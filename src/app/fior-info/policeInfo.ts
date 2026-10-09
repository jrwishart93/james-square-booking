// Pure helpers and configuration for Part 3 – Police Scotland.
//
// Everything the owner types into the Part 3 preparation tool stays in the
// component's state in their browser. Nothing is written to Firestore,
// localStorage, an API route or analytics, and James Square never sends
// anything: the owner copies their own summary if they wish to use it.

import { formatAmount, parseAmount } from "./repaymentEmail";

// The page deliberately does not publish the name of any police officer. The
// Police Scotland incident number is published so owners can quote it when
// contacting Police Scotland; any further reference details are available from
// the Owners Committee or Myreside, who can confirm the owner before sharing.

/** Police Scotland incident number, confirmed by the Owners Committee for owners to quote. */
export const POLICE_INCIDENT_NUMBER = "PS-20260720-1008";

/** Owners Committee inbox for reference requests. */
export const COMMITTEE_EMAIL = "committee@james-square.com";

/** Myreside Management contact who can also provide further reference details. */
export const MYRESIDE_REFERENCE_EMAIL = "ania@myreside-management.co.uk";

export const REFERENCE_REQUEST_SUBJECT = "Request for further Police Scotland reference details – James Square / FIOR";

/** Short prefilled request. Left for the owner to complete and send themselves. */
export const REFERENCE_REQUEST_BODY = [
  "Dear James Square Owners Committee,",
  "",
  `I am a James Square owner. Please could you provide me with any further Police Scotland reference details, in addition to incident number ${POLICE_INCIDENT_NUMBER}, relating to the concerns reported about payments made to the former factor, FIOR Property Assets.`,
  "",
  "My name:",
  "My James Square address:",
  "",
  "Kind regards,",
].join("\n");

export const POLICE_PHONE = {
  nonEmergency: "101",
  emergency: "999",
} as const;

export const POLICE_LINKS = {
  contact: { label: "Contact Police Scotland", href: "https://www.scotland.police.uk/contact-us/" },
  nonEmergency: {
    label: "101 non-emergency service",
    href: "https://www.scotland.police.uk/about-us/how-we-do-it/call-handling/non-emergencies/",
  },
} as const;

export const POLICE_LIMITS = {
  short: 150,
  contact: 254,
  long: 1500,
} as const;

export type YesNo = "" | "yes" | "no";

export type PoliceDetails = {
  fullName: string;
  address: string;
  contact: string;
  payment: string;
  amount: string;
  paymentDate: string;
  toldFor: string;
  afterwards: string;
  repaymentRequested: YesNo;
  repaymentWhen: string;
  moneyReturned: YesNo;
  returnedAmount: string;
  whyRelevant: string;
};

export type PoliceField = keyof PoliceDetails;
export type PoliceErrors = Partial<Record<PoliceField, string>>;

export const EMPTY_POLICE_DETAILS: PoliceDetails = {
  fullName: "",
  address: "",
  contact: "",
  payment: "",
  amount: "",
  paymentDate: "",
  toldFor: "",
  afterwards: "",
  repaymentRequested: "",
  repaymentWhen: "",
  moneyReturned: "",
  returnedAmount: "",
  whyRelevant: "",
};

/** Checklist label, and how the item reads inside the generated email. */
export const POLICE_EVIDENCE = [
  { label: "Bank statements showing payment", phrase: "bank statements showing payment" },
  { label: "Direct Debit records", phrase: "Direct Debit records" },
  { label: "FIOR invoices", phrase: "FIOR invoices" },
  { label: "Requests for payment", phrase: "requests for payment" },
  { label: "Emails or letters from FIOR", phrase: "emails or letters from FIOR" },
  { label: "Correspondence regarding proposed works", phrase: "correspondence regarding the proposed works" },
  { label: "Quotes or documents relating to the proposed work", phrase: "quotes or documents relating to the proposed work" },
  { label: "Repayment requests", phrase: "my repayment requests" },
  { label: "Responses received from FIOR", phrase: "responses received from FIOR" },
  { label: "Evidence of any partial refund", phrase: "evidence of any partial refund" },
  { label: "Other relevant correspondence", phrase: "other relevant correspondence" },
] as const;

export function validatePoliceDetails(d: PoliceDetails): PoliceErrors {
  const errors: PoliceErrors = {};
  if (!d.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!d.address.trim()) errors.address = "Enter your James Square address.";
  if (!d.contact.trim()) errors.contact = "Enter an email address or telephone number Police Scotland can use to contact you.";
  if (d.amount.trim() && parseAmount(d.amount) === null) {
    errors.amount = "Enter an amount in pounds and pence, for example 125 or 125.50, or leave it blank.";
  }
  if (d.moneyReturned === "yes" && d.returnedAmount.trim() && parseAmount(d.returnedAmount) === null) {
    errors.returnedAmount = "Enter an amount in pounds and pence, for example 50 or 50.00, or leave it blank.";
  }
  return errors;
}

/** Subject line an owner can use if Police Scotland asks them to send their information by email. */
export const POLICE_SUMMARY_SUBJECT = "James Square – information about payments made to FIOR Property Assets";

function text(value: string): string {
  return value.trim().replace(/\r\n?/g, "\n");
}

function money(value: string): string {
  const parsed = parseAmount(value);
  return parsed === null ? "" : `£${formatAmount(parsed)}`;
}

/** Joins ["a", "b", "c"] as "a, b and c". */
export function joinDocuments(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Builds a neutral, factual summary from the owner's own answers. The website
 * adds no allegations of criminal conduct and no statement about any police
 * enquiry: whether the circumstances are relevant is for Police Scotland.
 */
export function buildPoliceBody(d: PoliceDetails, documents: readonly string[]): string {
  const repayment =
    d.repaymentRequested === "yes"
      ? `Yes${d.repaymentWhen.trim() ? ` – ${d.repaymentWhen.trim()}` : ""}`
      : d.repaymentRequested === "no"
        ? "No"
        : "";
  const returned =
    d.moneyReturned === "yes"
      ? money(d.returnedAmount) || "Some money has been returned"
      : d.moneyReturned === "no"
        ? "None"
        : "";

  // Questions the owner left blank are omitted rather than shown as empty.
  const inline = (label: string, value: string) => (value ? ["", `${label}: ${value}`] : []);
  const block = (label: string, value: string) => (value ? ["", `${label}:`, value] : []);

  const lines = [
    "Dear Officer,",
    "",
    "I am an owner at James Square, Edinburgh. I understand that concerns about payments made to the former factor, FIOR Property Assets, have been reported to Police Scotland.",
    "",
    "I would like to provide information about my own circumstances in case it is of assistance.",
    ...inline("Name", text(d.fullName)),
    ...inline("James Square property", text(d.address)),
    ...inline("Payment", text(d.payment)),
    ...inline("Amount paid", money(d.amount)),
    ...inline("Date/payment period", text(d.paymentDate)),
    ...block("Purpose of payment", text(d.toldFor)),
    ...block("What happened afterwards", text(d.afterwards)),
    ...block("Repayment requested", repayment),
    ...block("Amount returned, if any", returned),
    ...block("Additional information", text(d.whyRelevant)),
    "",
    documents.length
      ? `I can provide supporting documents, including ${joinDocuments(documents)}, if these would be of assistance.`
      : "I can provide supporting documents if these would be of assistance.",
    "",
    `The Police Scotland incident number I have been given for this matter is ${POLICE_INCIDENT_NUMBER}.`,
  ];
  lines.push(
    "",
    "Please let me know if you require any further information from me.",
    "",
    "Kind regards,",
    "",
    d.fullName.trim(),
    "",
    d.contact.trim(),
  );
  return lines.join("\n");
}
