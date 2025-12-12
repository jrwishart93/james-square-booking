'use client';

import Link from 'next/link';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OwnersPage = () => {
  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
            Owners Area
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            A private space for James Square owners to view AGM information, vote on community matters,
            and keep up with building updates.
          </p>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
            The secure owners login is currently being built. The voting hub is available to use now.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard
            title="Secure owners access"
            subtitle="A private password-protected area for owners is on the way."
            titleClassName="text-slate-800/80 dark:text-slate-100/90"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow dark:bg-white/80 dark:text-slate-900">
              <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden />
              Coming soon
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              This will include AGM packs, meeting minutes, factor updates, and other owners-only documents.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You’ll be notified once secure access is available.
            </p>
          </GlassCard>

          <GlassCard
            title="Community voting hub"
            subtitle="Ask questions, vote, and review results."
            footer="Open to all owners."
            titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            className="before:inset-x-0 before:h-[3px] before:bg-[linear-gradient(90deg,rgba(15,23,42,0.08),rgba(15,23,42,0))]"
          >
            <Link
              href="/owners/voting"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white/90 backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/5 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:bg-white/85 dark:text-slate-900 dark:border-white/20"
            >
              Go to voting hub
            </Link>
          </GlassCard>
        </div>
      </div>
    </GradientBG>
  );
};

export default OwnersPage;
