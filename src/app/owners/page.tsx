'use client';

import Link from 'next/link';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OwnersPage = () => {
  return (
    <GradientBG className="min-h-screen py-10">
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-12 space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-600/80 dark:text-slate-300/70">
            Owners Area
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
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
          <GlassCard title="Secure owners access" subtitle="A private password-protected area for owners is on the way.">
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
          >
            <Link
              href="/owners/voting"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/80 text-gray-900 hover:bg-white transition shadow-md backdrop-blur active:scale-[0.99] dark:bg-white/90"
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
