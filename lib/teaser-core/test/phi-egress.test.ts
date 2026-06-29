/**
 * Tests for the shared no-PHI egress guard + the Tier-1 teaser aggregate
 * whitelist. The last describe block is the **CI guard** (ONRAMP §6a / SC-12):
 * it fails the build if a PHI-bearing payload could ever pass the teaser's
 * transmit schema — and asserts the thrown error never echoes the PHI value.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  type HiddenRevenueAggregate,
  PhiEgressError,
  assertNoPhiEgress,
  hiddenRevenueAggregateSchema,
  strictObject,
} from '@workspace/teaser-core';

const validAggregate: HiddenRevenueAggregate = {
  practicePseudonym: 'prac_9f2c',
  contactEmail: 'office@brightsmile.example',
  unscheduledTreatmentValue: 236300,
  fillableGapValue: 17200,
  unscheduledPatientCount: 87,
  overdueRecallPatientCount: 116,
  diagnosedDateRange: { earliest: '2025-09', latest: '2026-06' },
  recallDueDateRange: { earliest: '2025-01', latest: '2026-06' },
  sourceFormat: 'csv',
  mappingConfidence: 0.92,
  suppressedSmallCells: true,
};

describe('assertNoPhiEgress', () => {
  it('returns the typed value for a conforming payload', () => {
    const out = assertNoPhiEgress(validAggregate, hiddenRevenueAggregateSchema);
    expect(out.unscheduledTreatmentValue).toBe(236300);
  });

  it('throws on an unrecognized top-level key (the PHI-leak case)', () => {
    const withPhi = { ...validAggregate, patientName: 'Daisy Watsica' };
    expect(() => assertNoPhiEgress(withPhi, hiddenRevenueAggregateSchema)).toThrow(PhiEgressError);
  });

  it('throws on a nested unrecognized key (strict objects all the way down)', () => {
    const nested = {
      ...validAggregate,
      diagnosedDateRange: { earliest: '2025-09', latest: '2026-06', exactDate: '2026-06-02' },
    };
    expect(() => assertNoPhiEgress(nested, hiddenRevenueAggregateSchema)).toThrow(PhiEgressError);
  });

  it('throws on a wrong type', () => {
    const bad = { ...validAggregate, unscheduledPatientCount: 'eighty-seven' };
    expect(() => assertNoPhiEgress(bad, hiddenRevenueAggregateSchema)).toThrow(PhiEgressError);
  });

  it('reports the disallowed KEY name but NEVER the value', () => {
    const withPhi = { ...validAggregate, patientPhone: '555-867-5309' };
    try {
      assertNoPhiEgress(withPhi, hiddenRevenueAggregateSchema);
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(PhiEgressError);
      const err = e as PhiEgressError;
      const text = err.message + ' ' + err.issues.join(' ');
      expect(text).toContain('patientPhone'); // the key is named (helps debugging)
      expect(text).not.toContain('555-867-5309'); // the VALUE is never echoed
    }
  });

  it('strictObject rejects extras (the builder the guard depends on)', () => {
    const s = strictObject({ a: z.number() });
    expect(s.safeParse({ a: 1 }).success).toBe(true);
    expect(s.safeParse({ a: 1, b: 2 }).success).toBe(false);
  });
});

// --- CI GUARD: the teaser transmit payload can carry ONLY the whitelist ------
describe('CI guard — teaser aggregate rejects PHI', () => {
  // A spread of fields a careless change might leak. Each must be rejected.
  const PHI_FIELDS: Record<string, unknown> = {
    patientName: 'Daisy Watsica',
    firstName: 'Daisy',
    lastName: 'Watsica',
    phone: '555-867-5309',
    email: 'daisy@example.com', // a PATIENT email (distinct from contactEmail)
    dob: '1984-02-29',
    address: '12 Maple St',
    rows: [['Daisy', 'Watsica', '$17,500']],
    rawFile: 'name,phone\nDaisy,555...',
    serviceDate: '2026-06-02',
    chartNumber: 'A-1042',
    ssn: '000-00-0000',
  };

  for (const [field, value] of Object.entries(PHI_FIELDS)) {
    it(`rejects a payload carrying "${field}"`, () => {
      const leaky = { ...validAggregate, [field]: value };
      expect(() => assertNoPhiEgress(leaky, hiddenRevenueAggregateSchema)).toThrow(PhiEgressError);
    });
  }

  it('the whitelist is exactly the expected fields (drift tripwire)', () => {
    // If someone adds a field to the schema, this fails until they confirm it's
    // non-PHI and update the list — forcing a conscious review of any new egress.
    const keys = Object.keys(hiddenRevenueAggregateSchema.shape).sort();
    expect(keys).toEqual(
      [
        'contactEmail',
        'diagnosedDateRange',
        'fillableGapValue',
        'mappingConfidence',
        'overdueRecallPatientCount',
        'practicePseudonym',
        'recallDueDateRange',
        'sourceFormat',
        'suppressedSmallCells',
        'unscheduledPatientCount',
        'unscheduledTreatmentValue',
      ].sort(),
    );
  });
});
