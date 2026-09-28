"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Copy } from "lucide-react";

// Shared building blocks for the interactive parts of /fior-info.

export const glassPanel =
  "rounded-3xl border border-white/70 bg-white/65 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]";
export const h2Class = "text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl";
export const copyClass = "space-y-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-[1.8]";
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-950";
export const primaryButton = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto ${focusRing}`;
export const secondaryButton = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-[15px] font-semibold text-slate-800 transition hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08] sm:w-auto ${focusRing}`;
export const inputClass = `block w-full rounded-xl border bg-white/90 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:[color-scheme:dark] ${focusRing}`;
export const inputBorder = (error?: string) =>
  error ? "border-rose-500 dark:border-rose-400" : "border-slate-300 dark:border-white/15";
export const scrollMargin = "scroll-mt-[calc(var(--nav-height,4rem)+1.5rem)]";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts: fall back to a temporary textarea.
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ label, text, disabled }: { label: string; text: string; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2500);
    return () => window.clearTimeout(t);
  }, [state]);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => setState((await copyText(text)) ? "copied" : "failed")}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08] ${focusRing}`}
    >
      {state === "copied" ? (
        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{label}</span>
      <span aria-live="polite" className="text-emerald-700 dark:text-emerald-300">
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn’t copy – please select the text instead" : ""}
      </span>
    </button>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold text-slate-900 dark:text-white">
        {label}
        {optional && <span className="ml-1.5 text-sm font-normal text-slate-500 dark:text-slate-400">(optional)</span>}
      </label>
      {hint && (
        <div id={`${id}-hint`} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {hint}
        </div>
      )}
      {error && <FieldError id={`${id}-error`} message={error} />}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-rose-700 dark:text-rose-300">
      <span aria-hidden="true">⚠</span>
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  );
}

/** aria-describedby helper: joins the hint / error ids that exist. */
export function describedBy(id: string, { hint, error }: { hint?: boolean; error?: string }) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

/** Radio group rendered as large, tappable pill options. */
export function ChoiceGroup<T extends string>({
  legend,
  hint,
  value,
  options,
  onChange,
  name,
}: {
  legend: React.ReactNode;
  hint?: React.ReactNode;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  name?: string;
}) {
  const uid = useId();
  const groupName = name ?? uid;
  return (
    <fieldset>
      <legend className="text-[15px] font-semibold text-slate-900 dark:text-white">{legend}</legend>
      {hint && <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-slate-950 ${
                checked
                  ? "border-sky-600 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-400/15 dark:text-sky-100"
                  : "border-slate-300 bg-white/70 text-slate-700 hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  checked ? "border-sky-600 bg-sky-600 dark:border-sky-300 dark:bg-sky-300" : "border-slate-400 dark:border-slate-500"
                }`}
                aria-hidden="true"
              >
                {checked && <Check className="h-2.5 w-2.5 text-white dark:text-slate-950" strokeWidth={4} />}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-[15px] leading-6 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-slate-950 ${
        checked
          ? "border-sky-300 bg-sky-50/80 text-slate-900 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-white"
          : "border-slate-200 bg-white/60 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked ? "border-sky-600 bg-sky-600 dark:border-sky-300 dark:bg-sky-300" : "border-slate-400 bg-white dark:border-slate-500 dark:bg-transparent"
        }`}
        aria-hidden="true"
      >
        {checked && <Check className="h-3.5 w-3.5 text-white dark:text-slate-950" strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

export function ExternalLink({
  href,
  children,
  variant = "inline",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "inline" | "primary" | "secondary" | "card";
  className?: string;
}) {
  const styles = {
    inline: `inline-flex items-center gap-1 font-semibold text-sky-700 underline decoration-sky-400/50 underline-offset-4 hover:decoration-sky-600 dark:text-sky-300 dark:hover:decoration-sky-300 rounded ${focusRing}`,
    primary: primaryButton,
    secondary: secondaryButton,
    card: `flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-[15px] font-medium text-slate-800 transition hover:border-sky-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:border-sky-400/40 dark:hover:bg-white/[0.08] ${focusRing}`,
  }[variant];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles} ${className}`}>
      <span>{children}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">(official site, opens in a new tab)</span>
    </a>
  );
}

export function Accordion({
  title,
  icon,
  children,
  defaultOpen = false,
  tone = "default",
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  tone?: "default" | "important";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  return (
    <div
      className={`rounded-2xl border ${
        tone === "important"
          ? "border-amber-300/80 bg-amber-50/70 dark:border-amber-400/30 dark:bg-amber-400/[0.07]"
          : "border-slate-200/80 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]"
      }`}
    >
      <h4>
        <button
          type="button"
          id={`${uid}-button`}
          aria-expanded={open}
          aria-controls={`${uid}-panel`}
          onClick={() => setOpen((o) => !o)}
          className={`flex min-h-14 w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-base font-semibold text-slate-900 dark:text-white ${focusRing}`}
        >
          {icon && <span className="shrink-0 text-sky-700 dark:text-sky-300">{icon}</span>}
          <span className="flex-1">{title}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h4>
      <div
        id={`${uid}-panel`}
        role="region"
        aria-labelledby={`${uid}-button`}
        hidden={!open}
        className="px-5 pb-5 text-[15px] leading-7 text-slate-700 dark:text-slate-300"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Modal dialog built on the native <dialog> element, which provides focus
 * containment, Escape to close and inert background content.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-title`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm dark:border-white/10 dark:bg-slate-900 dark:text-white"
    >
      <div className="p-6 sm:p-7">
        <h2 id={`${uid}-title`} className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{actions}</div>
      </div>
    </dialog>
  );
}

export function Notice({
  icon,
  title,
  children,
  tone = "neutral",
  className = "",
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: "neutral" | "info" | "warning" | "success";
  className?: string;
}) {
  const tones = {
    neutral: "border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.04]",
    info: "border-sky-200/80 bg-sky-50/70 dark:border-sky-400/20 dark:bg-sky-400/[0.07]",
    warning: "border-amber-300/80 bg-amber-50/80 dark:border-amber-400/30 dark:bg-amber-400/[0.08]",
    success: "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07]",
  }[tone];
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${tones} ${className}`}>
      {icon && <span className="mt-0.5 shrink-0 text-slate-600 dark:text-slate-300">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{title}</p>
        {children && <div className="mt-1 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{children}</div>}
      </div>
    </div>
  );
}
