'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import AddToHomeCarousel from '@/components/AddToHomeCarousel';
import '@/styles/add-to-home.css';

const androidSteps = [
  'Open James Square in Chrome.',
  'Tap the menu (three dots) in the top-right corner.',
  'Tap Add to Home screen or Install app.',
  'Confirm when prompted.',
];

export default function HowToAppPage() {
  const shouldReduceMotion = useReducedMotion();
  const [isAndroidOpen, setIsAndroidOpen] = useState(false);

  const easedOut = [0.16, 1, 0.3, 1] as const;
  const stepTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: easedOut };

  const sectionVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <motion.div
        className="space-y-10 text-[color:var(--text-primary)]"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Header */}
        <motion.header variants={sectionVariants} className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            App-style setup
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
            Use James Square like a native app
          </h1>
          <div className="space-y-3 text-[color:var(--text-secondary)]">
            <p>
              Add James Square to your home screen for a fast, full-screen experience that feels just like an app.
            </p>
            <p>
              Nothing installs from an app store. You simply create a shortcut that opens James Square instantly.
            </p>
          </div>
        </motion.header>

        {/* iPhone section */}
        <motion.section
          variants={sectionVariants}
          className="space-y-8 rounded-2xl px-1 py-4 sm:px-2 sm:py-6"
        >
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
              iPhone · Safari
            </p>
            <h2 className="text-2xl font-semibold">Your guided setup</h2>
            <p className="text-sm text-[color:var(--text-secondary)]">
              Follow each step to add James Square to your home screen.
            </p>
          </div>

          <AddToHomeCarousel />

          <div className="glass-surface glass-outline flex items-center gap-3 rounded-2xl border border-[color:var(--glass-border)]/70 bg-white/60 p-4 text-sm text-[color:var(--text-secondary)] sm:p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 0 1 0 1.42l-7.2 7.2a1 1 0 0 1-1.42 0l-3.6-3.6a1 1 0 1 1 1.42-1.42l2.89 2.89 6.49-6.49a1 1 0 0 1 1.42 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p>James Square will now open full screen like an app.</p>
          </div>
        </motion.section>

        {/* Android section */}
        <motion.section
          variants={sectionVariants}
          className="glass-surface glass-outline space-y-4 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Android · Chrome
              </p>
              <h2 className="text-xl font-semibold">Android setup</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAndroidOpen((prev) => !prev)}
              className="rounded-full border border-[color:var(--glass-border)]/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)] transition hover:bg-white/90"
              aria-expanded={isAndroidOpen}
            >
              {isAndroidOpen ? 'Hide steps' : 'Show steps'}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isAndroidOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={stepTransition}
                className="overflow-hidden"
              >
                <ol className="space-y-3 pt-2 text-[color:var(--text-secondary)]">
                  {androidSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-sm">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-white/60 text-xs font-semibold text-[color:var(--muted)]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Reassurance */}
        <motion.section
          variants={sectionVariants}
          className="space-y-3 rounded-2xl border border-dashed border-[color:var(--glass-border)] bg-white/40 p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Note
          </p>
          <h2 className="text-base font-semibold">A quick reassurance</h2>
          <p className="text-[color:var(--text-secondary)]">
            This does not enable notifications, tracking, or background activity.
          </p>
          <p className="text-[color:var(--text-secondary)]">
            It simply provides quicker access to the James Square website in an app-style view.
          </p>
        </motion.section>

        {/* Back link */}
        <motion.div variants={sectionVariants}>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold"
          >
            <span className="text-base transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current after:opacity-40 after:transition group-hover:after:opacity-80">
              Back to dashboard
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
