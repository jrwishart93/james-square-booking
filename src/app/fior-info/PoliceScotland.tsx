"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  FileSearch,
  FileText,
  HandCoins,
  Hammer,
  HelpCircle,
  Lock,
  Mail,
  MailCheck,
  PencilLine,
  Scale,
  ShieldCheck,
  Trash2,
  Undo2,
  UserRound,
} from "lucide-react";
import Reveal from "./Reveal";
import {
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
  EMPTY_POLICE_DETAILS,
  FIOR_POLICE_CONTACT,
  FIOR_POLICE_REFERENCE,
  POLICE_EVIDENCE,
  POLICE_LIMITS,
  POLICE_LINKS,
  buildPoliceBody,
  policeSubject,
  validatePoliceDetails,
  type PoliceDetails,
  type PoliceErrors,
  type PoliceField,
  type YesNo,
} from "./policeInfo";

// Privacy: everything entered here lives in this component's state only. It is
// not written to localStorage, Firestore, an API route or analytics, is never
// placed in the page URL and is lost when the page is closed. James Square does
// not send the email: the owner's own email application is opened via mailto:.

/** Some email apps truncate very long mailto: links; beyond this, suggest copying instead. */
const MAILTO_SOFT_LIMIT = 1800;

const relevanceExamples = [
  {
    title: "Roof or repair payments",
    body: "You paid FIOR money specifically towards proposed roof, repair or other works and believe the circumstances surrounding that payment may be relevant to the existing enquiry.",
    icon: Hammer,
  },
  {
    title: "Money has not been returned",
    body: "You requested the return of money paid for proposed works and have experienced difficulty obtaining repayment.",
    icon: Undo2,
  },
  {
    title: "Information or documents",
    body: "You hold correspondence, payment requests, invoices or other information which you believe may assist the existing enquiry.",
    icon: FileSearch,
  },
  {
    title: "Something else you believe is relevant",
    body: "Your circumstances do not fit the examples above but you believe you have information which Police Scotland should be aware of.",
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

type Stage = "form" | "preview" | "opened";

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
  const contact = FIOR_POLICE_CONTACT;
  const reference = FIOR_POLICE_REFERENCE;
  const subject = policeSubject(reference);

  const [details, setDetails] = useState<PoliceDetails>(EMPTY_POLICE_DETAILS);
  const [documents, setDocuments] = useState<string[]>([]);
  const [errors, setErrors] = useState<PoliceErrors>({});
  const [stage, setStage] = useState<Stage>("form");
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const openedHeadingRef = useRef<HTMLHeadingElement>(null);
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
    setDraft(buildPoliceBody(details, documents, contact, reference));
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

  const mailto = contact.email && draft ? buildMailtoUri(contact.email, subject, draft) : "";
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
            Some of the circumstances reported by James Square owners were provided to Police Scotland and remain part of
            an ongoing enquiry.
          </p>
          <p className="text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg sm:leading-8">
            If you believe your own circumstances may be relevant, particularly where you paid money towards proposed
            works which were not subsequently carried out and the money has not been returned, you may wish to make the
            enquiry officer aware of your circumstances.
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
              These examples do not mean that a criminal offence has occurred. Police Scotland will determine whether
              information provided is relevant to its enquiry.
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

      {/* ── Existing enquiry ─────────────────────────────── */}
      <section aria-labelledby={`${uid}-enquiry`} className="mt-20 sm:mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
              <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">3.2</span>
              <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
              Police Scotland
            </p>
            <h3 id={`${uid}-enquiry`} className={`${h2Class} mt-4`}>
              Existing enquiry
            </h3>
            <div className={`${copyClass} mt-6`}>
              <p>
                The James Square Owners Committee previously provided Police Scotland with information received from
                owners regarding concerns surrounding payments to FIOR.
              </p>
              <p>
                Police Scotland is responsible for assessing that information and determining what, if any, criminal
                investigation or further enquiries are appropriate.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1} className="flex flex-col gap-4 lg:pt-10">
            <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Current status
              </p>
              <p className="mt-2 flex items-center gap-2.5 text-lg font-semibold text-slate-950 dark:text-white">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/15 dark:bg-sky-400 dark:ring-sky-400/15"
                  aria-hidden="true"
                />
                Ongoing enquiry
              </p>
            </div>

            {reference.visible && (
              <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Police Scotland enquiry reference
                </p>
                <p className="mt-2 font-mono text-xl font-semibold tracking-wide text-slate-950 dark:text-white">
                  {reference.reference}
                </p>
                <div className="mt-2">
                  <CopyButton label="Copy reference" text={reference.reference} />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Police incident reference
                </p>
                <p className="mt-2 font-mono text-xl font-semibold tracking-wide text-slate-950 dark:text-white">
                  {reference.incident}
                </p>
                <div className="mt-2">
                  <CopyButton label="Copy incident reference" text={reference.incident} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Quote both references when contacting Police Scotland about this matter.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Contacting the enquiry officer
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The enquiry officer currently understood to be dealing with relevant information is:
              </p>
              <p className="mt-3 flex items-center gap-2.5">
                <UserRound className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                <span>
                  <span className="block text-[15px] font-semibold text-slate-950 dark:text-white">{contact.officer}</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-400">{contact.organisation}</span>
                </span>
              </p>
              {contact.email ? (
                // The address is only assembled into a mailto: link on click, so it is never shown on the page.
                <button
                  type="button"
                  onClick={() => {
                    if (contact.email) window.location.href = buildMailtoUri(contact.email, subject, "");
                  }}
                  className={`${secondaryButton} mt-4`}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email the enquiry officer
                </button>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-100/80 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-white/[0.05] dark:text-slate-300">
                  Direct contact details for the enquiry officer will be added once confirmed.
                </p>
              )}
            </div>
          </Reveal>
        </div>
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
                  Providing a short factual summary can help explain why you are making contact and what information you
                  hold.
                </p>
                <p>
                  Keep it factual: describe what you paid, what you were told and what happened. It is for Police
                  Scotland to assess the circumstances.
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
                  {contact.email
                    ? "James Square will not send your email. It opens in your own email app for you to review and send yourself."
                    : "James Square will not send anything. You can copy your summary and send it yourself."}
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

                  <Field id={ids.address} label="Your James Square address" error={errors.address}>
                    <input
                      id={ids.address}
                      type="text"
                      autoComplete="street-address"
                      maxLength={POLICE_LIMITS.short}
                      value={details.address}
                      onChange={(e) => set("address")(e.target.value)}
                      aria-invalid={errors.address ? true : undefined}
                      aria-describedby={describedBy(ids.address, { error: errors.address })}
                      className={`${inputClass} ${inputBorder(errors.address)}`}
                    />
                  </Field>

                  <Field
                    id={ids.contact}
                    label="Preferred contact email or telephone"
                    hint="Included in your email so Police Scotland knows how to contact you."
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
                    label="Why do you believe Police Scotland should be aware of this?"
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
                {stage === "opened" && (
                  <div
                    role="status"
                    className="rounded-3xl border border-emerald-200/80 bg-emerald-50/80 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/[0.08] sm:p-7"
                  >
                    <div className="flex items-start gap-3">
                      <MailCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                      <div>
                        <h4
                          ref={openedHeadingRef}
                          tabIndex={-1}
                          className={`text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white ${scrollMargin}`}
                        >
                          Your email should now be open
                        </h4>
                        <p className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                          Check the recipient, subject and message, then send it from your own email account. Keep a copy
                          in your Sent folder. Police Scotland will determine what happens next.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                      <dt className="w-20 shrink-0 font-semibold text-slate-500 dark:text-slate-400">To</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {contact.officer}, {contact.organisation}
                        {!contact.email && (
                          <span className="font-normal text-slate-600 dark:text-slate-400"> – email address not yet confirmed</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-3 sm:px-7">
                      <dt className="w-20 shrink-0 font-semibold text-slate-500 dark:text-slate-400">Subject</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">{subject}</dd>
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
                  {mailto && (
                    <a
                      href={mailto}
                      onClick={() => {
                        pendingFocus.current = openedHeadingRef;
                        setStage("opened");
                      }}
                      className={`${primaryButton} sm:min-w-[16rem] sm:text-base`}
                    >
                      <Mail className="h-5 w-5" aria-hidden="true" />
                      {stage === "opened" ? "Open in my email app again" : "Open in my email app"}
                    </a>
                  )}
                </div>

                {!contact.email && (
                  <Notice tone="info" icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} title="Enquiry officer email not yet confirmed">
                    <p>
                      Direct contact details for the enquiry officer will be added once confirmed. In the meantime you can
                      copy your summary and keep it ready. If you contact Police Scotland through its official channels,
                      {reference.visible ? ` quote references ${reference.reference} and ${reference.incident}, and` : ""} mention that your information
                      relates to the existing James Square / FIOR enquiry.
                    </p>
                    <p>
                      <ExternalLink href={POLICE_LINKS.contact.href}>{POLICE_LINKS.contact.label}</ExternalLink>
                    </p>
                  </Notice>
                )}

                {mailto.length > MAILTO_SOFT_LIMIT && (
                  <Notice tone="warning" title="Long message">
                    <p>
                      Some email apps shorten very long messages opened this way. Check the whole message arrived, or copy
                      it below and paste it into a new email.
                    </p>
                  </Notice>
                )}

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Copy your summary</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Paste each part into a new email in Gmail, Outlook, Apple Mail or any other email service.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {contact.email && <CopyButton label="Copy recipient address" text={contact.email} />}
                    <CopyButton label="Copy subject" text={subject} />
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
