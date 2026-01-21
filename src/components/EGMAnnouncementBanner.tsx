'use client';

import { DateTime } from 'luxon';
import { Calendar, Lock, Monitor, Vote } from 'lucide-react';

const expiryDate = DateTime.fromISO('2026-01-21T18:30:00', { zone: 'Europe/London' });

export default function EGMAnnouncementBanner() {
  const now = DateTime.now().setZone('Europe/London');

  if (now >= expiryDate) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Announcement
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Extraordinary General Meeting — Tonight at 6:00pm
            </h2>
          </header>

          <div className="space-y-4 text-base text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex flex-col gap-2 text-slate-500 dark:text-slate-300"
                aria-hidden
              >
                <Calendar className="h-5 w-5" />
                <Monitor className="h-5 w-5" />
              </div>
              <p>
                The Extraordinary General Meeting (EGM) will take place this evening at 6:00pm and
                will be held online via Microsoft Teams.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex flex-col gap-2 text-slate-500 dark:text-slate-300"
                aria-hidden
              >
                <Vote className="h-5 w-5" />
                <Lock className="h-5 w-5" />
              </div>
              <p>
                Following the meeting, voting will open to decide on a new property factor to
                replace Fior once they step down. Further details and supporting documents are
                available in the Owners section of the website.
              </p>
            </div>

            <p>
              The access code has been emailed to all registered owners. If you are an owner but
              have not yet verified your status, you can do so via the Dashboard after logging in or
              signing up.
            </p>

            <p>If you experience any technical issues, please email support@james-square.com.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
