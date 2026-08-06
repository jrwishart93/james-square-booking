'use client';

import Image from 'next/image';
import {
  BrushCleaning,
  Camera,
  CircleCheck,
  DoorOpen,
  Info,
  LampCeiling,
  Leaf,
  Mail,
  Phone,
  Sparkles,
  SquareStack,
  Trash2,
  Waves,
  Webhook,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const schedule = [
  {
    day: 'Monday',
    duties: 'Vacuum all carpeted areas and stairs. Mop all tiled areas. Clean entrance doors and glass.',
  },
  {
    day: 'Tuesday',
    duties: 'Clean the swimming pool, changing rooms, toilets, showers, gym and sauna.',
  },
  {
    day: 'Wednesday',
    duties: 'Vacuum all carpeted areas and stairs. Mop all tiled areas. Clean entrance doors and glass.',
  },
  {
    day: 'Thursday',
    duties: 'Clean the swimming pool, changing rooms, toilets, showers, gym and sauna.',
  },
  {
    day: 'Friday',
    duties: 'Vacuum and mop communal areas. Clean entrance doors and glass. Remove leaves and debris.',
  },
];

const reportItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Dirty communal floors', icon: BrushCleaning },
  { label: 'Dirty windows', icon: SquareStack },
  { label: 'Overflowing bins', icon: Trash2 },
  { label: 'Unclean lighting areas', icon: LampCeiling },
  { label: 'Cobwebs', icon: Webhook },
  { label: 'Dirty entrance doors', icon: DoorOpen },
  { label: 'Stair cleaning issues', icon: Waves },
  { label: 'Leaves or debris', icon: Leaf },
];

function GlassSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`rounded-2xl border border-white/55 bg-white/65 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.38)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl dark:text-white">{children}</h2>
    </div>
  );
}

export default function CleaningPageClient() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate mx-auto max-w-5xl pb-8 text-slate-700 dark:text-slate-200">
      <div
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 top-[34rem] -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10"
        aria-hidden="true"
      />

      <motion.header
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mb-10 text-center"
      >
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="relative h-20 w-64 sm:h-24 sm:w-72">
            <Image
              src="/images/logo/myreside-logo-removebg-preview.png"
              alt="Myreside Management logo"
              fill
              priority
              sizes="(min-width: 640px) 288px, 256px"
              className="object-contain"
            />
          </div>
          <div className="my-3 h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
          <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-950 p-2 shadow-xl ring-1 ring-white/20 sm:h-28 sm:w-28">
            <Image
              src="/images/logo/Logo-white.PNG"
              alt="James Square logo"
              fill
              priority
              sizes="112px"
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>
        <div className="mt-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Resident information
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            James Square Cleaning Information
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            Keeping James Square clean is a shared responsibility. This page explains the current cleaning schedule,
            who carries out the work, and how to report any cleaning issues.
          </p>
        </div>
      </motion.header>

      <div className="space-y-7">
        <GlassSection className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cleaning services</p>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Myreside Management</h2>
              </div>
            </div>
            <a
              href="tel:+441314663001"
              className="rounded-xl border border-slate-200 bg-white/80 px-5 py-3 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              0131 466 3001
            </a>
          </div>
        </GlassSection>

        <GlassSection className="overflow-hidden">
          <div className="p-5 sm:p-7">
            <SectionTitle icon={Sparkles}>Weekly Cleaning Schedule</SectionTitle>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The weekly rota covers routine cleaning throughout James Square’s shared spaces.
            </p>
          </div>

          <div className="hidden border-t border-slate-200/70 md:block dark:border-white/10">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <th scope="col" className="w-40 px-7 py-4 font-semibold">Day</th>
                  <th scope="col" className="px-7 py-4 font-semibold">Cleaning duties</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item) => (
                  <tr key={item.day} className="border-t border-slate-200/70 transition hover:bg-white/65 dark:border-white/10 dark:hover:bg-white/5">
                    <th scope="row" className="px-7 py-5 font-semibold text-slate-950 dark:text-white">{item.day}</th>
                    <td className="px-7 py-5 leading-6">{item.duties}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 border-t border-slate-200/70 p-4 md:hidden dark:border-white/10">
            {schedule.map((item) => (
              <article key={item.day} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h3 className="font-semibold text-sky-800 dark:text-sky-300">{item.day}</h3>
                <p className="mt-2 text-sm leading-6">{item.duties}</p>
              </article>
            ))}
          </div>
        </GlassSection>

        <GlassSection className="p-5 sm:p-7">
          <SectionTitle icon={Info}>Report a Cleaning Issue</SectionTitle>
          <p className="mt-5 leading-7">
            If you notice any cleaning issues within the communal areas of James Square, please report them directly
            to Myreside Management.
          </p>
          <a
            href="mailto:cleaning@myreside-management.co.uk"
            className="group mt-5 flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/90 p-4 font-semibold text-sky-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200"
          >
            <Mail className="h-5 w-5 shrink-0 transition group-hover:scale-110" aria-hidden="true" />
            <span className="break-all">cleaning@myreside-management.co.uk</span>
          </a>

          <div className="mt-6">
            <h3 className="font-semibold text-slate-950 dark:text-white">Please include:</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                'A brief description of the issue',
                'The location within James Square',
                'A photograph where possible',
                'Any additional information that may assist',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div role="note" className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm leading-6 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
            <Camera className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>Attaching a photograph helps Myreside Management identify and resolve the issue much more quickly.</p>
          </div>
        </GlassSection>

        <section aria-labelledby="reportable-heading">
          <div className="mb-5 text-center">
            <h2 id="reportable-heading" className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              What Should Be Reported?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Report problems in any shared or communal area.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {reportItems.map(({ label, icon: Icon }, index) => (
              <motion.article
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group rounded-2xl border border-white/55 bg-white/65 p-4 text-center shadow-[0_12px_35px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-sky-100 group-hover:text-sky-700 dark:bg-white/10 dark:text-slate-200 dark:group-hover:bg-sky-400/15 dark:group-hover:text-sky-300">
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900 dark:text-white">{label}</h3>
              </motion.article>
            ))}
          </div>
        </section>

        <GlassSection className="p-5 sm:p-7">
          <SectionTitle icon={Info}>Cleaning Response</SectionTitle>
          <div className="mt-5 space-y-3 leading-7">
            <p>Cleaning issues are reviewed by Myreside Management during normal working hours.</p>
            <p className="font-semibold text-slate-950 dark:text-white">
              Urgent health and safety concerns should be reported by telephone.
            </p>
          </div>
          <a href="tel:+441314663001" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call 0131 466 3001
          </a>
        </GlassSection>
      </div>

      <footer className="mt-10 border-t border-slate-200/80 pt-7 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-200">James Square Management Information</p>
        <p className="mt-1">Cleaning services are managed by Myreside Management.</p>
      </footer>
    </div>
  );
}
