"use client";

import { useId, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Calculator,
  FolderLock,
  Info,
  PencilLine,
  Percent,
  Plus,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  TEXT_LIMITS,
  draftFor,
  draftOverTarget,
  emptyPayment,
  findSensitiveTerms,
  formatLongDate,
  formatPence,
  newId,
  sanitiseMoneyInput,
  toPence,
  type ClaimPrep,
  type DraftKey,
  type FieldErrors,
  type Totals,
} from "./claimPrep";
import CompanyStatusNotice from "./CompanyStatusNotice";
import { FIOR_COMPANY, LINKS, NARRATIVE_CHARACTER_TARGET, SOURCES_CHECKED_ON } from "./claimPrepSources";
import {
  AddressSuggestion,
  Checkbox,
  ChoiceGroup,
  CopyButton,
  ExternalLink,
  Field,
  FieldError,
  Notice,
  describedBy,
  focusRing,
  inputBorder,
  inputClass,
  secondaryButton,
} from "./ui";

export type RequestPrefill = { fullName: string; address: string; email: string; amount: string };

export type StepProps = {
  prep: ClaimPrep;
  setPrep: React.Dispatch<React.SetStateAction<ClaimPrep>>;
  totals: Totals;
  errors: FieldErrors;
  fromRequest?: RequestPrefill;
};

const YES_NO_OPTIONS = [
  { value: "yes" as const, label: "Yes" },
  { value: "no" as const, label: "No" },
];

const subHeading = "text-lg font-semibold tracking-tight text-slate-950 dark:text-white";

function useSection<K extends "claimant" | "respondent" | "story" | "resolution">(
  setPrep: StepProps["setPrep"],
  key: K,
) {
  return <F extends keyof ClaimPrep[K]>(field: F, value: ClaimPrep[K][F]) =>
    setPrep((p) => ({ ...p, [key]: { ...p[key], [field]: value } }));
}

function TextInput({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint: Boolean(hint), error })}
        className={`${inputClass} ${inputBorder(error)}`}
        {...rest}
      />
    </Field>
  );
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative sm:max-w-xs">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base font-semibold text-slate-500 dark:text-slate-400"
          aria-hidden="true"
        >
          £
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(sanitiseMoneyInput(e.target.value))}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { hint: Boolean(hint), error })}
          className={`${inputClass} ${inputBorder(error)} pl-9 tabular-nums`}
        />
      </div>
    </Field>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  hint,
  max = TEXT_LIMITS.story,
  rows = 4,
  optional = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  max?: number;
  rows?: number;
  optional?: boolean;
}) {
  return (
    <Field id={id} label={label} hint={hint} optional={optional}>
      <textarea
        id={id}
        rows={rows}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={[hint && `${id}-hint`, `${id}-count`].filter(Boolean).join(" ")}
        className={`${inputClass} border-slate-300 dark:border-white/15 min-h-28 resize-y leading-7`}
      />
      <p id={`${id}-count`} className="mt-1.5 text-right text-xs text-slate-500 dark:text-slate-400">
        {value.length.toLocaleString("en-GB")} of {max.toLocaleString("en-GB")} characters
      </p>
    </Field>
  );
}

function DateInput({
  id,
  label,
  value,
  onChange,
  error,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}) {
  return (
    <Field id={id} label={label} error={error} optional={optional}>
      <input
        id={id}
        type="date"
        min="1990-01-01"
        max="2100-12-31"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error })}
        className={`${inputClass} ${inputBorder(error)} min-h-12 appearance-none sm:max-w-xs`}
      />
    </Field>
  );
}

/** Generated draft with copy, edit and a live character count. */
export function DraftPanel({
  title,
  draftKey,
  prep,
  setPrep,
  totals,
  emptyMessage,
  copyLabel = "Copy answer",
}: {
  title: string;
  draftKey: DraftKey;
  prep: ClaimPrep;
  setPrep: StepProps["setPrep"];
  totals: Totals;
  emptyMessage: string;
  copyLabel?: string;
}) {
  const uid = useId();
  const [editing, setEditing] = useState(false);
  const text = draftFor(prep, draftKey, totals);
  const edited = prep.drafts[draftKey] !== undefined;
  const over = draftOverTarget(text);
  const flagged = findSensitiveTerms(text);

  const setDraft = (value: string | undefined) =>
    setPrep((p) => {
      const drafts = { ...p.drafts };
      if (value === undefined) delete drafts[draftKey];
      else drafts[draftKey] = value.slice(0, TEXT_LIMITS.draft);
      return { ...p, drafts };
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200/80 bg-white/80 dark:border-sky-400/20 dark:bg-slate-950/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-sky-50/70 px-5 py-3 dark:border-sky-400/15 dark:bg-sky-400/[0.06]">
        <h4 id={`${uid}-title`} className="text-[15px] font-semibold text-slate-900 dark:text-white">
          {title}
        </h4>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {edited ? "Edited by you" : "Generated from your answers"}
        </span>
      </div>
      <div className="px-5 py-4">
        {editing ? (
          <>
            <label htmlFor={`${uid}-edit`} className="sr-only">
              Edit {title}
            </label>
            <textarea
              id={`${uid}-edit`}
              rows={10}
              maxLength={TEXT_LIMITS.draft}
              value={text}
              onChange={(e) => setDraft(e.target.value)}
              aria-describedby={`${uid}-count`}
              className={`${inputClass} border-slate-300 dark:border-white/15 min-h-60 resize-y leading-7`}
            />
          </>
        ) : text ? (
          <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-800 [overflow-wrap:anywhere] dark:text-slate-200">
            {text}
          </div>
        ) : (
          <p className="text-sm italic text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        )}
        <p
          id={`${uid}-count`}
          className={`mt-3 text-xs ${over ? "font-semibold text-amber-800 dark:text-amber-300" : "text-slate-500 dark:text-slate-400"}`}
        >
          {text.length.toLocaleString("en-GB")} of {NARRATIVE_CHARACTER_TARGET.toLocaleString("en-GB")} characters
          {over && " – consider shortening this so it fits comfortably into Civil Online."}
        </p>
        {flagged.length > 0 && (
          <Notice
            tone="warning"
            className="mt-3"
            icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
            title="Consider rewording"
          >
            <p>
              Your text includes words such as “{flagged.join("”, “")}”. A civil claim is about whether money is owed.
              Describing what happened factually, without alleging a crime, is usually clearer and avoids statements you
              may be asked to prove.
            </p>
          </Notice>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton label={copyLabel} text={text} disabled={!text} />
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            aria-expanded={editing}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08] ${focusRing}`}
          >
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            {editing ? "Done editing" : "Edit"}
          </button>
          {edited && (
            <button
              type="button"
              onClick={() => {
                setDraft(undefined);
                setEditing(false);
              }}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] ${focusRing}`}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset to generated draft
            </button>
          )}
        </div>
        {edited && (
          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Because you have edited this draft, later changes to your answers will not update it until you reset it.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 1 ──────────────────────────────────────────────────────────────────

export function StepDetails({ prep, setPrep, errors, fromRequest }: StepProps) {
  const uid = useId();
  const set = useSection(setPrep, "claimant");
  const c = prep.claimant;
  const canPrefill = Boolean(fromRequest && (fromRequest.fullName || fromRequest.address || fromRequest.email));
  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        These are your details as the <strong className="font-semibold text-slate-900 dark:text-white">claimant</strong> –
        the person making the claim. Civil Online will ask for them when you start your claim.
      </p>
      {canPrefill && (
        <button
          type="button"
          onClick={() =>
            setPrep((p) => ({
              ...p,
              claimant: {
                ...p.claimant,
                fullName: p.claimant.fullName || fromRequest!.fullName,
                address: p.claimant.address || fromRequest!.address,
                email: p.claimant.email || fromRequest!.email,
              },
            }))
          }
          className={secondaryButton}
        >
          <UserRound className="h-4 w-4" aria-hidden="true" />
          Use the details from my repayment request
        </button>
      )}
      <TextInput
        id={`${uid}-fullName`}
        label="Full name"
        autoComplete="name"
        maxLength={TEXT_LIMITS.short}
        value={c.fullName}
        onChange={(v) => set("fullName", v)}
        error={errors.fullName}
      />
      <Field
        id={`${uid}-address`}
        label="Postal address"
        hint="Your address for court correspondence, without the postcode."
        error={errors.address}
      >
        <textarea
          id={`${uid}-address`}
          rows={3}
          autoComplete="street-address"
          maxLength={TEXT_LIMITS.address}
          value={c.address}
          onChange={(e) => set("address", e.target.value)}
          aria-invalid={errors.address ? true : undefined}
          aria-describedby={describedBy(`${uid}-address`, { hint: true, error: errors.address })}
          className={`${inputClass} ${inputBorder(errors.address)} resize-y leading-7`}
        />
        <AddressSuggestion inputId={`${uid}-address`} value={c.address} onAccept={(v) => set("address", v)} />
      </Field>
      <TextInput
        id={`${uid}-postcode`}
        label="Postcode"
        autoComplete="postal-code"
        autoCapitalize="characters"
        maxLength={10}
        value={c.postcode}
        onChange={(v) => set("postcode", v)}
        error={errors.postcode}
        className={`${inputClass} ${inputBorder(errors.postcode)} uppercase sm:max-w-[12rem]`}
      />
      <TextInput
        id={`${uid}-email`}
        label="Email address"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={254}
        value={c.email}
        onChange={(v) => set("email", v)}
        error={errors.email}
      />
    </div>
  );
}

// ── Step 2 ──────────────────────────────────────────────────────────────────

export function StepRespondent({ prep, setPrep }: StepProps) {
  const uid = useId();
  const set = useSection(setPrep, "respondent");
  const r = prep.respondent;
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        <p>
          It is important that a court claim identifies the correct person or legal organisation. For a company, this
          can include:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Full legal company name</li>
          <li>Company registration number</li>
          <li>Registered or appropriate service address</li>
          <li>Trading name, if applicable</li>
        </ul>
        <p>
          Owners generally dealt with a limited company rather than an individual. Do not assume that a director or
          employee is personally responsible for a company’s debts.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-200 dark:ring-white/10">
            <Building2 className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h4 className={subHeading}>FIOR company details</h4>
        </div>
        <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Legal name</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-white">{FIOR_COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Company number</dt>
            <dd className="mt-1 font-mono font-medium text-slate-900 dark:text-white">{FIOR_COMPANY.companyNumber}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Registered office address
            </dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-white">{FIOR_COMPANY.registeredOffice}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Source: Companies House register. These details were last checked on {SOURCES_CHECKED_ON}. Verify them on the live
          register before submitting your claim. The legal name is different from “FIOR Property Assets”, the name used elsewhere on this
          page.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ExternalLink href={FIOR_COMPANY.companiesHouseUrl} variant="secondary">
            View current Companies House record
          </ExternalLink>
          <button
            type="button"
            onClick={() =>
              setPrep((p) => ({
                ...p,
                respondent: {
                  ...p.respondent,
                  name: FIOR_COMPANY.legalName,
                  companyNumber: FIOR_COMPANY.companyNumber,
                  address: FIOR_COMPANY.registeredOffice,
                },
              }))
            }
            className={secondaryButton}
          >
            Use these details below
          </button>
        </div>
      </div>

      <CompanyStatusNotice />

      <div className="space-y-6">
        <h4 className={subHeading}>Respondent details for your claim</h4>
        <p className="-mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          You are responsible for confirming the correct legal identity and address of the person or organisation you
          are claiming against.
        </p>
        <TextInput id={`${uid}-name`} label="Legal name" maxLength={TEXT_LIMITS.short} value={r.name} onChange={(v) => set("name", v)} />
        <TextInput
          id={`${uid}-number`}
          label="Company registration number"
          optional
          maxLength={20}
          value={r.companyNumber}
          onChange={(v) => set("companyNumber", v)}
          className={`${inputClass} border-slate-300 dark:border-white/15 font-mono uppercase sm:max-w-[14rem]`}
        />
        <Field id={`${uid}-address`} label="Registered or service address">
          <textarea
            id={`${uid}-address`}
            rows={3}
            maxLength={TEXT_LIMITS.address}
            value={r.address}
            onChange={(e) => set("address", e.target.value)}
            className={`${inputClass} border-slate-300 dark:border-white/15 resize-y leading-7`}
          />
        </Field>
        <TextInput
          id={`${uid}-trading`}
          label="Trading name"
          optional
          maxLength={TEXT_LIMITS.short}
          value={r.tradingName}
          onChange={(v) => set("tradingName", v)}
        />
      </div>

      <Notice tone="neutral" icon={<Info className="h-4 w-4" aria-hidden="true" />} title="Which sheriff court?">
        <p>
          Civil Online will ask which sheriff court your claim should go to. SCTS guidance says that in most cases this is
          the court for the area where the respondent lives or has a place of business.{" "}
          <ExternalLink href={LINKS.howToClaim.href}>Read how to make a claim</ExternalLink>
        </p>
      </Notice>
    </div>
  );
}

// ── Step 3 ──────────────────────────────────────────────────────────────────

export function StepAmount({ prep, setPrep, totals, errors }: StepProps) {
  const uid = useId();
  const setRow = (id: string, field: "date" | "amount" | "description", value: string) =>
    setPrep((p) => ({ ...p, payments: p.payments.map((row) => (row.id === id ? { ...row, [field]: value } : row)) }));
  const removeRow = (id: string) =>
    setPrep((p) => {
      const payments = p.payments.filter((row) => row.id !== id);
      return { ...p, payments: payments.length ? payments : [emptyPayment()] };
    });
  const mismatch = totals.stated !== null && totals.totalPaid > 0 && totals.stated !== totals.calculatedOutstanding;

  return (
    <div className="space-y-8">
      <MoneyInput
        id={`${uid}-stated`}
        label="Amount you believe remains outstanding"
        hint="If you leave this blank, the figure calculated from your payments below is used."
        optional
        value={prep.statedOutstanding}
        onChange={(v) => setPrep((p) => ({ ...p, statedOutstanding: v }))}
        error={errors.statedOutstanding}
      />

      <div>
        <h4 className={subHeading}>Break down the amount</h4>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          List each payment separately, for example each Direct Debit or a payment towards proposed works.
        </p>
        <ol className="mt-4 space-y-3">
          {prep.payments.map((row, i) => {
            const e = {
              date: errors[`${row.id}-date`],
              amount: errors[`${row.id}-amount`],
              description: errors[`${row.id}-description`],
            };
            const base = `${uid}-${row.id}`;
            return (
              <li
                key={row.id}
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Payment {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06] ${focusRing}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove<span className="sr-only"> payment {i + 1}</span>
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,9rem)_minmax(0,1fr)]">
                  <div>
                    <label htmlFor={`${base}-date`} className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Date
                    </label>
                    <input
                      id={`${base}-date`}
                      type="date"
                      min="1990-01-01"
                      max="2100-12-31"
                      value={row.date}
                      onChange={(ev) => setRow(row.id, "date", ev.target.value)}
                      aria-invalid={e.date ? true : undefined}
                      aria-describedby={e.date ? `${base}-date-error` : undefined}
                      className={`${inputClass} ${inputBorder(e.date)} mt-1.5 min-h-12 appearance-none`}
                    />
                    {e.date && <FieldError id={`${base}-date-error`} message={e.date} />}
                  </div>
                  <div>
                    <label htmlFor={`${base}-amount`} className="block text-sm font-semibold text-slate-900 dark:text-white">
                      Amount
                    </label>
                    <div className="relative mt-1.5">
                      <span
                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-semibold text-slate-500 dark:text-slate-400"
                        aria-hidden="true"
                      >
                        £
                      </span>
                      <input
                        id={`${base}-amount`}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(ev) => setRow(row.id, "amount", sanitiseMoneyInput(ev.target.value))}
                        aria-invalid={e.amount ? true : undefined}
                        aria-describedby={e.amount ? `${base}-amount-error` : undefined}
                        className={`${inputClass} ${inputBorder(e.amount)} pl-8 tabular-nums`}
                      />
                    </div>
                    {e.amount && <FieldError id={`${base}-amount-error`} message={e.amount} />}
                  </div>
                  <div>
                    <label htmlFor={`${base}-desc`} className="block text-sm font-semibold text-slate-900 dark:text-white">
                      What was the payment for?
                    </label>
                    <input
                      id={`${base}-desc`}
                      type="text"
                      maxLength={TEXT_LIMITS.short}
                      placeholder="e.g. Direct Debit"
                      value={row.description}
                      onChange={(ev) => setRow(row.id, "description", ev.target.value)}
                      aria-invalid={e.description ? true : undefined}
                      aria-describedby={e.description ? `${base}-desc-error` : undefined}
                      className={`${inputClass} ${inputBorder(e.description)} mt-1.5`}
                    />
                    {e.description && <FieldError id={`${base}-desc-error`} message={e.description} />}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={() => setPrep((p) => ({ ...p, payments: [...p.payments, emptyPayment()] }))}
          className={`${secondaryButton} mt-4`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add another payment
        </button>
        <p className="mt-4 text-[15px] font-semibold text-slate-900 dark:text-white" aria-live="polite">
          Total payments listed: <span className="tabular-nums">{formatPence(totals.totalPaid)}</span>
        </p>
      </div>

      <ChoiceGroup
        legend="Has any money already been returned?"
        value={prep.anyReturned}
        options={YES_NO_OPTIONS}
        onChange={(v) => setPrep((p) => ({ ...p, anyReturned: v }))}
      />
      {prep.anyReturned === "yes" && (
        <MoneyInput
          id={`${uid}-returned`}
          label="Amount returned"
          value={prep.returnedAmount}
          onChange={(v) => setPrep((p) => ({ ...p, returnedAmount: v }))}
          error={errors.returnedAmount}
        />
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Amount you believe remains outstanding
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-950 dark:text-white">
              {formatPence(totals.claimed)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {totals.stated !== null ? "Your own figure. " : ""}Calculated from your entries:{" "}
              {formatPence(totals.totalPaid)} paid − {formatPence(totals.returned)} returned ={" "}
              {formatPence(totals.calculatedOutstanding)}. This is simple arithmetic based on the information you have
              entered. It is not a legal determination of what you are entitled to recover.
            </p>
            {mismatch && (
              <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                Your own figure differs from the calculation. Check which is correct before continuing.
              </p>
            )}
          </div>
        </div>
      </div>

      {totals.overLimit && <OverLimitNotice />}
    </div>
  );
}

export function OverLimitNotice() {
  return (
    <Notice tone="warning" icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />} title="Above the Simple Procedure limit">
      <p>
        The amount you have entered is above the current Simple Procedure monetary limit. This guide may therefore not
        be appropriate for your claim.
      </p>
      <p>
        <ExternalLink href={LINKS.simpleProcedure.href}>Read the official SCTS Simple Procedure information</ExternalLink>
      </p>
    </Notice>
  );
}

// ── Step 4 ──────────────────────────────────────────────────────────────────

const storyQuestions: { key: keyof ClaimPrep["story"]; label: string; hint?: string }[] = [
  { key: "whenPaid", label: "When were the relevant payments made?" },
  { key: "toldFor", label: "What were you told the payments were for?" },
  { key: "afterwards", label: "What happened afterwards?" },
  { key: "problemWhen", label: "When did you first believe there was a problem?" },
  { key: "whyReturn", label: "Why do you believe the money should be returned?" },
  {
    key: "partReturned",
    label: "Has any part of the money been returned?",
    hint: "The amount from Step 3 is included automatically. Add details such as when it was returned, if helpful.",
  },
  { key: "other", label: "Is there anything else important to the background?" },
];

export function StepStory({ prep, setPrep, totals }: StepProps) {
  const uid = useId();
  const set = useSection(setPrep, "story");
  return (
    <div className="space-y-6">
      <Notice tone="info" icon={<Info className="h-4 w-4" aria-hidden="true" />} title="Keep it factual and chronological">
        <p>Concentrate on the important events rather than including every detail. Dates and amounts help.</p>
      </Notice>
      {storyQuestions.map(({ key, label, hint }) => (
        <TextArea
          key={key}
          id={`${uid}-${key}`}
          label={label}
          hint={hint}
          value={prep.story[key]}
          onChange={(v) => set(key, v)}
          rows={3}
        />
      ))}
      <DraftPanel
        title="Draft: Background to your claim"
        draftKey="background"
        prep={prep}
        setPrep={setPrep}
        totals={totals}
        copyLabel="Copy background"
        emptyMessage="Answer the questions above and your draft will appear here."
      />
    </div>
  );
}

// ── Step 5 ──────────────────────────────────────────────────────────────────

export function StepWhy({ prep, setPrep, totals }: StepProps) {
  const uid = useId();
  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        This is separate from the background. Explain, in your own words, the reason you believe the money is due to you
        – for example, what the payment was for and why that reason no longer applies.
      </p>
      <TextArea
        id={`${uid}-why`}
        label="In your own words, why do you believe FIOR should return this money?"
        value={prep.why}
        onChange={(v) => setPrep((p) => ({ ...p, why: v }))}
        max={TEXT_LIMITS.why}
        rows={6}
        optional={false}
      />
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
        James Square only organises your own words and the figures you entered. It does not add legal arguments or refer
        to laws. If you want legal arguments included, consider independent advice.
      </p>
      <DraftPanel
        title="Draft: Why I believe the claim should succeed"
        draftKey="why"
        prep={prep}
        setPrep={setPrep}
        totals={totals}
        emptyMessage="Enter your explanation above and your draft will appear here."
      />
    </div>
  );
}

// ── Step 6 ──────────────────────────────────────────────────────────────────

export function StepResolution({ prep, setPrep, totals, errors, fromRequest }: StepProps) {
  const uid = useId();
  const set = useSection(setPrep, "resolution");
  const r = prep.resolution;
  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        Simple Procedure asks about steps already taken to try to resolve the dispute.
      </p>
      <Checkbox
        checked={r.usedGuide}
        onChange={(checked) =>
          setPrep((p) => ({
            ...p,
            resolution: {
              ...p.resolution,
              usedGuide: checked,
              amountRequested: p.resolution.amountRequested || (checked && fromRequest?.amount ? sanitiseMoneyInput(fromRequest.amount) : ""),
            },
          }))
        }
      >
        <span className="font-semibold">I sent a repayment request using the James Square guide</span>
        <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">
          Only tick this if you actually sent the email from your own email account.
        </span>
      </Checkbox>

      {r.usedGuide && (
        <div className="space-y-6 border-l-2 border-sky-300 pl-4 dark:border-sky-400/40 sm:pl-6">
          <DateInput id={`${uid}-sent`} label="Date sent" value={r.sentDate} onChange={(v) => set("sentDate", v)} error={errors.sentDate} />
          <MoneyInput
            id={`${uid}-requested`}
            label="Amount you requested"
            optional
            value={r.amountRequested}
            onChange={(v) => set("amountRequested", v)}
            error={errors.amountRequested}
          />
          <ChoiceGroup legend="Did FIOR respond?" value={r.responded} options={YES_NO_OPTIONS} onChange={(v) => set("responded", v)} />
          {r.responded === "yes" && (
            <>
              <DateInput
                id={`${uid}-responded`}
                label="Date of response"
                optional
                value={r.responseDate}
                onChange={(v) => set("responseDate", v)}
                error={errors.responseDate}
              />
              <TextArea
                id={`${uid}-response`}
                label="What was the response?"
                hint="A short, neutral summary. Keep the original response as evidence."
                value={r.responseSummary}
                onChange={(v) => set("responseSummary", v)}
              />
            </>
          )}
          <ChoiceGroup legend="Was any payment made?" value={r.paymentMade} options={YES_NO_OPTIONS} onChange={(v) => set("paymentMade", v)} />
          {r.paymentMade === "yes" && (
            <MoneyInput
              id={`${uid}-paid`}
              label="Amount paid"
              value={r.paymentAmount}
              onChange={(v) => set("paymentAmount", v)}
              error={errors.paymentAmount}
            />
          )}
        </div>
      )}

      <TextArea
        id={`${uid}-other`}
        label="Any other steps you have taken to resolve the matter"
        hint="For example, earlier emails, letters or phone calls, with dates."
        value={r.otherSteps}
        onChange={(v) => set("otherSteps", v)}
      />

      <DraftPanel
        title="Draft: Steps taken to resolve the dispute"
        draftKey="steps"
        prep={prep}
        setPrep={setPrep}
        totals={totals}
        emptyMessage="Tell us what you have done to resolve the matter and your draft will appear here."
      />
    </div>
  );
}

export function validateResolution(prep: ClaimPrep): FieldErrors {
  const r = prep.resolution;
  const errors: FieldErrors = {};
  if (!r.usedGuide) return errors;
  if (!formatLongDate(r.sentDate)) errors.sentDate = "Enter the date you sent your repayment request.";
  if (r.amountRequested.trim() && toPence(r.amountRequested) === null) errors.amountRequested = "Enter an amount such as 338.00.";
  if (r.responded === "yes" && r.responseDate && !formatLongDate(r.responseDate)) errors.responseDate = "Enter a valid date.";
  if (r.paymentMade === "yes" && toPence(r.paymentAmount) === null) errors.paymentAmount = "Enter the amount paid, for example 50.00.";
  return errors;
}

// ── Step 7 ──────────────────────────────────────────────────────────────────

export function PaymentCards({ totals }: { totals: Totals }) {
  if (totals.validPayments.length === 0) {
    return <p className="text-sm italic text-slate-500 dark:text-slate-400">No complete payments listed yet (Step 3).</p>;
  }
  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
      <li className="hidden grid-cols-[8rem_7rem_minmax(0,1fr)] gap-4 bg-slate-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:bg-white/[0.04] dark:text-slate-400 sm:grid" aria-hidden="true">
        <span>Date</span>
        <span className="text-right">Amount</span>
        <span>Reason</span>
      </li>
      {totals.validPayments.map((row) => (
        <li key={row.id} className="grid gap-1 px-4 py-3 text-[15px] sm:grid-cols-[8rem_7rem_minmax(0,1fr)] sm:gap-4">
          <span className="text-slate-600 dark:text-slate-300">
            <span className="sr-only">Date: </span>
            {formatLongDate(row.date)}
          </span>
          <span className="font-semibold tabular-nums text-slate-900 dark:text-white sm:text-right">
            <span className="sr-only">Amount: </span>
            {formatPence(row.pence)}
          </span>
          <span className="break-words text-slate-700 [overflow-wrap:anywhere] dark:text-slate-300">
            <span className="sr-only">Reason: </span>
            {row.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StepCourtRequest({ totals }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        Civil Online will ask what you want the court to do – the order you are asking for. For money you believe is owed,
        the relevant type may be:
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Order requested</p>
        <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">Payment of a sum of money</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Amount</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-950 dark:text-white">
          {formatPence(totals.claimed)}
        </p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Breakdown</p>
        <div className="mt-2">
          <PaymentCards totals={totals} />
        </div>
      </div>
      {totals.overLimit && <OverLimitNotice />}

      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        Civil Online may also ask about <strong className="font-semibold text-slate-900 dark:text-white">interest</strong> and{" "}
        <strong className="font-semibold text-slate-900 dark:text-white">expenses</strong>. These are decisions for you –
        this guide does not make them for you.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <Percent className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <div className="space-y-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
            <h4 className="font-semibold text-slate-900 dark:text-white">Interest</h4>
            <p>Civil Online may ask whether you are seeking interest on the amount claimed.</p>
            <p>
              The Civil Online service will allow you to review the interest information before submitting your claim.
              Any default rate or option shown there is not confirmation that you are automatically entitled to interest.
              If you are unsure whether to request interest or from what date, consider checking the official guidance or
              obtaining independent advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 8 ──────────────────────────────────────────────────────────────────

export function StepEvidence({ prep, setPrep }: StepProps) {
  const uid = useId();
  const [newItem, setNewItem] = useState("");
  const add = () => {
    const label = newItem.trim().slice(0, TEXT_LIMITS.short);
    if (!label) return;
    setPrep((p) => ({ ...p, evidence: [...p.evidence, { id: newId(), label, checked: false, custom: true }] }));
    setNewItem("");
  };
  const done = prep.evidence.filter((e) => e.checked).length;
  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
        Gather documents which support the factual points you are relying upon. Tick each item once you have it ready.
      </p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400" aria-live="polite">
        {done} of {prep.evidence.length} items gathered
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {prep.evidence.map((item) => (
          <li key={item.id} className="relative">
            <Checkbox
              checked={item.checked}
              onChange={(checked) =>
                setPrep((p) => ({ ...p, evidence: p.evidence.map((e) => (e.id === item.id ? { ...e, checked } : e)) }))
              }
            >
              <span className={item.custom ? "pr-10" : undefined}>{item.label}</span>
            </Checkbox>
            {item.custom && (
              <button
                type="button"
                onClick={() => setPrep((p) => ({ ...p, evidence: p.evidence.filter((e) => e.id !== item.id) }))}
                className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.08] ${focusRing}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove {item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <div className="flex-1">
          <label htmlFor={`${uid}-new`} className="block text-[15px] font-semibold text-slate-900 dark:text-white">
            Add another item
          </label>
          <input
            id={`${uid}-new`}
            type="text"
            maxLength={TEXT_LIMITS.short}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className={`${inputClass} border-slate-300 dark:border-white/15 mt-2`}
          />
        </div>
        <button type="submit" className={secondaryButton} disabled={!newItem.trim()}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add item
        </button>
      </form>
      <Notice tone="success" icon={<FolderLock className="h-4 w-4" aria-hidden="true" />} title="Keep your evidence on your own device">
        <p>
          Do not upload documents to James-Square.com. This checklist only records which items you have ticked. You will
          upload any documents required directly to the official Scottish Courts service when appropriate.
        </p>
      </Notice>
    </div>
  );
}
