/**
 * Teaser file → rows router. Runs ENTIRELY in the browser (ONRAMP_DESIGN §6b).
 * CSV and delimited `.out` are parsed by the pure shared core (no dependency).
 * `.xlsx` is parsed by SheetJS, which is **dynamically imported** so it loads in
 * its own chunk only when an .xlsx is actually dropped — it never ships in the
 * teaser's main bundle (client-bundle security review; TICKET XLSX decision).
 *
 * PDF is rejected here, by extension AND by magic bytes, and routed to the pilot
 * path — we never silently server-parse it.
 */
import { parseDelimited, type TeaserSourceFormat } from '@workspace/teaser-core';

/** A PDF (or PDF-by-magic-bytes) was dropped — route to the pilot/BAA path. */
export class PdfRejectedError extends Error {
  constructor() {
    super('PDF detected');
    this.name = 'PdfRejectedError';
  }
}

/** An unsupported / unparseable file was dropped. */
export class UnsupportedFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedFileError';
  }
}

export interface ParsedFile {
  rows: string[][];
  sourceFormat: TeaserSourceFormat;
}

function extensionOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim());
  return m ? m[1]!.toLowerCase() : '';
}

/** True if the first bytes are the `%PDF-` signature, regardless of extension. */
async function looksLikePdf(file: File): Promise<boolean> {
  const head = await file.slice(0, 5).text();
  return head.startsWith('%PDF-');
}

/** Coerce a SheetJS array-of-arrays cell to a trimmed string. */
function cell(v: unknown): string {
  return v == null ? '' : String(v).trim();
}

/**
 * Read a dropped file into rows of string cells, plus the detected source
 * format. Throws {@link PdfRejectedError} for PDFs and {@link UnsupportedFileError}
 * for anything we can't parse.
 */
export async function readFileToRows(file: File): Promise<ParsedFile> {
  const ext = extensionOf(file.name);

  if (ext === 'pdf' || (await looksLikePdf(file))) {
    throw new PdfRejectedError();
  }

  if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') {
    // Lazy-load SheetJS — its own chunk, fetched only for spreadsheet files.
    const XLSX = await import('xlsx');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array', cellDates: false });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) throw new UnsupportedFileError('The spreadsheet has no sheets.');
    const sheet = wb.Sheets[sheetName]!;
    const grid = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false, // formatted text (dates render as strings)
      defval: '',
      blankrows: false,
    }) as unknown[][];
    const rows: string[][] = grid.map((r) => (Array.isArray(r) ? r.map(cell) : []));
    return { rows, sourceFormat: 'xlsx' };
  }

  // CSV, .out, and unknown text: parse as delimited text with the pure core.
  const text = await file.text();
  const { rows } = parseDelimited(text);
  if (rows.length === 0 || rows.every((r) => r.every((c) => c === ''))) {
    throw new UnsupportedFileError("We couldn't read any rows from that file.");
  }
  const sourceFormat: TeaserSourceFormat = ext === 'out' ? 'out' : 'csv';
  return { rows, sourceFormat };
}

/** Accept attribute for the file input (advisory only — magic bytes are authoritative). */
export const TEASER_ACCEPT = '.csv,.tsv,.txt,.out,.xlsx,.xls,text/csv';
