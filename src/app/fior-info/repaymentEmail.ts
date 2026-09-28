// Pure helpers for the Part 2 repayment request. Everything here runs in the
// owner's browser only: nothing is sent to James Square, stored or logged.

/**
 * Recipient for owner repayment requests.
 *
 * Source: Pedrom Aghabala's own reply to the committee on 21 May 2026 was sent
 * from this address (see FIOR_EMAIL_CORRESPONDENCE in
 * src/app/owners/secure/page.tsx). FIOR's general inbox,
 * info@fiorassetandproperty.com, appears in the same signature and on /factor.
 */
export const FIOR_REPAYMENT_EMAIL = "pedrom@fiorassetandproperty.com";

export const REPAYMENT_SUBJECT = "Request for repayment – James Square";

export const LIMITS = {
  name: 100,
  address: 150,
  email: 254,
  reason: 1200,
  maxAmount: 100000,
} as const;

export type RepaymentDetails = {
  fullName: string;
  address: string;
  amount: string;
  reason: string;
  email: string;
};

export type RepaymentField = keyof RepaymentDetails;
export type RepaymentErrors = Partial<Record<RepaymentField, string>>;

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepts "250", "250.5", "1,250.00" or "£1,250" and returns pence-safe number, or null. */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/^£\s*/, "").replace(/,/g, "");
  if (!AMOUNT_PATTERN.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0 || value > LIMITS.maxAmount) return null;
  return value;
}

/** Removes anything other than digits, a single decimal point and up to two decimal places while typing. */
export function sanitiseAmountInput(raw: string): string {
  let out = raw.replace(/[^\d.,]/g, "");
  const firstDot = out.indexOf(".");
  if (firstDot !== -1) {
    out = out.slice(0, firstDot + 1) + out.slice(firstDot + 1).replace(/[.,]/g, "").slice(0, 2);
  }
  return out;
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function validateDetails(details: RepaymentDetails): RepaymentErrors {
  const errors: RepaymentErrors = {};
  if (!details.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!details.address.trim()) errors.address = "Enter your James Square address.";

  if (!details.amount.trim()) {
    errors.amount = "Enter the amount you are requesting.";
  } else if (parseAmount(details.amount) === null) {
    errors.amount = `Enter an amount in pounds and pence, for example 125 or 125.50, up to £${formatAmount(LIMITS.maxAmount)}.`;
  }

  if (!details.reason.trim()) {
    errors.reason = "Briefly explain why you believe this money should be returned.";
  } else if (details.reason.length > LIMITS.reason) {
    errors.reason = `Keep your explanation to ${LIMITS.reason} characters or fewer.`;
  }

  if (!details.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(details.email.trim())) {
    errors.email = "Enter an email address in the correct format, for example name@example.com.";
  }
  return errors;
}

/** UK format in the owner's local time, e.g. "28 September 2026 at 21:52". */
export function formatPreparedAt(date: Date): string {
  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${day} at ${time}`;
}

export function buildRepaymentBody(details: RepaymentDetails, preparedAt: Date): string {
  const amount = `£${formatAmount(parseAmount(details.amount) ?? 0)}`;
  const address = details.address.trim();
  const reason = details.reason.trim().replace(/\r\n?/g, "\n");
  return [
    "Dear Pedrom,",
    "",
    `I am writing to formally request repayment of ${amount}, which I believe is due to me in connection with my property at ${address}.`,
    "",
    `Amount requested: ${amount}`,
    "",
    "Reason for request:",
    "",
    reason,
    "",
    "I would be grateful if you could arrange repayment, or contact me if you believe there is any reason why this amount is not due.",
    "",
    "I would like to resolve this matter directly and without the need for any further action. Please therefore arrange repayment, or provide a substantive response regarding the outstanding amount, within a reasonable timeframe.",
    "",
    "If I do not receive repayment or a response which resolves the matter, I will have no choice but to consider taking the matter further, including the options available to me for recovering the outstanding sum.",
    "",
    "Please acknowledge receipt of this email.",
    "",
    `For record purposes, this repayment request was prepared on ${formatPreparedAt(preparedAt)}.`,
    "",
    "Kind regards,",
    "",
    details.fullName.trim(),
    "",
    address,
    "",
    details.email.trim(),
  ].join("\n");
}

/**
 * Builds an RFC 6068 mailto: URI. Subject and body are percent-encoded as
 * UTF-8 (so £, &, #, ?, = and accented characters cannot break the link) and
 * line breaks are sent as CRLF (%0D%0A), which mail clients expect.
 */
export function buildMailtoUri(to: string, subject: string, body: string): string {
  const encode = (value: string) => encodeURIComponent(value.replace(/\r\n?/g, "\n").replace(/\n/g, "\r\n"));
  return `mailto:${to}?subject=${encode(subject)}&body=${encode(body)}`;
}
