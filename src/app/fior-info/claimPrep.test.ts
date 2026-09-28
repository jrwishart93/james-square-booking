import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  asSentence,
  buildBackground,
  buildScheduleText,
  buildSteps,
  buildSummaryText,
  buildWhy,
  clearPrep,
  computeTotals,
  createEmptyPrep,
  findSensitiveTerms,
  formatLongDate,
  formatPence,
  isValidIsoDate,
  loadPrep,
  restorePrep,
  savePrep,
  toPence,
  validateAmounts,
  validateClaimant,
  type ClaimPrep,
} from './claimPrep';

function prepWith(overrides: Partial<ClaimPrep> = {}): ClaimPrep {
  return { ...createEmptyPrep(), ...overrides };
}

const payments = [
  { id: 'b', date: '2026-03-01', amount: '169', description: 'Direct Debit' },
  { id: 'a', date: '2026-02-01', amount: '169.00', description: 'Direct Debit' },
  { id: 'c', date: '2026-01-15', amount: '1,100', description: 'Proposed roof works' },
];

describe('money', () => {
  it('parses to integer pence without float drift', () => {
    expect(toPence('0.1')).toBe(10);
    expect(toPence('£1,250.5')).toBe(125050);
    expect(toPence('169.99')).toBe(16999);
    expect(toPence('0')).toBeNull();
    expect(toPence('0', { allowZero: true })).toBe(0);
    expect(toPence('12.345')).toBeNull();
    expect(toPence('abc')).toBeNull();
    expect(toPence('-5')).toBeNull();
  });

  it('formats pence as pounds', () => {
    expect(formatPence(143800)).toBe('£1,438.00');
    expect(formatPence(0)).toBe('£0.00');
  });
});

describe('dates', () => {
  it('validates real calendar dates only', () => {
    expect(isValidIsoDate('2026-02-01')).toBe(true);
    expect(isValidIsoDate('2026-02-30')).toBe(false);
    expect(isValidIsoDate('01/02/2026')).toBe(false);
    expect(isValidIsoDate('1850-01-01')).toBe(false);
  });

  it('formats without timezone drift', () => {
    expect(formatLongDate('2026-02-01')).toBe('1 February 2026');
    expect(formatLongDate('nonsense')).toBe('');
  });
});

describe('totals', () => {
  it('sums valid payments, subtracts returns and ignores incomplete rows', () => {
    const prep = prepWith({
      payments: [...payments, { id: 'd', date: '', amount: '50', description: 'no date' }],
      anyReturned: 'yes',
      returnedAmount: '100',
    });
    const t = computeTotals(prep);
    expect(t.totalPaid).toBe(143800);
    expect(t.returned).toBe(10000);
    expect(t.calculatedOutstanding).toBe(133800);
    expect(t.claimed).toBe(133800);
    expect(t.validPayments.map((p) => p.id)).toEqual(['c', 'a', 'b']);
    expect(t.overLimit).toBe(false);
  });

  it("prefers the owner's stated figure and flags the £5,000 limit", () => {
    const t = computeTotals(prepWith({ payments, statedOutstanding: '5000.01' }));
    expect(t.claimed).toBe(500001);
    expect(t.overLimit).toBe(true);
    expect(computeTotals(prepWith({ statedOutstanding: '5000' })).overLimit).toBe(false);
  });

  it('ignores the returned amount when the owner answered No', () => {
    const t = computeTotals(prepWith({ payments, anyReturned: 'no', returnedAmount: '999' }));
    expect(t.returned).toBe(0);
  });
});

describe('validation', () => {
  it('requires claimant details in the right format', () => {
    const errors = validateClaimant({ fullName: '', address: 'x', postcode: 'nope', email: 'bad' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName', 'postcode']);
    expect(validateClaimant({ fullName: 'A', address: 'B', postcode: 'eh11 2ab', email: 'a@b.co' })).toEqual({});
  });

  it('validates partially-filled payment rows but skips blank ones', () => {
    const prep = prepWith({
      payments: [
        { id: 'x', date: '', amount: '', description: '' },
        { id: 'y', date: '2026-02-31', amount: '1.234', description: '' },
      ],
    });
    expect(Object.keys(validateAmounts(prep)).sort()).toEqual(['y-amount', 'y-date', 'y-description']);
  });
});

describe('drafts', () => {
  it('builds a chronological background using only the owner’s facts', () => {
    const prep = prepWith({
      payments,
      anyReturned: 'no',
      story: {
        whenPaid: 'january to march 2026',
        toldFor: 'factoring fees and a roof repair',
        afterwards: 'FIOR stopped acting as factor on 31 January 2026',
        problemWhen: '',
        whyReturn: '',
        partReturned: '',
        other: '',
      },
    });
    const text = buildBackground(prep);
    expect(text).toContain('- 15 January 2026: £1,100.00 (Proposed roof works)');
    expect(text).toContain('Total paid: £1,438.00.');
    expect(text).toContain('When the payments were made: January to march 2026.');
    expect(text).toContain('FIOR stopped acting as factor on 31 January 2026.');
    expect(text).toContain('No money has been returned to me.');
    expect(text.trim().endsWith('I believe £1,438.00 remains outstanding.')).toBe(true);
    expect(text).not.toMatch(/fraud|theft|crim/i);
  });

  it('only mentions the repayment request when the owner confirms it was sent', () => {
    const base = prepWith({ payments, why: 'the works were never carried out' });
    expect(buildWhy(base)).not.toContain('asked the respondent');
    expect(buildSteps(base)).toBe('');

    const sent = prepWith({
      payments,
      resolution: { ...base.resolution, usedGuide: true, sentDate: '2026-06-01', responded: 'no', paymentMade: 'no' },
    });
    expect(buildWhy(sent)).toContain('I asked the respondent to repay this sum on 1 June 2026');
    expect(buildSteps(sent)).toBe(
      'On 1 June 2026 I contacted the respondent by email requesting repayment of £1,438.00. I explained the basis of my request and asked that the matter be resolved directly. No response has been received. No payment has been received.\n\nThe matter remains unresolved.',
    );
  });

  it('uses edited drafts in exports', () => {
    const prep = prepWith({ drafts: { background: 'My own words.' } });
    expect(buildSummaryText(prep, new Date(2026, 8, 28, 10, 0))).toContain('BACKGROUND TO CLAIM\nMy own words.');
  });

  it('labels exports as personal preparation documents', () => {
    const text = buildScheduleText(prepWith({ payments }), new Date(2026, 8, 28, 10, 0));
    expect(text).toContain('not an official court document');
    expect(text).toContain('15/01/2026 | £1,100.00 | Proposed roof works');
    expect(text).toContain('Prepared on 28 September 2026 at 10:00');
  });

  it('flags accusatory wording and tidies sentences', () => {
    expect(findSensitiveTerms('I think this was fraud and they stole it')).toEqual(['fraud', 'stolen']);
    expect(findSensitiveTerms('The thief kept it')).toEqual(['theft']);
    expect(findSensitiveTerms('Direct Debit continued')).toEqual([]);
    expect(asSentence('  hello\r\n\r\n\r\nworld  ')).toBe('Hello\n\nworld.');
  });
});

describe('local storage', () => {
  function memoryStorage() {
    const map = new Map<string, string>();
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
      map,
    };
  }

  it('round-trips, then clears', () => {
    const storage = memoryStorage();
    const prep = prepWith({ payments, why: 'reason' });
    expect(savePrep(storage, prep)).toBe(true);
    expect(loadPrep(storage)?.why).toBe('reason');
    clearPrep(storage);
    expect(storage.map.has(STORAGE_KEY)).toBe(false);
    expect(loadPrep(storage)).toBeNull();
  });

  it('discards malformed or unexpected stored data', () => {
    const storage = memoryStorage();
    storage.setItem(STORAGE_KEY, '{not json');
    expect(loadPrep(storage)).toBeNull();

    const restored = restorePrep({
      selfCheck: { underLimit: '<script>' },
      claimant: { fullName: 42, email: 'a'.repeat(1000) },
      payments: [{ id: 'p', date: 'bad', amount: '12abc', description: 'ok' }],
      drafts: { background: 'kept', evil: 'dropped' },
      readiness: { amount: true, bogus: true },
      extra: 'ignored',
    });
    expect(restored.selfCheck.underLimit).toBe('');
    expect(restored.claimant.fullName).toBe('');
    expect(restored.claimant.email).toHaveLength(254);
    expect(restored.payments[0]).toMatchObject({ date: '', amount: '12', description: 'ok' });
    expect(restored.drafts).toEqual({ background: 'kept' });
    expect(restored.readiness).toEqual({ amount: true });
    expect('extra' in restored).toBe(false);
  });

  it('survives storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadPrep(throwing)).toBeNull();
    expect(savePrep(throwing, createEmptyPrep())).toBe(false);
    expect(() => clearPrep(throwing)).not.toThrow();
  });
});
