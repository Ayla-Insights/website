/**
 * Presentational steps for the Tier-1 "Hidden Revenue Report" teaser. Pure UI —
 * no parsing, no network. The orchestrator (TeaserApp) owns state and the
 * transmit boundary.
 */
import { useRef, useState, type DragEvent } from 'react';
import type { ColumnMapping, ColumnRole, LocalAggregate, TeaserSourceFormat } from '@workspace/teaser-core';
import { TEASER_ACCEPT } from './parse';

export function usd(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

const ROLE_LABELS: Record<ColumnRole, string> = {
  fee: 'Fee / production ($)',
  procedureCode: 'Procedure code (CDT)',
  status: 'Treatment status',
  diagnosedDate: 'Diagnosed date',
  recallDueDate: 'Recall due date',
  visitDate: 'Last visit date',
  patientRef: 'Patient (for counting only)',
};
const ROLE_ORDER: ColumnRole[] = [
  'fee',
  'status',
  'procedureCode',
  'diagnosedDate',
  'recallDueDate',
  'visitDate',
  'patientRef',
];

// NOTE: the app's standalone `Shell` (logo + page chrome) is intentionally NOT
// ported — on the marketing site the teaser renders inside the shared `Layout`
// (nav/footer/branding). The "read in your browser, no trackers" trust line lives
// on the page wrapper (HiddenRevenue.tsx).

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div>
  );
}

/* ---- 1. Consent -------------------------------------------------------- */

export function ConsentStep({
  onAccept,
  onTrySample,
}: {
  onAccept: () => void;
  onTrySample: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  return (
    <Card>
      <h1 className="text-2xl font-bold text-slate-900">Find your practice's hidden revenue</h1>
      <p className="mt-2 text-slate-600">
        Drop in a treatment or recall export and we'll estimate the revenue sitting in unscheduled
        treatment and overdue recall — in about two minutes.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        <li className="flex gap-2">
          <Check />
          <span>
            Your file is parsed <strong>in your browser</strong>. The raw data never leaves your
            computer.
          </span>
        </li>
        <li className="flex gap-2">
          <Check />
          <span>
            We only receive <strong>anonymous totals</strong> (no patient names, no per-patient
            details).
          </span>
        </li>
        <li className="flex gap-2">
          <Check />
          <span>No account, no BAA, no software to install.</span>
        </li>
      </ul>
      <label className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          I agree that Mandi may use the anonymous aggregate metrics from my file to prepare this
          report and follow up with me about a pilot.
        </span>
      </label>
      <button
        disabled={!agreed}
        onClick={onAccept}
        className="mt-5 w-full rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
      <div className="mt-3 text-center text-sm text-slate-500">
        No export handy?{' '}
        <button onClick={onTrySample} className="font-medium text-[#0f766e] hover:underline">
          Try it with sample data →
        </button>
      </div>
    </Card>
  );
}

/* ---- 2. Upload --------------------------------------------------------- */

export function UploadStep({
  onFile,
  error,
  pdfRejected,
  onStartPilot,
  onTrySample,
}: {
  onFile: (file: File) => void;
  error: string | null;
  pdfRejected: boolean;
  onStartPilot: () => void;
  onTrySample: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Upload your export</h2>
      <p className="mt-1 text-sm text-slate-500">
        A treatment-plan or recall export works best. Accepted: <strong>CSV, Excel, or .out</strong>.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragging ? 'border-[#14b8a6] bg-[#f0fdfa]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <UploadIcon />
        <div className="mt-3 font-medium text-slate-700">Drag &amp; drop your file here</div>
        <div className="text-sm text-slate-400">or click to browse</div>
        <input
          ref={inputRef}
          type="file"
          accept={TEASER_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = ''; // allow re-selecting the same file
          }}
        />
      </div>

      <div className="mt-3 text-center text-sm text-slate-500">
        Just exploring?{' '}
        <button onClick={onTrySample} className="font-medium text-[#0f766e] hover:underline">
          Try it with sample data →
        </button>
      </div>

      <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-700">
          How do I export this from my practice management system?
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <div className="font-semibold text-slate-700">Dentrix (desktop)</div>
            <p>
              Office Manager → <strong>Letters &amp; Lists</strong> → <strong>List Manager</strong> →
              build a treatment or continuing-care (recall) list → <strong>Export</strong> to a{' '}
              <code className="rounded bg-slate-200 px-1">.out</code> file (it opens in Excel). Or
              use <strong>Treatment Manager</strong> for diagnosed-but-unscheduled treatment.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-700">Dentrix Ascend (cloud)</div>
            <p>
              <strong>Power Reports</strong> → an <strong>Unscheduled Treatment</strong> report →{' '}
              <strong>Export to CSV</strong>. The Treatment Manager and Daily Huddle export too.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-700">Any other system</div>
            <p>
              Export any <strong>treatment-plan</strong> or{' '}
              <strong>recall / continuing-care</strong> report as CSV or Excel. We look for columns
              like patient, procedure code, fee, status, and dates — and auto-map the rest, so it
              doesn't have to be perfect.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Whatever you upload is read entirely in your browser — it never leaves your computer.
          </p>
        </div>
      </details>

      {pdfRejected ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">To analyze a PDF we need the pilot BAA — or export a CSV/.out.</p>
          <button
            onClick={onStartPilot}
            className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Start a pilot →
          </button>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </Card>
  );
}

/* ---- 3. Confirm what we found ----------------------------------------- */

export function ConfirmStep({
  header,
  mapping,
  local,
  onSetRole,
  onConfirm,
  onBack,
}: {
  header: string[];
  mapping: ColumnMapping;
  local: LocalAggregate;
  onSetRole: (colIndex: number, role: ColumnRole | null) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const lowConfidence = mapping.overallConfidence < 0.6;
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Confirm what we found</h2>
      <p className="mt-1 text-sm text-slate-500">
        We auto-detected your columns. Correct any that look wrong, then continue — this is computed
        on your machine.
      </p>

      {lowConfidence && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Some columns were hard to read automatically — please double-check the mapping below.
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Your column</th>
              <th className="px-4 py-2 font-medium">We'll treat it as</th>
            </tr>
          </thead>
          <tbody>
            {header.map((h, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-700">{h || <em className="text-slate-400">(unnamed)</em>}</td>
                <td className="px-4 py-2">
                  <select
                    value={mapping.columns[i]?.role ?? ''}
                    onChange={(e) => onSetRole(i, (e.target.value || null) as ColumnRole | null)}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-[#14b8a6] focus:outline-none"
                  >
                    <option value="">— ignore —</option>
                    {ROLE_ORDER.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl bg-gradient-to-br from-[#f0fdfa] to-white p-5 ring-1 ring-[#ccfbf1]">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">
          Estimated unscheduled treatment
        </div>
        <div className="mt-1 text-3xl font-bold text-slate-900">
          {usd(local.unscheduledTreatmentValue)}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          across {local.unscheduledRowCount} planned {local.unscheduledRowCount === 1 ? 'procedure' : 'procedures'}
          {mapping.roleToIndex.fee == null && ' — map your fee column to see this'}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          ← Use a different file
        </button>
        <button
          onClick={onConfirm}
          disabled={mapping.roleToIndex.fee == null || local.unscheduledTreatmentValue <= 0}
          className="rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          That's right — show my report →
        </button>
      </div>
    </Card>
  );
}

/* ---- 4. Email gate ----------------------------------------------------- */

export function GateStep({
  headlineValue,
  onSubmit,
  submitting,
  error,
}: {
  headlineValue: number;
  onSubmit: (email: string) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState('');
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <Card>
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wide text-[#0f766e]">
          Your Hidden Revenue Report is ready
        </div>
        <div className="mt-2 text-4xl font-bold text-slate-900">{usd(headlineValue)}</div>
        <p className="mt-1 text-slate-600">
          in estimated unscheduled treatment — plus your overdue-recall opportunity.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !submitting) onSubmit(email.trim());
        }}
        className="mt-6"
      >
        <label className="block text-sm font-medium text-slate-700">
          Enter your work email to see the full breakdown
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourpractice.com"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#14b8a6] focus:outline-none"
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <button
          disabled={!valid || submitting}
          className="mt-4 w-full rounded-xl bg-[#0d9488] px-5 py-3 font-semibold text-white transition hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Preparing your report…' : 'Show my full report →'}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          We send only anonymous totals with your email — never patient data.
        </p>
      </form>
    </Card>
  );
}

/* ---- 5. Report --------------------------------------------------------- */

function fmtRange(r: { earliest: string | null; latest: string | null }): string | null {
  if (!r.earliest && !r.latest) return null;
  if (r.earliest === r.latest) return r.earliest;
  return `${r.earliest ?? '—'} to ${r.latest ?? '—'}`;
}

export function ReportStep({
  local,
  onStartPilot,
  onExplore,
  sample,
}: {
  local: LocalAggregate;
  /** Primary CTA → book a discovery call. */
  onStartPilot: () => void;
  /** Secondary CTA → explore the full platform. */
  onExplore: () => void;
  /** True for the "Try with sample data" demo — watermarks the report as synthetic. */
  sample?: boolean;
}) {
  const diagnosed = fmtRange(local.diagnosedDateRange);
  const recall = fmtRange(local.recallDueDateRange);
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">
          Hidden Revenue Report
        </div>
        {sample && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
            Sample data
          </span>
        )}
      </div>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">
        {sample ? 'Here’s what a report looks like' : "Here's what we found"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Estimated figures based on the numbers in your file. Typical results; your actual recoverable
        revenue depends on outreach and scheduling.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Metric
          label="Unscheduled treatment"
          value={usd(local.unscheduledTreatmentValue)}
          sub={diagnosed ? `diagnosed ${diagnosed}` : 'on the table'}
          hero
        />
        <Metric
          label="Patients with unscheduled treatment"
          value={local.unscheduledPatientCount > 0 ? String(local.unscheduledPatientCount) : '—'}
          sub={local.unscheduledPatientCount > 0 ? 'to reach out to' : 'too few to report'}
        />
        <Metric
          label="Overdue-recall patients"
          value={local.overdueRecallPatientCount > 0 ? String(local.overdueRecallPatientCount) : '—'}
          sub={
            local.overdueRecallPatientCount > 0
              ? recall
                ? `due ${recall}`
                : 'past due'
              : 'too few to report'
          }
        />
        <Metric
          label="Fillable schedule gaps"
          value={local.fillableGapValue != null ? usd(local.fillableGapValue) : 'Pilot'}
          sub={local.fillableGapValue != null ? 'recoverable' : 'needs schedule data'}
        />
      </div>

      <div className="mt-6 rounded-xl border border-[#99f6e4] bg-[#f0fdfa] p-5">
        <div className="text-sm font-semibold uppercase tracking-wide text-[#0f766e]">
          This is a fraction of what Mandi finds
        </div>
        <p className="mt-1 text-sm text-slate-600">
          This quick report only looks at unscheduled treatment and overdue recall from a single
          file. The full Mandi platform connects to your practice management system and surfaces the
          money across your whole office — insurance &amp; carrier profitability, schedule &amp;
          chair-time, case acceptance, staff productivity — answers any question in plain English
          with Ask Mandi, and helps your team book it. With your data live, the numbers are bigger
          and always up to date.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
        <div className="text-lg font-semibold">Ready to turn this into booked appointments?</div>
        <p className="mt-1 text-sm text-slate-300">
          In a pilot, Mandi works this list for you — outreach scripts, recall, and schedule-gap
          filling — with a signed BAA and your live PMS.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartPilot}
            className="rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-900 hover:bg-slate-100"
          >
            Book a discovery call →
          </button>
          <button
            onClick={onExplore}
            className="text-sm font-medium text-slate-200 hover:text-white hover:underline"
          >
            or explore the full platform →
          </button>
        </div>
      </div>
    </Card>
  );
}

function Metric({
  label,
  value,
  sub,
  hero,
}: {
  label: string;
  value: string;
  sub: string | null;
  hero?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${hero ? 'border-[#99f6e4] bg-[#f0fdfa]' : 'border-slate-200 bg-white'}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 font-bold ${hero ? 'text-3xl text-[#0f766e]' : 'text-2xl text-slate-900'}`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

/* ---- tiny inline icons ------------------------------------------------- */

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-[#0d9488]" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}
