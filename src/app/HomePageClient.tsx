'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/** ------------------------------------------------
 *  Shared styles
 *  ------------------------------------------------ */
const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

/** ------------------------------------------------
 *  Hero rule pill
 *  ------------------------------------------------ */
function RulePill({ title, detail }: { title: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-full px-5 py-3 ${glass} text-center`}
    >
      <div className="text-sm font-semibold tracking-tight">{title}</div>
      <div className="text-xs mt-0.5 text-neutral-700 dark:text-neutral-300">{detail}</div>
    </motion.div>
  );
}

/** ------------------------------------------------
 *  Light/Dark icon without theme libs
 *  ------------------------------------------------ */
function DualModeIcon({
  lightSrc,
  darkSrc,
  alt,
  size = 128,
}: {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  size?: number;
}) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={size}
        height={size}
        className="block dark:hidden w-24 h-24 sm:w-28 sm:h-28 object-contain"
        priority
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={size}
        height={size}
        className="hidden dark:block w-24 h-24 sm:w-28 sm:h-28 object-contain"
        priority
      />
    </>
  );
}

/** ------------------------------------------------
 *  Reusable destination card
 *  ------------------------------------------------ */
function IconCard({
  title,
  href,
  lightIcon,
  darkIcon,
  blurb,
  iconAlt,
}: {
  title: string;
  href: string;
  lightIcon: string;
  darkIcon: string;
  blurb: string;
  iconAlt?: string;
}) {
  return (
    <Link href={href} className="group block focus:outline-none">
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`${glass} p-5 flex items-center gap-4 sm:gap-5 relative overflow-hidden`}
      >
        {/* sheen */}
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="absolute -inset-1 bg-gradient-to-tr from-white/15 to-transparent" />
        </span>

        <div className="shrink-0">
          <DualModeIcon lightSrc={lightIcon} darkSrc={darkIcon} alt={iconAlt ?? title} />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{blurb}</p>
          <span className="mt-2 inline-flex items-center text-sm underline underline-offset-4 text-neutral-900/80 dark:text-neutral-100/90">
            Open {title}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

/** ------------------------------------------------
 *  Lightweight photo carousel
 *  ------------------------------------------------ */
function PhotoCarousel() {
  const slides = [
    { src: '/images/buildingimages/front.jpg', alt: 'Front of James Square', w: 1535, h: 1024 },
    { src: '/images/buildingimages/garden.jpg', alt: 'Garden at James Square', w: 1200, h: 900 },
    { src: '/images/buildingimages/pool.jpg', alt: 'Pool at James Square', w: 1600, h: 1066 },
    { src: '/images/buildingimages/above.jpg', alt: 'James Square from above', w: 1536, h: 1024 },
  ];

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  return (
    <section className="mx-auto max-w-6xl mt-10 sm:mt-12">
      <div className={`${glass} p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold">Around James Square</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="rounded-xl border px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              onClick={next}
              className="rounded-xl border px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Next photo"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0.0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <Image
                src={slides[idx].src}
                alt={slides[idx].alt}
                width={slides[idx].w}
                height={slides[idx].h}
                className="w-full h-[280px] sm:h-[420px] object-cover"
                sizes="(min-width: 1024px) 1000px, 100vw"
                priority={idx === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === idx
                  ? 'bg-neutral-900 dark:bg-neutral-100'
                  : 'bg-neutral-400/40 dark:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** ------------------------------------------------
 *  Page
 *  ------------------------------------------------ */
export default function HomePageClient() {
  return (
    <main className="px-4 py-10 sm:py-14">
      {/* HERO */}
      <section className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`${glass} overflow-hidden`}
        >
          {/* Top image */}
          <div className="relative">
            <Image
              src="/images/buildingimages/above.jpg"
              alt="James Square from above"
              width={1536}
              height={1024}
              priority
              className="w-full h-[200px] sm:h-[320px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </div>

          <div className="p-6 sm:p-10">
            <header className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                James <span className="text-slate-500">Square</span>
                <br />
                <span className="text-neutral-900 dark:text-neutral-100">Community Website</span>
              </h1>
              <div className="mt-4 space-y-3 text-base sm:text-lg text-neutral-700 dark:text-neutral-300">
                <p>
                  James Square is a shared community website for residents and owners. It’s a place
                  access useful info about the area, to discuss issues or topics with other residents
                  and owners, access owners’ documents and AGM details, take part in votes, and stay
                  up to date with what’s happening around the square.
                </p>
                <p>
                  The site also provides the booking portal for the pool, gym, and sauna.
                </p>
              </div>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                This website is still evolving and will continue to be improved over time. Ideas,
                suggestions, and feedback are always welcome.
              </p>

              <div className="mt-7 space-y-3">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Booking Portal - book the pool, gym and sauna.
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
                  You can also use{' '}
                  <Link href="/dashboard" className="underline">
                    My Dashboard
                  </Link>{' '}
                  to view, edit and manage bookings and your account.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
                  <RulePill title="Bookable Windows" detail="05:30–09:30 • 17:00–23:00" />
                  <RulePill title="Daily Limit" detail="Max 2 slots per facility" />
                  <RulePill title="Free Use" detail="11:00–17:00 (no booking)" />
                </div>
              </div>
            </header>
          </div>
        </motion.div>
      </section>

      {/* MAIN ICON GRID */}
      <section className="mx-auto max-w-6xl mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IconCard
          title="Message Board"
          href="/message-board"
          lightIcon="/images/icons/message-icon-light.png"
          darkIcon="/images/icons/message-icon-dark.png"
          blurb="Share updates, ask questions and discuss anything related to James Square."
        />

        <IconCard
          title="My Dashboard"
          href="/dashboard"
          lightIcon="/images/icons/dashboard-icon-light.png"
          darkIcon="/images/icons/dashboard-icon-dark.png"
          blurb="View, edit and manage your bookings. Add bookings to your calendar."
        />

        <IconCard
          title="Book Facilities"
          href="/book"
          lightIcon="/images/icons/pool-icon-light.png"
          darkIcon="/images/icons/pool-icon-dark.png"
          blurb="Reserve time for the pool, gym or sauna."
        />

        <IconCard
          title="Owners Area"
          href="/owners"
          lightIcon="/images/icons/Owner-icon-light.PNG"
          darkIcon="/images/icons/Owner-icon-dark.PNG"
          blurb="Access owner information, voting, and owners-only updates."
          iconAlt="Owners area"
        />

        {/* Keep this route aligned with your header */}
        <IconCard
          title="Useful Info"
          href="/local"
          lightIcon="/images/icons/info-icon-light.png"
          darkIcon="/images/icons/info-icon-dark.png"
          blurb="Access, bins & recycling, contacts and local picks (food, shops, coffee)."
        />
      </section>

      {/* PHOTO CAROUSEL */}
      <PhotoCarousel />
    </main>
  );
}
