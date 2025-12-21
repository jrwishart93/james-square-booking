'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

import { FacilityCard } from '@/components/FacilityCard';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

const FACILITIES = [
  { title: 'Pool', href: '/book/schedule?facility=pool', imageSrc: '/images/icons/simple-pool-icon.png' },
  { title: 'Gym', href: '/book/schedule?facility=gym', imageSrc: '/images/icons/simple-gym-icon.png' },
  { title: 'Sauna', href: '/book/schedule?facility=sauna', imageSrc: '/images/icons/simple-sauna-icon.png' },
];

const OPENING_TIMES = [
  { label: 'Facilities open daily', time: '05:30–23:00' },
  { label: 'Cleaning (Mon–Fri)', time: '09:30–11:00', note: 'Limited lane access during quick cleans.' },
  { label: 'Extended cleaning (every other Tue)', time: '09:00–12:30', note: 'Pool closed while deep cleaning takes place.' },
  { label: 'No booking required', time: '11:00–17:00', note: 'Drop in freely during daytime off-peak.' },
  { label: 'Booking required', time: '05:30–09:30 and 17:00–23:00', note: 'Secure a slot for early morning and evening peaks.' },
];

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6 font-sans bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center text-center gap-3">
        <h1 className="text-4xl font-bold text-black dark:text-white">Choose a facility</h1>
        <p className="text-base text-gray-600 dark:text-gray-300">Select a space to view schedules and book your spot.</p>
        <div className="w-full max-w-xl flex items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-800/60">
          <Button variant="ghost" href="/book/schedule" className="text-sm sm:text-base">
            View availability
          </Button>
          <Button variant="secondary" href="/dashboard" className="text-sm sm:text-base">
            My dashboard
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {FACILITIES.map((facility) => (
          <FacilityCard key={facility.title} {...facility} />
        ))}
      </div>
      <div className="mt-16">
        <GlassCard title="Opening times &amp; rules" className="text-base">
          <details className="group">
            <summary
              className="list-none flex w-full items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-slate-900 shadow-sm transition hover:border-white/60 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden"
            >
              <span className="font-semibold">Open daily 05:30–23:00</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-slate-700 transition duration-200 group-open:rotate-180 dark:bg-white/10 dark:text-white">
                <ChevronDown className="h-4 w-4" aria-hidden />
              </span>
            </summary>

            <div className="mt-6 space-y-6 text-slate-700 dark:text-white/80">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Opening Times</h3>

                <div className="space-y-4">
                  {OPENING_TIMES.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/50 bg-white/70 px-4 py-3 shadow-sm backdrop-blur sm:flex sm:items-baseline sm:justify-between sm:gap-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-white/70">{item.label}</p>
                        {item.note && <p className="text-xs text-slate-500 dark:text-white/50">{item.note}</p>}
                      </div>
                      <p className="mt-2 text-base font-semibold tabular-nums text-slate-900 sm:mt-0 dark:text-white">
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pool rules</h3>
                <div className="mx-auto max-w-2xl">
                  <Image
                    src="/images/icons/poolrules.png"
                    alt="Pool Rules"
                    width={800}
                    height={900}
                    className="h-auto max-h-[460px] w-full rounded-xl border border-white/50 object-contain shadow-md dark:border-white/10"
                  />
                </div>
              </div>
            </div>
          </details>
        </GlassCard>
      </div>

    </main>
  );
}
