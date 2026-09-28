"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Coins,
  Download,
  ExternalLink as ExternalIcon,
  FileText,
  Gavel,
  HardDrive,
  Info,
  Landmark,
  Mailbox,
  Printer,
  Receipt,
  Scale,
  ShieldAlert,
  Trash2,
  Users,
  WalletCards,
} from "lucide-react";
import {
  READINESS_ITEMS,
  buildScheduleText,
  buildSummaryText,
  clearPrep,
  computeTotals,
  createEmptyPrep,
  draftFor,
  formatPence,
  formatPreparedOn,
  loadPrep,
  respondentLine,
  savePrep,
  tidy,
  validateAmounts,
  validateClaimant,
  type Answer,
  type ClaimPrep,
  type FieldErrors,
  type SelfCheck,
  type Totals,
} from "./claimPrep";
import { COURT_FEES, LINKS, SOURCES_CHECKED_ON } from "./claimPrepSources";
import {
  OverLimitNotice,
  PaymentCards,
  StepAmount,
  StepCourtRequest,
  StepDetails,
  StepEvidence,
  StepResolution,
  StepRespondent,
  StepStory,
  StepWhy,
  validateResolution,
  type RequestPrefill,
  type StepProps,
} from "./ClaimSteps";
import {
  Accordion,
  Checkbox,
  ChoiceGroup,
  CopyButton,
  ExternalLink,
  Modal,
  Notice,
  copyClass,
  focusRing,
  glassPanel,
  h2Class,
  primaryButton,
  scrollMargin,
  secondaryButton,
} from "./ui";

// Privacy: everything the owner enters stays in this component's state. It is
// written to this browser's localStorage only if the owner turns on "Save my
// progress on this device". Nothing is sent to Firestore, an API route,
// analytics or any third party, and nothing is placed in the URL.

const STEPS = [
  { short: "Your details", title: "Your details", Component: StepDetails },
  { short: "Respondent", title: "Who is the claim against?", Component: StepRespondent },
  { short: "Amount", title: "How much are you claiming?", Component: StepAmount },
  { short: "What happened", title: "What happened?", Component: StepStory },
  { short: "Why money is due", title: "Why do you believe the money is due?", Component: StepWhy },
  { short: "Resolution attempts", title: "What have you done to resolve the matter?", Component: StepResolution },
  { short: "Court request", title: "What do you want the court to do?", Component: StepCourtRequest },
  { short: "Evidence", title: "Gather your evidence", Component: StepEvidence },
  { short: "Review", title: "Your claim preparation summary", Component: null },
] as const;

const REVIEW_STEP = STEPS.length; // 9
const CONTINUE_STEP = REVIEW_STEP + 1; // 10

const ANSWER_OPTIONS: { value: Exclude<Answer, "">; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const selfCheckQuestions: { key: Exclude<keyof SelfCheck, "attempted">; label: string }[] = [
  { key: "underLimit", label: "Are you seeking payment of £5,000 or less?" },
  { key: "personallyOwed", label: "Is this money you believe is personally owed to you?" },
  { key: "identifyRespondent", label: "Can you identify who you believe owes the money?" },
  { key: "canExplain", label: "Can you explain why you believe the money should be returned?" },
];

function validateStep(step: number, prep: ClaimPrep): FieldErrors {
  if (step === 1) return validateClaimant(prep.claimant);
  if (step === 3) return validateAmounts(prep);
  if (step === 6) return validateResolution(prep);
  return {};
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export default function ClaimPreparation({
  repaymentSent,
  fromRequest,
}: {
  repaymentSent: boolean;
  fromRequest?: RequestPrefill;
}) {
  const uid = useId();
  const [prep, setPrep] = useState<ClaimPrep>(createEmptyPrep);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveOnDevice, setSaveOnDevice] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saved" | "unavailable">("");
  const [hydrated, setHydrated] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState<null | "schedule" | "summary">(null);
  const [announcement, setAnnouncement] = useState("");

  const introRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef<"step" | "errors" | null>(null);

  const totals = useMemo(() => computeTotals(prep), [prep]);

  // Bring the owner to Part 2B when it opens.
  useEffect(() => {
    introRef.current?.scrollIntoView({ block: "start" });
    introRef.current?.focus({ preventScroll: true });
  }, []);

  // Restore progress previously saved on this device (only if the owner chose to save it).
  useEffect(() => {
    const saved = loadPrep(safeStorage());
    if (saved) {
      setPrep(saved);
      setSaveOnDevice(true);
      setSaveStatus("saved");
      if (saved.selfCheck.underLimit && saved.selfCheck.underLimit !== "no") setStarted(true);
    } else if (repaymentSent) {
      setPrep((p) => ({ ...p, selfCheck: { ...p.selfCheck, attempted: "sent" } }));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || !saveOnDevice) return;
    const t = window.setTimeout(() => setSaveStatus(savePrep(safeStorage(), prep) ? "saved" : "unavailable"), 300);
    return () => window.clearTimeout(t);
  }, [prep, saveOnDevice, hydrated]);

  useEffect(() => {
    if (moveFocus.current === "step") stepHeadingRef.current?.focus();
    if (moveFocus.current === "errors") errorSummaryRef.current?.focus();
    moveFocus.current = null;
  }, [step, errors]);

  // Print one section via a portal so the printout contains only that document.
  useEffect(() => {
    if (!printTarget) return;
    const html = document.documentElement;
    html.classList.add("jqs-printing");
    const done = () => setPrintTarget(null);
    window.addEventListener("afterprint", done);
    const t = window.setTimeout(() => window.print(), 60);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("afterprint", done);
      html.classList.remove("jqs-printing");
    };
  }, [printTarget]);

  const goTo = (target: number) => {
    setErrors({});
    moveFocus.current = "step";
    setStep(target);
  };

  const next = () => {
    const found = validateStep(step, prep);
    if (Object.keys(found).length > 0) {
      moveFocus.current = "errors";
      setErrors(found);
      return;
    }
    goTo(step + 1);
  };

  const setSelfCheck = <K extends keyof SelfCheck>(key: K, value: SelfCheck[K]) =>
    setPrep((p) => ({
      ...p,
      selfCheck: { ...p.selfCheck, [key]: value },
      resolution: key === "attempted" && value === "sent" ? { ...p.resolution, usedGuide: true } : p.resolution,
    }));

  const toggleSave = (on: boolean) => {
    setSaveOnDevice(on);
    if (on) {
      setSaveStatus(savePrep(safeStorage(), prep) ? "saved" : "unavailable");
      setAnnouncement("Your preparation will be saved on this device.");
    } else {
      clearPrep(safeStorage());
      setSaveStatus("");
      setAnnouncement("Saving turned off. Your preparation has been removed from this device.");
    }
  };

  const clearAll = () => {
    clearPrep(safeStorage());
    setPrep(createEmptyPrep());
    setSaveOnDevice(false);
    setSaveStatus("");
    setStarted(false);
    setStep(1);
    setErrors({});
    setConfirmClear(false);
    setAnnouncement("Your preparation data has been cleared from this browser.");
  };

  const sc = prep.selfCheck;
  const answered = selfCheckQuestions.every(({ key }) => sc[key]) && sc.attempted !== "";
  const overLimitAnswer = sc.underLimit === "no";
  const uncertain = selfCheckQuestions.some(({ key }) => sc[key] === "unsure" || sc[key] === "no");
  const errorList = Object.values(errors);
  const phase = step < REVIEW_STEP ? 0 : step === REVIEW_STEP ? 1 : 2;
  const currentStep = step <= REVIEW_STEP ? STEPS[step - 1] : null;
  const StepBody = currentStep?.Component;
  const stepProps: StepProps = { prep, setPrep, totals, errors, fromRequest };
  const now = new Date();

  return (
    <section
      id="part-2b"
      aria-labelledby={`${uid}-heading`}
      className={`relative -mx-4 mt-16 overflow-hidden border-y border-sky-200/70 bg-gradient-to-b from-sky-50/80 via-white/70 to-white/40 px-4 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-sky-400/15 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900/30 sm:mx-0 sm:mt-20 sm:rounded-[2rem] sm:border sm:p-10 lg:p-12 ${scrollMargin}`}
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* ── Introduction ───────────────────────────────────── */}
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-400/30 dark:bg-white/5 dark:text-sky-300">
          Part 2B
        </p>
        <h2
          id={`${uid}-heading`}
          ref={introRef}
          tabIndex={-1}
          className={`mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-950 outline-none dark:text-white sm:text-5xl ${scrollMargin}`}
        >
          Prepare your Simple Procedure claim
        </h2>
        <div className={`${copyClass} mt-6`}>
          <p>
            If your repayment request has not resolved the matter, you may wish to consider whether the Scottish Simple
            Procedure is appropriate for your circumstances.
          </p>
          <p>
            Simple Procedure can be used for certain civil claims in Scotland, including eligible claims seeking payment
            of £5,000 or less.
          </p>
          <p>
            This guide will help you organise the information you may need before opening the official Scottish Courts
            Civil Online service.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Notice tone="info" icon={<Landmark className="h-4 w-4" aria-hidden="true" />} title="James Square does not submit your claim">
          <p>
            This tool helps you prepare information. Any court claim is made by you directly through the Scottish Courts
            and Tribunals Service.
          </p>
        </Notice>
        <div className="flex items-center">
          <ExternalLink href={LINKS.guide.href} variant="primary" className="w-full sm:w-full">
            Read the official Simple Procedure guidance
          </ExternalLink>
        </div>
      </div>

      {/* ── Before you continue (self-check) ───────────────── */}
      <div className="mt-14">
        <h3 className={h2Class}>Before you continue</h3>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          A quick self-check. This is not a legal eligibility test and cannot tell you whether you have a valid claim.
        </p>
        <div className={`${glassPanel} mt-6 space-y-7 p-5 sm:p-8`}>
          {selfCheckQuestions.map(({ key, label }) => (
            <ChoiceGroup
              key={key}
              legend={label}
              value={sc[key]}
              options={ANSWER_OPTIONS}
              onChange={(v) => setSelfCheck(key, v)}
            />
          ))}
          <ChoiceGroup
            legend="Have you attempted to resolve the matter directly?"
            value={sc.attempted}
            options={[
              { value: "sent", label: "Yes – I sent the repayment request" },
              { value: "yes", label: "Yes – in another way" },
              { value: "no", label: "No" },
            ]}
            onChange={(v) => setSelfCheck("attempted", v)}
          />

          <div aria-live="polite" className="space-y-4">
            {overLimitAnswer ? (
              <OverLimitNotice />
            ) : (
              answered && (
                <>
                  <Notice tone="neutral" icon={<Info className="h-4 w-4" aria-hidden="true" />} title="Based on your answers">
                    <p>
                      Simple Procedure may be something you wish to consider. Please read the official Scottish Courts
                      guidance before deciding whether to make a claim.
                    </p>
                    {uncertain && (
                      <p>You may wish to check the official guidance or obtain independent advice before proceeding.</p>
                    )}
                    {sc.attempted === "no" && (
                      <p>
                        You have not yet tried to resolve the matter directly.{" "}
                        <a href="#part-2" className={`font-semibold text-sky-700 underline underline-offset-4 dark:text-sky-300 ${focusRing}`}>
                          Step 1 – Request your money back
                        </a>{" "}
                        can help you do that first.
                      </p>
                    )}
                  </Notice>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Costs ──────────────────────────────────────────── */}
      <div className="mt-14">
        <h3 className={h2Class}>Court fees and expenses</h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className={`${glassPanel} p-5 sm:p-7`}>
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
              <h4 className="text-lg font-semibold text-slate-950 dark:text-white">Court fee</h4>
            </div>
            <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
              Simple Procedure is not free. A court fee is normally payable when a Simple Procedure claim is submitted,
              although some people may qualify for exemption.
            </p>
            <dl className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/70 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-[15px] text-slate-700 dark:text-slate-300">
                  Money claim of {COURT_FEES.smallMoneyClaimThreshold} or less
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-slate-950 dark:text-white">{COURT_FEES.smallMoneyClaimFee}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-[15px] text-slate-700 dark:text-slate-300">Other Simple Procedure money claims</dt>
                <dd className="text-lg font-semibold tabular-nums text-slate-950 dark:text-white">{COURT_FEES.otherClaimFee}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Fees from {COURT_FEES.effectiveFrom}. Last checked: {SOURCES_CHECKED_ON}. Further fees can apply later, for
              example for service by sheriff officer or enforcement.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <ExternalLink href={LINKS.fees.href} variant="card">
                Check current court fees
              </ExternalLink>
              <ExternalLink href={LINKS.feeExemption.href} variant="card">
                Check whether you may qualify for a fee exemption
              </ExternalLink>
            </div>
          </div>
          <div className={`${glassPanel} p-5 sm:p-7`}>
            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
              <h4 className="text-lg font-semibold text-slate-950 dark:text-white">Expenses</h4>
            </div>
            <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
              <p>
                Depending on the circumstances and outcome of a disputed case, expenses may potentially be awarded. The
                rules vary according to the value and circumstances of the claim.
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                Making a claim is not free of financial risk. Consider the fee, your time and the possibility that you do
                not recover the money.
              </p>
            </div>
            <div className="mt-4">
              <ExternalLink href={LINKS.disputed.href} variant="card">
                Read about expenses
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wizard ─────────────────────────────────────────── */}
      <div className="mt-14">
        <h3 className={h2Class}>Prepare the information for your claim</h3>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-[1.8]">
          Civil Online will ask you for information about yourself, the respondent, what happened, what you want the court
          to do and what evidence supports your position. Complete the sections below and James Square will help organise
          your information before you open the official service.
        </p>

        {!started ? (
          <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-dashed border-slate-300/90 p-5 dark:border-white/15 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
              {overLimitAnswer
                ? "This guide may not be appropriate for claims above the Simple Procedure limit."
                : answered
                  ? "When you are ready, start preparing. You can stop at any time."
                  : "Answer the self-check above to begin."}
            </p>
            <button
              type="button"
              className={primaryButton}
              disabled={!answered || overLimitAnswer}
              onClick={() => {
                setStarted(true);
                moveFocus.current = "step";
                setStep(1);
              }}
            >
              Start preparing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {/* Device storage controls */}
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                <div>
                  <label className="flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={saveOnDevice}
                      onChange={(e) => toggleSave(e.target.checked)}
                      className={`h-5 w-5 rounded border-slate-400 accent-sky-600 ${focusRing}`}
                    />
                    Save my progress on this device
                  </label>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {saveOnDevice
                      ? saveStatus === "unavailable"
                        ? "This browser is not allowing storage, so your progress cannot be saved here."
                        : "Saved on this device. Nothing is sent to James Square."
                      : "Off – your answers are kept only while this page is open. Avoid saving on a shared computer."}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setConfirmClear(true)} className={`${secondaryButton} sm:shrink-0`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear my preparation data
              </button>
            </div>

            {/* Phase indicator */}
            <ol className="mb-6 grid grid-cols-3 gap-2" aria-label="Preparation stages">
              {[
                { label: "Prepare", sub: "Gather and organise your claim" },
                { label: "Review", sub: "See your preparation summary" },
                { label: "Continue", sub: "Open Civil Online" },
              ].map((p, i) => (
                <li
                  key={p.label}
                  aria-current={phase === i ? "step" : undefined}
                  className={`rounded-2xl border px-3 py-3 sm:px-4 ${
                    phase === i
                      ? "border-sky-400 bg-white text-slate-950 shadow-sm dark:border-sky-400/60 dark:bg-slate-900 dark:text-white"
                      : phase > i
                        ? "border-sky-200 bg-sky-50/60 text-slate-700 dark:border-sky-400/20 dark:bg-sky-400/[0.05] dark:text-slate-300"
                        : "border-slate-200 bg-white/40 text-slate-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400"
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {phase > i ? (
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                    ) : (
                      <span className="font-mono text-xs" aria-hidden="true">
                        {i + 1}
                      </span>
                    )}
                    {p.label}
                    {phase > i && <span className="sr-only"> (done)</span>}
                  </p>
                  <p className="mt-0.5 hidden text-xs leading-5 sm:block">{p.sub}</p>
                </li>
              ))}
            </ol>

            <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
              {/* Desktop stepper */}
              <nav aria-label="Preparing your claim" className="hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Preparing your claim
                </p>
                <ol className="mt-3 space-y-1">
                  {STEPS.map((s, i) => {
                    const n = i + 1;
                    const current = n === step;
                    const done = n < step;
                    return (
                      <li key={s.short}>
                        <button
                          type="button"
                          onClick={() => goTo(n)}
                          aria-current={current ? "step" : undefined}
                          className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${focusRing} ${
                            current
                              ? "bg-white font-semibold text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white"
                              : "text-slate-600 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/[0.05]"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              current
                                ? "border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950"
                                : done
                                  ? "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-300"
                                  : "border-slate-300 bg-white text-slate-500 dark:border-white/15 dark:bg-slate-900"
                            }`}
                            aria-hidden="true"
                          >
                            {n}
                          </span>
                          {s.short}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="min-w-0">
                {/* Mobile compact progress */}
                {step <= REVIEW_STEP && (
                  <div className="mb-4 lg:hidden">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Step {step} of {STEPS.length}
                        <span className="font-normal text-slate-600 dark:text-slate-400"> · {STEPS[step - 1].short}</span>
                      </p>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
                      role="progressbar"
                      aria-label="Preparation progress"
                      aria-valuemin={1}
                      aria-valuemax={STEPS.length}
                      aria-valuenow={step}
                    >
                      <div
                        className="h-full rounded-full bg-sky-500 transition-all motion-reduce:transition-none"
                        style={{ width: `${(step / STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className={`${glassPanel} p-4 sm:p-8`}>
                  {currentStep && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                        {step === REVIEW_STEP ? "Review" : `Preparation step ${step}`}
                      </p>
                      <h4
                        ref={stepHeadingRef}
                        tabIndex={-1}
                        className={`mt-2 text-2xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white sm:text-[1.75rem] ${scrollMargin}`}
                      >
                        {currentStep.title}
                      </h4>
                    </>
                  )}

                  {errorList.length > 0 && (
                    <div
                      ref={errorSummaryRef}
                      tabIndex={-1}
                      role="alert"
                      className={`mt-5 rounded-2xl border-2 border-rose-500/80 bg-rose-50/80 p-4 outline-none dark:border-rose-400/60 dark:bg-rose-400/[0.08] ${scrollMargin}`}
                    >
                      <p className="text-[15px] font-semibold text-rose-800 dark:text-rose-200">Please check the following:</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800 dark:text-rose-200">
                        {errorList.map((message) => (
                          <li key={message}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6">
                    {StepBody && <StepBody {...stepProps} />}
                    {step === REVIEW_STEP && (
                      <ReviewSummary
                        prep={prep}
                        totals={totals}
                        now={now}
                        onPrint={setPrintTarget}
                        onEdit={goTo}
                      />
                    )}
                    {step === CONTINUE_STEP && (
                      <ContinueSection
                        headingRef={stepHeadingRef}
                        prep={prep}
                        setPrep={setPrep}
                        totals={totals}
                        onOpen={() => setLeaveOpen(true)}
                      />
                    )}
                  </div>

                  {/* Step navigation */}
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                    {step > 1 ? (
                      <button type="button" onClick={() => goTo(step - 1)} className={secondaryButton}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}
                    {step < REVIEW_STEP && (
                      <button type="button" onClick={next} className={primaryButton}>
                        {step === REVIEW_STEP - 1 ? "Review my preparation" : `Continue to ${STEPS[step].short.toLowerCase()}`}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {step === REVIEW_STEP && (
                      <button type="button" onClick={() => goTo(CONTINUE_STEP)} className={primaryButton}>
                        I’ve reviewed my summary – continue
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AfterSubmission />
      <OfficialResources />

      {/* ── Important information ──────────────────────────── */}
      <aside
        aria-labelledby={`${uid}-important`}
        className="mt-14 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-7"
      >
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <div>
            <h3 id={`${uid}-important`} className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
              Important information
            </h3>
            <div className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              <p>
                This guide provides general information and helps owners organise information they may need if they
                decide to make a Simple Procedure claim.
              </p>
              <p>
                It does not constitute legal advice and does not determine whether you have a valid claim or whether your
                claim will be successful.
              </p>
              <p>
                James Square and the James Square Owners Committee do not submit, manage or represent owners in court
                proceedings.
              </p>
              <p>
                Court procedures, fees, forms and deadlines can change. Always follow the current information provided by
                the Scottish Courts and Tribunals Service and any instructions issued by the court in your individual case.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Dialogs ────────────────────────────────────────── */}
      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear your preparation data?"
        actions={
          <>
            <button type="button" onClick={() => setConfirmClear(false)} className={secondaryButton}>
              Keep my data
            </button>
            <button
              type="button"
              onClick={clearAll}
              className={`${primaryButton} bg-rose-700 hover:bg-rose-800 dark:bg-rose-500 dark:text-white dark:hover:bg-rose-600`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear data
            </button>
          </>
        }
      >
        <p>
          This removes the information saved by this guide from this browser/device and empties the form. It does not
          affect anything submitted separately to Scottish Courts.
        </p>
      </Modal>

      <Modal
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title="Continue to Scottish Courts"
        actions={
          <>
            <button type="button" onClick={() => setLeaveOpen(false)} className={secondaryButton}>
              Stay here
            </button>
            <a
              href={LINKS.civilOnline.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setLeaveOpen(false)}
              className={primaryButton}
            >
              Open Civil Online
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        }
      >
        <p>You are now leaving James-Square.com and opening the official Scottish Courts service.</p>
        <p>The information you prepared here is not automatically transferred.</p>
        <p>Keep this page open if you would like to copy your prepared answers into Civil Online.</p>
        <p>James Square will not receive or have access to your court claim.</p>
      </Modal>

      {printTarget &&
        createPortal(
          <div id="jqs-print-root">
            <PrintDocument kind={printTarget} prep={prep} totals={totals} now={now} />
          </div>,
          document.body,
        )}
    </section>
  );
}

// ── Review ──────────────────────────────────────────────────────────────────

function SummaryBlock({
  title,
  children,
  copyText,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  copyText?: string;
  onEdit?: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{title}</h5>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className={`min-h-11 rounded-full px-3 text-sm font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-400/10 ${focusRing}`}
          >
            Change<span className="sr-only"> {title.toLowerCase()}</span>
          </button>
        )}
      </div>
      <div className="mt-2 text-[15px] leading-7 text-slate-800 dark:text-slate-200">{children}</div>
      {copyText !== undefined && (
        <div className="mt-3">
          <CopyButton label={`Copy ${title.toLowerCase()}`} text={copyText} disabled={!copyText} />
        </div>
      )}
    </section>
  );
}

function Narrative({ text }: { text: string }) {
  return text ? (
    <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{text}</div>
  ) : (
    <p className="italic text-slate-500 dark:text-slate-400">Not yet completed.</p>
  );
}

function ReviewSummary({
  prep,
  totals,
  now,
  onPrint,
  onEdit,
}: {
  prep: ClaimPrep;
  totals: Totals;
  now: Date;
  onPrint: (target: "schedule" | "summary") => void;
  onEdit: (step: number) => void;
}) {
  const background = draftFor(prep, "background", totals);
  const why = draftFor(prep, "why", totals);
  const steps = draftFor(prep, "steps", totals);
  const gathered = prep.evidence.filter((e) => e.checked);
  const missing = prep.evidence.filter((e) => !e.checked);
  const claimant = [tidy(prep.claimant.fullName), tidy(prep.claimant.address), tidy(prep.claimant.postcode).toUpperCase(), tidy(prep.claimant.email)].filter(Boolean);

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        This is a personal preparation pack, not an official court form. Use the copy buttons to paste each part into
        Civil Online.
      </p>
      {totals.overLimit && <OverLimitNotice />}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={() => onPrint("summary")} className={secondaryButton}>
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print preparation summary
        </button>
        <button
          type="button"
          onClick={() => downloadText("claim-preparation-summary.txt", buildSummaryText(prep, new Date(), totals))}
          className={secondaryButton}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download preparation summary
        </button>
      </div>

      <SummaryBlock title="Claimant" onEdit={() => onEdit(1)}>
        {claimant.length ? claimant.map((line) => <p key={line} className="whitespace-pre-line break-words">{line}</p>) : <Narrative text="" />}
      </SummaryBlock>
      <SummaryBlock title="Respondent" onEdit={() => onEdit(2)} copyText={respondentLine(prep)}>
        <Narrative text={respondentLine(prep)} />
      </SummaryBlock>
      <SummaryBlock title="Amount claimed" onEdit={() => onEdit(3)} copyText={totals.claimed ? formatPence(totals.claimed) : ""}>
        <p className="text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">{formatPence(totals.claimed)}</p>
      </SummaryBlock>

      <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Schedule of payments
          </h5>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
            Personal claim preparation document
          </span>
        </div>
        <div className="mt-3">
          <PaymentCards totals={totals} />
        </div>
        <dl className="mt-4 grid gap-1 text-[15px] sm:grid-cols-[1fr_auto]">
          <dt className="text-slate-600 dark:text-slate-400">Total paid</dt>
          <dd className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatPence(totals.totalPaid)}</dd>
          <dt className="text-slate-600 dark:text-slate-400">Amount already returned</dt>
          <dd className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatPence(totals.returned)}</dd>
          <dt className="text-slate-600 dark:text-slate-400">Amount you believe remains outstanding</dt>
          <dd className="font-semibold tabular-nums text-slate-900 dark:text-white">{formatPence(totals.claimed)}</dd>
        </dl>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => onPrint("schedule")} className={secondaryButton}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print schedule
          </button>
          <button
            type="button"
            onClick={() => downloadText("schedule-of-payments.txt", buildScheduleText(prep, new Date(), totals))}
            className={secondaryButton}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download schedule
          </button>
        </div>
      </section>

      <SummaryBlock title="Background to claim" onEdit={() => onEdit(4)} copyText={background}>
        <Narrative text={background} />
      </SummaryBlock>
      <SummaryBlock title="Why I believe the claim should succeed" onEdit={() => onEdit(5)} copyText={why}>
        <Narrative text={why} />
      </SummaryBlock>
      <SummaryBlock title="Attempts to resolve the dispute" onEdit={() => onEdit(6)} copyText={steps}>
        <Narrative text={steps} />
      </SummaryBlock>
      <SummaryBlock title="Evidence prepared" onEdit={() => onEdit(8)}>
        {gathered.length ? (
          <ul className="space-y-1">
            {gathered.map((e) => (
              <li key={e.id} className="flex gap-2">
                <Check className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{e.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-slate-500 dark:text-slate-400">No items marked as gathered yet.</p>
        )}
      </SummaryBlock>
      <SummaryBlock title="Documents still required" onEdit={() => onEdit(8)}>
        {missing.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {missing.map((e) => (
              <li key={e.id}>
                {e.label}
                <span className="sr-only"> (not yet gathered)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>All listed items are marked as gathered.</p>
        )}
      </SummaryBlock>
      <p className="text-xs text-slate-500 dark:text-slate-400">Prepared on {formatPreparedOn(now)}</p>
    </div>
  );
}

// ── Continue ────────────────────────────────────────────────────────────────

function ContinueSection({
  headingRef,
  prep,
  setPrep,
  totals,
  onOpen,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  prep: ClaimPrep;
  setPrep: React.Dispatch<React.SetStateAction<ClaimPrep>>;
  totals: Totals;
  onOpen: () => void;
}) {
  const checkedCount = READINESS_ITEMS.filter((i) => prep.readiness[i.id]).length;
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Continue</p>
        <h4
          ref={headingRef}
          tabIndex={-1}
          className={`mt-2 text-2xl font-semibold tracking-tight text-slate-950 outline-none dark:text-white sm:text-[1.75rem] ${scrollMargin}`}
        >
          Before you continue
        </h4>
        <p className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          These are preparation prompts, not legal declarations.
        </p>
        {totals.overLimit && <OverLimitNotice />}
        <div className="mt-4 space-y-2">
          {READINESS_ITEMS.map((item) => (
            <Checkbox
              key={item.id}
              checked={Boolean(prep.readiness[item.id])}
              onChange={(checked) => setPrep((p) => ({ ...p, readiness: { ...p.readiness, [item.id]: checked } }))}
            >
              {item.label}
            </Checkbox>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
          {checkedCount} of {READINESS_ITEMS.length} checked
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900/10 bg-slate-900 p-6 text-white shadow-lg dark:border-white/10 dark:bg-white/[0.06] sm:p-8">
        <h5 className="text-2xl font-semibold tracking-tight">Ready to continue?</h5>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-200">
          If you decide to make a claim, the next step takes place outside James-Square.com using the official Scottish
          Courts and Tribunals Service.
        </p>
        <button
          type="button"
          onClick={onOpen}
          className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 sm:w-auto ${focusRing}`}
        >
          Start your claim on Civil Online
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="mt-3 text-xs text-slate-300">Opens the official Scottish Courts service in a new tab.</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <ExternalLink href={LINKS.guide.href} variant="card">
          Read the official Simple Procedure guide
        </ExternalLink>
        <ExternalLink href={LINKS.civilOnlineGuide.href} variant="card">
          Civil Online user guide
        </ExternalLink>
        <ExternalLink href={LINKS.form3A.href} variant="card">
          View Form 3A
        </ExternalLink>
        <ExternalLink href={LINKS.forms.href} variant="card">
          View all Simple Procedure forms
        </ExternalLink>
        <ExternalLink href={LINKS.fees.href} variant="card">
          Check court fees
        </ExternalLink>
      </div>

      <Accordion title="Looking for the claim form?" icon={<FileText className="h-5 w-5" aria-hidden="true" />}>
        <div className="space-y-3">
          <p>
            Form 3A is the Simple Procedure Claim Form. However, Scottish Courts currently directs claimants to submit
            Simple Procedure claims electronically through Civil Online.
          </p>
          <p>Paper submission may require the sheriff’s approval where a claimant cannot submit electronically.</p>
          <ExternalLink href={LINKS.form3A.href}>View Form 3A</ExternalLink>
        </div>
      </Accordion>

      <Notice tone="warning" icon={<Receipt className="h-4 w-4" aria-hidden="true" />} title="Remember: account of expenses">
        <p>
          Claimants must lodge an account of expenses before a Simple Procedure case will be decided. See “Important:
          account of expenses” below.
        </p>
      </Notice>
    </div>
  );
}

// ── After submission ────────────────────────────────────────────────────────

function AfterSubmission() {
  return (
    <div className="mt-14">
      <h3 className={h2Class}>What happens after I submit?</h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        A brief overview. Once your claim is registered, the court will give you instructions for your individual case.
      </p>

      <Notice tone="warning" className="mt-6" icon={<ShieldAlert className="h-4 w-4" aria-hidden="true" />} title="Follow the dates issued by the court">
        <p>
          Do not rely on dates calculated by James-Square.com. Once your claim is registered, follow the timetable and
          instructions issued by the sheriff court for your individual case.
        </p>
      </Notice>

      <div className="mt-6 space-y-3">
        <Accordion title="After you submit your claim" icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}>
          <div className="space-y-3">
            <p>The sheriff clerk will check the claim. Issues can include:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Incorrect court.</li>
              <li>Incorrect fee.</li>
              <li>Missing information.</li>
              <li>Claim outside the scope of Simple Procedure.</li>
              <li>Other procedural issues.</li>
            </ul>
            <p>
              If accepted, the claim receives a court reference and the court issues further information, including the
              relevant timetable and deadlines.
            </p>
          </div>
        </Accordion>

        <Accordion title="How does FIOR receive the court claim?" icon={<Mailbox className="h-5 w-5" aria-hidden="true" />}>
          <div className="space-y-3">
            <p>
              Your earlier repayment request is <strong>not</strong> the same as formal service of a court claim. Simple
              Procedure has formal rules about how the claim is delivered (“served”) to the respondent.
            </p>
            <p>
              For individual claimants, the sheriff clerk may be able to arrange service, normally initially by recorded
              delivery, depending on the circumstances and current procedure. If service is unsuccessful, additional
              steps – and potentially sheriff officer fees – may be required.
            </p>
            <ExternalLink href={LINKS.howToClaim.href}>Read official guidance about making and serving a claim</ExternalLink>
          </div>
        </Accordion>

        <Accordion title="What if there is no response?" icon={<Gavel className="h-5 w-5" aria-hidden="true" />} tone="important">
          <div className="space-y-3">
            <p className="font-semibold text-slate-900 dark:text-white">No response does not mean you automatically win.</p>
            <p>
              If the respondent does not provide the required response by the deadline set by the court, you may need to
              take a further step to ask the sheriff to make a decision, using an{" "}
              <strong>Application for a Decision (Form 7A)</strong>.
            </p>
            <p>
              There is a specific deadline for doing this. Current SCTS guidance states that the application must be sent
              within two weeks of the last date for a response – and that if it is not, the sheriff will dismiss the
              claim. An account of expenses must be lodged with it.
            </p>
            <p className="font-semibold text-slate-900 dark:text-white">
              Always use the dates provided by the court in your individual case.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              <ExternalLink href={LINKS.noResponse.href}>View official guidance</ExternalLink>
              <ExternalLink href={LINKS.form7A.href}>View Form 7A</ExternalLink>
            </div>
          </div>
        </Accordion>

        <Accordion title="Important: account of expenses" icon={<WalletCards className="h-5 w-5" aria-hidden="true" />} tone="important">
          <div className="space-y-3">
            <p>
              Scottish Courts introduced an additional requirement for Simple Procedure claimants from 21 May 2025.
              Claimants are required to lodge an account of expenses before the case can be decided.
            </p>
            <p>
              SCTS provides a pro forma account of expenses for claimants who are not legally represented. SCTS guidance
              gives, as examples, lodging it with an Application for a Decision or a Time to Pay Notice, and says failing
              to do so may result in an application being rejected. The precise point at which it must be lodged depends
              on how your case progresses.
            </p>
            <p>Follow the current SCTS guidance and any instructions issued by the court in your individual case.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              <ExternalLink href={LINKS.expensesGuidance.href}>Read the current SCTS expenses guidance</ExternalLink>
              <ExternalLink href={LINKS.expensesProForma.href}>Open the account of expenses form</ExternalLink>
            </div>
          </div>
        </Accordion>

        <Accordion title="What if FIOR disputes the claim?" icon={<Users className="h-5 w-5" aria-hidden="true" />}>
          <div className="space-y-3">
            <p>
              A disputed claim does not necessarily mean a traditional court trial takes place straight away. Depending on
              the case, the sheriff may consider various procedural options, including:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Case management.</li>
              <li>Alternative dispute resolution.</li>
              <li>A hearing.</li>
              <li>Whether a decision can be made without a hearing.</li>
            </ul>
            <p>James Square cannot predict what will happen in your case.</p>
            <ExternalLink href={LINKS.disputed.href}>What happens in a disputed Simple Procedure case?</ExternalLink>
          </div>
        </Accordion>

        <Accordion title="Evidence for a hearing" icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}>
          <div className="space-y-3">
            <p>
              If the case proceeds to a hearing, there are formal rules for lodging evidence, including{" "}
              <strong>Form 10A – List of Evidence</strong>. Current guidance indicates the list and the evidence must be
              sent to the court and the other party at least 14 days before the hearing.
            </p>
            <p>The evidence checklist on this page does not satisfy the court’s requirements.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              <ExternalLink href={LINKS.form10A.href}>View Form 10A</ExternalLink>
              <ExternalLink href={LINKS.forms.href}>View all Simple Procedure forms</ExternalLink>
            </div>
          </div>
        </Accordion>

        <Accordion title="What if the court orders payment but I still don’t receive it?" icon={<Scale className="h-5 w-5" aria-hidden="true" />}>
          <div className="space-y-3">
            <p>
              A court decision ordering payment does not necessarily result in the money being transferred automatically.
              If payment is not made, further enforcement action may be required.
            </p>
            <p>
              Enforcement is generally the responsibility of the successful party – it is not something James Square or
              the court automatically does for you – and it usually involves a sheriff officer and further costs.
            </p>
            <ExternalLink href={LINKS.enforcement.href}>Read the official enforcement guidance</ExternalLink>
          </div>
        </Accordion>
      </div>
    </div>
  );
}

// ── Official resources ──────────────────────────────────────────────────────

const RESOURCES = [
  LINKS.simpleProcedure,
  LINKS.howToClaim,
  LINKS.civilOnline,
  LINKS.civilOnlineGuide,
  LINKS.form3A,
  LINKS.forms,
  LINKS.fees,
  LINKS.feeExemption,
  LINKS.disputed,
  LINKS.enforcement,
];

function OfficialResources() {
  return (
    <div className="mt-14">
      <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        <ExternalIcon className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
        Official Scottish Courts resources
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        External links to the Scottish Courts and Tribunals Service. They open in a new tab.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {RESOURCES.map((link) => (
          <li key={link.href}>
            <ExternalLink href={link.href} variant="card" className="h-full">
              {link.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Print ───────────────────────────────────────────────────────────────────

function PrintDocument({
  kind,
  prep,
  totals,
  now,
}: {
  kind: "schedule" | "summary";
  prep: ClaimPrep;
  totals: Totals;
  now: Date;
}) {
  const claimantAddress = [tidy(prep.claimant.address).replace(/\n+/g, ", "), tidy(prep.claimant.postcode).toUpperCase()]
    .filter(Boolean)
    .join(", ");
  const schedule = (
    <>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {totals.validPayments.length ? (
            totals.validPayments.map((row) => (
              <tr key={row.id}>
                <td>{row.date.split("-").reverse().join("/")}</td>
                <td>{formatPence(row.pence)}</td>
                <td>{row.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No payments listed.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total paid: {formatPence(totals.totalPaid)}</p>
      <p>Amount already returned: {formatPence(totals.returned)}</p>
      <p>Amount owner believes remains outstanding: {formatPence(totals.claimed)}</p>
    </>
  );

  return (
    <article className="jqs-print-doc">
      <p className="jqs-print-label">Personal claim preparation document – not an official court document</p>
      <h1>{kind === "schedule" ? "Schedule of payments" : "Claim preparation summary"}</h1>
      <p>Owner: {prep.claimant.fullName || "—"}</p>
      <p>Property: {claimantAddress || "—"}</p>
      <p>Respondent: {respondentLine(prep) || "—"}</p>
      <p>Amount claimed: {formatPence(totals.claimed)}</p>
      {kind === "schedule" ? (
        schedule
      ) : (
        <>
          <h2>Payment breakdown</h2>
          {schedule}
          <h2>Background to claim</h2>
          <p className="jqs-pre">{draftFor(prep, "background", totals) || "Not yet completed."}</p>
          <h2>Why I believe the claim should succeed</h2>
          <p className="jqs-pre">{draftFor(prep, "why", totals) || "Not yet completed."}</p>
          <h2>Attempts to resolve the dispute</h2>
          <p className="jqs-pre">{draftFor(prep, "steps", totals) || "Not yet completed."}</p>
          <h2>Evidence prepared</h2>
          <ul>{prep.evidence.filter((e) => e.checked).map((e) => <li key={e.id}>{e.label}</li>)}</ul>
          <h2>Documents still required</h2>
          <ul>{prep.evidence.filter((e) => !e.checked).map((e) => <li key={e.id}>{e.label}</li>)}</ul>
        </>
      )}
      <p className="jqs-print-footer">Prepared on {formatPreparedOn(now)}</p>
    </article>
  );
}

