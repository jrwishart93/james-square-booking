'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { DateTime } from 'luxon';
import { Calendar, Lock, Vote } from 'lucide-react';

const expiryDate = DateTime.fromISO('2026-01-21T18:30:00', { zone: 'Europe/London' });

export default function EGMAnnouncementBanner() {
  const now = DateTime.now().setZone('Europe/London');
  const reduceMotion = useReducedMotion();

  if (now >= expiryDate) {
    return null;
  }

  return (
    <motion.section
      className="mx-auto max-w-6xl"
      initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="flex flex-col gap-5">
          <header className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Announcement
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Extraordinary General Meeting (EGM) —{' '}
              <span className="font-bold">Tonight at 6:00pm</span>
            </h2>
          </header>

          <div className="space-y-5 text-base text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-3">
              <motion.span
                className="mt-0.5 text-slate-500 dark:text-slate-300"
                aria-hidden
                initial={reduceMotion ? undefined : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: reduceMotion ? 0 : 0.05 }}
              >
                <Calendar className="h-5 w-5" />
              </motion.span>
              <p>
                Tonight at 6:00pm — The Extraordinary General Meeting (EGM) will be held online via
                Microsoft Teams.
              </p>
            </div>

            <div className="h-px bg-slate-200/50 dark:bg-slate-700/50" aria-hidden />

            <div className="flex items-start gap-3">
              <motion.span
                className="mt-0.5 text-slate-500 dark:text-slate-300"
                aria-hidden
                initial={reduceMotion ? undefined : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: reduceMotion ? 0 : 0.1 }}
              >
                <Vote className="h-5 w-5" />
              </motion.span>
              <p>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Voting will open after the meeting
                </span>{' '}
                to decide on a new property factor to replace Fior.
              </p>
            </div>

            <div className="h-px bg-slate-200/50 dark:bg-slate-700/50" aria-hidden />

            <div className="flex items-start gap-3">
              <motion.span
                className="mt-0.5 text-slate-500 dark:text-slate-300"
                aria-hidden
                initial={reduceMotion ? undefined : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: reduceMotion ? 0 : 0.15 }}
              >
                <Lock className="h-5 w-5" />
              </motion.span>
              <div className="space-y-1">
                <p>The access code has been emailed to all registered owners.</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Owners who have not yet verified can do so via the Dashboard after logging in or
                  signing up.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Need help? Email support@james-square.com
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
