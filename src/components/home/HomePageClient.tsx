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
}: {
  title: string;
  href: string;
  lightIcon: string;
  darkIcon: string;
  blurb: string;
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
          <DualModeIcon lightSrc={lightIcon} darkSrc={darkIcon} alt={title} />
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
          <div className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/5 text-neutral-900 dark:text-white px-4 py-2 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Residents only — sign in with your email
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-neutral-900 dark:text-white">
                  Welcome to the James Square residents’ portal
                </h1>
                <p className="text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed">
                  Book your slot for shared amenities, find building information, and stay updated
                  with everything happening around the community.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <RulePill title="Pool" detail="Pre-book required for residents and guests" />
                  <RulePill title="Gym" detail="Adults only. One guest max." />
                  <RulePill title="Sauna" detail="Adults only. One guest max." />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-black text-white hover:bg-neutral-800 transition shadow-sm"
                  >
                    Book facilities
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href="/guide"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    Resident guide
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-[460px]">
                  <Image
                    src="/images/buildingimages/pool.jpg"
                    alt="Pool at James Square"
                    width={800}
                    height={600}
                    className="w-full rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                  <div className="absolute -left-4 -bottom-4 w-28 h-28 bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-lg">
                    <DualModeIcon
                      lightSrc="/images/logo/JQ Logo Black.png"
                      darkSrc="/images/logo/JQ Logo white.png"
                      alt="James Square logo"
                      size={112}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DESTINATIONS */}
      <section className="mx-auto max-w-6xl mt-10 sm:mt-14 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <IconCard
            title="Booking"
            href="/booking"
            blurb="Reserve times for the pool, gym, and sauna. Residents only."
            lightIcon="/images/icons/Bookings.png"
            darkIcon="/images/icons/Bookingsdark.png"
          />
          <IconCard
            title="Guide"
            href="/guide"
            blurb="Resident handbook covering site access, safety, parcel guidance, and more."
            lightIcon="/images/icons/Guide.png"
            darkIcon="/images/icons/Guidedark.png"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <IconCard
            title="Updates"
            href="/updates"
            blurb="Stay informed about works, maintenance, and other site updates."
            lightIcon="/images/icons/Announcements.png"
            darkIcon="/images/icons/Announcementsdark.png"
          />
          <IconCard
            title="Contacts"
            href="/contacts"
            blurb="Quickly find the right person to help with building or resident questions."
            lightIcon="/images/icons/Contacts.png"
            darkIcon="/images/icons/Contactsdark.png"
          />
          <IconCard
            title="Elections"
            href="/elections"
            blurb="Review candidates and vote in the Factor elections."
            lightIcon="/images/icons/podium.png"
            darkIcon="/images/icons/Podiumdark.png"
          />
        </div>
      </section>

      <PhotoCarousel />
    </main>
  );
}
