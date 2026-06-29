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

export default function TeaserApp() {
  const [step, setStep] = useState<Step>('consent');
  const [parse, setParse] = useState<ParseState | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pdfRejected, setPdfRejected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      setUploadError('Sorry — we could not read that file. Try a CSV export.');
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

  async function handleGateSubmit(email: string) {
    if (!parse) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = buildHiddenRevenueAggregate(parse.local, parse.mapping, {
        practicePseudonym: pseudonym,
        contactEmail: email,
        sourceFormat: parse.sourceFormat,
      });
      // Defense in depth: refuse to transmit anything outside the allowlist.
      const safe = assertNoPhiEgress(payload, hiddenRevenueAggregateSchema);
      const res = await fetch('/api/teaser/aggregate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(safe),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStep('report');
    } catch {
      setSubmitError("We couldn't generate your report just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const bookCall = () => setLocation('/demo'); // primary CTA — book a discovery call
  const joinWaitlist = () => setLocation('/waitlist'); // secondary CTA

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
          submitting={submitting}
          error={submitError}
        />
      )}

      {step === 'report' && parse && (
        <ReportStep
          local={parse.local}
          onStartPilot={bookCall}
          onJoinWaitlist={joinWaitlist}
          sample={parse.isSample}
        />
      )}
    </>
  );
}
