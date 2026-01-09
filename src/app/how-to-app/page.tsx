'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HowToAppPage() {
  const stepVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const iPhoneSteps = [
    {
      text: 'Open Safari and go to www.james-square.com, then tap the three dots in the bottom-right corner.',
      image: '/images/brands/step1-removebg-preview.png',
    },
    {
      text: 'From the menu, tap Share to open the iOS sharing options.',
      image: '/images/brands/step2-removebg-preview.png',
    },
    {
      text: 'Scroll down and tap Add to Home Screen.',
      image: '/images/brands/step3-removebg-preview.png',
    },
    {
      text: 'Check the details and make sure Open as Web App is enabled, then tap Add.',
      image: '/images/brands/step4-removebg-preview.png',
    },
    {
      text: 'James Square will now appear on your home screen. Tap it to open like an app.',
      image: '/images/brands/step5-removebg-preview.png',
    },
  ];

  const androidSteps = [
    'Open James Square in Chrome.',
    'Tap the menu (three dots) in the top-right corner.',
    'Tap Add to Home screen or Install app.',
    'Confirm when prompted.',
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <motion.div
        className="space-y-8 text-[color:var(--text-primary)]"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.header variants={sectionVariants} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Helpful guide
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Use James Square as an app on your phone
          </h1>
          <p className="text-[color:var(--text-secondary)]">
            If you regularly use James Square on your phone, you can add it to your home screen and open it like an app.
          </p>
          <p className="text-[color:var(--text-secondary)]">
            This does not install anything from an app store. It simply creates an app-style shortcut that opens James
            Square full screen for quicker access.
          </p>
        </motion.header>

        {/* iPhone section */}
        <motion.section
          variants={sectionVariants}
          className="glass-surface glass-outline space-y-6 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            iPhone (Safari)
          </p>
          <h2 className="text-xl font-semibold">On iPhone</h2>

          <motion.ol variants={containerVariants} className="space-y-6">
            {iPhoneSteps.map((step, index) => (
              <motion.li
                key={index}
                variants={stepVariants}
                className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
              >
                {/* Step number */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--btn-bg)]/10 text-sm font-semibold">
                  {index + 1}
                </span>

                {/* Image + text */}
                <div className="flex flex-1 flex-col gap-3">
                  <div className="relative w-full max-w-[260px]">
                    <Image
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      width={260}
                      height={520}
                      className="rounded-xl border border-black/5"
                    />
                  </div>
                  <p className="text-[color:var(--text-secondary)]">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>

          <p className="text-sm text-[color:var(--text-secondary)]">
            Once added, James Square opens full screen and behaves like a dedicated app.
          </p>
        </motion.section>

        {/* Android section */}
        <motion.section
          variants={sectionVariants}
          className="glass-surface glass-outline space-y-4 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-5 sm:p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Android (Chrome)
          </p>
          <h2 className="text-xl font-semibold">On Android</h2>

          <motion.ol variants={containerVariants} className="space-y-3">
            {androidSteps.map((step, index) => (
              <motion.li key={step} variants={stepVariants} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--btn-bg)]/10 text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="text-[color:var(--text-secondary)]">{step}</p>
              </motion.li>
            ))}
          </motion.ol>
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
