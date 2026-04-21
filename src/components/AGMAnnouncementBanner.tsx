'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

export default function AGMAnnouncementBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-indigo-300/40 bg-indigo-50/70 p-6 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-950/30 sm:p-7">
        <div className="space-y-4">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
              Owners announcement
            </p>
            <h2 className="text-xl font-semibold text-indigo-950 dark:text-indigo-100 sm:text-2xl">
              AGM Thursday 4th June for owners
            </h2>
          </header>

          <p className="text-sm leading-relaxed text-indigo-950/85 dark:text-indigo-100/90 sm:text-base">
            The James Square AGM is approaching. Owners can review updates and vote on plans for
            improvements. If you are a tenant, please make your owner aware.
          </p>

          <Link
            href="/AGM"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-indigo-400/50 bg-white/80 px-3 py-2 font-medium text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-300/40 dark:bg-indigo-900/30 dark:text-indigo-100 dark:hover:bg-indigo-900/50"
          >
            Visit AGM page
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>

          {expanded && (
            <div className="space-y-4 border-t border-indigo-300/40 pt-4 text-sm leading-relaxed text-indigo-950/85 dark:border-indigo-400/30 dark:text-indigo-100/90 sm:text-base">
              <p>
                The Annual General Meeting gives owners the opportunity to find out what has been
                happening at James Square and to vote on plans for improvements going forward. This
                will be our first AGM with Myreside Management as factors, taking place on Thursday
                4th June 2026 via Microsoft Teams.
              </p>
              <p>
                For more information, and to leave suggestions on what you would like discussed,
                please visit the AGM page.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
          >
            {expanded ? 'Show less' : 'Read more'}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
