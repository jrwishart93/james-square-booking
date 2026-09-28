// Pure helpers and configuration for Part 3 – Police Scotland.
//
// Everything the owner types into the Part 3 preparation tool stays in the
// component's state in their browser. Nothing is written to Firestore,
// localStorage, an API route or analytics, and James Square never sends the
// email: it is opened in the owner's own email application via mailto:.

import { formatAmount, parseAmount } from "./repaymentEmail";

/** Only Police Scotland addresses are accepted as the enquiry officer's email. */
const POLICE_EMAIL_PATTERN = /^[^\s@]+@scotland\.police\.uk$/i;

export type PoliceContact = {
  officer: string;
  salutation: string;
  organisation: string;
  /** Verified Police Scotland email for the enquiry officer, or null until confirmed. */
  email: string | null;
};

export type PoliceReference = {
  reference: string;
  /** Police Scotland incident number linked to the enquiry. */
  incident: string;
  /** False hides the reference from the page and from generated emails. */
  visible: boolean;
};

/**
 * Enquiry officer contact. The officer's email address has been confirmed by
 * the Owners Committee but is deliberately kept out of this public repository:
 * set NEXT_PUBLIC_FIOR_POLICE_CONTACT_EMAIL in the hosting environment to
 * enable the email route. The address is never printed on the page; it only
 * reaches the owner's own email app through a mailto: link. Anything other
 * than an @scotland.police.uk address is ignored.
 */
export function resolvePoliceContact(email: string | undefined): PoliceContact {
  const trimmed = email?.trim() ?? "";
  return {
    officer: "DC Holly Webster",
    salutation: "DC Webster",
    organisation: "Police Scotland",
    email: POLICE_EMAIL_PATTERN.test(trimmed) ? trimmed : null,
  };
}

/**
 * Enquiry and incident references confirmed by the Owners Committee for
 * owners to quote.
 * Set NEXT_PUBLIC_FIOR_POLICE_REFERENCE_VISIBLE=false to withdraw it from
 * the page without a code change.
 */
export function resolvePoliceReference(visible: string | undefined): PoliceReference {
  return { reference: "EN/0016676/26", incident: "PS-20260720-1008", visible: visible?.trim().toLowerCase() !== "false" };
}

export const FIOR_POLICE_CONTACT = resolvePoliceContact(process.env.NEXT_PUBLIC_FIOR_POLICE_CONTACT_EMAIL);
export const FIOR_POLICE_REFERENCE = resolvePoliceReference(process.env.NEXT_PUBLIC_FIOR_POLICE_REFERENCE_VISIBLE);

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

export function policeSubject(reference: PoliceReference): string {
  return reference.visible
    ? `James Square / FIOR – Information relating to enquiry ${reference.reference} (incident ${reference.incident})`
    : "James Square / FIOR – Information relating to an existing enquiry";
}

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
 * Builds a neutral, factual email from the owner's own answers. The website
 * adds no allegations of criminal conduct: whether the circumstances are
 * relevant is for Police Scotland to assess.
 */
export function buildPoliceBody(
  d: PoliceDetails,
  documents: readonly string[],
  contact: Pick<PoliceContact, "salutation">,
  reference: PoliceReference,
): string {
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
    `Dear ${contact.salutation},`,
    "",
    "I am an owner at James Square, Edinburgh, and understand that Police Scotland is currently making enquiries regarding concerns which have been reported in relation to payments made to FIOR Property Assets.",
    "",
    "I would like to provide information regarding my own circumstances which I believe may be relevant.",
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
      ? `I can provide supporting documents, including ${joinDocuments(documents)}, if these would assist your enquiries.`
      : "I can provide supporting documents if these would assist your enquiries.",
  ];
  if (reference.visible) {
    lines.push(
      "",
      `The Police Scotland enquiry reference I have been provided with is ${reference.reference}, and the related incident reference is ${reference.incident}.`,
    );
  }
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
