// Official sources and verified facts used by Part 2B (Simple Procedure
// preparation). Keep every procedural figure, form and link here so it can be
// re-checked against the Scottish Courts and Tribunals Service (SCTS) in one
// place. Update SOURCES_CHECKED_ON whenever the figures below are re-verified.

export const SOURCES_CHECKED_ON = "28 September 2026";

/** Simple Procedure applies to claims with a value of £5,000 or less (SCTS). */
export const SIMPLE_PROCEDURE_LIMIT_PENCE = 5000_00;

/** Sheriff Court Fees Order 2026 (SSI 2026/74), in force from 1 April 2026. */
export const COURT_FEES = {
  effectiveFrom: "1 April 2026",
  smallMoneyClaimThreshold: "£300",
  smallMoneyClaimFee: "£23",
  otherClaimFee: "£127",
} as const;

/**
 * Civil Online free-text fields. SCTS has not published a character limit for
 * the claim narrative fields that could be verified, so drafts are designed to
 * stay within 5,000 characters and owners are asked to check the live form.
 */
export const NARRATIVE_CHARACTER_TARGET = 5000;

export type OfficialLink = { label: string; href: string };

const SCTS = "https://www.scotcourts.gov.uk";

export const LINKS = {
  simpleProcedure: { label: "Simple Procedure overview", href: `${SCTS}/taking-action/simple-procedure/` },
  guide: { label: "Guide to Simple Procedure", href: `${SCTS}/taking-action/simple-procedure/guide-to-simple-procedure/` },
  howToClaim: {
    label: "How to make a claim",
    href: `${SCTS}/taking-action/simple-procedure/how-to-make-a-claim-with-simple-procedure/`,
  },
  civilOnlineInfo: { label: "About Civil Online", href: `${SCTS}/taking-action/simple-procedure/civil-online/` },
  civilOnline: { label: "Civil Online", href: "https://civilonline.scotcourts.gov.uk/" },
  civilOnlineGuide: {
    label: "Civil Online Public User Guide",
    href: `${SCTS}/media/xbrdutlg/civil-online-public-user-guide.pdf`,
  },
  form3A: { label: "Form 3A – Claim Form", href: `${SCTS}/media/otzlxbuo/form-3a-2023.pdf` },
  forms: {
    label: "All Simple Procedure forms",
    href: `${SCTS}/rules-and-practice/forms/sheriff-court-forms/simple-procedure-forms-and-standard-orders-for-claims-initiated-on-or-after-31-may-2023/`,
  },
  fees: { label: "Current Sheriff Court fees", href: `${SCTS}/taking-action/court-fees/sheriff-court-fees/` },
  feeExemption: { label: "Fee exemption information", href: `${SCTS}/taking-action/court-fees/guide-to-court-fees/` },
  noResponse: {
    label: "If no response is received",
    href: `${SCTS}/taking-action/simple-procedure/what-happens-in-a-case-where-no-response-is-received-by-the-court-or-the-respondent-seeks-time-to-pay/`,
  },
  form7A: { label: "Form 7A – Application for a Decision", href: `${SCTS}/media/qqkpkli3/form-7a-2023.pdf` },
  disputed: {
    label: "Disputed cases and expenses",
    href: `${SCTS}/taking-action/simple-procedure/what-happens-in-a-disputed-case-including-expenses/`,
  },
  expensesGuidance: {
    label: "SCTS expenses guidance (May 2025)",
    href: `${SCTS}/about-us/news/news/2025/may/updated-guidance-for-claiming-expenses-in-undefended-simple-procedure-actions/`,
  },
  expensesProForma: {
    label: "Account of expenses pro forma (Word document)",
    href: `${SCTS}/media/lmylj2tw/simple-procedure-pro-forma-expenses-form-for-party-litigants-final.docx`,
  },
  form10A: { label: "Form 10A – List of Evidence", href: `${SCTS}/media/hrspqk0t/form-10a-2023.pdf` },
  enforcement: { label: "Enforcement of a decision", href: `${SCTS}/taking-action/simple-procedure/enforcement-of-the-decision/` },
} satisfies Record<string, OfficialLink>;

/**
 * Respondent identity, from the Companies House register (company SC681823).
 * The legal name differs from "FIOR Property Assets", which is how the company
 * is commonly referred to on this site. The register is the authority – owners
 * are always pointed to the live record rather than relying on this page.
 */
export const FIOR_COMPANY = {
  legalName: "FIOR ASSET AND PROPERTY LIMITED",
  companyNumber: "SC681823",
  registeredOffice: "CBC House, 24 Canning Street, Edinburgh, EH3 8EG",
  companiesHouseUrl: "https://find-and-update.company-information.service.gov.uk/company/SC681823",
  filingHistoryUrl: "https://find-and-update.company-information.service.gov.uk/company/SC681823/filing-history",
  strikeOffObjectionUrl: "https://www.gov.uk/object-to-a-limited-company-being-struck-off",
} as const;

export type CompanyStatusCheck = {
  /** The status exactly as the live Companies House record showed it, e.g. "Active – Proposal to Strike off". */
  status: string;
  /** The date a committee member personally checked the live record, e.g. "8 October 2026". */
  checkedOn: string;
  /** True only when the live record showed a strike-off notice (first Gazette) at that check. */
  strikeOffProposed: boolean;
};

/**
 * The page never publishes a company status that has not been checked against
 * the live register. Leave this as null until someone has looked at the live
 * record; the notice then simply directs owners to Companies House. After
 * checking, set it, for example:
 *
 *   { status: "Active – Proposal to Strike off", checkedOn: "8 October 2026", strikeOffProposed: true }
 *
 * Re-check and update it (or set it back to null) whenever the page is updated.
 */
export const COMPANY_STATUS_CHECK: CompanyStatusCheck | null = null;
