# Hidden Revenue Report — Nurture Sequence (v1)

Three emails that fire after someone runs the Hidden Revenue Report and hands over a work
email. Goal: turn a captured email into a booked discovery call, trust-first.

## Setup notes (read before pasting into Kit/Beehiiv)
- **Merge fields we actually have** (from `teaser_leads`, all no-PHI): `contactEmail`,
  `unscheduled_value` (rounded $), `patient_count` (unscheduled patients),
  `recall_count`. We do **not** capture first name or practice name at the gate (email-only
  = low friction), so greetings use a fallback.
- Set the tool's fallback so `{{first_name}}` → **"there"**. All copy reads correctly either way.
- Optional computed field `{{recoverable_low}}` = `unscheduled_value × 0.20` if your tool
  supports math; the copy works without it.
- **From name:** send as a person — **"Fitch at Mandi" <hello@heymandi.ai>**. Founder-from lifts
  opens for early B2B and matches the "talk to the founder" pilot motion. (Requires the verified
  `heymandi.ai` domain — same blocker as the report email.)
- **CTA link:** `https://heymandi.ai/demo` everywhere a call is offered.
- **Honesty guardrails (kept):** "$ estimated / typical," "built for HIPAA" (never "HIPAA
  compliant"), no claim of live integrations beyond a pilot. Scope gets set on the call.
- **CAN-SPAM footer** (shared, below) on all three: real from, physical address, one-click
  unsubscribe. The tool inserts unsubscribe automatically — keep the address current once
  Mandi LLC registration completes.

---

## Email 1 — immediate (0 min)  ·  *deliver the value*

**Subject A:** Your Hidden Revenue Report: {{unscheduled_value}} on the table
**Subject B:** The {{unscheduled_value}} hiding in your schedule
**Preheader:** Here's what it is — and what getting even a slice of it back looks like.

> Hi {{first_name}},
>
> Here's your Hidden Revenue Report, saved so you can come back to it:
>
> **{{unscheduled_value}}** in estimated unscheduled treatment, across **{{patient_count}}**
> patients who were diagnosed something and never got booked.
>
> That number is typical — most practices we look at are carrying six figures of
> diagnosed-but-unscheduled treatment they simply can't see day to day. It's not a sales
> problem; it's a *visibility* problem. Those patients said yes once. They just fell through
> the cracks of a busy front desk.
>
> The good news: you don't have to recover all of it to move the needle. If even one in five of
> those {{patient_count}} patients came back in, that's real production back on the schedule —
> from patients who already want the work.
>
> Over the next couple of days I'll show you how practices actually work a list like this (and
> why your patient data never left your computer to get this report). If you'd rather just talk
> it through, grab 15 minutes here:
>
> **→ Book a discovery call**  ( https://heymandi.ai/demo )
>
> — Fitch
> Founder, Mandi
>
> *Figures are estimates based on the file you uploaded; actual recoverable revenue depends on
> outreach and scheduling.*

---

## Email 2 — day 2  ·  *the trust wedge*

**Subject A:** Why your patient file never left your computer
**Subject B:** We built Mandi security-first — here's what that means for you
**Preheader:** The whole report ran in your browser. On purpose.

> Hi {{first_name}},
>
> Quick thing worth knowing about the report you ran.
>
> When you uploaded that file, **it never left your computer.** The whole calculation happened
> inside your browser — the only thing that reached us was an anonymous total (a dollar figure
> and a couple of counts) plus your email. No patient names, no chart numbers, no clinical data.
> Ever.
>
> That's not an accident or a setting we flip on. It's how the tool was built from the first
> line of code. Most of the category does it the other way around — you hand over patient data
> to their servers, *then* they add safeguards. We think that's backwards for anything touching
> a dental office.
>
> The full Mandi platform runs on the same principle: **built for HIPAA from day one**, a signed
> BAA before any real data flows, and only sanctioned, above-board connections to your practice
> management system — never scraping, never a back door.
>
> Security is the thing that has to be right *before* the AI is worth anything. So we started
> there.
>
> Questions about how any of it works? Just reply — it comes straight to me.
>
> — Fitch
> Founder, Mandi

---

## Email 3 — day 4  ·  *the ask*

**Subject A:** That report was one slice. Here's the whole thing.
**Subject B:** Unscheduled treatment was just the start
**Preheader:** Insurance, chair-time, case acceptance, staff productivity — one place.

> Hi {{first_name}},
>
> The report you ran looked at exactly two things from a single file: unscheduled treatment and
> overdue recall. That's the tip of it.
>
> Connected to your practice management system, Mandi surfaces the money hiding across the whole
> office:
>
> - **Insurance & carrier profitability** — which plans and carriers actually pay, and where
>   you're leaving money on write-offs
> - **Schedule & chair-time** — the gaps and low-value hours quietly costing you production
> - **Case acceptance** — where treatment plans stall between "diagnosed" and "booked"
> - **Staff productivity** — who's carrying the office and where the bottlenecks are
> - **Ask Mandi** — any of it, answered in plain English, no report-building
>
> And in a pilot, Mandi doesn't just *find* the revenue — it helps your team **work the list**:
> recall outreach, unscheduled-treatment follow-up, and filling schedule gaps, all with a signed
> BAA and your live data.
>
> If the {{unscheduled_value}} from your report got your attention, the full picture is worth a
> conversation. 15 minutes, no pitch-deck marathon:
>
> **→ Book a discovery call**  ( https://heymandi.ai/demo )
>
> — Fitch
> Founder, Mandi

---

## Shared footer (CAN-SPAM)

> Mandi · [Mandi LLC mailing address — update on registration]
> You're getting this because you ran a Hidden Revenue Report at heymandi.ai.
> {{unsubscribe}} anytime — one click, no hard feelings.

## After the sequence
Move non-openers/non-clickers to a **bi-weekly value newsletter** (benchmarks, one revenue-leak
teardown per issue) — keeps the list warm so it converts later instead of going cold. Separate
track; don't keep pushing the discovery call.
