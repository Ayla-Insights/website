/**
 * Tests for the Tier-1 "Hidden Revenue Report" pure core (TIER1_TEASER_TICKET
 * stage 1; ONRAMP_DESIGN §6b). Covers the whole client-side pipeline —
 * delimited parsing, header detection, auto-mapping, aggregation, small-cell
 * suppression — and the critical link to the no-PHI transmit boundary: the
 * core's output must validate clean through the egress allowlist and carry no
 * patient identifiers.
 */
import { describe, expect, it } from 'vitest';
import {
  assertNoPhiEgress,
  autoMapColumns,
  buildHiddenRevenueAggregate,
  classifyStatus,
  coarseDateOf,
  computeLocalAggregate,
  detectHeaderRow,
  hiddenRevenueAggregateSchema,
  parseDelimited,
  parseLooseDate,
  parseMoney,
  parseWithDelimiter,
  roundDollars,
  suppressCount,
  type LocalAggregate,
} from '@workspace/teaser-core';

// A realistic synthetic treatment-plan export: two title rows, quoted names
// with embedded commas, a `$`/comma money column, mixed statuses, blank recall
// cells. Synthetic data only (CLAUDE.md / §6a "send a sample" rule).
const FIXTURE_CSV = [
  'Treatment Manager — Bright Smile Dental,,,,,,',
  'Generated 06/16/2026,,,,,,',
  'Patient,Code,Description,Status,Fee,Diagnosed,Recall Due',
  '"Smith, John",D2740,Crown,Unscheduled,1300,03/12/2026,01/15/2026',
  '"Smith, John",D2950,Core buildup,Unscheduled,$350,03/12/2026,01/15/2026',
  '"Doe, Jane",D6010,Implant,Treatment Planned,"2,200",02/01/2026,',
  '"Roe, Richard",D1110,Prophy,Completed,95,01/05/2026,05/20/2026',
  '"Lee, Amy",D2391,Filling,Scheduled,210,04/02/2026,',
  '"Park, Sam",D2740,Crown,Unscheduled,1300,05/10/2026,11/01/2025',
].join('\n');

const NOW = new Date('2026-06-13T12:00:00Z');

function pipeline(csv: string) {
  const { rows } = parseDelimited(csv);
  const headerIdx = detectHeaderRow(rows);
  const header = rows[headerIdx]!;
  const dataRows = rows.slice(headerIdx + 1);
  const mapping = autoMapColumns(header, dataRows);
  const local = computeLocalAggregate(dataRows, mapping, { now: NOW });
  return { rows, headerIdx, header, dataRows, mapping, local };
}

describe('parseWithDelimiter', () => {
  it('parses simple comma rows', () => {
    expect(parseWithDelimiter('a,b,c\n1,2,3', ',')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('honors quoted fields with embedded delimiters, quotes, and newlines', () => {
    const text = '"Smith, John","say ""hi""","line1\nline2"\nx,y,z';
    expect(parseWithDelimiter(text, ',')).toEqual([
      ['Smith, John', 'say "hi"', 'line1\nline2'],
      ['x', 'y', 'z'],
    ]);
  });

  it('handles \\r\\n line endings and no trailing empty row', () => {
    expect(parseWithDelimiter('a,b\r\n1,2\r\n', ',')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps empty trailing fields', () => {
    expect(parseWithDelimiter('a,b,', ',')).toEqual([['a', 'b', '']]);
  });
});

describe('parseDelimited (delimiter sniffing)', () => {
  it('sniffs tab-delimited .out content', () => {
    const out = 'Patient\tCode\tFee\nSmith\tD2740\t1300';
    const { rows, delimiter } = parseDelimited(out);
    expect(delimiter).toBe('\t');
    expect(rows[1]).toEqual(['Smith', 'D2740', '1300']);
  });

  it('sniffs pipe-delimited content', () => {
    const { delimiter } = parseDelimited('a|b|c|d\n1|2|3|4\n5|6|7|8');
    expect(delimiter).toBe('|');
  });

  it('strips a UTF-8 BOM', () => {
    const { rows } = parseDelimited('﻿a,b\n1,2');
    expect(rows[0]).toEqual(['a', 'b']);
  });

  it('prefers comma over a delimiter that yields a single column', () => {
    const { delimiter } = parseDelimited('a,b,c\n1,2,3');
    expect(delimiter).toBe(',');
  });
});

describe('detectHeaderRow', () => {
  it('skips title and blank rows above the header', () => {
    const { rows } = parseDelimited(FIXTURE_CSV);
    expect(detectHeaderRow(rows)).toBe(2);
    expect(rows[2]![0]).toBe('Patient');
  });

  it('returns 0 when the first row is already the header', () => {
    const { rows } = parseDelimited('Patient,Code,Fee\nSmith,D2740,1300');
    expect(detectHeaderRow(rows)).toBe(0);
  });
});

describe('parseMoney', () => {
  it.each([
    ['1300', 1300],
    ['$350', 350],
    ['2,200', 2200],
    ['$1,234.50', 1234.5],
    ['($300)', -300],
    ['-42', -42],
  ])('parses %s → %d', (input, expected) => {
    expect(parseMoney(input)).toBe(expected);
  });

  it.each(['', '  ', 'N/A', 'abc', 'D2740'])('rejects non-money %j → null', (input) => {
    expect(parseMoney(input)).toBeNull();
  });
});

describe('parseLooseDate + coarseDateOf', () => {
  it('parses ISO, US slash, and 2-digit years', () => {
    expect(coarseDateOf(parseLooseDate('2026-03-12')!)).toBe('2026-03');
    expect(coarseDateOf(parseLooseDate('3/12/2026')!)).toBe('2026-03');
    expect(coarseDateOf(parseLooseDate('03/12/26')!)).toBe('2026-03');
    expect(coarseDateOf(parseLooseDate('2026-03-12 09:30:00')!)).toBe('2026-03');
  });

  it('rejects junk and impossible dates', () => {
    expect(parseLooseDate('')).toBeNull();
    expect(parseLooseDate('not a date')).toBeNull();
    expect(parseLooseDate('13/40/2026')).toBeNull();
  });
});

describe('classifyStatus', () => {
  it('distinguishes unscheduled from scheduled (substring trap) and completed', () => {
    expect(classifyStatus('Unscheduled')).toBe('unscheduled');
    expect(classifyStatus('Treatment Planned')).toBe('unscheduled');
    expect(classifyStatus('Proposed')).toBe('unscheduled');
    expect(classifyStatus('Scheduled')).toBe('scheduled');
    expect(classifyStatus('Confirmed')).toBe('scheduled');
    expect(classifyStatus('Completed')).toBe('completed');
    expect(classifyStatus('Existing')).toBe('completed');
    expect(classifyStatus('')).toBe('unknown');
  });
});

describe('autoMapColumns', () => {
  it('maps roles from headers on the realistic fixture', () => {
    const { mapping } = pipeline(FIXTURE_CSV);
    expect(mapping.roleToIndex).toMatchObject({
      patientRef: 0,
      procedureCode: 1,
      status: 3,
      fee: 4,
      diagnosedDate: 5,
      recallDueDate: 6,
    });
    expect(mapping.overallConfidence).toBeGreaterThan(0.8);
  });

  it('maps roles from CONTENT when headers are unhelpful', () => {
    const header = ['A', 'B', 'C', 'D'];
    const rows = [
      ['$1,300', 'D2740', 'Unscheduled', '03/12/2026'],
      ['$350', 'D2950', 'Completed', '01/05/2026'],
      ['$2,200', 'D6010', 'Scheduled', '02/01/2026'],
      ['$95', 'D1110', 'Unscheduled', '04/02/2026'],
    ];
    const mapping = autoMapColumns(header, rows);
    expect(mapping.roleToIndex.fee).toBe(0);
    expect(mapping.roleToIndex.procedureCode).toBe(1);
    expect(mapping.roleToIndex.status).toBe(2);
    expect(mapping.roleToIndex.diagnosedDate).toBe(3);
  });

  it('lets a labeled column win over a coincidental content match', () => {
    // An integer "Account" column should map to patientRef, not fee, even
    // though its values look money-ish. The real Fee column keeps fee.
    const header = ['Account', 'Fee'];
    const rows = [
      ['10231', '1300'],
      ['10232', '350'],
      ['10233', '2200'],
    ];
    const mapping = autoMapColumns(header, rows);
    expect(mapping.roleToIndex.patientRef).toBe(0);
    expect(mapping.roleToIndex.fee).toBe(1);
  });
});

describe('computeLocalAggregate', () => {
  it('aggregates the realistic fixture to exact raw values', () => {
    const { local } = pipeline(FIXTURE_CSV);
    // Unscheduled = Smith crown+core + Doe implant + Park crown (Roe completed,
    // Lee scheduled excluded).
    expect(local.unscheduledTreatmentValue).toBe(1300 + 350 + 2200 + 1300);
    expect(local.unscheduledRowCount).toBe(4);
    expect(local.unscheduledPatientCount).toBe(3); // Smith, Doe, Park (Smith deduped)
    // Overdue recall: any patient with a recall-due month before NOW (June 2026):
    // Smith (Jan), Roe (May), Park (Nov 2025).
    expect(local.overdueRecallPatientCount).toBe(3);
    expect(local.diagnosedDateRange).toEqual({ earliest: '2026-02', latest: '2026-05' });
    expect(local.recallDueDateRange).toEqual({ earliest: '2025-11', latest: '2026-05' });
    expect(local.fillableGapValue).toBeNull();
  });

  it('falls back to priced coded rows when no status column is present', () => {
    const csv = [
      'Patient,Code,Fee',
      'Aaa,D2740,1000',
      'Bbb,D2950,500',
      'Ccc,D0120,0', // zero fee → not counted
    ].join('\n');
    const { mapping, local } = (() => {
      const { rows } = parseDelimited(csv);
      const h = detectHeaderRow(rows);
      const m = autoMapColumns(rows[h]!, rows.slice(h + 1));
      const l = computeLocalAggregate(rows.slice(h + 1), m, { now: NOW });
      return { mapping: m, local: l };
    })();
    expect(mapping.roleToIndex.status).toBeUndefined();
    expect(local.unscheduledTreatmentValue).toBe(1500);
    expect(local.unscheduledPatientCount).toBe(2);
  });

  it('excludes future-dated and >18-month-stale diagnoses (recoverable window)', () => {
    // NOW = 2026-06 → window is ~2024-12 .. 2026-06.
    const mapping = {
      columns: [],
      roleToIndex: { patientRef: 0, procedureCode: 1, fee: 2, status: 3, diagnosedDate: 4 },
      overallConfidence: 1,
    };
    const rows = [
      ['A', 'D2740', '1000', 'Unscheduled', '03/15/2026'], // in window → counts
      ['B', 'D2740', '2000', 'Unscheduled', '01/15/2028'], // future → excluded
      ['C', 'D2740', '4000', 'Unscheduled', '01/15/2023'], // >18mo stale → excluded
      ['D', 'D2740', '500', 'Unscheduled', ''], //            no date → counts best-effort
    ];
    const local = computeLocalAggregate(rows, mapping, { now: NOW });
    expect(local.unscheduledTreatmentValue).toBe(1500); // 1000 + 500 only
    expect(local.unscheduledPatientCount).toBe(2); // A + D
    // Range is bounded and never shows a future month.
    expect(local.diagnosedDateRange).toEqual({ earliest: '2026-03', latest: '2026-03' });
  });

  it('leaves the total unchanged and the range empty when no diagnosed column is mapped', () => {
    const mapping = {
      columns: [],
      roleToIndex: { patientRef: 0, procedureCode: 1, fee: 2, status: 3 },
      overallConfidence: 1,
    };
    const rows = [['A', 'D2740', '1000', 'Unscheduled']];
    const local = computeLocalAggregate(rows, mapping, { now: NOW });
    expect(local.unscheduledTreatmentValue).toBe(1000);
    expect(local.diagnosedDateRange).toEqual({ earliest: null, latest: null });
  });
});

describe('suppression + rounding', () => {
  it('suppresses counts below the small-cell threshold', () => {
    expect(suppressCount(4)).toBe(0);
    expect(suppressCount(5)).toBe(5);
    expect(suppressCount(37)).toBe(37);
  });

  it('rounds dollars to the configured granularity', () => {
    expect(roundDollars(5153)).toBe(5150);
    expect(roundDollars(12344)).toBe(12340);
    expect(roundDollars(0)).toBe(0);
  });
});

describe('buildHiddenRevenueAggregate', () => {
  const base: LocalAggregate = {
    unscheduledTreatmentValue: 5153,
    unscheduledPatientCount: 8,
    overdueRecallPatientCount: 6,
    fillableGapValue: null,
    diagnosedDateRange: { earliest: '2026-02', latest: '2026-05' },
    recallDueDateRange: { earliest: '2025-11', latest: '2026-05' },
    unscheduledRowCount: 12,
  };
  const mapping = { columns: [], roleToIndex: {}, overallConfidence: 0.91 };
  const ctx = {
    practicePseudonym: 'prac_9f2c',
    contactEmail: 'office@brightsmile.example',
    sourceFormat: 'csv' as const,
  };

  it('rounds dollars, keeps surviving counts, stamps suppression, and validates clean', () => {
    const payload = buildHiddenRevenueAggregate(base, mapping, ctx);
    expect(payload.unscheduledTreatmentValue).toBe(5150);
    expect(payload.unscheduledPatientCount).toBe(8);
    expect(payload.overdueRecallPatientCount).toBe(6);
    expect(payload.suppressedSmallCells).toBe(true);
    expect(payload.mappingConfidence).toBeCloseTo(0.91);
    // The crux: the core's output passes the no-PHI egress allowlist untouched.
    expect(() => assertNoPhiEgress(payload, hiddenRevenueAggregateSchema)).not.toThrow();
  });

  it('suppresses small patient counts to zero', () => {
    const payload = buildHiddenRevenueAggregate(
      { ...base, unscheduledPatientCount: 3, overdueRecallPatientCount: 2 },
      mapping,
      ctx,
    );
    expect(payload.unscheduledPatientCount).toBe(0);
    expect(payload.overdueRecallPatientCount).toBe(0);
  });
});

describe('end-to-end: fixture → transmit payload carries no PHI', () => {
  it('produces a whitelist-clean aggregate with no patient identifiers', () => {
    const { local, mapping } = pipeline(FIXTURE_CSV);
    const payload = buildHiddenRevenueAggregate(local, mapping, {
      practicePseudonym: 'prac_9f2c',
      contactEmail: 'office@brightsmile.example',
      sourceFormat: 'csv',
    });
    const safe = assertNoPhiEgress(payload, hiddenRevenueAggregateSchema);
    expect(safe.unscheduledTreatmentValue).toBe(5150);
    // The fixture's patient surnames must not appear anywhere in the payload.
    const serialized = JSON.stringify(payload);
    for (const name of ['Smith', 'Doe', 'Roe', 'Lee', 'Park', 'John', 'Jane']) {
      expect(serialized).not.toContain(name);
    }
    // Only whitelisted keys are present.
    expect(Object.keys(payload).sort()).toEqual(
      Object.keys(hiddenRevenueAggregateSchema.shape).sort(),
    );
  });
});
