'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CONSENT_CATEGORY_INFO } from '@/lib/consent/categories';
import type { ConsentCategory } from '@/lib/consent/types';

import { useConsent } from './ConsentProvider';
import CookieIcon from './CookieIcon';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CookiePreferencesPanel() {
  const {
    isPreferencesOpen,
    closePreferences,
    decisions,
    record,
    acceptAll,
    savePreferences,
    withdrawConsent,
  } = useConsent();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isPreferencesOpen && (
        <PreferencesDialog
          decisions={decisions}
          key="cookie-preferences"
          onAcceptAll={acceptAll}
          onClose={closePreferences}
          onSave={savePreferences}
          onWithdraw={withdrawConsent}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
          lastDecidedAt={record?.decidedAt ?? null}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

type DialogProps = {
  decisions: Record<ConsentCategory, boolean>;
  lastDecidedAt: string | null;
  prefersReducedMotion: boolean;
  onClose: () => void;
  onSave: (next: Partial<Record<ConsentCategory, boolean>>) => void;
  onAcceptAll: () => void;
  onWithdraw: () => void;
};

function PreferencesDialog({
  decisions,
  lastDecidedAt,
  prefersReducedMotion,
  onClose,
  onSave,
  onAcceptAll,
  onWithdraw,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Working copy, so nothing is written until the visitor commits.
  const [draft, setDraft] = useState<Record<ConsentCategory, boolean>>(() => ({ ...decisions }));

  const toggle = useCallback((category: ConsentCategory) => {
    setDraft((current) => ({ ...current, [category]: !current[category] }));
  }, []);

  const setAll = useCallback((value: boolean) => {
    setDraft(() =>
      CONSENT_CATEGORY_INFO.reduce(
        (acc, category) => {
          acc[category.id] = category.required ? true : value;
          return acc;
        },
        {} as Record<ConsentCategory, boolean>,
      ),
    );
  }, []);

  // Focus management: remember what had focus, move into the dialog, restore on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    return () => previouslyFocused.current?.focus?.();
  }, []);

  // Escape closes; Tab is contained within the dialog.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  // Prevent the page behind from scrolling, without the layout shift that
  // setting `overflow: hidden` alone would cause on desktop scrollbars.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  const lastReviewed = useMemo(() => {
    if (!lastDecidedAt) return null;
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(lastDecidedAt));
    } catch {
      return null;
    }
  }, [lastDecidedAt]);

  return (
    <div className="consent-modal-root fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <motion.div
        animate={{ opacity: 1 }}
        aria-hidden="true"
        className="consent-scrim absolute inset-0"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: 'easeOut' }}
      />

      <motion.div
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        // Presented as a bottom sheet on phones and a centred card from `sm` up.
        // The sheet keeps square bottom corners so it reads as anchored to the
        // edge of the screen rather than floating just off it.
        className="consent-surface relative m-0 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none pb-[env(safe-area-inset-bottom)] sm:m-6 sm:rounded-[1.75rem] sm:pb-0"
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.97 }}
        ref={dialogRef}
        role="dialog"
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: EASE_OUT }}
      >
        <header className="flex items-start gap-3.5 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[color:var(--text-secondary)]"
            style={{
              borderColor: 'hsl(var(--glass-border))',
              background: 'color-mix(in srgb, var(--glass-bg-light) 70%, transparent)',
            }}
          >
            <CookieIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1 space-y-1.5">
            <h2
              className="text-lg font-semibold text-[color:var(--text-primary)]"
              id={titleId}
            >
              Cookie Preferences
            </h2>
            <p
              className="text-sm leading-relaxed text-[color:var(--text-secondary)]"
              id={descriptionId}
            >
              Choose what James Square is allowed to store on your device. Nothing optional runs
              until you turn it on, and you can change your mind at any time.
            </p>
          </div>

          <button
            aria-label="Close cookie preferences"
            className="consent-btn consent-btn--ghost -mr-2 -mt-1 !px-2 !py-2"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t px-5 py-4 sm:px-7"
          style={{ borderColor: 'hsl(var(--glass-border))' }}
        >
          <ul className="space-y-3">
            {CONSENT_CATEGORY_INFO.map((category) => (
              <CategoryRow
                checked={category.required ? true : draft[category.id] === true}
                info={category}
                key={category.id}
                onToggle={() => toggle(category.id)}
              />
            ))}
          </ul>

          <p className="mt-5 text-xs leading-relaxed text-[color:var(--text-secondary)]">
            Full detail of every cookie, how long it lasts and who provides it is set out in our{' '}
            <Link className="underline underline-offset-2" href="/cookies">
              Cookie Policy
            </Link>
            . How we handle personal information is covered in the{' '}
            <Link className="underline underline-offset-2" href="/privacy">
              Privacy Policy
            </Link>
            .
            {lastReviewed ? (
              <>
                {' '}
                Your current choices were saved on {lastReviewed}.
              </>
            ) : null}
          </p>
        </div>

        <footer
          className="border-t px-5 py-4 sm:px-7"
          style={{ borderColor: 'hsl(var(--glass-border))' }}
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="consent-btn consent-btn--ghost order-3 !px-3 sm:order-1"
              onClick={() => {
                setAll(false);
                onSave({});
              }}
              type="button"
            >
              Reject Optional Cookies
            </button>

            {/* column-reverse on phones puts Accept All at the top of the stack,
                nearest the thumb; from `sm` it becomes secondary-then-primary. */}
            <div className="flex flex-col-reverse gap-2.5 sm:order-2 sm:flex-row sm:items-center">
              <button
                className="consent-btn consent-btn--secondary"
                onClick={() => onSave(draft)}
                type="button"
              >
                Save Preferences
              </button>
              <button
                className="consent-btn consent-btn--primary"
                onClick={() => {
                  setAll(true);
                  onAcceptAll();
                }}
                type="button"
              >
                Accept All
              </button>
            </div>
          </div>

          {lastReviewed ? (
            <button
              className="mt-3 text-xs text-[color:var(--text-secondary)] underline underline-offset-2 transition-colors hover:text-[color:var(--text-primary)]"
              onClick={onWithdraw}
              type="button"
            >
              Withdraw consent and forget my choices
            </button>
          ) : null}
        </footer>
      </motion.div>
    </div>
  );
}

function CategoryRow({
  info,
  checked,
  onToggle,
}: {
  info: (typeof CONSENT_CATEGORY_INFO)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  const inputId = useId();
  const detailsId = useId();

  return (
    <li
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'hsl(var(--glass-border))',
        background: 'color-mix(in srgb, var(--glass-bg-light) 55%, transparent)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[color:var(--text-primary)]">
              {info.label}
            </span>
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--text-secondary)]"
              style={{ borderColor: 'hsl(var(--glass-border))' }}
            >
              {info.required ? 'Always on' : 'Optional'}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[color:var(--text-secondary)]">
            {info.summary}
          </p>
        </div>

        {/* The input is the control; the span is only its skin. Screen readers
            and keyboards therefore get a plain checkbox. */}
        <span className="shrink-0 pt-0.5">
          <input
            aria-describedby={detailsId}
            checked={checked}
            className="consent-toggle-input sr-only"
            disabled={info.required}
            id={inputId}
            onChange={onToggle}
            type="checkbox"
          />
          <label className="consent-toggle" htmlFor={inputId}>
            <span className="consent-toggle__knob" />
            <span className="sr-only">
              {info.required
                ? `${info.label} cookies are required and cannot be switched off`
                : `Allow ${info.label.toLowerCase()} cookies`}
            </span>
          </label>
        </span>
      </div>

      <dl className="mt-3 space-y-2 text-xs leading-relaxed" id={detailsId}>
        <div>
          <dt className="font-medium text-[color:var(--text-primary)]">What these do</dt>
          <dd className="mt-1">
            <ul className="list-disc space-y-0.5 pl-4 text-[color:var(--text-secondary)]">
              {info.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-[color:var(--text-primary)]">
            Does this store personal information?
          </dt>
          <dd className="mt-1 text-[color:var(--text-secondary)]">{info.personalData}</dd>
        </div>
        <div>
          <dt className="font-medium text-[color:var(--text-primary)]">How long it lasts</dt>
          <dd className="mt-1 text-[color:var(--text-secondary)]">{info.storageDuration}</dd>
        </div>
      </dl>
    </li>
  );
}
