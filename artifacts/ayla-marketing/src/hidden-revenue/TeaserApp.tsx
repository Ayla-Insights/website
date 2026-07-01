/**
 * Tier-1 "Hidden Revenue Report" — orchestrator (TIER1_TEASER_TICKET stage 2).
 * Owns the step machine, the (user-correctable) column mapping, and the single
 * transmit boundary. Everything PHI-bearing (the raw rows) stays in this
 * component's memory; the ONLY thing that leaves is the strict no-PHI aggregate,
 * re-validated by assertNoPhiEgress immediately before the POST.
 *
 * Flow: consent → upload → confirm-what-we-found → email gate → full report.
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  assertNoPhiEgress,
  autoMapColumns,
  buildHiddenRevenueAggregate,
  computeLocalAggregate,
  detectHeaderRow,
  hiddenRevenueAggregateSchema,
  type HiddenRevenueAggregate,
  type ColumnMapping,
  type ColumnRole,
  type DetectedColumn,
  type LocalAggregate,
  type TeaserSourceFormat,
} from '@workspace/teaser-core';
import { PdfRejectedError, UnsupportedFileError, readFileToRows } from './parse';
import { buildSampleRows } from './sample-data';
import { ConfirmStep, ConsentStep, GateStep, ReportStep, UploadStep } from './steps';

type Step = 'consent' | 'upload' | 'confirm' | 'gate' | 'report';

interface ParseState {
  sourceFormat: TeaserSourceFormat;
  header: string[];
  dataRows: string[][];
  mapping: ColumnMapping;
  local: LocalAggregate;
  /** True for the synthetic "Try with sample data" demo — watermarks the report. */
  isSample: boolean;
}

/** Client-generated pseudonymous id — NOT derived from any practice/patient data. */
function generatePseudonym(): string {
  const b = new Uint8Array(6);
  crypto.getRandomValues(b);
  return 'prac_' + Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

/** Reassign a column's role, keeping each role on at most one column. Pure. */
function withRole(mapping: ColumnMapping, col: number, role: ColumnRole | null): ColumnMapping {
  const roleToIndex: Partial<Record<ColumnRole, number>> = { ...mapping.roleToIndex };
  for (const r of Object.keys(roleToIndex) as ColumnRole[]) {
    if (roleToIndex[r] === col) delete roleToIndex[r]; // vacate col's old role
  }
  if (role) roleToIndex[role] = col; // role moves to col, leaving any prior holder
  const columns: DetectedColumn[] = mapping.columns.map((c) => {
    const assigned = (Object.keys(roleToIndex) as ColumnRole[]).find((r) => roleToIndex[r] === c.index) ?? null;
    const confidence = assigned ? (c.role === assigned ? c.confidence : 1) : 0;
    return { ...c, role: assigned, confidence };
  });
  return { columns, roleToIndex, overallConfidence: mapping.overallConfidence };
}

/**
 * POST the validated (no-PHI) aggregate, retrying once on a network error or 5xx.
 * Returns whether the lead was captured. The report itself is local and never
 * waits on this — see handleGateSubmit. The server dedupes on (email, day) so
 * background + CTA retries can't create duplicate rows.
 */
async function postLeadWithRetry(safe: HiddenRevenueAggregate): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch('/api/teaser/aggregate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(safe),
      });
      if (res.ok) return true;
      if (res.status < 500) return false; // 4xx won't succeed on retry
    } catch {
      // network error — fall through to the retry
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

export default function TeaserApp() {
  const [step, setStep] = useState<Step>('consent');
  const [parse, setParse] = useState<ParseState | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pdfRejected, setPdfRejected] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [pendingLead, setPendingLead] = useState<HiddenRevenueAggregate | null>(null);
  const [pseudonym] = useState(generatePseudonym);
  const [, setLocation] = useLocation();

  async function handleFile(file: File) {
    setUploadError(null);
    setPdfRejected(false);
    try {
      const { rows, sourceFormat } = await readFileToRows(file);
      const headerIdx = detectHeaderRow(rows);
      const header = rows[headerIdx] ?? [];
      const dataRows = rows.slice(headerIdx + 1);
      const mapping = autoMapColumns(header, dataRows);
      const local = computeLocalAggregate(dataRows, mapping, { now: new Date() });
      setParse({ sourceFormat, header, dataRows, mapping, local, isSample: false });
      setStep('confirm');
    } catch (e) {
      if (e instanceof PdfRejectedError) return setPdfRejected(true);
      if (e instanceof UnsupportedFileError) return setUploadError(e.message);
      setUploadError("Sorry, we couldn't read that file. Try a CSV export.");
    }
  }

  /**
   * "Try with sample data" (#11c): run a synthetic dataset through the SAME
   * detect→auto-map→aggregate path and jump straight to a watermarked report.
   * Nothing transmits — it's a pure local demo, so no email gate and no egress.
   */
  function loadSample() {
    const rows = buildSampleRows();
    const headerIdx = detectHeaderRow(rows);
    const header = rows[headerIdx] ?? [];
    const dataRows = rows.slice(headerIdx + 1);
    const mapping = autoMapColumns(header, dataRows);
    const local = computeLocalAggregate(dataRows, mapping, { now: new Date() });
    setParse({ sourceFormat: 'csv', header, dataRows, mapping, local, isSample: true });
    setStep('report');
  }

  function handleSetRole(col: number, role: ColumnRole | null) {
    setParse((p) => {
      if (!p) return p;
      const mapping = withRole(p.mapping, col, role);
      const local = computeLocalAggregate(p.dataRows, mapping, { now: new Date() });
      return { ...p, mapping, local };
    });
  }

  function captureLead(safe: HiddenRevenueAggregate) {
    void postLeadWithRetry(safe).then((ok) => {
      if (ok) {
        setLeadCaptured(true);
        setPendingLead(null);
      }
    });
  }

  function handleGateSubmit(email: string) {
    if (!parse) return;
    let safe: HiddenRevenueAggregate;
    try {
      const payload = buildHiddenRevenueAggregate(parse.local, parse.mapping, {
        practicePseudonym: pseudonym,
        contactEmail: email,
        sourceFormat: parse.sourceFormat,
      });
      // The single egress gate — runs before anything transmits.
      safe = assertNoPhiEgress(payload, hiddenRevenueAggregateSchema);
    } catch {
      // Should never happen (email is client-validated), but never block the
      // user's own 100%-local report on it.
      setStep('report');
      return;
    }
    // The report is entirely local — render it immediately, don't gate on the
    // network. Capture the lead in the background; if it fails we re-try when
    // the user clicks a post-report CTA (peak intent).
    setPendingLead(safe);
    setStep('report');
    captureLead(safe);
  }

  // Second capture chance at peak intent; the server dedupes so this is safe.
  const reattemptCapture = () => {
    if (pendingLead && !leadCaptured) void postLeadWithRetry(pendingLead);
  };

  const bookCall = () => { reattemptCapture(); setLocation('/demo'); }; // primary CTA
  const explore = () => { reattemptCapture(); setLocation('/features'); }; // secondary CTA

  return (
    <>
      {step === 'consent' && (
        <ConsentStep onAccept={() => setStep('upload')} onTrySample={loadSample} />
      )}

      {step === 'upload' && (
        <UploadStep
          onFile={handleFile}
          error={uploadError}
          pdfRejected={pdfRejected}
          onStartPilot={bookCall}
          onTrySample={loadSample}
        />
      )}

      {step === 'confirm' && parse && (
        <ConfirmStep
          header={parse.header}
          mapping={parse.mapping}
          local={parse.local}
          onSetRole={handleSetRole}
          onConfirm={() => setStep('gate')}
          onBack={() => {
            setParse(null);
            setStep('upload');
          }}
        />
      )}

      {step === 'gate' && parse && (
        <GateStep
          headlineValue={parse.local.unscheduledTreatmentValue}
          onSubmit={handleGateSubmit}
          submitting={false}
          error={null}
        />
      )}

      {step === 'report' && parse && (
        <ReportStep
          local={parse.local}
          onStartPilot={bookCall}
          onExplore={explore}
          sample={parse.isSample}
        />
      )}
    </>
  );
}
