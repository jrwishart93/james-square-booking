'use client';

import { useEffect, useId, useState } from 'react';
import { Check, Loader2, Lock, MessageCircle } from 'lucide-react';

import { RESIDENT_QUESTIONS, type ResidentAnswers, type WhatsAppGroup } from '@/lib/residentCheck';

import WhatsAppQrCode from './WhatsAppQrCode';

type Stage = 'locked' | 'asking' | 'checking' | 'unlocked';

const storageKey = (group: WhatsAppGroup) => `jsq-whatsapp-invite:${group}`;

// Remembered for this browser tab only, so a resident is not asked twice per visit.
function readStored(group: WhatsAppGroup): string | null {
  try {
    const value = window.sessionStorage.getItem(storageKey(group));
    return value && value.startsWith('https://chat.whatsapp.com/') ? value : null;
  } catch {
    return null;
  }
}
function store(group: WhatsAppGroup, url: string) {
  try {
    window.sessionStorage.setItem(storageKey(group), url);
  } catch {
    // Storage can be unavailable (private browsing); the visitor simply answers again next time.
  }
}

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
const primary = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:opacity-70 sm:w-auto sm:text-base ${focusRing}`;

/**
 * Hides a WhatsApp invitation behind three questions only a resident would
 * know. The invitation itself comes from /api/whatsapp-invite and is never
 * part of the page until the answers are right.
 */
export default function ResidentWhatsAppGate({
  group,
  ctaLabel,
  groupName,
  qrSize = 148,
}: {
  group: WhatsAppGroup;
  ctaLabel: string;
  /** e.g. "the James Square Community WhatsApp group", used in labels. */
  groupName: string;
  qrSize?: number;
}) {
  const id = useId();
  const [stage, setStage] = useState<Stage>('locked');
  const [url, setUrl] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<ResidentAnswers>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStored(group);
    if (stored) {
      setUrl(stored);
      setStage('unlocked');
    }
  }, [group]);

  const unanswered = RESIDENT_QUESTIONS.filter(({ id: q }) => !answers[q]).length;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unanswered > 0) {
      setError('Please answer all three questions.');
      return;
    }
    setStage('checking');
    setError(null);
    try {
      const res = await fetch('/api/whatsapp-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, answers }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && body.url) {
        store(group, body.url);
        setUrl(body.url);
        setStage('unlocked');
        return;
      }
      setError(
        res.status === 429
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : body.error ?? 'Something went wrong. Please try again.',
      );
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
    }
    setStage('asking');
  }

  if (stage === 'unlocked' && url) {
    return (
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <Check className="h-4 w-4" aria-hidden="true" />
            Thanks for confirming you live here.
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className={primary}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Open WhatsApp to join
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            Please don’t share this link outside James Square.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <WhatsAppQrCode url={url} size={qrSize} label={`QR code that opens the invitation to ${groupName}`} />
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Or scan with your phone</p>
        </div>
      </div>
    );
  }

  if (stage === 'locked') {
    return (
      <div className="space-y-2">
        <button type="button" onClick={() => setStage('asking')} className={primary}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {ctaLabel}
        </button>
        <p className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          You’ll answer three quick questions first, to show you live here.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${id}-title`}
      className="space-y-5 rounded-2xl border border-black/5 bg-white/70 p-4 sm:p-5 dark:border-white/10 dark:bg-white/5"
    >
      <div>
        <p id={`${id}-title`} className="font-semibold text-neutral-950 dark:text-white">
          Quick resident check
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          To keep the group for people who live here, please answer three questions about James Square.
        </p>
      </div>

      {RESIDENT_QUESTIONS.map(({ id: questionId, question, options }, index) => (
        <fieldset key={questionId}>
          <legend className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {index + 1}. {question}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((option) => {
              const checked = answers[questionId] === option.value;
              return (
                <label
                  key={option.value}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-emerald-600/40 ${
                    checked
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-50'
                      : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`${id}-${questionId}`}
                    value={option.value}
                    checked={checked}
                    onChange={() => {
                      setAnswers((current) => ({ ...current, [questionId]: option.value }));
                      setError(null);
                    }}
                    className="sr-only"
                  />
                  {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={stage === 'checking'} className={primary}>
          {stage === 'checking' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {stage === 'checking' ? 'Checking…' : 'Check answers'}
        </button>
        <button
          type="button"
          onClick={() => {
            setStage('locked');
            setError(null);
          }}
          className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white ${focusRing}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
