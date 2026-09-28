"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Hourglass,
  Landmark,
  Lock,
  Mail,
  MailCheck,
  MessageSquareReply,
  PencilLine,
  Send,
  XCircle,
} from "lucide-react";
import ClaimPreparation from "./ClaimPreparation";
import Reveal from "./Reveal";
import { CopyButton } from "./ui";
import {
  FIOR_REPAYMENT_EMAIL,
  LIMITS,
  REPAYMENT_SUBJECT,
  buildMailtoUri,
  buildRepaymentBody,
  sanitiseAmountInput,
  validateDetails,
  type RepaymentDetails,
  type RepaymentErrors,
  type RepaymentField,
} from "./repaymentEmail";

// Form contents live in component state only. Nothing is written to
// localStorage, Firestore, an API route or analytics.

const glassPanel =
  "rounded-3xl border border-white/70 bg-white/65 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]";
const h2Class = "text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl";
const copyClass = "space-y-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-[1.8]";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-950";
const primaryButton = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto ${focusRing}`;
const secondaryButton = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-[15px] font-semibold text-slate-800 transition hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08] sm:w-auto ${focusRing}`;
const inputClass = `block w-full rounded-xl border bg-white/90 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 ${focusRing}`;

const emptyDetails: RepaymentDetails = { fullName: "", address: "", amount: "", reason: "", email: "" };

const fieldOrder: RepaymentField[] = ["fullName", "address", "amount", "reason", "email"];
const fieldLabels: Record<RepaymentField, string> = {
  fullName: "Your full name",
  address: "Your James Square address",
  amount: "How much are you requesting?",
  reason: "Why do you believe this money should be returned?",
  email: "Your email address",
};

const progression = [
  "Enter details",
  "Preview",
  "Open in your email app",
  "Send it yourself",
  "Keep your sent email",
  "Allow an opportunity to respond",
];

const recordsToKeep = [
  "The sent email.",
  "Any reply from FIOR.",
  "Relevant bank statements.",
  "Direct Debit records.",
  "Previous correspondence.",
  "Invoices or requests for payment.",
  "Evidence relating to the payment.",
];

type Outcome = "resolved" | "response" | "unresolved";

const outcomes: { id: Outcome; kicker: string; title: string; body: string; icon: typeof CheckCircle2 }[] = [
  {
    id: "resolved",
    kicker: "Money returned",
    title: "My issue has been resolved",
    body: "If you are satisfied the matter has been resolved, you may not need to continue with this guide.",
    icon: CheckCircle2,
  },
  {
    id: "response",
    kicker: "FIOR responded",
    title: "I’ve received a response",
    body: "Consider the response and compare it with your own records before deciding what to do next. This guide cannot tell you whether a response is correct.",
    icon: MessageSquareReply,
  },
  {
    id: "unresolved",
    kicker: "Still unresolved",
    title: "My repayment request has not resolved the matter",
    body: "Part 2B below explains Simple Procedure and helps you organise your information before you decide whether to use the official Scottish Courts service.",
    icon: XCircle,
  },
];

const partTwoJourney = [
  { number: "01", title: "Request repayment", note: "Available", state: "available" as const },
  { number: "02", title: "Prepare your claim", note: "Part 2B – this guide", state: "available" as const },
  { number: "03", title: "Submit through Scottish Courts", note: "External – Civil Online", state: "external" as const },
  { number: "04", title: "Follow your court case", note: "Brief guidance", state: "info" as const },
];

type Stage = "form" | "preview" | "opened";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold text-slate-900 dark:text-white">
        {label}
      </label>
      {hint && (
        <div id={`${id}-hint`} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {hint}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-rose-700 dark:text-rose-300">
          <span aria-hidden="true">⚠</span>
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function RepaymentRequest() {
  const uid = useId();
  const ids = Object.fromEntries(fieldOrder.map((f) => [f, `${uid}-${f}`])) as Record<RepaymentField, string>;

  const [details, setDetails] = useState<RepaymentDetails>(emptyDetails);
  const [errors, setErrors] = useState<RepaymentErrors>({});
  const [stage, setStage] = useState<Stage>("form");
  const [body, setBody] = useState("");
  const [confirmedSent, setConfirmedSent] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const preparedHeadingRef = useRef<HTMLHeadingElement>(null);
  const recordsHeadingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<React.RefObject<HTMLElement | null> | null>(null);

  // Move focus after the stage changes so keyboard and screen reader users land on the new content.
  useEffect(() => {
    pendingFocus.current?.current?.focus();
    pendingFocus.current = null;
  }, [stage, errors, confirmedSent]);

  const update = (field: RepaymentField) => (value: string) => {
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const describedBy = (field: RepaymentField, hasHint: boolean) =>
    [hasHint && `${ids[field]}-hint`, errors[field] && `${ids[field]}-error`].filter(Boolean).join(" ") || undefined;

  const errorBorder = (field: RepaymentField) =>
    errors[field] ? "border-rose-500 dark:border-rose-400" : "border-slate-300 dark:border-white/15";

  const onPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateDetails(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      pendingFocus.current = errorSummaryRef;
      return;
    }
    setBody(buildRepaymentBody(details, new Date()));
    setConfirmedSent(false);
    pendingFocus.current = previewHeadingRef;
    setStage("preview");
  };

  const onEdit = () => {
    pendingFocus.current = formHeadingRef;
    setStage("form");
  };

  const mailto = body ? buildMailtoUri(FIOR_REPAYMENT_EMAIL, REPAYMENT_SUBJECT, body) : "";
  const errorList = fieldOrder.filter((f) => errors[f]);
  const activeStep = stage === "form" ? 0 : stage === "preview" ? 1 : confirmedSent ? 4 : 3;

  return (
    <section id="part-2" aria-labelledby="part2-heading" className="scroll-mt-[calc(var(--nav-height,4rem)+1rem)]">
      {/* ── Part 2 intro ─────────────────────────────────── */}
      <Reveal className="border-t border-slate-200/80 pt-14 dark:border-white/10 sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 backdrop-blur dark:border-sky-400/20 dark:bg-white/5 dark:text-sky-300">
          Part 2
        </p>
        <h2 id="part2-heading" className="mt-5 max-w-3xl text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-950 dark:text-white sm:text-5xl">
          Recovering money you believe is due to you
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl sm:leading-9">
          If you believe FIOR owes money directly to you, the first step is to clearly request repayment and give FIOR an
          opportunity to respond.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Part 2 journey">
          {partTwoJourney.map(({ number, title, note, state }) => (
            <li
              key={number}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                state === "available"
                  ? "border-sky-200/80 bg-white/75 dark:border-sky-400/20 dark:bg-slate-900/60"
                  : "border-dashed border-slate-300/90 bg-white/40 dark:border-white/15 dark:bg-white/[0.02]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold ${
                  state === "available"
                    ? "border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950"
                    : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-400"
                }`}
                aria-hidden="true"
              >
                {state === "external" ? <Landmark className="h-4 w-4" /> : number}
              </span>
              <span className="min-w-0">
                <span className="sr-only">Step {number}: </span>
                <span className="block text-[15px] font-semibold leading-5 text-slate-900 dark:text-white">{title}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{note}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Moving through these steps is optional. Reaching step 02 does not mean you should raise court proceedings –
          that is a decision for each owner.
        </p>
      </Reveal>

      {/* ── Step 1 ───────────────────────────────────────── */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
              <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">Step 1 of 4</span>
              <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
              Repayment request
            </p>
            <h3 className={`${h2Class} mt-4`}>Request your money back</h3>
            <div className={`${copyClass} mt-5`}>
              <p>This tool will help you prepare a clear written repayment request using the information you provide.</p>
              <p>
                James Square will not send the email. Once you are happy with it, we will open the completed message in
                your own email app for you to review and send yourself.
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-5 py-4 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07]">
              <Send className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <div>
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Sent from you, not James Square</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Your request will come directly from your own email address and should then appear in your normal Sent
                  folder once you send it.
                </p>
              </div>
            </div>

            {/* Visual progression */}
            <ol className="mt-8 space-y-0" aria-label="How this works">
              {progression.map((label, i) => {
                const done = i < activeStep;
                const current = i === activeStep;
                return (
                  <li key={label} aria-current={current ? "step" : undefined} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < progression.length - 1 && (
                      <span
                        className={`absolute left-[0.8125rem] top-7 h-[calc(100%-1.5rem)] w-px ${done ? "bg-sky-400" : "bg-slate-300 dark:bg-white/15"}`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                        done
                          ? "border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950"
                          : current
                            ? "border-sky-500 bg-white text-sky-700 ring-4 ring-sky-400/20 dark:border-sky-400 dark:bg-slate-900 dark:text-sky-300"
                            : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-400"
                      }`}
                      aria-hidden="true"
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                    </span>
                    <span
                      className={`pt-0.5 text-sm ${
                        current ? "font-semibold text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {label}
                      {done && <span className="sr-only"> (done)</span>}
                      {current && <span className="sr-only"> (current step)</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        <div className="min-w-0">
          {stage === "form" && (
            <div className={`${glassPanel} p-5 sm:p-8`}>
              <h4
                ref={formHeadingRef}
                tabIndex={-1}
                className="scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)] text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white"
              >
                Your details
              </h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">All fields are required.</p>

              {errorList.length > 0 && (
                <div
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)] mt-5 rounded-2xl border-2 border-rose-500/80 bg-rose-50/80 p-4 outline-none dark:border-rose-400/60 dark:bg-rose-400/[0.08]"
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
                <Field id={ids.fullName} label={fieldLabels.fullName} error={errors.fullName}>
                  <input
                    id={ids.fullName}
                    type="text"
                    autoComplete="name"
                    placeholder="John Smith"
                    maxLength={LIMITS.name}
                    value={details.fullName}
                    onChange={(e) => update("fullName")(e.target.value)}
                    aria-invalid={errors.fullName ? true : undefined}
                    aria-describedby={describedBy("fullName", false)}
                    className={`${inputClass} ${errorBorder("fullName")}`}
                  />
                </Field>

                <Field id={ids.address} label={fieldLabels.address} error={errors.address}>
                  <input
                    id={ids.address}
                    type="text"
                    autoComplete="street-address"
                    placeholder="59/2 Caledonian Crescent"
                    maxLength={LIMITS.address}
                    value={details.address}
                    onChange={(e) => update("address")(e.target.value)}
                    aria-invalid={errors.address ? true : undefined}
                    aria-describedby={describedBy("address", false)}
                    className={`${inputClass} ${errorBorder("address")}`}
                  />
                </Field>

                <Field
                  id={ids.amount}
                  label={fieldLabels.amount}
                  hint="In pounds and pence, for example 125 or 125.50."
                  error={errors.amount}
                >
                  <div className="relative sm:max-w-xs">
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
                      onChange={(e) => update("amount")(sanitiseAmountInput(e.target.value))}
                      aria-invalid={errors.amount ? true : undefined}
                      aria-describedby={describedBy("amount", true)}
                      className={`${inputClass} ${errorBorder("amount")} pl-9 tabular-nums`}
                    />
                  </div>
                </Field>

                <Field
                  id={ids.reason}
                  label={fieldLabels.reason}
                  hint={
                    <>
                      <p>Briefly explain what the payment relates to and why you believe it should be returned.</p>
                      <p className="mt-1 italic">
                        For example: Direct Debit payments continued after FIOR ceased acting as factor in February 2026.
                      </p>
                    </>
                  }
                  error={errors.reason}
                >
                  <textarea
                    id={ids.reason}
                    rows={6}
                    maxLength={LIMITS.reason}
                    value={details.reason}
                    onChange={(e) => update("reason")(e.target.value)}
                    aria-invalid={errors.reason ? true : undefined}
                    aria-describedby={[describedBy("reason", true), `${ids.reason}-count`].filter(Boolean).join(" ")}
                    className={`${inputClass} ${errorBorder("reason")} min-h-40 resize-y leading-7`}
                  />
                  <p id={`${ids.reason}-count`} className="mt-1.5 text-right text-xs text-slate-500 dark:text-slate-400">
                    {details.reason.length} of {LIMITS.reason} characters
                  </p>
                </Field>

                <Field
                  id={ids.email}
                  label={fieldLabels.email}
                  hint="This is included in the repayment request so FIOR knows how to contact you. The email will still be sent using your own email application."
                  error={errors.email}
                >
                  <input
                    id={ids.email}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="name@example.com"
                    maxLength={LIMITS.email}
                    value={details.email}
                    onChange={(e) => update("email")(e.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy("email", true)}
                    className={`${inputClass} ${errorBorder("email")}`}
                  />
                </Field>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Your information stays with you</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      James Square does not receive or store the information entered into this form. It is used in your
                      browser only to prepare your repayment request.
                    </p>
                  </div>
                </div>

                <button type="submit" className={primaryButton}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Preview my repayment request
                </button>
              </form>
            </div>
          )}

          {stage !== "form" && (
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
                        ref={preparedHeadingRef}
                        tabIndex={-1}
                        className="scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)] text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white"
                      >
                        Your email has been prepared
                      </h4>
                      <div className="mt-2 space-y-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                        <p>Your email application should now have opened with your repayment request ready to review.</p>
                        <p>
                          Check the recipient, subject and message carefully, then send it from your own email account.
                        </p>
                        <p>Once sent, keep the email in your Sent folder as part of your records.</p>
                      </div>
                      {!confirmedSent && (
                        <button
                          type="button"
                          onClick={() => {
                            pendingFocus.current = recordsHeadingRef;
                            setConfirmedSent(true);
                          }}
                          className={`${secondaryButton} mt-5`}
                        >
                          I’ve sent the email – what next?
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {confirmedSent && (
                <div className={`${glassPanel} p-5 sm:p-7`}>
                  <h4
                    ref={recordsHeadingRef}
                    tabIndex={-1}
                    className="scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)] text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white"
                  >
                    Keep a copy for your records
                  </h4>
                  <p className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                    Your sent email provides a useful record of what you requested, the amount involved and when the
                    request was sent. It is also a good idea to keep:
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                    {recordsToKeep.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[15px] leading-6 text-slate-700 dark:text-slate-300">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Keep these yourself. Please do not upload them to James-Square.com.
                  </p>
                </div>
              )}

              {/* Email-style preview */}
              <div className={`${glassPanel} overflow-hidden`}>
                <div className="border-b border-slate-200/80 px-5 py-4 dark:border-white/10 sm:px-7">
                  <h4
                    ref={previewHeadingRef}
                    tabIndex={-1}
                    className="scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)] flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white"
                  >
                    <Mail className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                    {stage === "preview" ? "Check your repayment request" : "Your repayment request"}
                  </h4>
                  {stage === "preview" && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      This is exactly what will be placed into your email. Nothing has been sent.
                    </p>
                  )}
                </div>
                <dl className="divide-y divide-slate-200/80 text-[15px] dark:divide-white/10">
                  <div className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-3 sm:px-7">
                    <dt className="w-20 shrink-0 font-semibold text-slate-500 dark:text-slate-400">To</dt>
                    <dd className="break-all font-medium text-slate-900 dark:text-white">{FIOR_REPAYMENT_EMAIL}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:gap-3 sm:px-7">
                    <dt className="w-20 shrink-0 font-semibold text-slate-500 dark:text-slate-400">Subject</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{REPAYMENT_SUBJECT}</dd>
                  </div>
                </dl>
                <div className="border-t border-slate-200/80 bg-white/70 px-5 py-6 dark:border-white/10 dark:bg-slate-950/40 sm:px-7">
                  <p className="sr-only">Message:</p>
                  <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-800 [overflow-wrap:anywhere] dark:text-slate-200">
                    {body}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button type="button" onClick={onEdit} className={secondaryButton}>
                  <PencilLine className="h-4 w-4" aria-hidden="true" />
                  Edit my details
                </button>
                <a
                  href={mailto}
                  onClick={() => {
                    pendingFocus.current = preparedHeadingRef;
                    setStage("opened");
                  }}
                  className={`${primaryButton} sm:min-w-[16rem] sm:text-base`}
                >
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  {stage === "opened" ? "Open in my email app again" : "Open in my email app"}
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  Having trouble opening your email app?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Copy each part below, then paste it into a new email in Gmail, Outlook, Apple Mail or any other email
                  service.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CopyButton label="Copy email address" text={FIOR_REPAYMENT_EMAIL} />
                  <CopyButton label="Copy subject" text={REPAYMENT_SUBJECT} />
                  <CopyButton label="Copy email text" text={body} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── What happens next ─────────────────────────────── */}
      <div className="mt-20 sm:mt-24">
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
            <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
            What happens next?
          </p>
          <h3 className={`${h2Class} mt-4`}>Give FIOR an opportunity to respond</h3>
          <div className={`${copyClass} mt-5`}>
            <p>You have now clearly set out what you believe is owed and requested repayment.</p>
            <p>Allow a reasonable opportunity for FIOR to respond or resolve the matter.</p>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <fieldset>
            <legend className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              Where are things now?
            </legend>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {outcomes.map(({ id, kicker, title, icon: Icon }) => {
                const selected = outcome === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    aria-controls={id === "unresolved" ? "part-2b" : undefined}
                    onClick={() => setOutcome(selected ? null : id)}
                    className={`flex h-full flex-col rounded-2xl border p-5 text-left transition sm:p-6 ${focusRing} ${
                      selected
                        ? "border-sky-500 bg-white shadow-[0_16px_40px_rgba(14,165,233,0.16)] ring-1 ring-sky-500 dark:border-sky-400 dark:bg-slate-900 dark:ring-sky-400"
                        : `${glassPanel} hover:border-sky-300 dark:hover:border-sky-400/40`
                    }`}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          selected
                            ? "border-sky-600 bg-sky-600 text-white dark:border-sky-300 dark:bg-sky-300 dark:text-slate-950"
                            : "border-slate-300 dark:border-white/20"
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                      {kicker}
                    </span>
                    <span className="mt-1 text-base font-semibold tracking-tight text-slate-950 dark:text-white">{title}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div aria-live="polite">
            {outcome && outcome !== "unresolved" && (
              <p className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 text-[15px] leading-7 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {outcomes.find((o) => o.id === outcome)?.body}
              </p>
            )}
          </div>
        </Reveal>

        {outcome === "unresolved" && <ClaimPreparation repaymentSent={confirmedSent} fromRequest={details} />}
      </div>
    </section>
  );
}
