'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AGMOwnerVotingNotice,
  PoolNotice,
  TelferSubwayClosureNotice,
  AGMNotice,
  RoadworksNotice,
  MyresideNotice,
  isNoticeActive,
  noticeSummaries,
} from '@/components/home/notices';

const noticeComponents: Record<string, () => React.JSX.Element | null> = {
  'pool-facilities': PoolNotice,
  'agm-voting': AGMOwnerVotingNotice,
  'agm-summary': AGMNotice,
  myreside: MyresideNotice,
  'telfer-subway': TelferSubwayClosureNotice,
  roadworks: RoadworksNotice,
};

/** Notices render in the order they are declared in notices.tsx. */
const orderedNotices = noticeSummaries.filter((notice) => noticeComponents[notice.id]);

export default function UpdatesClient() {
  // Resolved after mount so the server and client markup match on date-gated notices.
  const [resolved, setResolved] = useState(false);
  useEffect(() => setResolved(true), []);

  const current = orderedNotices.filter((notice) => !resolved || isNoticeActive(notice));
  const past = resolved ? orderedNotices.filter((notice) => !isNoticeActive(notice)) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header className="mt-6 mb-8 sm:mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Updates &amp; Notices</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          Current resident notices and building updates for James Square, with the most recent
          shown first. Notices that no longer apply move to Recently completed.
        </p>
      </header>

      <div className="space-y-6">
        {current.map((notice) => {
          const Component = noticeComponents[notice.id];
          return (
            <section key={notice.id} id={notice.id} className="scroll-mt-24">
              <Component />
            </section>
          );
        })}
      </div>

      {past.length > 0 ? (
        <section className="mt-14" aria-labelledby="completed-notices-heading">
          <h2
            id="completed-notices-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400"
          >
            Recently completed
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Kept here for reference. These works and closures have finished.
          </p>
          <div className="mt-5 space-y-6 opacity-75">
            {past.map((notice) => {
              const Component = noticeComponents[notice.id];
              return (
                <section key={notice.id} id={notice.id} className="scroll-mt-24">
                  <Component />
                </section>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
