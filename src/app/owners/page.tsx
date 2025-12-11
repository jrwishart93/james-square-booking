'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OwnersPage = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const passcodeIsValid = useMemo(() => passcode.trim().toUpperCase() === '3579C', [passcode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passcodeIsValid) {
      setIsAuthenticated(true);
    }
  };

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
          {isAuthenticated ? (
            <GlassCard
              title="Secure owners access"
              subtitle="Welcome back. You now have access to owners-only information and updates."
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow dark:bg-white/80 dark:text-slate-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Access granted
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                AGM packs, meeting minutes, factor updates, and other owners-only documents will appear here.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                If you need to reset access, refresh this page and re-enter the passcode.
              </p>
            </GlassCard>
          ) : (
            <GlassCard title="Secure owners access" subtitle="Enter the passcode to view owners-only details.">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-100" htmlFor="owners-passcode">
                  Passcode
                </label>
                <input
                  id="owners-passcode"
                  name="passcode"
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-900/70 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/40"
                  placeholder="Enter passcode"
                  aria-describedby="owners-passcode-help"
                />
                <p id="owners-passcode-help" className="text-xs text-slate-600 dark:text-slate-300">
                  Use the shared owners passcode to unlock this area.
                </p>
                {passcode && !passcodeIsValid && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Incorrect passcode. Please try again.</p>
                )}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  disabled={!passcode}
                >
                  Unlock owners area
                </button>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Need help? Reach out to the factor to confirm the passcode.
                </p>
              </form>
            </GlassCard>
          )}

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
