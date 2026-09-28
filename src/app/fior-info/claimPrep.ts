// Pure helpers for Part 2B – preparing a Simple Procedure claim.
//
// Everything here runs in the owner's browser. Drafts are built
// deterministically from the owner's own answers: no AI service, API route,
// Firestore write or analytics call is involved. The only persistence is an
// optional copy in this browser's localStorage, which the owner controls.

import { NARRATIVE_CHARACTER_TARGET, SIMPLE_PROCEDURE_LIMIT_PENCE } from "./claimPrepSources";

export const STORAGE_KEY = "jqs-fior-claim-prep-v1";

export type Answer = "" | "yes" | "no" | "unsure";
export type YesNo = "" | "yes" | "no";

export type PaymentRow = { id: string; date: string; amount: string; description: string };
export type EvidenceItem = { id: string; label: string; checked: boolean; custom?: boolean };

export type SelfCheck = {
  underLimit: Answer;
  personallyOwed: Answer;
  identifyRespondent: Answer;
  canExplain: Answer;
  attempted: "" | "yes" | "sent" | "no";
};

export type ClaimPrep = {
  selfCheck: SelfCheck;
  claimant: { fullName: string; address: string; postcode: string; email: string };
  respondent: { name: string; companyNumber: string; address: string; tradingName: string };
  statedOutstanding: string;
  payments: PaymentRow[];
  anyReturned: YesNo;
  returnedAmount: string;
  story: {
    whenPaid: string;
    toldFor: string;
    afterwards: string;
    problemWhen: string;
    whyReturn: string;
    partReturned: string;
    other: string;
  };
  why: string;
  resolution: {
    usedGuide: boolean;
    sentDate: string;
    amountRequested: string;
    responded: YesNo;
    responseDate: string;
    responseSummary: string;
    paymentMade: YesNo;
    paymentAmount: string;
    otherSteps: string;
  };
  evidence: EvidenceItem[];
  /** Owner edits to generated drafts. Absent means "use the generated text". */
  drafts: Partial<Record<DraftKey, string>>;
  readiness: Record<string, boolean>;
};

export type DraftKey = "background" | "why" | "steps";

export const TEXT_LIMITS = {
  short: 150,
  address: 300,
  story: 1500,
  why: 2500,
  draft: 8000,
} as const;

export const DEFAULT_EVIDENCE = [
  "Bank statements showing relevant payments",
  "Direct Debit records",
  "FIOR invoices or statements",
  "Requests for payment",
  "Emails with FIOR",
  "Letters from FIOR",
  "The repayment request sent through Part 2A",
  "Any response from FIOR",
  "Evidence of partial repayments",
  "Correspondence about proposed roof/repair works",
  "Documents explaining what a payment was intended for",
  "Other relevant correspondence",
];

export const READINESS_ITEMS = [
  { id: "amount", label: "I have checked the amount I am claiming." },
  { id: "identity", label: "I have checked the identity of the respondent." },
  { id: "address", label: "I have checked the respondent’s current address." },
  { id: "explanation", label: "I have prepared a clear explanation of what happened." },
  { id: "documents", label: "I have gathered my supporting documents." },
  { id: "evidence", label: "I have kept evidence of my attempt to resolve the dispute." },
  { id: "fee", label: "I understand that a court fee may apply." },
  { id: "guidance", label: "I have read the official Simple Procedure guidance." },
] as const;

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyPayment(): PaymentRow {
  return { id: newId(), date: "", amount: "", description: "" };
}

export function createEmptyPrep(): ClaimPrep {
  return {
    selfCheck: { underLimit: "", personallyOwed: "", identifyRespondent: "", canExplain: "", attempted: "" },
    claimant: { fullName: "", address: "", postcode: "", email: "" },
    respondent: { name: "", companyNumber: "", address: "", tradingName: "" },
    statedOutstanding: "",
    payments: [emptyPayment()],
    anyReturned: "",
    returnedAmount: "",
    story: { whenPaid: "", toldFor: "", afterwards: "", problemWhen: "", whyReturn: "", partReturned: "", other: "" },
    why: "",
    resolution: {
      usedGuide: false,
      sentDate: "",
      amountRequested: "",
      responded: "",
      responseDate: "",
      responseSummary: "",
      paymentMade: "",
      paymentAmount: "",
      otherSteps: "",
    },
    evidence: DEFAULT_EVIDENCE.map((label, i) => ({ id: `default-${i}`, label, checked: false })),
    drafts: {},
    readiness: {},
  };
}

// ── Money ───────────────────────────────────────────────────────────────────

const MONEY_PATTERN = /^\d{1,7}(\.\d{1,2})?$/;

/** Parses "1,250.5" / "£1250" into integer pence. Returns null when invalid. */
export function toPence(raw: string, { allowZero = false } = {}): number | null {
  const cleaned = raw.trim().replace(/^£\s*/, "").replace(/,/g, "");
  if (!MONEY_PATTERN.test(cleaned)) return null;
  const [pounds, pence = ""] = cleaned.split(".");
  const value = Number(pounds) * 100 + Number(pence.padEnd(2, "0"));
  if (!Number.isSafeInteger(value) || value < 0 || (!allowZero && value === 0)) return null;
  return value;
}

export function formatPence(pence: number): string {
  const sign = pence < 0 ? "-" : "";
  return `${sign}£${new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Math.abs(pence) / 100,
  )}`;
}

/** Keeps digits, commas and one decimal point with at most two decimals while typing. */
export function sanitiseMoneyInput(raw: string): string {
  let out = raw.replace(/[^\d.,]/g, "");
  const firstDot = out.indexOf(".");
  if (firstDot !== -1) {
    out = out.slice(0, firstDot + 1) + out.slice(firstDot + 1).replace(/[.,]/g, "").slice(0, 2);
  }
  return out.slice(0, 12);
}

// ── Dates ───────────────────────────────────────────────────────────────────

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidIsoDate(value: string): boolean {
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1990 || y > 2100) return false;
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

/** "2026-02-01" → "1 February 2026". Returns "" for invalid dates. */
export function formatLongDate(value: string): string {
  if (!isValidIsoDate(value)) return "";
  const [y, m, d] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

/** "2026-02-01" → "01/02/2026". */
export function formatShortDate(value: string): string {
  if (!isValidIsoDate(value)) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

// ── Validation ──────────────────────────────────────────────────────────────

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export type FieldErrors = Record<string, string>;

export function validateClaimant(c: ClaimPrep["claimant"]): FieldErrors {
  const errors: FieldErrors = {};
  if (!c.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!c.address.trim()) errors.address = "Enter your postal address.";
  if (!c.postcode.trim()) errors.postcode = "Enter your postcode.";
  else if (!UK_POSTCODE.test(c.postcode.trim())) errors.postcode = "Enter a UK postcode, for example EH11 2AB.";
  if (!c.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(c.email.trim())) errors.email = "Enter an email address like name@example.com.";
  return errors;
}

export function isBlankPayment(row: PaymentRow): boolean {
  return !row.date && !row.amount.trim() && !row.description.trim();
}

export function validatePayments(rows: PaymentRow[]): FieldErrors {
  const errors: FieldErrors = {};
  rows.forEach((row, i) => {
    if (isBlankPayment(row)) return;
    const n = i + 1;
    if (!isValidIsoDate(row.date)) errors[`${row.id}-date`] = `Payment ${n}: enter a valid date.`;
    if (toPence(row.amount) === null) errors[`${row.id}-amount`] = `Payment ${n}: enter an amount such as 169 or 169.00.`;
    if (!row.description.trim()) errors[`${row.id}-description`] = `Payment ${n}: say what the payment was for.`;
  });
  return errors;
}

export function validateAmounts(prep: ClaimPrep): FieldErrors {
  const errors: FieldErrors = {};
  if (prep.statedOutstanding.trim() && toPence(prep.statedOutstanding) === null) {
    errors.statedOutstanding = "Enter an amount in pounds and pence, for example 338 or 338.00.";
  }
  if (prep.anyReturned === "yes" && toPence(prep.returnedAmount, { allowZero: true }) === null) {
    errors.returnedAmount = "Enter the amount returned, for example 50 or 50.00.";
  }
  return { ...errors, ...validatePayments(prep.payments) };
}

// ── Totals ──────────────────────────────────────────────────────────────────

export type Totals = {
  validPayments: (PaymentRow & { pence: number })[];
  totalPaid: number;
  returned: number;
  calculatedOutstanding: number;
  stated: number | null;
  /** The owner's own figure where given, otherwise the calculation. */
  claimed: number;
  overLimit: boolean;
};

export function computeTotals(prep: ClaimPrep): Totals {
  const validPayments = prep.payments
    .map((row) => ({ ...row, pence: toPence(row.amount) }))
    .filter((row): row is PaymentRow & { pence: number } => row.pence !== null && isValidIsoDate(row.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const totalPaid = validPayments.reduce((sum, row) => sum + row.pence, 0);
  const returned = prep.anyReturned === "yes" ? (toPence(prep.returnedAmount, { allowZero: true }) ?? 0) : 0;
  const calculatedOutstanding = Math.max(totalPaid - returned, 0);
  const stated = toPence(prep.statedOutstanding);
  const claimed = stated ?? calculatedOutstanding;
  return {
    validPayments,
    totalPaid,
    returned,
    calculatedOutstanding,
    stated,
    claimed,
    overLimit: claimed > SIMPLE_PROCEDURE_LIMIT_PENCE,
  };
}

// ── Text helpers ────────────────────────────────────────────────────────────

/** Trims, normalises line breaks and whitespace, and removes control characters. */
export function tidy(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Tidies text, capitalises the first letter and ensures closing punctuation. */
export function asSentence(text: string): string {
  const t = tidy(text);
  if (!t) return "";
  const capitalised = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?)"”’]$/.test(capitalised) ? capitalised : `${capitalised}.`;
}

const SENSITIVE_TERMS: [RegExp, string][] = [
  [/\bfraud\w*/i, "fraud"],
  [/\b(?:theft|thie(?:f|ves|ving))\b/i, "theft"],
  [/\bst(?:ole|olen|eal\w*)\b/i, "stolen"],
  [/\bembezzl\w*/i, "embezzlement"],
  [/\bscam\w*/i, "scam"],
  [/\bcriminal\w*/i, "criminal"],
  [/\bcrook\w*/i, "crook"],
  [/\bcon ?(?:man|men|artist)\b/i, "con man"],
  [/\bswindl\w*/i, "swindle"],
  [/\bliar\w*/i, "liar"],
];

/** Words that make a civil narrative read as an allegation of crime. */
export function findSensitiveTerms(text: string): string[] {
  return SENSITIVE_TERMS.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
}

// ── Draft builders ──────────────────────────────────────────────────────────

function paymentLine(row: PaymentRow & { pence: number }): string {
  const description = tidy(row.description).replace(/\n+/g, " ");
  return `- ${formatLongDate(row.date)}: ${formatPence(row.pence)}${description ? ` (${description})` : ""}`;
}

function labelled(label: string, text: string): string {
  const s = asSentence(text);
  return s ? `${label}: ${s}` : "";
}

export function buildBackground(prep: ClaimPrep, totals = computeTotals(prep)): string {
  const { story } = prep;
  const parts: string[] = [];

  if (totals.validPayments.length > 0) {
    parts.push(
      [
        "The payments relevant to this claim are:",
        ...totals.validPayments.map(paymentLine),
        `Total paid: ${formatPence(totals.totalPaid)}.`,
      ].join("\n"),
    );
  }

  parts.push(labelled("When the payments were made", story.whenPaid));
  parts.push(labelled("What I was told the payments were for", story.toldFor));
  parts.push(asSentence(story.afterwards));
  parts.push(labelled("When I first believed there was a problem", story.problemWhen));
  parts.push(asSentence(story.whyReturn));

  if (story.partReturned.trim()) {
    parts.push(labelled("Money returned", story.partReturned));
  } else if (prep.anyReturned === "yes" && totals.returned > 0) {
    parts.push(`${formatPence(totals.returned)} has been returned to me.`);
  } else if (prep.anyReturned === "no") {
    parts.push("No money has been returned to me.");
  }

  parts.push(asSentence(story.other));

  if (totals.claimed > 0) parts.push(`I believe ${formatPence(totals.claimed)} remains outstanding.`);

  return parts.filter(Boolean).join("\n\n");
}

export function buildWhy(prep: ClaimPrep, totals = computeTotals(prep)): string {
  const parts: string[] = [];
  parts.push(asSentence(prep.why));

  if (totals.totalPaid > 0) {
    const returned = totals.returned > 0 ? `, of which ${formatPence(totals.returned)} has been returned` : "";
    parts.push(`According to my records, I paid ${formatPence(totals.totalPaid)} in total${returned}.`);
  }
  if (totals.claimed > 0) parts.push(`I believe ${formatPence(totals.claimed)} remains due to me.`);

  const sent = formatLongDate(prep.resolution.sentDate);
  if (prep.resolution.usedGuide && sent) {
    parts.push(`I asked the respondent to repay this sum on ${sent} and the matter has not been resolved.`);
  }
  return parts.filter(Boolean).join("\n\n");
}

export function buildSteps(prep: ClaimPrep, totals = computeTotals(prep)): string {
  const r = prep.resolution;
  const parts: string[] = [];
  const sent = formatLongDate(r.sentDate);

  if (r.usedGuide && sent) {
    const requested = toPence(r.amountRequested) ?? (totals.claimed > 0 ? totals.claimed : null);
    const amount = requested !== null ? ` of ${formatPence(requested)}` : "";
    const first = `On ${sent} I contacted the respondent by email requesting repayment${amount}. I explained the basis of my request and asked that the matter be resolved directly.`;

    let response = "";
    if (r.responded === "yes") {
      const on = formatLongDate(r.responseDate);
      response = `A response was received${on ? ` on ${on}` : ""}.`;
      const summary = asSentence(r.responseSummary);
      if (summary) response += ` In summary, the response stated: ${summary}`;
    } else if (r.responded === "no") {
      response = "No response has been received.";
    }

    let payment = "";
    if (r.paymentMade === "yes") {
      const paid = toPence(r.paymentAmount);
      payment = paid !== null ? `A payment of ${formatPence(paid)} was received.` : "A payment was received.";
    } else if (r.paymentMade === "no") {
      payment = "No payment has been received.";
    }

    parts.push([first, response, payment].filter(Boolean).join(" "));
  }

  parts.push(asSentence(r.otherSteps));

  const body = parts.filter(Boolean);
  if (body.length === 0) return "";
  body.push("The matter remains unresolved.");
  return body.join("\n\n");
}

export function draftFor(prep: ClaimPrep, key: DraftKey, totals = computeTotals(prep)): string {
  const edited = prep.drafts[key];
  if (edited !== undefined) return edited;
  if (key === "background") return buildBackground(prep, totals);
  if (key === "why") return buildWhy(prep, totals);
  return buildSteps(prep, totals);
}

export function draftOverTarget(text: string): boolean {
  return text.length > NARRATIVE_CHARACTER_TARGET;
}

// ── Plain-text exports ──────────────────────────────────────────────────────

export function formatPreparedOn(date: Date): string {
  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${day} at ${time}`;
}

export function respondentLine(prep: ClaimPrep): string {
  const r = prep.respondent;
  return [
    tidy(r.name),
    r.tradingName.trim() && `trading as ${tidy(r.tradingName)}`,
    r.companyNumber.trim() && `company number ${tidy(r.companyNumber)}`,
    tidy(r.address).replace(/\n+/g, ", "),
  ]
    .filter(Boolean)
    .join(", ");
}

function claimantAddress(prep: ClaimPrep): string {
  return [tidy(prep.claimant.address).replace(/\n+/g, ", "), tidy(prep.claimant.postcode).toUpperCase()]
    .filter(Boolean)
    .join(", ");
}

const NOT_OFFICIAL = "Personal claim preparation document – this is not an official court document.";

export function buildScheduleText(prep: ClaimPrep, preparedAt: Date, totals = computeTotals(prep)): string {
  const lines = [
    "SCHEDULE OF PAYMENTS",
    NOT_OFFICIAL,
    "",
    `Owner: ${tidy(prep.claimant.fullName) || "—"}`,
    `Property: ${claimantAddress(prep) || "—"}`,
    `Respondent: ${respondentLine(prep) || "—"}`,
    `Amount claimed: ${formatPence(totals.claimed)}`,
    "",
    "Date | Amount | Reason",
    ...(totals.validPayments.length
      ? totals.validPayments.map(
          (row) => `${formatShortDate(row.date)} | ${formatPence(row.pence)} | ${tidy(row.description).replace(/\n+/g, " ")}`,
        )
      : ["No payments listed."]),
    "",
    `Total paid: ${formatPence(totals.totalPaid)}`,
    `Amount already returned: ${formatPence(totals.returned)}`,
    `Amount owner believes remains outstanding: ${formatPence(totals.claimed)}`,
    "",
    `Prepared on ${formatPreparedOn(preparedAt)}`,
  ];
  return lines.join("\n");
}

export function buildSummaryText(prep: ClaimPrep, preparedAt: Date, totals = computeTotals(prep)): string {
  const section = (title: string, body: string) => [title.toUpperCase(), body.trim() || "Not yet completed.", ""];
  const checked = prep.evidence.filter((e) => e.checked).map((e) => `- ${tidy(e.label)}`);
  const missing = prep.evidence.filter((e) => !e.checked).map((e) => `- ${tidy(e.label)}`);
  return [
    "CLAIM PREPARATION SUMMARY",
    NOT_OFFICIAL,
    `Prepared on ${formatPreparedOn(preparedAt)}`,
    "",
    ...section(
      "Claimant",
      [tidy(prep.claimant.fullName), claimantAddress(prep), tidy(prep.claimant.email)].filter(Boolean).join("\n"),
    ),
    ...section("Respondent", respondentLine(prep)),
    ...section("Amount claimed", formatPence(totals.claimed)),
    ...section(
      "Payment breakdown",
      totals.validPayments.length
        ? [
            ...totals.validPayments.map(paymentLine),
            `Total paid: ${formatPence(totals.totalPaid)}`,
            `Amount already returned: ${formatPence(totals.returned)}`,
          ].join("\n")
        : "",
    ),
    ...section("Background to claim", draftFor(prep, "background", totals)),
    ...section("Why I believe the claim should succeed", draftFor(prep, "why", totals)),
    ...section("Attempts to resolve the dispute", draftFor(prep, "steps", totals)),
    ...section("Evidence prepared", checked.join("\n") || "None marked yet."),
    ...section("Documents still required", missing.join("\n") || "None."),
  ].join("\n");
}

// ── Local storage (this device only) ────────────────────────────────────────

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

const ANSWERS = ["", "yes", "no", "unsure"] as const;
const YES_NO = ["", "yes", "no"] as const;

/**
 * Rebuilds a ClaimPrep from untrusted stored JSON, keeping only known fields
 * of the right type and length. Anything unexpected is discarded.
 */
export function restorePrep(raw: unknown): ClaimPrep {
  const base = createEmptyPrep();
  const src = record(raw);
  const sc = record(src.selfCheck);
  const cl = record(src.claimant);
  const rs = record(src.respondent);
  const st = record(src.story);
  const re = record(src.resolution);
  const dr = record(src.drafts);
  const rd = record(src.readiness);
  const S = TEXT_LIMITS;

  const payments = Array.isArray(src.payments)
    ? src.payments.slice(0, 100).map((p) => {
        const row = record(p);
        return {
          id: str(row.id, 20) || newId(),
          date: isValidIsoDate(str(row.date, 10)) ? str(row.date, 10) : "",
          amount: sanitiseMoneyInput(str(row.amount, 12)),
          description: str(row.description, S.short),
        };
      })
    : base.payments;

  const evidence = Array.isArray(src.evidence)
    ? src.evidence.slice(0, 60).map((e) => {
        const item = record(e);
        return {
          id: str(item.id, 20) || newId(),
          label: str(item.label, S.short),
          checked: item.checked === true,
          custom: item.custom === true,
        };
      }).filter((e) => e.label.trim())
    : base.evidence;

  const drafts: ClaimPrep["drafts"] = {};
  for (const key of ["background", "why", "steps"] as const) {
    if (typeof dr[key] === "string") drafts[key] = str(dr[key], S.draft);
  }

  const readiness: Record<string, boolean> = {};
  for (const item of READINESS_ITEMS) if (rd[item.id] === true) readiness[item.id] = true;

  return {
    selfCheck: {
      underLimit: pick(sc.underLimit, ANSWERS, ""),
      personallyOwed: pick(sc.personallyOwed, ANSWERS, ""),
      identifyRespondent: pick(sc.identifyRespondent, ANSWERS, ""),
      canExplain: pick(sc.canExplain, ANSWERS, ""),
      attempted: pick(sc.attempted, ["", "yes", "sent", "no"] as const, ""),
    },
    claimant: {
      fullName: str(cl.fullName, S.short),
      address: str(cl.address, S.address),
      postcode: str(cl.postcode, 10),
      email: str(cl.email, 254),
    },
    respondent: {
      name: str(rs.name, S.short),
      companyNumber: str(rs.companyNumber, 20),
      address: str(rs.address, S.address),
      tradingName: str(rs.tradingName, S.short),
    },
    statedOutstanding: sanitiseMoneyInput(str(src.statedOutstanding, 12)),
    payments: payments.length ? payments : base.payments,
    anyReturned: pick(src.anyReturned, YES_NO, ""),
    returnedAmount: sanitiseMoneyInput(str(src.returnedAmount, 12)),
    story: {
      whenPaid: str(st.whenPaid, S.story),
      toldFor: str(st.toldFor, S.story),
      afterwards: str(st.afterwards, S.story),
      problemWhen: str(st.problemWhen, S.story),
      whyReturn: str(st.whyReturn, S.story),
      partReturned: str(st.partReturned, S.story),
      other: str(st.other, S.story),
    },
    why: str(src.why, S.why),
    resolution: {
      usedGuide: re.usedGuide === true,
      sentDate: isValidIsoDate(str(re.sentDate, 10)) ? str(re.sentDate, 10) : "",
      amountRequested: sanitiseMoneyInput(str(re.amountRequested, 12)),
      responded: pick(re.responded, YES_NO, ""),
      responseDate: isValidIsoDate(str(re.responseDate, 10)) ? str(re.responseDate, 10) : "",
      responseSummary: str(re.responseSummary, S.story),
      paymentMade: pick(re.paymentMade, YES_NO, ""),
      paymentAmount: sanitiseMoneyInput(str(re.paymentAmount, 12)),
      otherSteps: str(re.otherSteps, S.story),
    },
    evidence: evidence.length ? evidence : base.evidence,
    drafts,
    readiness,
  };
}

export function loadPrep(storage: Pick<Storage, "getItem"> | undefined): ClaimPrep | null {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? restorePrep(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function savePrep(storage: Pick<Storage, "setItem"> | undefined, prep: ClaimPrep): boolean {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(prep));
    return Boolean(storage);
  } catch {
    return false;
  }
}

export function clearPrep(storage: Pick<Storage, "removeItem"> | undefined): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode / blocked): nothing was saved.
  }
}
