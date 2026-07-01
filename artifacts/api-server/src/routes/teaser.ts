import { Router } from "express";
import rateLimit from "express-rate-limit";
import { and, eq, gte } from "drizzle-orm";
import { db, teaserLeadsTable } from "@workspace/db";
import {
  assertNoPhiEgress,
  PhiEgressError,
  hiddenRevenueAggregateSchema,
} from "@workspace/teaser-core";
import { sendHiddenRevenueReportEmail, sendTeaserLeadNotification } from "../lib/email";

const router = Router();

// Public, unauthenticated endpoint → rate-limit it (mirror the app's 20/min).
const limiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Receives ONLY the strict no-PHI "Hidden Revenue Report" aggregate. The browser
 * already ran `assertNoPhiEgress` before transmitting; we re-run it server-side
 * (defense in depth) against the SAME schema from @workspace/teaser-core. On
 * failure we return the value-free issue descriptors (key names + codes, never
 * values). We never log the body, email, or aggregate (ONRAMP_DESIGN §6a).
 */
router.post("/teaser/aggregate", limiter, async (req, res) => {
  let safe;
  try {
    safe = assertNoPhiEgress(req.body, hiddenRevenueAggregateSchema);
  } catch (err) {
    if (err instanceof PhiEgressError) {
      res.status(400).json({ error: "Invalid aggregate", issues: err.issues });
      return;
    }
    throw err;
  }

  try {
    // Dedupe on (contactEmail, day) so background + CTA retries never create
    // duplicate rows or duplicate emails.
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const existing = await db
      .select({ id: teaserLeadsTable.id })
      .from(teaserLeadsTable)
      .where(
        and(
          eq(teaserLeadsTable.contactEmail, safe.contactEmail),
          gte(teaserLeadsTable.createdAt, startOfDay),
        ),
      )
      .limit(1);
    if (existing.length > 0) {
      res.status(201).json({ ok: true });
      return;
    }

    const [entry] = await db
      .insert(teaserLeadsTable)
      .values({
        practicePseudonym: safe.practicePseudonym,
        contactEmail: safe.contactEmail,
        unscheduledTreatmentValue: safe.unscheduledTreatmentValue,
        fillableGapValue: safe.fillableGapValue,
        unscheduledPatientCount: safe.unscheduledPatientCount,
        overdueRecallPatientCount: safe.overdueRecallPatientCount,
        diagnosedEarliest: safe.diagnosedDateRange.earliest,
        diagnosedLatest: safe.diagnosedDateRange.latest,
        recallEarliest: safe.recallDueDateRange.earliest,
        recallLatest: safe.recallDueDateRange.latest,
        sourceFormat: safe.sourceFormat,
        mappingConfidence: safe.mappingConfidence,
      })
      .returning();

    // Log the row id only — never the email/aggregate.
    req.log.info({ id: entry.id }, "Hidden Revenue Report lead");

    // Internal alert + the prospect's own copy of their report (both no-PHI).
    sendTeaserLeadNotification(entry).catch(() => {});
    sendHiddenRevenueReportEmail(entry).catch(() => {});

    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to store teaser lead");
    res.status(500).json({ error: "Failed to save. Please try again." });
  }
});

export default router;
