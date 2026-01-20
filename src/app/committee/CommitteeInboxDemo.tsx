// TEMPORARY DEMO COMPONENT
// This code is illustrative only and will be removed once live inbox features are implemented.

'use client';

import { useMemo, useState } from 'react';

type DemoStatus = 'new' | 'in_progress' | 'closed';

type DemoMessage = {
  id: string;
  fromName: string;
  subject: string;
  receivedDate: string;
  body: string;
  status: DemoStatus;
  source: 'Email';
};

const demoMessages: DemoMessage[] = [
  {
    id: 'demo-1',
    fromName: 'John Smith',
    subject: 'Noise late at night in Block B',
    receivedDate: '12 Feb 2024',
    body: 'Hello committee, just a quick note to report ongoing noise after 11pm in Block B. It has been happening most nights this week. Could someone remind residents about quiet hours? Thank you.',
    status: 'new',
    source: 'Email',
  },
  {
    id: 'demo-2',
    fromName: 'Sarah McLeod',
    subject: 'Question about factoring invoices',
    receivedDate: '6 Feb 2024',
    body: 'Hi team, I noticed a couple of recent factoring charges and wanted to clarify what they relate to. Could you share a brief summary or point me to the relevant documents? Thanks for your help.',
    status: 'in_progress',
    source: 'Email',
  },
  {
    id: 'demo-3',
    fromName: 'Flat 23',
    subject: 'Broken light in stairwell',
    receivedDate: '29 Jan 2024',
    body: 'Good morning, the light on the stairwell between levels 2 and 3 is out. It has been dark for a few days now. Can this be logged for maintenance? Appreciate it.',
    status: 'closed',
    source: 'Email',
  },
];

const statusStyles: Record<DemoStatus, { label: string; dot: string; pill: string }> = {
  new: {
    label: 'New',
    dot: 'bg-emerald-400',
    pill: 'border-emerald-300/50 text-emerald-700 dark:text-emerald-200',
  },
  in_progress: {
    label: 'In progress',
    dot: 'bg-amber-400',
    pill: 'border-amber-300/50 text-amber-700 dark:text-amber-200',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-slate-300',
    pill: 'border-slate-200/60 text-[color:var(--text-muted)]',
  },
};

const statusOptions: DemoStatus[] = ['new', 'in_progress', 'closed'];

export default function CommitteeInboxDemo() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, DemoStatus>>({});

  const messages = useMemo(
    () =>
      demoMessages.map((message) => ({
        ...message,
        status: statusMap[message.id] ?? message.status,
      })),
    [statusMap],
  );

  const handleToggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleStatusChange = (id: string, status: DemoStatus) => {
    setStatusMap((current) => ({
      ...current,
      [id]: status,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Example: Shared inbox (demo)</h2>
          <p className="text-xs text-[color:var(--text-muted)]">
            This is a demonstration of how the committee inbox will work. Messages shown
            below are examples only and are not real.
          </p>
        </div>
        <span className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
          Demo
        </span>
      </div>
      <ul className="space-y-3 opacity-90">
        {messages.map((message) => {
          const isExpanded = expandedId === message.id;
          const statusStyle = statusStyles[message.status];

          return (
            <li
              key={message.id}
              className="rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5"
            >
              <button
                type="button"
                onClick={() => handleToggle(message.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                aria-expanded={isExpanded}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="truncate">{message.fromName}</span>
                    <span className="rounded-full border border-white/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                      {message.source}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-[color:var(--text-muted)]">
                    {message.subject}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
                  <span>{message.receivedDate}</span>
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] uppercase tracking-[0.2em]">
                      {statusStyle.label}
                    </span>
                  </span>
                </div>
              </button>
              {isExpanded ? (
                <div className="space-y-4 border-t border-white/20 px-4 pb-4 pt-3">
                  <div className="flex flex-col gap-1 text-xs text-[color:var(--text-muted)]">
                    <span>
                      <span className="font-semibold text-[color:var(--text-primary)]">
                        From:
                      </span>{' '}
                      {message.fromName}
                    </span>
                    <span>
                      <span className="font-semibold text-[color:var(--text-primary)]">
                        Received:
                      </span>{' '}
                      {message.receivedDate}
                    </span>
                  </div>
                  <div className="max-h-[220px] space-y-3 overflow-y-auto rounded-xl border border-white/20 bg-white/70 p-4 text-sm text-[color:var(--text-muted)] shadow-inner dark:bg-white/10">
                    <p>{message.body}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                      Demo only – changes are not saved
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => {
                        const optionStyle = statusStyles[status];
                        const isActive = status === message.status;
                        return (
                          <button
                            key={`${message.id}-${status}`}
                            type="button"
                            onClick={() => handleStatusChange(message.id, status)}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition hover:brightness-[1.05] ${
                              isActive
                                ? `${optionStyle.pill} border-current`
                                : 'border-white/30 text-[color:var(--text-muted)]'
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${optionStyle.dot}`} />
                            {optionStyle.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
