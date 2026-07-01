/**
 * Tier-1 "Hidden Revenue Report" — the PURE client-side engine (ONRAMP_DESIGN
 * §4/§6b; TIER1_TEASER_TICKET stage 1). Parses a practice's native export,
 * auto-maps its columns, and computes practice-level aggregates ENTIRELY in the
 * browser. Nothing here touches the DOM, the network, SheetJS, or Node — it is
 * deterministic and fully unit-testable.
 *
 * PHI boundary (CLAUDE.md #3/#4; control SC-12): the raw rows live only in the
 * caller's memory. These functions return AGGREGATES (sums, distinct counts,
 * month-granularity ranges) — never rows, names, or per-patient values. The only
 * thing that ever leaves the browser is {@link buildHiddenRevenueAggregate}'s
 * output, re-validated by the no-PHI egress guard at the transmit boundary.
 *
 * Pipeline: parseDelimited → detectHeaderRow → autoMapColumns → (user confirms)
 * → computeLocalAggregate → buildHiddenRevenueAggregate.
 *
 * NOTE on parsing: the UI uses SheetJS only for the binary .xlsx case (File →
 * rows). CSV and delimited .out go through {@link parseDelimited} here, so the
 * common path is pure and tested rather than dependent on SheetJS's CSV quirks.
 */
import type { CoarseDateRange, HiddenRevenueAggregate, TEASER_SOURCE_FORMATS } from './teaser.js';

export type TeaserSourceFormat = (typeof TEASER_SOURCE_FORMATS)[number];

/** Counts strictly below this are suppressed to 0 (small-cell rule, §6a). */
export const SMALL_CELL_THRESHOLD = 5;
/** Dollar totals are rounded to this granularity before transmit (de-precision). */
export const DOLLAR_ROUNDING = 10;

const DELIMITER_CANDIDATES = [',', '\t', '|', ';'] as const;
type Delimiter = (typeof DELIMITER_CANDIDATES)[number];

// ---------------------------------------------------------------------------
// 1. Delimited-text parsing (RFC-4180-ish, with a delimiter sniffer for .out)
// ---------------------------------------------------------------------------

/** Parse one cell value: trim outer whitespace (quoted content already de-quoted). */
function cleanCell(s: string): string {
  return s.trim();
}

/**
 * Parse delimited text into rows of cells with a known delimiter. Handles
 * RFC-4180 quoting: `"`-wrapped fields, `""` escapes, and delimiters/newlines
 * inside quotes. Accepts both \n and \r\n line endings. A trailing newline does
 * not yield a spurious empty row.
 */
export function parseWithDelimiter(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let fieldWasQuoted = false;
  let sawAnyChar = false;

  const pushField = () => {
    row.push(fieldWasQuoted ? field : cleanCell(field));
    field = '';
    fieldWasQuoted = false;
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    sawAnyChar = true;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // consume the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"' && field === '') {
      inQuotes = true;
      fieldWasQuoted = true;
      continue;
    }
    if (ch === delimiter) {
      pushField();
      continue;
    }
    if (ch === '\r') {
      // \r\n or bare \r both end the row; swallow the optional \n.
      if (text[i + 1] === '\n') i++;
      pushRow();
      continue;
    }
    if (ch === '\n') {
      pushRow();
      continue;
    }
    field += ch;
  }
  // Flush the final field/row unless the file ended exactly on a newline.
  if (field !== '' || row.length > 0 || (sawAnyChar && rows.length === 0)) {
    pushRow();
  }
  return rows;
}

/**
 * Score a delimiter by how consistently it splits the sample into a stable,
 * multi-column shape. Higher is better; a delimiter that yields a single column
 * everywhere scores 0.
 */
function scoreDelimiter(sample: string, delimiter: Delimiter): number {
  const rows = parseWithDelimiter(sample, delimiter).filter((r) => r.some((c) => c !== ''));
  if (rows.length === 0) return 0;
  const counts = rows.map((r) => r.length);
  const freq = new Map<number, number>();
  for (const c of counts) freq.set(c, (freq.get(c) ?? 0) + 1);
  let modeWidth = 1;
  let modeFreq = 0;
  for (const [width, f] of freq) {
    if (f > modeFreq || (f === modeFreq && width > modeWidth)) {
      modeWidth = width;
      modeFreq = f;
    }
  }
  if (modeWidth < 2) return 0; // single column → this delimiter isn't it
  // Reward consistency (rows matching the modal width) and width itself.
  const consistency = modeFreq / rows.length;
  return consistency * modeWidth;
}

/**
 * Parse CSV / delimited `.out` text into rows, sniffing the delimiter from
 * `,`, tab, `|`, `;`. Strips a UTF-8 BOM. Title rows above the header are NOT
 * removed here — that is {@link detectHeaderRow}'s job.
 */
export function parseDelimited(text: string): { rows: string[][]; delimiter: string } {
  const clean = text.replace(/^﻿/, '');
  const sample = clean.split(/\r\n|\r|\n/).slice(0, 30).join('\n');
  let best: Delimiter = ',';
  let bestScore = -1;
  for (const d of DELIMITER_CANDIDATES) {
    const score = scoreDelimiter(sample, d);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return { rows: parseWithDelimiter(clean, best), delimiter: best };
}

// ---------------------------------------------------------------------------
// 2. Header detection (skip title/blank rows above the real header)
// ---------------------------------------------------------------------------

const MONEY_RE = /^\(?\s*[-+]?\$?\s*[\d,]+(\.\d+)?\s*\)?$/;
const CDT_RE = /^d\d{3,4}[a-z]?$/i;

function nonEmpty(row: string[]): number {
  return row.filter((c) => c.trim() !== '').length;
}
function looksNumeric(cell: string): boolean {
  const t = cell.trim();
  return t !== '' && (MONEY_RE.test(t) || /^[-+]?[\d,]+(\.\d+)?%?$/.test(t));
}

/**
 * Find the index of the header row. Many PMS exports prepend a title row
 * ("Treatment Manager — Bright Smile Dental") and/or blank rows. The header is
 * the first row that is wide (close to the table's modal width) and made mostly
 * of non-numeric text labels, with at least one data row beneath it.
 */
export function detectHeaderRow(rows: string[][]): number {
  if (rows.length === 0) return 0;
  const widths = rows.map((r) => nonEmpty(r));
  const modalWidth = Math.max(...widths);
  const limit = Math.min(rows.length, 15);
  for (let i = 0; i < limit; i++) {
    const row = rows[i]!;
    const filled = nonEmpty(row);
    if (filled < 2) continue; // title/blank row
    if (filled < Math.max(2, modalWidth * 0.5)) continue; // too narrow to be the header
    const labels = row.filter((c) => c.trim() !== '');
    const textLabels = labels.filter((c) => !looksNumeric(c));
    if (textLabels.length < Math.max(2, labels.length * 0.6)) continue; // mostly values, not labels
    if (i + 1 >= rows.length) continue; // need at least one data row
    return i;
  }
  // Fallback: first non-empty row.
  return widths.findIndex((w) => w >= 1) >= 0 ? widths.findIndex((w) => w >= 1) : 0;
}

// ---------------------------------------------------------------------------
// 3. Auto-map columns (fuzzy header match + content heuristics + confidence)
// ---------------------------------------------------------------------------

export type ColumnRole =
  | 'fee'
  | 'procedureCode'
  | 'status'
  | 'diagnosedDate'
  | 'recallDueDate'
  | 'visitDate'
  | 'patientRef';

/** A column as detected for the "confirm what we found" step (no raw values transmitted). */
export interface DetectedColumn {
  index: number;
  header: string;
  role: ColumnRole | null;
  /** 0..1 confidence in the assigned role. */
  confidence: number;
}

export interface ColumnMapping {
  columns: DetectedColumn[];
  /** Convenience lookup: role → column index (only confidently-assigned roles). */
  roleToIndex: Partial<Record<ColumnRole, number>>;
  /** 0..1 overall confidence, weighted toward the roles the aggregate depends on. */
  overallConfidence: number;
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Header keyword patterns per role (matched against the normalized header). */
const HEADER_PATTERNS: Record<ColumnRole, RegExp[]> = {
  fee: [/fee/, /amount/, /charge/, /production/, /^prod/, /balance/, /cost/, /\btotal/, /estimate/],
  procedureCode: [/code/, /cdt/, /procedurecode/, /^proc/, /ada/],
  status: [/status/, /apptstatus/, /scheduledstatus/, /txstatus/, /state/],
  diagnosedDate: [/diagnos/, /txdate/, /treatmentdate/, /planned/, /presented/, /proposeddate/, /dxdate/],
  recallDueDate: [/recall/, /recare/, /^due/, /duedate/, /hygiene/, /nextvisit/, /prophy/, /perio/],
  visitDate: [/lastvisit/, /lastseen/, /visitdate/, /dateofservice/, /dos/, /servicedate/, /apptdate/, /appointmentdate/],
  patientRef: [/patient/, /chart/, /guarantor/, /account/, /member/, /subscriber/, /^name/, /^id$/, /patientid/, /mrn/],
};

function classifyDateString(s: string): boolean {
  return parseLooseDate(s) !== null;
}

/** Content score 0..1 for how well a column's sample values fit a role. */
function contentScore(role: ColumnRole, samples: string[]): number {
  if (samples.length === 0) return 0;
  const frac = (pred: (v: string) => boolean) =>
    samples.filter(pred).length / samples.length;
  switch (role) {
    case 'fee':
      return frac((v) => MONEY_RE.test(v.trim()) && /\d/.test(v));
    case 'procedureCode':
      return frac((v) => CDT_RE.test(v.trim()));
    case 'status':
      return frac((v) => classifyStatus(v) !== 'unknown');
    case 'diagnosedDate':
    case 'recallDueDate':
    case 'visitDate':
      return frac(classifyDateString);
    case 'patientRef':
      // Names/ids: mostly non-numeric, non-date, non-money text.
      return frac((v) => {
        const t = v.trim();
        return t !== '' && !MONEY_RE.test(t) && !classifyDateString(t) && !CDT_RE.test(t);
      }) * 0.6; // weak signal — header match carries patientRef
  }
}

const ROLES: ColumnRole[] = [
  'fee',
  'procedureCode',
  'status',
  'diagnosedDate',
  'recallDueDate',
  'visitDate',
  'patientRef',
];

/** Roles that may legitimately appear on more than one column are NOT here. */
const DATE_ROLES: ColumnRole[] = ['diagnosedDate', 'recallDueDate', 'visitDate'];

/**
 * Auto-map header columns to roles using fuzzy header matching plus content
 * heuristics, then greedily assign so each role goes to its best-fitting column
 * (and each column gets at most one role). Returns per-column detections for the
 * confirm step and an overall confidence.
 */
export function autoMapColumns(header: string[], sampleRows: string[][]): ColumnMapping {
  const nCols = header.length;
  const samplesByCol: string[][] = Array.from({ length: nCols }, (_, c) =>
    sampleRows
      .map((r) => (r[c] ?? '').trim())
      .filter((v) => v !== '')
      .slice(0, 50),
  );

  // Score matrix: per (column, role).
  type Cell = { col: number; role: ColumnRole; score: number };
  const cells: Cell[] = [];
  for (let c = 0; c < nCols; c++) {
    const norm = normalizeHeader(header[c] ?? '');
    for (const role of ROLES) {
      const headerHit = HEADER_PATTERNS[role].some((re) => re.test(norm)) ? 1 : 0;
      const content = contentScore(role, samplesByCol[c]!);
      // A header match (0.7..1.0) strictly dominates a content-only signal
      // (0..0.65), so a labeled column always beats a coincidental content fit
      // (e.g. an integer account-# column won't be mistaken for fees). Strong
      // content alone (≥0.75) can still map an unlabeled column — the ticket
      // wants `$`-cols→fee and `Dnnnn`→code to work from content.
      let score = headerHit ? 0.7 + content * 0.3 : content >= 0.75 ? content * 0.65 : 0;
      // A `$`/`amt` token in the header is a fee hint even if other fee keywords miss.
      if (role === 'fee' && /\$|amt/.test(norm)) score = Math.max(score, 0.7 + content * 0.3);
      if (score > 0) cells.push({ col: c, role, score });
    }
  }

  // Greedy assignment: highest score first; one role per column, one column per
  // role (date roles are distinct roles, so multiple date columns still map).
  cells.sort((a, b) => b.score - a.score);
  const usedCols = new Set<number>();
  const usedRoles = new Set<ColumnRole>();
  const assigned = new Map<number, { role: ColumnRole; score: number }>();
  for (const { col, role, score } of cells) {
    if (usedCols.has(col) || usedRoles.has(role)) continue;
    if (score < 0.5) continue; // confidence floor
    assigned.set(col, { role, score });
    usedCols.add(col);
    usedRoles.add(role);
  }

  const columns: DetectedColumn[] = header.map((h, c) => {
    const a = assigned.get(c);
    return { index: c, header: h, role: a?.role ?? null, confidence: a ? clamp01(a.score) : 0 };
  });

  const roleToIndex: Partial<Record<ColumnRole, number>> = {};
  for (const [col, a] of assigned) roleToIndex[a.role] = col;

  // Overall confidence weights the roles the dollar headline depends on most.
  const weight: Partial<Record<ColumnRole, number>> = {
    fee: 0.4,
    status: 0.2,
    procedureCode: 0.15,
    diagnosedDate: 0.1,
    recallDueDate: 0.1,
    patientRef: 0.05,
  };
  let wSum = 0;
  let wConf = 0;
  for (const role of Object.keys(weight) as ColumnRole[]) {
    const w = weight[role]!;
    wSum += w;
    const col = roleToIndex[role];
    if (col != null) wConf += w * clamp01(assigned.get(col)!.score);
  }
  const overallConfidence = wSum > 0 ? clamp01(wConf / wSum) : 0;

  return { columns, roleToIndex, overallConfidence };
}

// ---------------------------------------------------------------------------
// 4. Aggregation (practice-level numbers only; raw rows never retained)
// ---------------------------------------------------------------------------

export type StatusClass = 'unscheduled' | 'scheduled' | 'completed' | 'unknown';

/** Classify a free-text appointment/treatment status into a coarse class. */
export function classifyStatus(raw: string): StatusClass {
  const s = raw.toLowerCase();
  if (!s.trim()) return 'unknown';
  if (/(complete|existing|delivered|\bdone\b|seated|paid)/.test(s)) return 'completed';
  // "unscheduled" must be checked before "scheduled" (substring trap).
  if (/(unschedul|not schedul|tx planned|treatment plan|^planned|propos|present|recommend|accepted|pending|open)/.test(s))
    return 'unscheduled';
  if (/(schedul|booked|confirmed|appt|appointment)/.test(s)) return 'scheduled';
  return 'unknown';
}

/** Raw (un-suppressed, un-rounded) practice aggregate. */
export interface LocalAggregate {
  unscheduledTreatmentValue: number;
  unscheduledPatientCount: number;
  overdueRecallPatientCount: number;
  fillableGapValue: number | null;
  diagnosedDateRange: CoarseDateRange;
  recallDueDateRange: CoarseDateRange;
  /** Convenience for the confirm step UI — not transmitted. */
  unscheduledRowCount: number;
}

export interface AggregateOptions {
  /** "Now" for the overdue-recall comparison — passed in for determinism. */
  now: Date;
}

/**
 * Compute practice-level aggregates from data rows and a (possibly
 * user-corrected) column mapping. Returns only numbers, distinct counts, and
 * coarse date ranges — never rows or identifiers.
 */
export function computeLocalAggregate(
  dataRows: string[][],
  mapping: ColumnMapping,
  opts: AggregateOptions,
): LocalAggregate {
  const { roleToIndex } = mapping;
  const feeCol = roleToIndex.fee;
  const statusCol = roleToIndex.status;
  const codeCol = roleToIndex.procedureCode;
  const patientCol = roleToIndex.patientRef;
  const diagnosedCol = roleToIndex.diagnosedDate ?? roleToIndex.visitDate;
  const recallCol = roleToIndex.recallDueDate;
  const hasStatus = statusCol != null;

  const nowMonth = monthIndex(opts.now);

  let unscheduledValue = 0;
  let unscheduledRowCount = 0;
  const unscheduledPatients = new Set<string>();
  const overduePatients = new Set<string>();
  const diagnosedRange = new RangeAccumulator();
  const recallRange = new RangeAccumulator();

  // Recoverable date window: only count diagnoses from the last 18 months.
  const LOOKBACK_MONTHS = 18;
  const windowStart = nowMonth - LOOKBACK_MONTHS;

  for (const row of dataRows) {
    if (row.every((c) => c.trim() === '')) continue; // skip blank lines

    const fee = feeCol != null ? parseMoney(row[feeCol] ?? '') : null;
    const statusClass = hasStatus ? classifyStatus(row[statusCol!] ?? '') : 'unknown';
    const hasCode = codeCol != null ? CDT_RE.test((row[codeCol] ?? '').trim()) : false;
    const patientKey = patientCol != null ? (row[patientCol] ?? '').trim().toLowerCase() : '';

    // A row is "diagnosed, unscheduled treatment" when it is a priced procedure
    // that is not already scheduled or completed. With a status column we trust
    // it; without one we assume the export is a treatment-plan list (priced rows
    // with a procedure code) and count those.
    const priced = fee != null && fee > 0;
    const isUnscheduled = hasStatus
      ? statusClass === 'unscheduled'
      : priced && (hasCode || codeCol == null);

    if (isUnscheduled && priced) {
      // Exclude future-dated diagnoses (impossible for a real diagnosis; a
      // "proposed treatment date" column legitimately holds future dates) and
      // ones older than LOOKBACK_MONTHS (too stale to be realistically
      // recoverable). Rows with no parseable diagnosed date are counted
      // best-effort but don't contribute to the range.
      const d = diagnosedCol != null ? parseLooseDate(row[diagnosedCol] ?? '') : null;
      const m = d ? monthIndexOf(d) : null;
      const inWindow = m == null || (m <= nowMonth && m >= windowStart);
      if (inWindow) {
        unscheduledValue += fee!;
        unscheduledRowCount++;
        if (patientKey) unscheduledPatients.add(patientKey);
        if (d) diagnosedRange.add(d);
      }
    }

    if (recallCol != null) {
      const due = parseLooseDate(row[recallCol] ?? '');
      if (due && monthIndexOf(due) < nowMonth) {
        if (patientKey) overduePatients.add(patientKey);
        else overduePatients.add(`__row_${unscheduledRowCount}_${recallRange.count}`);
        recallRange.add(due);
      }
    }
  }

  // Patient counts: distinct patientRef when available; otherwise fall back to
  // the qualifying row count (best-effort — the confirm step prompts the user to
  // map a patient column to sharpen this).
  const unscheduledPatientCount = patientCol != null ? unscheduledPatients.size : unscheduledRowCount;
  const overdueRecallPatientCount = overduePatients.size;

  return {
    unscheduledTreatmentValue: unscheduledValue,
    unscheduledPatientCount,
    overdueRecallPatientCount,
    fillableGapValue: null, // requires appointment/open-slot data — out of scope for v1
    diagnosedDateRange: diagnosedRange.toCoarseRange(),
    recallDueDateRange: recallRange.toCoarseRange(),
    unscheduledRowCount,
  };
}

// ---------------------------------------------------------------------------
// 5. Suppression + rounding + transmit-payload assembly
// ---------------------------------------------------------------------------

/** Counts below the small-cell threshold collapse to 0 (re-identification guard). */
export function suppressCount(n: number): number {
  return n < SMALL_CELL_THRESHOLD ? 0 : Math.round(n);
}
/** Round a dollar total to {@link DOLLAR_ROUNDING} granularity. */
export function roundDollars(n: number): number {
  return Math.round(n / DOLLAR_ROUNDING) * DOLLAR_ROUNDING;
}

export interface TransmitContext {
  practicePseudonym: string;
  contactEmail: string;
  sourceFormat: TeaserSourceFormat;
}

/**
 * Assemble the ONLY object that leaves the browser. Applies small-cell
 * suppression + dollar rounding and stamps `suppressedSmallCells: true`. The
 * result is still re-validated by {@link assertNoPhiEgress} at the actual
 * transmit boundary (defense in depth).
 */
export function buildHiddenRevenueAggregate(
  local: LocalAggregate,
  mapping: ColumnMapping,
  ctx: TransmitContext,
): HiddenRevenueAggregate {
  return {
    practicePseudonym: ctx.practicePseudonym,
    contactEmail: ctx.contactEmail,
    unscheduledTreatmentValue: roundDollars(local.unscheduledTreatmentValue),
    fillableGapValue: local.fillableGapValue == null ? null : roundDollars(local.fillableGapValue),
    unscheduledPatientCount: suppressCount(local.unscheduledPatientCount),
    overdueRecallPatientCount: suppressCount(local.overdueRecallPatientCount),
    diagnosedDateRange: local.diagnosedDateRange,
    recallDueDateRange: local.recallDueDateRange,
    sourceFormat: ctx.sourceFormat,
    mappingConfidence: clamp01(mapping.overallConfidence),
    suppressedSmallCells: true,
  };
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Parse a money-ish string to a number. `($1,200.50)` → -1200.5; '' → null. */
export function parseMoney(raw: string): number | null {
  const t = raw.trim();
  if (t === '') return null;
  const negative = /^\(.*\)$/.test(t) || /^-/.test(t);
  const digits = t.replace(/[()$,\s]/g, '').replace(/^-/, '');
  if (!/^\d+(\.\d+)?$/.test(digits)) return null;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** A calendar date with no time component (local interpretation). */
interface LooseDate {
  year: number;
  month: number; // 1..12
  day: number;
}

/**
 * Parse common PMS date strings: ISO `YYYY-MM-DD`, US `M/D/YYYY` (or `YY`), and
 * `M-D-YYYY`. Returns null for anything ambiguous or non-date. Time portions are
 * ignored. Deliberately tolerant but conservative — a wrong parse only nudges a
 * coarse month range.
 */
export function parseLooseDate(raw: string): LooseDate | null {
  const t = raw.trim();
  if (t === '') return null;
  // ISO: YYYY-MM-DD (optionally with time)
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?$/.exec(t);
  if (m) return validDate(+m[1]!, +m[2]!, +m[3]!);
  // US: M/D/YYYY or M/D/YY (optionally with time)
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:[ T].*)?$/.exec(t);
  if (m) return validDate(normYear(+m[3]!), +m[1]!, +m[2]!);
  // M-D-YYYY (only when the first group isn't a 4-digit year, handled above)
  m = /^(\d{1,2})-(\d{1,2})-(\d{2,4})$/.exec(t);
  if (m) return validDate(normYear(+m[3]!), +m[1]!, +m[2]!);
  return null;
}

function normYear(y: number): number {
  if (y >= 100) return y;
  // 2-digit year: 00–69 → 2000s, 70–99 → 1900s.
  return y <= 69 ? 2000 + y : 1900 + y;
}
function validDate(year: number, month: number, day: number): LooseDate | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;
  return { year, month, day };
}

/** `YYYY-MM` for a date, or null. */
export function coarseDateOf(d: LooseDate): string {
  return `${d.year.toString().padStart(4, '0')}-${d.month.toString().padStart(2, '0')}`;
}

/** Months since year 0, for cheap ordering/comparison. */
function monthIndexOf(d: LooseDate): number {
  return d.year * 12 + (d.month - 1);
}
function monthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

/** Accumulates min/max dates and emits a coarse (month-granularity) range. */
class RangeAccumulator {
  private min: LooseDate | null = null;
  private max: LooseDate | null = null;
  count = 0;

  add(d: LooseDate): void {
    this.count++;
    if (!this.min || monthIndexOf(d) < monthIndexOf(this.min)) this.min = d;
    if (!this.max || monthIndexOf(d) > monthIndexOf(this.max)) this.max = d;
  }
  toCoarseRange(): CoarseDateRange {
    return {
      earliest: this.min ? coarseDateOf(this.min) : null,
      latest: this.max ? coarseDateOf(this.max) : null,
    };
  }
}
