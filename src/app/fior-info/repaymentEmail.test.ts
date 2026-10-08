import { describe, expect, it } from 'vitest';
import {
  FIOR_DIRECTOR_CC_EMAIL,
  FIOR_REPAYMENT_EMAIL,
  REPAYMENT_SUBJECT,
  buildMailtoUri,
  buildRepaymentBody,
  formatPreparedAt,
  parseAmount,
  sanitiseAmountInput,
  validateDetails,
} from './repaymentEmail';

const details = {
  fullName: "Siobhán O'Neill-Brown",
  address: '12/3 Caledonian Crescent, Edinburgh',
  amount: '1,250.5',
  reason: "Direct Debits & a roof payment (£300) continued after Feb 2026.\nIt's 50% of #3?a=b",
  email: 'siobhan+js@example.co.uk',
};

describe('repayment email', () => {
  it('parses sensible monetary amounts only', () => {
    expect(parseAmount('125')).toBe(125);
    expect(parseAmount('£1,250.50')).toBe(1250.5);
    expect(parseAmount('12.345')).toBeNull();
    expect(parseAmount('0')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('1e5')).toBeNull();
    expect(sanitiseAmountInput('£12a.3.456')).toBe('12.34');
  });

  it('validates required fields', () => {
    const errors = validateDetails({ fullName: '', address: '', amount: '1.234', reason: '', email: 'nope' });
    expect(Object.keys(errors).sort()).toEqual(['address', 'amount', 'email', 'fullName', 'reason']);
    expect(validateDetails(details)).toEqual({});
  });

  it('formats the prepared timestamp in UK style', () => {
    expect(formatPreparedAt(new Date(2026, 8, 28, 21, 52))).toBe('28 September 2026 at 21:52');
  });

  it('builds a neutral body addressed to the company', () => {
    const body = buildRepaymentBody(details, new Date(2026, 8, 28, 21, 52));
    expect(body.startsWith('Dear Sir or Madam,')).toBe(true);
    expect(body).toContain('I am the owner of 12/3 Caledonian Crescent, Edinburgh, James Square.');
    expect(body).toContain('Amount I believe is due to me: £1,250.50');
    expect(body).toContain('confirm the payments you have received from me');
    expect(body).toContain('confirm the balance you consider to be outstanding');
    expect(body).toContain('let me know how and when repayment will be made');
    expect(body).toContain('this request was prepared on 28 September 2026 at 21:52.');
    expect(body).not.toMatch(/sent on|Pedrom|fraud|criminal|police|no choice/i);
    expect(body.endsWith("Siobhán O'Neill-Brown\n\n12/3 Caledonian Crescent, Edinburgh\n\nsiobhan+js@example.co.uk")).toBe(true);
  });

  it('sends to the company inbox and adds the director only as an optional CC', () => {
    expect(FIOR_REPAYMENT_EMAIL).toBe('info@fiorassetandproperty.com');
    const withCc = buildMailtoUri(FIOR_REPAYMENT_EMAIL, REPAYMENT_SUBJECT, 'Hi', [FIOR_DIRECTOR_CC_EMAIL]);
    expect(withCc.startsWith(`mailto:${FIOR_REPAYMENT_EMAIL}?cc=${FIOR_DIRECTOR_CC_EMAIL}&subject=`)).toBe(true);
    expect(new URL(withCc).searchParams.get('cc')).toBe(FIOR_DIRECTOR_CC_EMAIL);
    expect(buildMailtoUri(FIOR_REPAYMENT_EMAIL, REPAYMENT_SUBJECT, 'Hi')).not.toContain('cc=');
  });

  it('encodes a mailto URI that round-trips special characters and line breaks', () => {
    const body = buildRepaymentBody(details, new Date(2026, 8, 28, 21, 52));
    const uri = buildMailtoUri(FIOR_REPAYMENT_EMAIL, REPAYMENT_SUBJECT, body);
    expect(uri.startsWith(`mailto:${FIOR_REPAYMENT_EMAIL}?subject=`)).toBe(true);
    // Only one raw "&" (the subject/body separator) and one raw "?".
    expect(uri.split('&').length).toBe(2);
    expect(uri.split('?').length).toBe(2);
    expect(uri).not.toMatch(/[\s£#]/);
    expect(uri).toContain('%0D%0A');

    const url = new URL(uri);
    expect(url.searchParams.get('subject')).toBe(REPAYMENT_SUBJECT);
    const decodedBody = decodeURIComponent(uri.split('&body=')[1]);
    expect(decodedBody).toBe(body.replace(/\n/g, '\r\n'));
  });
});
