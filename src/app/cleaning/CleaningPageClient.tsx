'use client';

import Image from 'next/image';
import {
  Building2,
  CalendarCheck2,
  Camera,
  Check,
  Clock3,
  DoorOpen,
  Dumbbell,
  Flower2,
  HelpCircle,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Recycle,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Trash2,
  Users,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const schedule = [
  { day: 'Monday', areas: 'Blocks 45 & 51' },
  { day: 'Tuesday', areas: 'Block 39' },
  { day: 'Wednesday', areas: 'Block 55' },
  { day: 'Thursday', areas: 'Blocks 57, 59, 61 & 65' },
  { day: 'Friday', areas: 'Blocks 45 & 51' },
];

const communalDuties = [
  'Clean bin chute rooms',
  'Clean conservatory',
  'Clean lifts',
  'Litter pick parking area',
  'Clean vennel and surrounding roads',
  'Clean main street entrance',
  'Wipe down communal entrance doors where required',
];

const leisureDuties: { label: string; icon: LucideIcon }[] = [
  { label: 'Swimming pool', icon: Waves },
  { label: 'Gym', icon: Dumbbell },
  { label: 'Sauna', icon: Sparkles },
  { label: 'Showers', icon: ShowerHead },
  { label: 'Both changing rooms', icon: Users },
];

const quarterlyTasks = [
  'Wiping down all entrance canopies',
  'Cleaning canopy fascias',
  'Cleaning entrance pillars',
  'Cleaning all main block entrances',
  'Cleaning the front street entrance',
];

const residentTips: { label: string; icon: LucideIcon }[] = [
  { label: 'Reporting cleaning issues promptly', icon: HelpCircle },
  { label: 'Including photographs where possible', icon: Camera },
  { label: 'Disposing of rubbish correctly', icon: Trash2 },
  { label: 'Recycling where appropriate', icon: Recycle },
  { label: 'Not leaving bulky items in communal areas', icon: Building2 },
  { label: 'Keeping stairwells and corridors clear', icon: DoorOpen },
];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/70 bg-white/75 shadow-[0_20px_55px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, eyebrow }: { icon: LucideIcon; title: string; eyebrow?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-300/20">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-[#13243b] sm:text-3xl dark:text-white">{title}</h2>
      </div>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700 sm:text-base dark:text-slate-200">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function CleaningPageClient() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate mx-auto max-w-5xl pb-20 text-slate-700 dark:text-slate-200 sm:pb-10">
      <div className="pointer-events-none absolute -left-40 top-80 -z-10 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl dark:bg-amber-500/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-[70rem] -z-10 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" aria-hidden="true" />

      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#13243b] shadow-[0_28px_70px_-35px_rgba(15,23,42,0.7)]"
      >
        <div className="relative min-h-[440px] sm:min-h-[500px]">
          <Image
            src="/images/home-photos/10-frontgate.png"
            alt="The James Square main entrance and vehicle entrance"
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] via-[#13243b]/55 to-[#13243b]/10" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">James Square resident information</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">Cleaning Schedule</h1>
            <div className="mt-4 max-w-3xl space-y-2 text-sm leading-6 text-slate-100 sm:text-base sm:leading-7">
              <p>Keeping James Square clean, safe and well maintained is a shared responsibility between the cleaning contractor, the factor and residents.</p>
              <p>This page explains the weekly cleaning schedule, daily cleaning duties, gardening arrangements and how to report any cleaning issues.</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="mt-8 space-y-8">
        <Reveal>
          <GlassCard className="overflow-hidden">
            <div className="p-6 sm:p-8">
              <SectionHeading icon={CalendarCheck2} title="Weekly Cleaning Schedule" eyebrow="Cleaning rota" />
            </div>
            <div className="overflow-x-auto border-t border-slate-200/80 dark:border-white/10">
              <table className="w-full min-w-[32rem] border-collapse text-left">
                <thead className="bg-[#13243b] text-sm text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold sm:px-8">Day</th>
                    <th scope="col" className="px-6 py-4 font-semibold sm:px-8">Areas</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item) => (
                    <tr key={item.day} className="border-t border-slate-200/80 transition-colors hover:bg-amber-50/60 dark:border-white/10 dark:hover:bg-white/5">
                      <th scope="row" className="px-6 py-4 font-semibold text-[#13243b] sm:px-8 dark:text-white">
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
                            <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
                          </span>
                          {item.day}
                        </span>
                      </th>
                      <td className="px-6 py-4 font-medium sm:px-8">{item.areas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </Reveal>

        <section aria-labelledby="daily-duties-heading">
          <Reveal className="mb-5">
            <SectionHeading icon={Sparkles} title="Daily Cleaning Duties" eyebrow="Every day" />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <GlassCard className="h-full p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <h3 id="daily-duties-heading" className="text-xl font-semibold text-[#13243b] dark:text-white">Communal Areas</h3>
                </div>
                <CheckList items={communalDuties} />
              </GlassCard>
            </Reveal>
            <Reveal delay={0.08}>
              <GlassCard className="h-full p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Waves className="h-6 w-6 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#13243b] dark:text-white">Leisure Facilities</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Daily cleaning includes:</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {leisureDuties.map(({ label, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/5">
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                      <p className="mt-2 text-sm font-semibold text-[#13243b] dark:text-white">{label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
          <Reveal className="mt-5">
            <div role="note" className="rounded-2xl border border-sky-200 bg-sky-50/90 p-6 shadow-sm dark:border-sky-400/20 dark:bg-sky-400/10">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#13243b] text-amber-300"><Clock3 className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="text-xl font-semibold text-[#13243b] dark:text-white">Pool Cleaning Hours</h3>
                  <p className="mt-2">The swimming pool area is closed for cleaning every day between:</p>
                  <p className="mt-2 text-2xl font-bold text-[#13243b] dark:text-white">9:30am and 11:00am</p>
                  <p className="mt-2 text-sm leading-6">Please avoid using the pool during these times while cleaning is taking place.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full p-6 sm:p-8">
              <SectionHeading icon={ShieldCheck} title="Quarterly Tasks" eyebrow="Maintenance" />
              <p className="mb-5 mt-4">Quarterly maintenance includes:</p>
              <CheckList items={quarterlyTasks} />
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard className="h-full p-6 sm:p-8">
              <SectionHeading icon={Flower2} title="Gardening" eyebrow="Grounds" />
              <p className="mt-4">Current gardening schedule:</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200/70 dark:bg-amber-400/10 dark:ring-amber-300/20">
                  <Leaf className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold text-[#13243b] dark:text-white">Summer</h3>
                  <p className="mt-1 text-sm">Gardens are maintained:</p>
                  <p className="mt-2 font-bold text-[#13243b] dark:text-white">Twice per month</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200/70 dark:bg-sky-400/10 dark:ring-sky-300/20">
                  <Sparkles className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold text-[#13243b] dark:text-white">Winter</h3>
                  <p className="mt-1 text-sm">Gardens are maintained:</p>
                  <p className="mt-2 font-bold text-[#13243b] dark:text-white">Once per month</p>
                </div>
              </div>
              <p className="mt-5 text-sm italic text-slate-500 dark:text-slate-400">The exact dates vary depending on weather conditions and operational requirements.</p>
            </GlassCard>
          </Reveal>
        </div>

        <Reveal>
          <section id="report-cleaning-issue" className="scroll-mt-28 overflow-hidden rounded-2xl bg-[#13243b] text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.8)] ring-1 ring-white/10">
            <div className="p-6 sm:p-9">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-[#13243b]"><Mail className="h-6 w-6" aria-hidden="true" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Contact Myreside Management</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Report a Cleaning Issue</h2>
                </div>
              </div>
              <div className="mt-5 max-w-3xl space-y-3 leading-7 text-slate-200">
                <p>If you notice any cleaning issue within James Square, please let Myreside Management know as soon as possible.</p>
                <p>Where possible, please include photographs of the issue to help identify the problem quickly and ensure it is resolved efficiently.</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a href="mailto:cleaning@myreside-management.co.uk" className="group rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300"><Mail className="h-4 w-4" aria-hidden="true" /> Email</span>
                  <span className="mt-2 block break-all font-semibold">cleaning@myreside-management.co.uk</span>
                </a>
                <a href="tel:+441314663001" className="group rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300"><Phone className="h-4 w-4" aria-hidden="true" /> Telephone</span>
                  <span className="mt-2 block font-semibold">0131 466 3001</span>
                </a>
              </div>
              <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-slate-300"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />Please attach photographs where possible and include the location of the issue (block number, floor or communal area).</p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <GlassCard className="p-6 sm:p-8">
            <SectionHeading icon={Users} title="How Residents Can Help" eyebrow="Helpful tips" />
            <p className="mt-4">Residents can help keep James Square looking its best by:</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {residentTips.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/65 p-3 dark:border-white/10 dark:bg-white/5">
                  <Icon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <p className="text-sm font-medium text-[#13243b] dark:text-white">{label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-white p-6 text-center shadow-sm dark:border-amber-300/20 dark:from-amber-400/10 dark:to-white/5">
            <Sparkles className="mx-auto h-6 w-6 text-amber-600 dark:text-amber-300" aria-hidden="true" />
            <p className="mx-auto mt-3 max-w-2xl font-semibold text-[#13243b] dark:text-white">Thank you for helping keep James Square clean, safe and welcoming for everyone.</p>
          </div>
        </Reveal>
      </div>

      <a href="#report-cleaning-issue" className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex items-center justify-center gap-2 rounded-2xl bg-[#13243b] px-5 py-3.5 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/20 transition active:scale-[0.98] sm:hidden">
        <Mail className="h-4 w-4 text-amber-300" aria-hidden="true" />
        Report a Cleaning Issue
      </a>
    </div>
  );
}
