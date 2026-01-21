'use client';

import Link from 'next/link';

const SHOW_ANNOUNCEMENT = true; // Remove after 23 Jan 2026 vote closes.

export default function AnnouncementNotice() {
  if (!SHOW_ANNOUNCEMENT) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl mt-6 sm:mt-8">
      <div className="jqs-glass rounded-2xl border border-white/30 bg-white/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-8">
        <div className="flex flex-col gap-4">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
              Owner Notice
            </p>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Important Update – Property Manager Change & Owner Vote
            </h2>
          </header>

          <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
            <p>
              Fior Asset &amp; Property will be stepping down as property manager for James Square.
              Two alternative factors, Myreside and Newton, have each provided documentation for
              owners to review ahead of a formal vote.
            </p>
            <p>
              Owners are encouraged to review both replacement options before placing their vote.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/myreside"
              className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50/70 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 dark:border-amber-300/40 dark:bg-amber-400/10 dark:text-amber-100 dark:hover:bg-amber-400/20"
            >
              View Myreside proposal
            </Link>
            <Link
              href="/newton"
              className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50/70 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 dark:border-amber-300/40 dark:bg-amber-400/10 dark:text-amber-100 dark:hover:bg-amber-400/20"
            >
              View Newton proposal
            </Link>
          </div>

          <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm font-semibold text-amber-900 dark:border-amber-300/40 dark:bg-amber-400/10 dark:text-amber-100 sm:text-base">
            Voting is now open and will close on <span className="font-bold">Friday 23 January 2026 at 5:00pm</span>.
          </div>
        </div>
      </div>
    </section>
  );
}
