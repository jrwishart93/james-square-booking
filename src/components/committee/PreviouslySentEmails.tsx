'use client';

import { useState } from 'react';

export type SentEmail = {
  id: string;
  subject: string;
  sentAt: string;
  audience: string;
  html: string;
};

type PreviouslySentEmailsProps = {
  emails: SentEmail[];
};

const glassCard =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]';

export default function PreviouslySentEmails({ emails }: PreviouslySentEmailsProps) {
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);

  const toggleEmail = (id: string) => {
    setOpenEmailId((current) => (current === id ? null : id));
  };

  return (
    <section className={`${glassCard} space-y-4 p-6`}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Previously Sent Emails</h2>
        <p className="text-sm text-[color:var(--text-muted)]">
          A record of committee communications sent via the James Square website.
        </p>
      </div>

      <div className="space-y-4">
        {emails.map((email) => {
          const isOpen = openEmailId === email.id;
          return (
            <article
              className="flex flex-col gap-4 rounded-2xl bg-white/60 p-5 text-[color:var(--text-primary)] shadow-inner dark:bg-white/5"
              key={email.id}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">{email.subject}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-[color:var(--text-muted)]">
                    <span>{email.sentAt}</span>
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--text-muted)]/60" />
                      Audience: {email.audience}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--text-muted)]/60" />
                      Sent via James Square Committee
                    </span>
                  </div>
                </div>
                <button
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-[color:var(--text-primary)] jqs-glass hover:brightness-[1.05] transition"
                  onClick={() => toggleEmail(email.id)}
                  type="button"
                >
                  {isOpen ? 'Hide email' : 'View email'}
                </button>
              </div>

              {isOpen ? (
                <div className="rounded-2xl border border-white/10 bg-slate-100/80 p-4 shadow-inner dark:bg-slate-900/60">
                  <div className="max-h-96 overflow-auto">
                    <div
                      className="mx-auto w-full max-w-3xl"
                      dangerouslySetInnerHTML={{ __html: email.html }}
                    />
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
