// TEMPORARY DEMO COMPONENT
// This code is illustrative only and will be removed once live inbox features are implemented.

'use client';

import { useMemo, useState } from 'react';

const demoMessages = [
  {
    id: 'demo-1',
    sender: 'John Smith',
    subject: 'Noise late at night in Block B',
    received: '14 Feb 2024',
    status: 'New',
    source: 'Email',
    body: `Hi committee,\n\nJust a quick note to let you know there has been loud music coming from Block B after 11pm for the last couple of nights. I know it can happen occasionally, but it has been quite disruptive.\n\nThanks for looking into it.`,
  },
  {
    id: 'demo-2',
    sender: 'Sarah McLeod',
    subject: 'Question about factoring invoices',
    received: '02 Mar 2024',
    status: 'In progress',
    source: 'Email',
    body: `Hello,\n\nI have a question about the most recent factoring invoices. Could someone explain the additional charges listed under “maintenance adjustment”?\n\nMany thanks.`,
  },
  {
    id: 'demo-3',
    sender: 'Flat 23',
    subject: 'Broken light in stairwell',
    received: '19 Mar 2024',
    status: 'Closed',
    source: 'Email',
    body: `Hi committee,\n\nThe light on the second floor stairwell has been out for a few days. It’s quite dark in the evenings.\n\nPlease can this be arranged for repair?\n\nRegards,\nFlat 23.`,
  },
  {
    id: 'demo-4',
    sender: 'Michael Orr',
    subject: 'Parking bay signage request',
    received: '25 Mar 2024',
    status: 'New',
    source: 'Email',
    body: `Hello committee,\n\nWould it be possible to add clearer signage for guest parking bays? There has been some confusion recently with visitors.\n\nThanks for your help.`,
  },
] as const;

type DemoStatus = (typeof demoMessages)[number]['status'];

const statusStyles: Record<DemoStatus, string> = {
  New: 'bg-emerald-100 text-emerald-700 border-emerald-200/70',
  'In progress': 'bg-amber-100 text-amber-700 border-amber-200/70',
  Closed: 'bg-slate-200 text-slate-700 border-slate-300/70',
};

const statusOptions: DemoStatus[] = ['New', 'In progress', 'Closed'];

export default function CommitteeInboxDemo() {
  const initialStatus = useMemo(
    () =>
      demoMessages.reduce((acc, message) => {
        acc[message.id] = message.status;
        return acc;
      }, {} as Record<string, DemoStatus>),
    [],
  );

  const [openId, setOpenId] = useState<string | null>(demoMessages[0]?.id ?? null);
  const [messageStatuses, setMessageStatuses] = useState<Record<string, DemoStatus>>(
    initialStatus,
  );

  const handleToggle = (messageId: string) => {
    setOpenId((current) => (current === messageId ? null : messageId));
  };

  const handleStatusChange = (messageId: string, status: DemoStatus) => {
    setMessageStatuses((current) => ({ ...current, [messageId]: status }));
  };

  return (
    <section className="jqs-glass rounded-2xl border border-white/20 bg-white/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:bg-white/10">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">Example: Shared inbox (demo)</h2>
          <span className="rounded-full border border-white/30 bg-white/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)] dark:bg-white/10">
            Demo
          </span>
        </div>
        <p className="text-sm text-[color:var(--text-muted)]">
          This is a demonstration of how the committee inbox will work. Messages shown
          below are examples only and are not real.
        </p>
      </header>

      <div className="mt-6 space-y-4 opacity-90">
        {demoMessages.map((message) => {
          const isOpen = openId === message.id;
          const currentStatus = messageStatuses[message.id] ?? message.status;

          return (
            <div
              key={message.id}
              className="rounded-2xl border border-white/20 bg-white/40 p-4 shadow-sm transition dark:bg-white/5"
            >
              <button
                className="flex w-full flex-wrap items-center justify-between gap-4 text-left"
                onClick={() => handleToggle(message.id)}
                type="button"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {message.subject}
                  </p>
                  <p className="text-xs text-[color:var(--text-muted)]">
                    {message.sender} · {message.received}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[currentStatus]}`}
                  >
                    {currentStatus}
                  </span>
                  <span className="rounded-full border border-slate-200/70 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {message.source}
                  </span>
                  <span className="text-xs text-[color:var(--text-muted)]">
                    {isOpen ? 'Collapse' : 'Expand'}
                  </span>
                </div>
              </button>

              {isOpen ? (
                <div className="mt-4 space-y-4 border-t border-white/20 pt-4 text-sm">
                  <div className="grid gap-2 text-xs text-[color:var(--text-muted)]">
                    <div>
                      <span className="font-semibold text-[color:var(--text-primary)]">
                        From:
                      </span>{' '}
                      {message.sender}
                    </div>
                    <div>
                      <span className="font-semibold text-[color:var(--text-primary)]">
                        Received:
                      </span>{' '}
                      {message.received}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/20 bg-white/50 p-3 text-sm text-[color:var(--text-primary)] shadow-inner dark:bg-white/10">
                    <div className="max-h-32 overflow-y-auto whitespace-pre-line">
                      {message.body}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusOptions.map((statusOption) => (
                        <button
                          key={statusOption}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition hover:brightness-95 ${
                            currentStatus === statusOption
                              ? statusStyles[statusOption]
                              : 'border-white/30 text-[color:var(--text-muted)]'
                          }`}
                          onClick={() => handleStatusChange(message.id, statusOption)}
                          type="button"
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[color:var(--text-muted)]">
                      Demo only – changes are not saved
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
