'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  AGMOwnerVotingNotice,
  PoolNotice,
  TelferSubwayClosureNotice,
  AGMNotice,
  RoadworksNotice,
  MyresideNotice,
} from '@/components/home/notices';

const notices = [
  { id: 'agm-voting', Component: AGMOwnerVotingNotice },
  { id: 'pool-facilities', Component: PoolNotice },
  { id: 'telfer-subway', Component: TelferSubwayClosureNotice },
  { id: 'agm-summary', Component: AGMNotice },
  { id: 'roadworks', Component: RoadworksNotice },
  { id: 'myreside', Component: MyresideNotice },
];

export default function UpdatesClient() {
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
          All current resident notices and building updates for James Square, with the most recent
          shown first.
        </p>
      </header>

      <div className="space-y-6">
        {notices.map(({ id, Component }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <Component />
          </section>
        ))}
      </div>
    </div>
  );
}
