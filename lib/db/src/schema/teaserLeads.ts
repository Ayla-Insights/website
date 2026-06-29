import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";

/**
 * Leads captured by the "Hidden Revenue Report" teaser. By construction this
 * table holds ONLY the strict no-PHI aggregate (ONRAMP_DESIGN §6a): a
 * client-generated pseudonym, the lead's business email, rounded dollar totals,
 * small-cell-suppressed counts, and coarse (YYYY-MM) date ranges. No patient
 * identifiers, no rows, no precise dates — there are no columns that could hold
 * them. The egress allowlist is enforced upstream by `assertNoPhiEgress`
 * (@workspace/teaser-core); this schema is intentionally NOT validated via
 * drizzle-zod so there is a single source of truth for the allowlist.
 */
export const teaserLeadsTable = pgTable("teaser_leads", {
  id: serial("id").primaryKey(),
  practicePseudonym: text("practice_pseudonym").notNull(),
  contactEmail: text("contact_email").notNull(),
  unscheduledTreatmentValue: integer("unscheduled_treatment_value").notNull(),
  fillableGapValue: integer("fillable_gap_value"),
  unscheduledPatientCount: integer("unscheduled_patient_count").notNull(),
  overdueRecallPatientCount: integer("overdue_recall_patient_count").notNull(),
  diagnosedEarliest: text("diagnosed_earliest"),
  diagnosedLatest: text("diagnosed_latest"),
  recallEarliest: text("recall_earliest"),
  recallLatest: text("recall_latest"),
  sourceFormat: text("source_format").notNull(),
  mappingConfidence: real("mapping_confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TeaserLead = typeof teaserLeadsTable.$inferSelect;
export type InsertTeaserLead = typeof teaserLeadsTable.$inferInsert;
