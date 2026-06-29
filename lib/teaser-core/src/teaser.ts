/**
 * Tier-1 "Hidden Revenue Report" teaser — the ONLY thing transmitted to Ayla
 * (ONRAMP_DESIGN §4/§6a). The raw export is parsed entirely in the browser; this
 * strict, PHI-free aggregate is the entire payload, validated by the no-PHI
 * egress guard before it leaves. Whitelist: practice-level numbers, counts,
 * COARSE (month-granularity) date ranges, the lead's business email, and
 * non-PHI provenance. No names, no rows, no per-patient values, no precise dates
 * (a specific service date is a Safe-Harbor identifier).
 */
import { z } from 'zod';
import { strictObject } from './phi-egress.js';

/** Month-granularity range only — never a specific per-patient date. */
export const coarseDateRangeSchema = strictObject({
  earliest: z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM').nullable(),
  latest: z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM').nullable(),
});
export type CoarseDateRange = z.infer<typeof coarseDateRangeSchema>;

export const TEASER_SOURCE_FORMATS = ['csv', 'xlsx', 'out'] as const;

/**
 * The transmit payload. STRICT (rejects any unrecognized key) so a PHI field
 * added upstream can never leave — see assertNoPhiEgress. Dollar fields are
 * rounded and counts are small-cell-suppressed BEFORE they reach here.
 */
export const hiddenRevenueAggregateSchema = strictObject({
  /** Pseudonymous practice id (client-generated/hashed) — NOT the practice name. */
  practicePseudonym: z.string().min(1).max(64),
  /** Lead contact: the practice's BUSINESS email (not PHI). Gates the full report. */
  contactEmail: z.string().email().max(254),

  /** Dollars (rounded). */
  unscheduledTreatmentValue: z.number().nonnegative(),
  fillableGapValue: z.number().nonnegative().nullable(),
  /** Counts (suppressed to 0 when below the small-cell threshold). */
  unscheduledPatientCount: z.number().int().nonnegative(),
  overdueRecallPatientCount: z.number().int().nonnegative(),

  /** Coarse ranges only. */
  diagnosedDateRange: coarseDateRangeSchema,
  recallDueDateRange: coarseDateRangeSchema,

  /** Non-PHI provenance for the funnel. */
  sourceFormat: z.enum(TEASER_SOURCE_FORMATS),
  mappingConfidence: z.number().min(0).max(1),
  /** Asserts the client applied small-cell suppression + dollar rounding. */
  suppressedSmallCells: z.literal(true),
});

export type HiddenRevenueAggregate = z.infer<typeof hiddenRevenueAggregateSchema>;
