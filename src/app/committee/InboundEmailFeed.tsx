'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

type InboundEmailStatus = 'new' | 'reviewed';

type InboundEmail = {
  id: string;
  fromName?: string;
  fromEmail?: string;
  subject?: string;
  body?: string;
  receivedAt?: unknown;
  status?: InboundEmailStatus;
  source?: string;
};

type ParsedBody = {
  paragraphs: string[];
  trimmed: string;
};

const emptyState = 'No inbound email messages yet.';

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function toDate(value?: unknown): Date | null {
  if (!value || typeof value !== 'object') return null;
  if ('toDate' in (value as Record<string, unknown>)) {
    const date = (value as { toDate?: () => Date }).toDate?.();
    if (date instanceof Date && !Number.isNaN(date.getTime())) return date;
  }
  if ('toMillis' in (value as Record<string, unknown>)) {
    const millis = (value as { toMillis?: () => number }).toMillis?.();
    if (typeof millis === 'number') return new Date(millis);
  }
  return null;
}

function stripHtml(input: string): string {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function collapseQuotedReplies(input: string): string {
  const lines = input.split(/\r?\n/);
  const cleaned: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      cleaned.push('');
      continue;
    }
    if (trimmed.startsWith('>')) continue;
    if (
      /^(on .+ wrote:|from:|sent:|to:|subject:|-----original message-----)/i.test(trimmed)
    ) {
      break;
    }
    cleaned.push(line);
  }
  return cleaned.join('\n');
}

function parseEmailBody(raw?: string): ParsedBody {
  if (!raw) return { paragraphs: [], trimmed: '' };
  const noHtml = stripHtml(raw);
  const unquoted = collapseQuotedReplies(noHtml);
  const trimmed = unquoted.replace(/\s+/g, ' ').trim();
  const paragraphs = unquoted
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return { paragraphs, trimmed };
}

function formatShortDate(value?: unknown): string {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : 'Unknown date';
}

function formatDateTime(value?: unknown): string {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : 'Unknown time';
}

export default function InboundEmailFeed() {
  const [emails, setEmails] = useState<InboundEmail[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'committeeInboundEmails'), orderBy('receivedAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
          id: docSnap.id,
          fromName: data.fromName as string | undefined,
          fromEmail: data.fromEmail as string | undefined,
          subject: data.subject as string | undefined,
          body: data.body as string | undefined,
          receivedAt: data.receivedAt,
          status: data.status as InboundEmailStatus | undefined,
          source: data.source as string | undefined,
        } satisfies InboundEmail;
      });
      setEmails(items);
    });

    return () => unsub();
  }, []);

  const parsedBodies = useMemo(() => {
    const bodyMap = new Map<string, ParsedBody>();
    emails.forEach((email) => {
      bodyMap.set(email.id, parseEmailBody(email.body));
    });
    return bodyMap;
  }, [emails]);

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleMarkReviewed = async (id: string) => {
    setBusyId(id);
    try {
      await updateDoc(doc(db, 'committeeInboundEmails', id), {
        status: 'reviewed',
      });
    } finally {
      setBusyId((current) => (current === id ? null : current));
    }
  };

  if (emails.length === 0) {
    return <p className="text-sm text-[color:var(--text-muted)]">{emptyState}</p>;
  }

  return (
    <ul className="space-y-3">
      {emails.map((email) => {
        const isExpanded = expandedId === email.id;
        const displayName = email.fromName?.trim() || email.fromEmail || 'Unknown sender';
        const status = email.status ?? 'new';
        const parsedBody = parsedBodies.get(email.id);

        return (
          <li
            key={email.id}
            className="rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5"
          >
            <button
              type="button"
              onClick={() => handleToggle(email.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              aria-expanded={isExpanded}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="truncate">{displayName}</span>
                  <span className="rounded-full border border-white/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                    Email
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-[color:var(--text-muted)]">
                  {email.subject || '(No subject)'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
                <span>{formatShortDate(email.receivedAt)}</span>
                <span className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      status === 'new' ? 'bg-emerald-400' : 'bg-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] uppercase tracking-[0.2em]">
                    {status === 'new' ? 'New' : 'Reviewed'}
                  </span>
                </span>
              </div>
            </button>
            {isExpanded ? (
              <div className="space-y-4 border-t border-white/20 px-4 pb-4 pt-3">
                <div className="flex flex-col gap-1 text-xs text-[color:var(--text-muted)]">
                  <span>
                    <span className="font-semibold text-[color:var(--text-primary)]">From:</span>{' '}
                    {displayName}
                    {email.fromEmail && email.fromEmail !== displayName
                      ? ` <${email.fromEmail}>`
                      : null}
                  </span>
                  <span>
                    <span className="font-semibold text-[color:var(--text-primary)]">Received:</span>{' '}
                    {formatDateTime(email.receivedAt)}
                  </span>
                </div>
                <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-xl border border-white/20 bg-white/70 p-4 text-sm text-[color:var(--text-muted)] shadow-inner dark:bg-white/10">
                  {parsedBody?.paragraphs.length ? (
                    parsedBody.paragraphs.map((paragraph, index) => (
                      <p key={`${email.id}-paragraph-${index}`}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{parsedBody?.trimmed || 'No message content available.'}</p>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(email.id)}
                    disabled={busyId === email.id || status === 'reviewed'}
                    className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-primary)] transition hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'reviewed' ? 'Reviewed' : 'Mark as reviewed'}
                  </button>
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
