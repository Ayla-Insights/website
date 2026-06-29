/**
 * Synthetic sample data for the teaser's "Try with sample data" demo (#11c).
 * Lets a cold visitor (investor, Henry Schein, a curious office manager) see a
 * full Hidden Revenue Report without exporting a real CSV.
 *
 * 100% SYNTHETIC — generated here, never a real export (ONRAMP_DESIGN §6a "send
 * a sample" rule). Believable dental cases + fees tuned to a six-figure pool. It
 * runs through the EXACT same client-side detect→auto-map→aggregate flow as a
 * real upload (and the sample report never transmits — pure local demo), so
 * there is no second egress path.
 */

/** Believable treatment-plan cases (code · description · fee), weighted toward a
 *  realistic six-figure unscheduled pool. Shapes the seed generator's templates
 *  without importing server code into the client bundle. */
const CASE_TEMPLATES: ReadonlyArray<{ code: string; desc: string; fee: number }> = [
  { code: 'D6114', desc: 'Implant/abutment supported denture — maxillary', fee: 14500 },
  { code: 'D6010', desc: 'Surgical placement of implant body', fee: 2250 },
  { code: 'D6058', desc: 'Implant-supported porcelain crown', fee: 1850 },
  { code: 'D2740', desc: 'Crown — porcelain/ceramic', fee: 1350 },
  { code: 'D2750', desc: 'Crown — porcelain fused to high noble', fee: 1450 },
  { code: 'D3330', desc: 'Root canal — molar', fee: 1150 },
  { code: 'D2950', desc: 'Core buildup, including pins', fee: 350 },
  { code: 'D2391', desc: 'Resin composite — one surface, posterior', fee: 265 },
];

/** How often (every Nth case) we use the high-value full-arch template. */
const FULL_ARCH_EVERY = 15;
const UNSCHEDULED_COUNT = 58;
const RECALL_COUNT = 42;

const HEADER = ['Patient', 'Code', 'Description', 'Status', 'Fee', 'Diagnosed', 'Recall Due'];

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function daysAgo(now: Date, n: number): Date {
  return new Date(now.getTime() - n * 86_400_000);
}

/**
 * Build a synthetic patients/treatment table (header + rows) in the teaser's CSV
 * shape. Deterministic given `now` (so the demo + its screenshot are stable):
 * ~58 diagnosed-unscheduled cases (six-figure total) across distinct patients,
 * plus ~42 overdue-recall patients.
 */
export function buildSampleRows(now: Date = new Date()): string[][] {
  const rows: string[][] = [HEADER];

  // Diagnosed, unscheduled treatment — distinct patient per row.
  for (let i = 0; i < UNSCHEDULED_COUNT; i++) {
    const t = i % FULL_ARCH_EVERY === 0 ? CASE_TEMPLATES[0]! : CASE_TEMPLATES[1 + (i % (CASE_TEMPLATES.length - 1))]!;
    // Small deterministic fee variation so totals don't look templated.
    const fee = t.fee + (i % 5) * 25;
    const diagnosed = daysAgo(now, 20 + ((i * 7) % 170)); // spread over ~6 months
    rows.push([
      `Patient ${1000 + i}`,
      t.code,
      t.desc,
      'Unscheduled',
      `$${fee.toLocaleString('en-US')}`,
      iso(diagnosed),
      '',
    ]);
  }

  // Overdue recall — distinct patients, completed hygiene, recall date in the past.
  for (let j = 0; j < RECALL_COUNT; j++) {
    const recallDue = daysAgo(now, 25 + ((j * 11) % 210));
    rows.push([
      `Patient ${2000 + j}`,
      'D1110',
      'Prophylaxis — adult',
      'Completed',
      '95',
      iso(daysAgo(now, 230 + ((j * 7) % 120))),
      iso(recallDue),
    ]);
  }

  return rows;
}
