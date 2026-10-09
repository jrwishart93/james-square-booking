"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  FileSearch,
  FileText,
  HandCoins,
  Hammer,
  HelpCircle,
  Lock,
  Mail,
  PencilLine,
  Phone,
  Scale,
  ShieldCheck,
  Trash2,
  Undo2,
} from "lucide-react";
import Reveal from "./Reveal";
import {
  Accordion,
  AddressSuggestion,
  Checkbox,
  ChoiceGroup,
  CopyButton,
  ExternalLink,
  Field,
  Notice,
  copyClass,
  describedBy,
  glassPanel,
  h2Class,
  inputBorder,
  inputClass,
  primaryButton,
  scrollMargin,
  secondaryButton,
} from "./ui";
import { buildMailtoUri, sanitiseAmountInput } from "./repaymentEmail";
import {
  COMMITTEE_EMAIL,
  EMPTY_POLICE_DETAILS,
  MYRESIDE_REFERENCE_EMAIL,
  POLICE_EVIDENCE,
  POLICE_INCIDENT_NUMBER,
  POLICE_LIMITS,
  POLICE_LINKS,
  POLICE_PHONE,
  POLICE_SUMMARY_SUBJECT,
  REFERENCE_REQUEST_BODY,
  REFERENCE_REQUEST_SUBJECT,
  buildPoliceBody,
  validatePoliceDetails,
  type PoliceDetails,
  type PoliceErrors,
  type PoliceField,
  type YesNo,
} from "./policeInfo";

// Privacy: everything entered here lives in this component's state only. It is
// not written to localStorage, Firestore, an API route or analytics, is never
// placed in the page URL and is lost when the page is closed. James Square does
// not send anything: the owner copies their summary if they choose to use it.
//
// No police officer's name and no Police Scotland reference number is shown on
// this page. Owners who need the references ask the committee or Myreside.

const relevanceExamples = [
  {
    title: "Roof or repair payments",
    body: "You paid FIOR money towards proposed roof, repair or other works and have questions about what happened to that payment.",
    icon: Hammer,
  },
  {
    title: "Money has not been returned",
    body: "You requested the return of money paid for proposed works and have experienced difficulty obtaining repayment.",
    icon: Undo2,
  },
  {
    title: "Information or documents",
    body: "You hold correspondence, payment requests, invoices or other records relating to payments you made to FIOR.",
    icon: FileSearch,
  },
  {
    title: "Something else you believe is relevant",
    body: "Your circumstances do not fit the examples above but you believe you hold information which may be of assistance.",
    icon: HelpCircle,
  },
];

const fieldOrder: PoliceField[] = [
  "fullName",
  "address",
  "contact",
  "payment",
  "amount",
  "paymentDate",
  "toldFor",
  "afterwards",
  "repaymentWhen",
  "returnedAmount",
  "whyRelevant",
];

const YES_NO_OPTIONS: { value: Exclude<YesNo, "">; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

type Stage = "form" | "preview";

function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label} hint={hint} optional>
      <textarea
        id={id}
        rows={4}
        maxLength={POLICE_LIMITS.long}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={[describedBy(id, { hint: Boolean(hint) }), `${id}-count`].filter(Boolean).join(" ")}
        className={`${inputClass} ${inputBorder()} min-h-28 resize-y leading-7`}
      />
      <p id={`${id}-count`} className="mt-1.5 text-right text-xs text-slate-500 dark:text-slate-400">
        {value.length} of {POLICE_LIMITS.long} characters
      </p>
    </Field>
  );
}

export default function PoliceScotland() {
  const uid = useId();
  const ids = Object.fromEntries(fieldOrder.map((f) => [f, `${uid}-${f}`])) as Record<PoliceField, string>;
  const referenceMailto = buildMailtoUri(COMMITTEE_EMAIL, REFERENCE_REQUEST_SUBJECT, REFERENCE_REQUEST_BODY, [
    MYRESIDE_REFERENCE_EMAIL,
  ]);
  const [showPhone, setShowPhone] = useState(false);

  const [details, setDetails] = useState<PoliceDetails>(EMPTY_POLICE_DETAILS);
  const [documents, setDocuments] = useState<string[]>([]);
  const [errors, setErrors] = useState<PoliceErrors>({});
  const [stage, setStage] = useState<Stage>("form");
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<React.RefObject<HTMLElement | null> | null>(null);

  useEffect(() => {
    pendingFocus.current?.current?.focus();
    pendingFocus.current = null;
  }, [stage, errors]);

  const set = (field: PoliceField) => (value: string) => {
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const toggleDocument = (phrase: string, checked: boolean) =>
    setDocuments((docs) =>
      checked
        ? POLICE_EVIDENCE.map((e) => e.phrase).filter((p) => p === phrase || docs.includes(p))
        : docs.filter((p) => p !== phrase),
    );

  const onPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validatePoliceDetails(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      pendingFocus.current = errorSummaryRef;
      return;
    }
    setDraft(buildPoliceBody(details, documents));
    pendingFocus.current = previewHeadingRef;
    setStage("preview");
  };

  const onEdit = () => {
    pendingFocus.current = formHeadingRef;
    setStage("form");
  };

  const clearAll = () => {
    setDetails(EMPTY_POLICE_DETAILS);
    setDocuments([]);
    setErrors({});
    setDraft("");
    pendingFocus.current = formHeadingRef;
    setStage("form");
    setAnnouncement("Your information has been cleared from this page.");
  };

  const errorList = fieldOrder.filter((f) => errors[f]);

  return (
    <section id="part-3" aria-labelledby="part3-heading" className={scrollMargin}>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* ── Part 3 intro ─────────────────────────────────── */}
      <Reveal className="border-t border-slate-200/80 pt-14 dark:border-white/10 sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 backdrop-blur dark:border-sky-400/20 dark:bg-white/5 dark:text-sky-300">
          Part 3
        </p>
        <h2
          id="part3-heading"
          className="mt-5 max-w-3xl text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl"
        >
          Police Scotland &amp; further information
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl sm:leading-9">
          <p>
            Concerns relating to payments made to the former factor have been reported to Police Scotland. Police
            Scotland is responsible for deciding what, if any, action is appropriate.
          </p>
          <p className="text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg sm:leading-8">
            This part explains how to contact Police Scotland if you decide that you wish to. Whether to do so is
            entirely a matter for you. The committee does not encourage or discourage any owner from contacting Police
            Scotland, and does not act on behalf of Police Scotland.
          </p>
        </div>
      </Reveal>

      {/* ── Civil recovery vs police enquiry ─────────────── */}
      <Reveal className="mt-10">
        <div className="rounded-3xl border-2 border-sky-300/80 bg-gradient-to-br from-sky-50/90 to-white/70 p-6 dark:border-sky-400/30 dark:from-sky-400/[0.08] dark:to-white/[0.03] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 ring-1 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20">
              <Scale className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                Civil recovery and the Police enquiry are separate
              </h3>
              <div className={`${copyClass} mt-3`}>
                <p>
                  The Police Scotland enquiry and an owner&apos;s attempt to recover money are separate matters.
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  Reporting information to Police Scotland does not itself recover money owed to you. Similarly, deciding
                  to pursue a civil claim does not prevent you from providing information to Police Scotland which you
                  believe may be relevant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Is my information potentially relevant? ─────── */}
      <div className="mt-20 sm:mt-24">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.1</span>
            <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
            Relevance
          </p>
          <h3 className={`${h2Class} mt-4`}>Is my information potentially relevant?</h3>
          <p className={`${copyClass} mt-5`}>
            Owners sometimes ask whether their own circumstances could be of interest to Police Scotland. Examples of
            the kinds of circumstances owners have described include:
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2" role="list">
          {relevanceExamples.map(({ title, body, icon: Icon }, i) => (
            <Reveal as="li" key={title} delay={i} className="h-full">
              <div className={`${glassPanel} flex h-full gap-4 rounded-2xl p-5 sm:p-6`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-200 dark:ring-white/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-5">
          <Notice icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} title="These are examples only">
            <p>
              These examples do not mean that any offence has occurred, and they are not a suggestion that you should
              contact Police Scotland. It is for Police Scotland to decide whether any information it receives is
              relevant.
            </p>
          </Notice>
        </Reveal>

        {/* ── Simply a repayment dispute? ─────────────────── */}
        <Reveal className="mt-8">
          <div className="rounded-3xl border border-dashed border-slate-300/90 bg-white/40 p-6 dark:border-white/15 dark:bg-white/[0.02] sm:p-7">
            <div className="flex items-start gap-4">
              <HandCoins className="mt-1 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                  Is this simply a repayment dispute?
                </h3>
                <div className="mt-2 space-y-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                  <p>Not every disagreement about money is necessarily a criminal matter.</p>
                  <p>
                    If your concern is simply that you believe FIOR owes you money, the repayment and Simple Procedure
                    information in Part 2 may be the more relevant starting point.
                  </p>
                </div>
                <a href="#part-2" className={`${secondaryButton} mt-5`}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Return to recovering your money
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Police Scotland enquiry (expandable) ─────────── */}
      <section aria-labelledby={`${uid}-enquiry`} className="mt-20 sm:mt-24">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.2</span>
            <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
            Police Scotland
          </p>
          <h3 id={`${uid}-enquiry`} className={`${h2Class} mt-4`}>
            Contacting Police Scotland
          </h3>
          <p className={`${copyClass} mt-5`}>
            Open the section below for the police incident number, how to contact Police Scotland and how to request
            any further reference details.
          </p>
        </Reveal>

        <Reveal className="mt-8">
          <Accordion title="Police Scotland Enquiry" icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}>
            <div className={copyClass}>
              <p>
                Concerns relating to payments made to the former factor, FIOR Property Assets, have been reported to
                Police Scotland by the James Square Owners Committee.
              </p>
              <p>
                Reporting a concern does not mean that any company or person has committed an offence. Police Scotland is
                responsible for assessing any information it receives and for deciding what, if any, action to take. The
                committee does not act on behalf of Police Scotland and cannot comment on, or provide updates about, any
                police enquiry.
              </p>

              <h5 className="pt-2 text-base font-semibold text-slate-950 dark:text-white">Contacting Police Scotland</h5>
              <p>
                If you wish to contact Police Scotland, telephone {POLICE_PHONE.nonEmergency}, quote the incident number
                below and ask to be directed to the enquiry officer dealing with the FIOR matter relating to James Square.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Police incident number
              </p>
              <p className="mt-2 font-mono text-xl font-semibold tracking-wide text-slate-950 dark:text-white">
                {POLICE_INCIDENT_NUMBER}
              </p>
              <div className="mt-2">
                <CopyButton label="Copy incident number" text={POLICE_INCIDENT_NUMBER} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Quote this number if you contact Police Scotland about this matter. An incident number is a record
                reference only and does not indicate any finding.
              </p>
            </div>

            <div className={`${copyClass} mt-5`}>
              <h5 className="text-base font-semibold text-slate-950 dark:text-white">Further reference details</h5>
              <p>
                If you need any further reference details, please contact the Owners Committee at{" "}
                <a href={`mailto:${COMMITTEE_EMAIL}`} className="break-all font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300">
                  {COMMITTEE_EMAIL}
                </a>{" "}
                or Myreside Management at{" "}
                <a
                  href={`mailto:${MYRESIDE_REFERENCE_EMAIL}`}
                  className="break-all font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300"
                >
                  {MYRESIDE_REFERENCE_EMAIL}
                </a>
                . You may be asked to confirm that you are a James Square owner.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={referenceMailto} className={primaryButton}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                Request further reference details
              </a>
              <button
                type="button"
                aria-expanded={showPhone}
                aria-controls={`${uid}-phone`}
                onClick={() => setShowPhone((v) => !v)}
                className={secondaryButton}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contact Police Scotland
                <ChevronDown
                  className={`h-4 w-4 transition motion-reduce:transition-none ${showPhone ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              “Request further reference details” opens a short prefilled email to the committee, copied to Myreside, in your own
              email app. Add your name and address, then send it yourself.
            </p>

            <div id={`${uid}-phone`} hidden={!showPhone} className="mt-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
                <p className="text-[15px] font-semibold text-slate-950 dark:text-white">How to contact Police Scotland</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                  <li>
                    Telephone <strong>{POLICE_PHONE.nonEmergency}</strong>, the Police Scotland non-emergency number.
                  </li>
                  <li>Explain that you are a James Square owner in Edinburgh.</li>
                  <li>Ask to be directed to the enquiry officer dealing with the FIOR matter relating to James Square.</li>
                  <li>
                    Quote incident number <span className="font-mono font-semibold">{POLICE_INCIDENT_NUMBER}</span>.
                  </li>
                </ol>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a href={`tel:${POLICE_PHONE.nonEmergency}`} className={secondaryButton}>
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {POLICE_PHONE.nonEmergency}
                  </a>
                  <ExternalLink href={POLICE_LINKS.nonEmergency.href}>{POLICE_LINKS.nonEmergency.label}</ExternalLink>
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                  In an emergency, always call {POLICE_PHONE.emergency}.
                </p>
              </div>
            </div>
          </Accordion>
        </Reveal>
      </section>

      {/* ── Evidence checklist ───────────────────────────── */}
      <section id="police-evidence" aria-labelledby={`${uid}-evidence`} className={`mt-20 sm:mt-24 ${scrollMargin}`}>
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.3</span>
            <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
            Your records
          </p>
          <h3 id={`${uid}-evidence`} className={`${h2Class} mt-4`}>
            Information you may wish to have available
          </h3>
          <p className={`${copyClass} mt-5`}>
            Tick anything you hold. If you prepare an email below, the items you tick will be listed as documents you can
            provide.
          </p>
        </Reveal>
        <Reveal className="mt-8">
          <ul className="grid gap-2 sm:grid-cols-2" role="list">
            {POLICE_EVIDENCE.map(({ label, phrase }) => (
              <li key={label}>
                <Checkbox checked={documents.includes(phrase)} onChange={(c) => toggleDocument(phrase, c)}>
                  {label}
                </Checkbox>
              </li>
            ))}
          </ul>
          <Notice className="mt-5" tone="warning" icon={<Lock className="h-4 w-4" aria-hidden="true" />} title="Do not upload these documents to James-Square.com">
            <p>
              Keep the originals securely. Police Scotland can advise whether and how they wish relevant documents to be
              provided.
            </p>
          </Notice>
        </Reveal>
      </section>

      {/* ── Prepare your information ─────────────────────── */}
      <section aria-labelledby={`${uid}-prepare`} className="mt-20 sm:mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+4.5rem)] lg:self-start">
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.4</span>
                <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
                Optional
              </p>
              <h3 id={`${uid}-prepare`} className={`${h2Class} mt-4`}>
                Prepare your information
              </h3>
              <div className={`${copyClass} mt-5`}>
                <p>
                  If you decide to contact Police Scotland, a short factual summary can help you explain your circumstances
                  and what records you hold.
                </p>
                <p>
                  Keep it factual: describe what you paid, what you were told and what happened. Avoid describing anyone&apos;s
                  conduct as criminal. It is for Police Scotland to assess the circumstances.
                </p>
              </div>
              <Notice
                className="mt-6"
                tone="success"
                icon={<Lock className="h-4 w-4" aria-hidden="true" />}
                title="Your information stays with you"
              >
                <p>
                  Nothing you enter is sent to or stored by James Square. It is not saved in your browser either, so it
                  will be lost if you close or reload this page.
                </p>
                <p>
                  James Square will not send anything. You can copy your summary and keep it ready in case Police
                  Scotland asks you for information.
                </p>
              </Notice>
              <button type="button" onClick={clearAll} className={`${secondaryButton} mt-4`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear my information
              </button>
            </Reveal>
          </div>

          <div className="min-w-0">
            {stage === "form" ? (
              <div className={`${glassPanel} p-5 sm:p-8`}>
                <h4
                  ref={formHeadingRef}
                  tabIndex={-1}
                  className={`text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white ${scrollMargin}`}
                >
                  Your circumstances
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Only your name, address and contact details are required.
                </p>

                {errorList.length > 0 && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    className={`mt-5 rounded-2xl border-2 border-rose-500/80 bg-rose-50/80 p-4 outline-none dark:border-rose-400/60 dark:bg-rose-400/[0.08] ${scrollMargin}`}
                  >
                    <p className="text-[15px] font-semibold text-rose-800 dark:text-rose-200">
                      Please check the following before previewing:
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800 dark:text-rose-200">
                      {errorList.map((f) => (
                        <li key={f}>
                          <a href={`#${ids[f]}`} className="underline underline-offset-2">
                            {errors[f]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <form noValidate onSubmit={onPreview} className="mt-6 space-y-6">
                  <Field id={ids.fullName} label="Your full name" error={errors.fullName}>
                    <input
                      id={ids.fullName}
                      type="text"
                      autoComplete="name"
                      maxLength={POLICE_LIMITS.short}
                      value={details.fullName}
                      onChange={(e) => set("fullName")(e.target.value)}
                      aria-invalid={errors.fullName ? true : undefined}
                      aria-describedby={describedBy(ids.fullName, { error: errors.fullName })}
                      className={`${inputClass} ${inputBorder(errors.fullName)}`}
                    />
                  </Field>

                  <Field
                    id={ids.address}
                    label="Your James Square address"
                    hint="Start with your property number and we will suggest the rest. You can edit it."
                    error={errors.address}
                  >
                    <input
                      id={ids.address}
                      type="text"
                      autoComplete="street-address"
                      maxLength={POLICE_LIMITS.short}
                      value={details.address}
                      onChange={(e) => set("address")(e.target.value)}
                      aria-invalid={errors.address ? true : undefined}
                      aria-describedby={describedBy(ids.address, { hint: true, error: errors.address })}
                      className={`${inputClass} ${inputBorder(errors.address)}`}
                    />
                    <AddressSuggestion inputId={ids.address} value={details.address} onAccept={set("address")} />
                  </Field>

                  <Field
                    id={ids.contact}
                    label="Preferred contact email or telephone"
                    hint="Included in your summary so Police Scotland knows how to contact you."
                    error={errors.contact}
                  >
                    <input
                      id={ids.contact}
                      type="text"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      maxLength={POLICE_LIMITS.contact}
                      value={details.contact}
                      onChange={(e) => set("contact")(e.target.value)}
                      aria-invalid={errors.contact ? true : undefined}
                      aria-describedby={describedBy(ids.contact, { hint: true, error: errors.contact })}
                      className={`${inputClass} ${inputBorder(errors.contact)}`}
                    />
                  </Field>

                  <Field
                    id={ids.payment}
                    label="What payment are you concerned about?"
                    hint="For example: a contribution towards proposed roof repairs."
                    optional
                  >
                    <input
                      id={ids.payment}
                      type="text"
                      maxLength={POLICE_LIMITS.short}
                      value={details.payment}
                      onChange={(e) => set("payment")(e.target.value)}
                      aria-describedby={describedBy(ids.payment, { hint: true })}
                      className={`${inputClass} ${inputBorder()}`}
                    />
                  </Field>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={ids.amount} label="Amount" error={errors.amount} optional>
                      <div className="relative">
                        <span
                          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base font-semibold text-slate-500 dark:text-slate-400"
                          aria-hidden="true"
                        >
                          £
                        </span>
                        <input
                          id={ids.amount}
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          placeholder="0.00"
                          maxLength={12}
                          value={details.amount}
                          onChange={(e) => set("amount")(sanitiseAmountInput(e.target.value))}
                          aria-invalid={errors.amount ? true : undefined}
                          aria-describedby={describedBy(ids.amount, { error: errors.amount })}
                          className={`${inputClass} ${inputBorder(errors.amount)} pl-9 tabular-nums`}
                        />
                      </div>
                    </Field>
                    <Field
                      id={ids.paymentDate}
                      label="Date or approximate date of payment"
                      hint="For example: March 2025."
                      optional
                    >
                      <input
                        id={ids.paymentDate}
                        type="text"
                        maxLength={POLICE_LIMITS.short}
                        value={details.paymentDate}
                        onChange={(e) => set("paymentDate")(e.target.value)}
                        aria-describedby={describedBy(ids.paymentDate, { hint: true })}
                        className={`${inputClass} ${inputBorder()}`}
                      />
                    </Field>
                  </div>

                  <TextArea id={ids.toldFor} label="What were you told the payment was for?" value={details.toldFor} onChange={set("toldFor")} />
                  <TextArea id={ids.afterwards} label="What happened afterwards?" value={details.afterwards} onChange={set("afterwards")} />

                  <div className="space-y-4">
                    <ChoiceGroup
                      legend="Have you requested repayment?"
                      value={details.repaymentRequested}
                      options={YES_NO_OPTIONS}
                      onChange={(v) => set("repaymentRequested")(v)}
                    />
                    {details.repaymentRequested === "yes" && (
                      <Field id={ids.repaymentWhen} label="When?" hint="For example: by email on 3 April 2026." optional>
                        <input
                          id={ids.repaymentWhen}
                          type="text"
                          maxLength={POLICE_LIMITS.short}
                          value={details.repaymentWhen}
                          onChange={(e) => set("repaymentWhen")(e.target.value)}
                          aria-describedby={describedBy(ids.repaymentWhen, { hint: true })}
                          className={`${inputClass} ${inputBorder()}`}
                        />
                      </Field>
                    )}
                  </div>

                  <div className="space-y-4">
                    <ChoiceGroup
                      legend="Has any money been returned?"
                      value={details.moneyReturned}
                      options={YES_NO_OPTIONS}
                      onChange={(v) => set("moneyReturned")(v)}
                    />
                    {details.moneyReturned === "yes" && (
                      <Field id={ids.returnedAmount} label="How much?" error={errors.returnedAmount} optional>
                        <div className="relative sm:max-w-xs">
                          <span
                            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base font-semibold text-slate-500 dark:text-slate-400"
                            aria-hidden="true"
                          >
                            £
                          </span>
                          <input
                            id={ids.returnedAmount}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="0.00"
                            maxLength={12}
                            value={details.returnedAmount}
                            onChange={(e) => set("returnedAmount")(sanitiseAmountInput(e.target.value))}
                            aria-invalid={errors.returnedAmount ? true : undefined}
                            aria-describedby={describedBy(ids.returnedAmount, { error: errors.returnedAmount })}
                            className={`${inputClass} ${inputBorder(errors.returnedAmount)} pl-9 tabular-nums`}
                          />
                        </div>
                      </Field>
                    )}
                  </div>

                  <TextArea
                    id={ids.whyRelevant}
                    label="Anything else you think may be helpful"
                    hint="Stick to the facts as you understand them."
                    value={details.whyRelevant}
                    onChange={set("whyRelevant")}
                  />

                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Documents ticked in the checklist above:{" "}
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">{documents.length}</strong>.{" "}
                    <a href="#police-evidence" className="font-semibold text-sky-700 underline underline-offset-2 dark:text-sky-300">
                      Review checklist
                    </a>
                  </p>

                  <button type="submit" className={primaryButton}>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Preview my summary
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`${glassPanel} overflow-hidden`}>
                  <div className="border-b border-slate-200/80 px-5 py-4 dark:border-white/10 sm:px-7">
                    <h4
                      ref={previewHeadingRef}
                      tabIndex={-1}
                      className={`flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white ${scrollMargin}`}
                    >
                      <Mail className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                      Check and edit your summary
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Nothing has been sent. You can change the wording below before using it.
                    </p>
                  </div>
                  <dl className="divide-y divide-slate-200/80 text-[15px] dark:divide-white/10">
                    <div className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-3 sm:px-7">
                      <dt className="w-20 shrink-0 font-semibold text-slate-500 dark:text-slate-400">Subject</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{POLICE_SUMMARY_SUBJECT}</dd>
                    </div>
                  </dl>
                  <div className="border-t border-slate-200/80 bg-white/70 px-5 py-5 dark:border-white/10 dark:bg-slate-950/40 sm:px-7">
                    <label htmlFor={`${uid}-draft`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      id={`${uid}-draft`}
                      rows={18}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      aria-describedby={`${uid}-draft-hint`}
                      className={`${inputClass} ${inputBorder()} mt-2 resize-y text-[15px] leading-7`}
                    />
                    <p id={`${uid}-draft-hint`} className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Going back to edit your answers will rebuild this message and replace changes made here.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <button type="button" onClick={onEdit} className={secondaryButton}>
                    <PencilLine className="h-4 w-4" aria-hidden="true" />
                    Edit my answers
                  </button>
                </div>

                <Notice tone="info" icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} title="Using your summary">
                  <p>
                    Keep your summary ready if you call {POLICE_PHONE.nonEmergency}. If Police Scotland asks you to send
                    information by email, paste it into a new email to the address they give you.
                  </p>
                  <p>
                    <ExternalLink href={POLICE_LINKS.contact.href}>{POLICE_LINKS.contact.label}</ExternalLink>
                  </p>
                </Notice>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Copy your summary</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Copy your summary to keep it ready, or paste it into an email if Police Scotland asks you to send it.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <CopyButton label="Copy subject" text={POLICE_SUMMARY_SUBJECT} />
                    <CopyButton label="Copy message" text={draft} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
