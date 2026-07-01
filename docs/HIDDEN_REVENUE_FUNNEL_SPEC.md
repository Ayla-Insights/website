# Hidden Revenue Report — Funnel Spec (v1)

**Owner:** Web Dev lane · **Reviewer for compliance items:** Security Architect (only where flagged)
**Repo:** `Ayla-Insights/website` (`~/Code/mandi-web`)

## Why
Three goals, in priority order:
1. **Credibility** — the report must survive scrutiny on a discovery call. It currently
   inflates the headline number and shows a future date.
2. **Never lose a captured lead** — the report is gated on a backend POST succeeding; a
   transient error blocks the user *and* drops the lead. That directly undercuts list-building.
3. **Wire the follow-on funnel** — captured email → prospect gets their report → nurture →
   booked discovery call. Today the funnel dead-ends at the report screen (internal
   notification only; the prospect never hears from us again).

## Hard invariants (do not break)
- `assertNoPhiEgress(payload, hiddenRevenueAggregateSchema)` stays the **single egress gate**;
  it runs before *every* network send. Do not change the schema shape — if a field is
  added/removed, that's a **Security Architect gate** (control SC-12). This spec is designed to
  avoid touching it.
- No patient data leaves the browser. No third-party analytics/telemetry on `/hidden-revenue`.
- Server never logs body / email / aggregate. `/hidden-revenue` stays out of prerender.
- The "Try with sample data" path transmits nothing — keep it that way.

Files in scope: `lib/teaser-core/src/teaser-core.ts`,
`artifacts/ayla-marketing/src/hidden-revenue/{TeaserApp,steps}.tsx`,
`artifacts/api-server/src/routes/teaser.ts`, `artifacts/api-server/src/lib/email.ts`.

---

## 1. Report accuracy — recoverable date window  *(credibility — highest priority)*

**Problem.** `computeLocalAggregate` counts every priced/unscheduled row into
`unscheduledValue` regardless of its diagnosed date. The recall path is correctly clamped to the
past (`teaser-core.ts:453` — `monthIndexOf(due) < nowMonth`), but the treatment path
(`teaser-core.ts:443–448`) has **no date filter**. So future-dated and years-stale rows both
count, producing the impossible label `diagnosed 2025-07 to 2029-09` and an inflated total.
(This isn't only synthetic data — the column matchers include `/planned/` and `/proposeddate/`,
so a real practice's *proposed treatment date* column legitimately contains future dates.)

**Change — `teaser-core.ts`, `computeLocalAggregate`:**
- Add `const LOOKBACK_MONTHS = 18;` and derive `windowStart = nowMonth - LOOKBACK_MONTHS`
  (`nowMonth` already exists at ~line 417).
- In the unscheduled branch (~line 443), when the row has a parseable diagnosed date `d`:
  - **Exclude** if `monthIndexOf(d) > nowMonth` (future — impossible for a real diagnosis).
  - **Exclude** if `monthIndexOf(d) < windowStart` (too stale to be recoverable).
  - Only in-window rows contribute to `unscheduledValue`, `unscheduledRowCount`,
    `unscheduledPatients`, and `diagnosedRange`.
- If the row has **no** parseable diagnosed date (or no diagnosed column mapped): keep counting
  it (best-effort, unchanged) — it just doesn't contribute to the range.
- Downstream small-cell suppression + $ rounding stay exactly as-is.

**Change — label, `steps.tsx` report subtitle:**
- If a window applied: render **"diagnosed in the last 18 months"** (never a raw range that
  could show a future month).
- If no date column was mapped: **drop the date subtitle entirely** — don't imply a range we
  don't have.

**Compliance:** pure local compute. The transmitted `diagnosedDateRange` gets *bounded* values
but the **same shape** → no schema change → **no SA gate.**

**Acceptance:**
- File with a future diagnosed date → excluded; total drops; range never shows a future month.
- File with only >18-month-old dates → excluded; label reflects it.
- File with no date column → total unchanged; no date subtitle.

---

## 2. Report presentation — no empty/placeholder cards  *(credibility)*

**Problem.** Two of four cards render as non-values: `OVERDUE-RECALL PATIENTS: —` ("too few to
report") and `FILLABLE SCHEDULE GAPS: Pilot` ("needs schedule data"). A bare `—` and the literal
word **"Pilot"** in a number slot read as bugs and make the report look half-empty.

**Change — `steps.tsx`, ReportStep card grid.** Give each card one of three states:
- `value` — a real number → render as today.
- `suppressed` (small-cell) → **hide the card** when ≥2 real cards exist; otherwise render muted
  "Not enough in this file." **Never** a bare `—`.
- `locked` (needs live PMS / pilot) → render as an explicit teaser, not a stat: lock glyph +
  muted style + copy like **"Unlock with your live PMS."** **Never** a bare word ("Pilot") in
  the number slot.
- Rule: always lead with the strongest 1–2 real cards; degrade the rest gracefully.

**Compliance:** presentational only.

---

## 3. Lead capture must not gate the report  *(funnel reliability)*

**Problem.** `TeaserApp.tsx:handleGateSubmit` only calls `setStep('report')` **after** a
successful `POST /api/teaser/aggregate`; on any error it shows *"We couldn't generate your
report just now."* The report is 100% local — a backend hiccup blocks the user from their own
numbers AND drops the lead.

**Change — `TeaserApp.tsx:handleGateSubmit`:**
- Keep `assertNoPhiEgress(payload, schema)` **before** any send (unchanged — it's the guard).
- **Immediately `setStep('report')`** after the guard passes — the report always renders.
- Fire the POST **in the background**: `.catch()` it; never throw to the UI, never show an error
  over the report.
- **Retry** once on network/5xx with a short backoff. Track `leadCaptured: boolean`.
- If still not captured, **re-attempt the POST when the user clicks a CTA** (Book a call /
  Explore) — a second chance at the peak of intent. Backend insert is cheap; **dedupe on
  `(contactEmail, createdAt-day)`** so retries don't create duplicate rows (see §4).
- Drop the `submitError` UI on this path (keep it only for client-side validation, e.g. bad
  email format).

**Compliance:** changes *when* the report renders and *how often* we retry — **not what
egresses**. Same payload, same guard → **no SA gate.**

**Acceptance:** stop the api-server → submit email → report renders, no error shown; restart it
→ lead lands exactly once. Sample-data path → still zero network calls.

---

## 4. The follow-on funnel  *(captured email → booked call)*

This is the part that turns an email into a discovery call.

### 4a. Post-report CTAs — confirm destinations *(mostly wired)*
`ReportStep` already receives `onStartPilot` (→ `bookCall`) and `onExplore` (→ `explore`).
- **Primary "Book a discovery call →" → `/demo`.** Confirm `/demo` embeds a real scheduler
  (Cal.com/Calendly) — one click from peak intent converts far better than a plain form. If it's
  currently a form, that's the single highest-ROI upgrade in this doc.
- **Secondary "explore the full platform →" → `/features`.** Confirm.

### 4b. Send the prospect their report *(net-new — the promise made good)*
Today `teaser.ts:62` fires **only** an internal `sendTeaserLeadNotification`. Add a
**prospect-facing** email on successful insert:
- Content = **only the already-validated aggregate**: rounded $, suppressed counts, coarse
  YYYY-MM ranges, and a "Book a discovery call" link. **No patient data by construction** — reuse
  the same object that passed `assertNoPhiEgress`. Do not add any field not already in the schema.
- New fn `sendHiddenRevenueReportEmail(entry)` in `email.ts` (mirror the existing lazy
  `getResend()` + per-fn key guard — already correct there).
- **Prerequisite (blocker):** the lead notification currently sends from
  `onboarding@resend.dev` (Resend sandbox — only delivers to the account owner). Prospect email
  **requires a verified sending domain** — send from `hello@heymandi.ai` (or
  `reports@heymandi.ai`). Verify the domain in Resend first (owner/DNS task) or this email won't
  deliver. Flag to Fitch.

### 4c. Nurture sequence *(the list-building payoff)*
Do this in an **email marketing tool** (Kit/ConvertKit free ≤10k, or Beehiiv free) — not custom
cron — so unsubscribe / CAN-SPAM is handled for you. 3 emails:
- **E1 (immediate):** the report + one benchmark ("N patients with unscheduled treatment is
  typical for a practice your size; recovering even 20% looks like $X").
- **E2 (day 2):** the security story — "why your file never left your browser." The trust wedge.
- **E3 (day 4):** soft CTA to a discovery call + the "fraction of what Mandi finds" list.
- Then a bi-weekly value newsletter (separate track).

**Handoff mechanism (v1, simplest):** on successful insert, the API pushes the lead
(`contactEmail` + rounded aggregate, **no PHI**) to the email tool via its API/webhook. If that's
not ready, export `teaser_leads` → import to the tool manually to start.

**Vendor determination (record with SA):** the email tool receives only a **business email + a
no-PHI aggregate** → it never touches PHI → **DPA, not BAA** (CLAUDE.md #11). Log the
determination; don't default to a BAA.

### 4d. Measurement — first-party only *(compliance-safe)*
The site is zero-analytics by design, and `/hidden-revenue` is a no-telemetry surface. To measure
the funnel **without** violating that:
- Emit **first-party, server-side step counters** only — aggregate counts of
  `report_started / upload_done / email_submitted / cta_clicked`. No patient data, no identifiers.
- **Do NOT** add Google Analytics, Meta Pixel, or any third-party script to `/hidden-revenue`.
  That would break the no-third-party-telemetry rule on the teaser surface (CLAUDE.md #3).

---

## 5. Prerequisites / owner actions (not code)
- **Verify `heymandi.ai` sending domain in Resend** (DNS) — blocks §4b.
- **Pick + set up the email marketing tool** (Kit or Beehiiv) — enables §4c.
- **SA sign-off** needed only for: recording the email-tool vendor as a DPA (§4c). §1–3 and
  §4a/4b/4d carry **no schema change** and need no SA gate.

## 6. Verification checklist (before opening the PR)
- [ ] Future-dated file → excluded; no future month in the label; total drops.
- [ ] All-stale (>18mo) file → excluded/labeled.
- [ ] No-date-column file → total unchanged; no date subtitle.
- [ ] Suppressed/locked cards render as hidden/locked, never `—` or a bare "Pilot".
- [ ] api-server down → report still renders, no error shown; background retry logged.
- [ ] api-server up → lead row lands exactly once (dedupe holds on retry).
- [ ] Prospect receives the report email; body contains only rounded totals / coarse ranges.
- [ ] `curl` a body with `patientName` → still 400, no value echoed (guard intact).
- [ ] Sample-data path → zero network POSTs.
- [ ] `/hidden-revenue` still not in the prerender routes; no third-party scripts on the page.
