'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FormEvent, useState } from 'react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OWNERS_ACCESS_CODE = '3579';
const OWNERS_ACCESS_KEY = 'owners_secure_access';
const COMMITTEE_EMAIL = 'committee@jamessquare.org';
const EMAIL_SUBJECT = 'Request for owners access code – James Square';
const EMAIL_BODY =
  'I am an owner at James Square and would like to request the access code to the owners section of the website: https://www.james-square.com/owners';
const EMAIL_LINK = `mailto:${COMMITTEE_EMAIL}?subject=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${encodeURIComponent(EMAIL_BODY)}`;
const TEAMS_LINK =
  'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZjI4NmMzZjYtYmI3OS00ZDk3LTg1ZDgtNGE5NDI3YmExNzA1%40thread.v2/0?context=%7b%22Tid%22%3a%22f5c44b19-1c42-4ad7-b10e-1d2fcf2b71d3%22%2c%22Oid%22%3a%2290c27962-4d1a-4d45-8e9e-ff0f7b30452b%22%7d';
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  'Extraordinary General Meeting (EGM) – James Square'
)}&dates=20260121T180000Z/20260121T203000Z&details=${encodeURIComponent(
  `Online via Microsoft Teams\nThe access code will be shared with owners during the meeting.\n\nJoin online via Microsoft Teams: ${TEAMS_LINK}`
)}&location=${encodeURIComponent('Online via Microsoft Teams')}`;

const OwnersPage = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [accessCode, setAccessCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOwnersAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode === OWNERS_ACCESS_CODE) {
      sessionStorage.setItem(OWNERS_ACCESS_KEY, 'true');
      setIsSubmitting(true);
      const delay = prefersReducedMotion ? 0 : 250;
      window.setTimeout(() => {
        router.replace('/owners/secure');
      }, delay);
      return;
    }

    setShowError(true);
  };

  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
            Owners Area
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            A private space for James Square owners to access secure information and building updates.
          </p>
        </header>

        <div className="space-y-6">
          <GlassCard
            title="Owners access"
            titleClassName="text-slate-800/80 dark:text-slate-100/90"
            className="bg-white/80 border-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:bg-slate-900/30"
          >
            <p className="text-sm text-slate-700 dark:text-slate-200">
              This is a private area for owners of James Square.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              Owners can access secure documents, building updates, and the current voting area using an access code.
            </p>
            <div className="space-y-2 pt-2 text-left">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                The access code is available from a committee member, another owner, or at the upcoming Extraordinary
                General Meeting.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                The code should only be shared with owners of James Square.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <a
                  href={EMAIL_LINK}
                  className="font-semibold text-cyan-700 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Request access code by email
                </a>
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                The access code will also be shared during the Extraordinary General Meeting.
              </p>
            </div>

            <form className="space-y-3 pt-2" onSubmit={handleOwnersAccessSubmit}>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Enter owners access code
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Access code"
                  value={accessCode}
                  onChange={(event) => {
                    setAccessCode(event.target.value);
                    setShowError(false);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/40 dark:border-white/15 dark:bg-white/20 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white/90 backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-white/85 dark:text-slate-900 dark:border-white/20"
                >
                  Enter secure area
                </button>
              </div>
            </form>

            <AnimatePresence>
              {showError && (
                <motion.p
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                  className="text-sm text-rose-600 dark:text-rose-300"
                >
                  Incorrect access code.
                  <br />
                  If you’re an owner and don’t have the code, please contact the factor or ask another owner.
                </motion.p>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </GradientBG>
  );
};

export default OwnersPage;
