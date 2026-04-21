'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CalendarDays, ArrowRight, Building2, ChevronDown } from 'lucide-react';
import MobileAppPoster from '@/components/home/MobileAppPoster';

/** ------------------------------------------------
 *  Shared styles
 *  ------------------------------------------------ */
const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

const viewportOnce = { once: true, margin: '0px 0px -60px 0px' };
const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

function fadeUpVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? {
        hidden: { opacity: 1, y: 0, scale: 1 },
        show: { opacity: 1, y: 0, scale: 1 },
      }
    : {
        hidden: { opacity: 0, y: 12, scale: 0.99 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: easeOut },
        },
      };
}

function staggerContainerVariants(reduceMotion: boolean, stagger = 0.1): Variants {
  return reduceMotion
    ? {
        hidden: {},
        show: { transition: { staggerChildren: 0, delayChildren: 0 } },
      }
    : {
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      };
}

function sectionHeaderVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? {
        hidden: { opacity: 1, x: 0 },
        show: { opacity: 1, x: 0 },
      }
    : {
        hidden: { opacity: 0, x: -14 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.35, ease: easeOut },
        },
      };
}

function cardRevealVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: easeOut },
        },
      };
}

const carouselSlides = [
  { src: '/images/buildingimages/front.jpg', alt: 'Front of James Square', w: 1535, h: 1024 },
  { src: '/images/buildingimages/garden.jpg', alt: 'Garden at James Square', w: 1200, h: 900 },
  { src: '/images/buildingimages/pool.jpg', alt: 'Pool at James Square', w: 1600, h: 1066 },
  { src: '/images/buildingimages/above.jpg', alt: 'James Square from above', w: 1536, h: 1024 },
];

function SectionHeader({
  children,
  reduceMotion,
}: {
  children: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={sectionHeaderVariants(reduceMotion)}
      className="mb-4 flex items-center gap-3"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 dark:bg-neutral-500" />
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {children}
      </p>
      <div className="flex-1 border-t border-neutral-200 dark:border-white/10" />
    </motion.div>
  );
}

/** ------------------------------------------------
 *  Hero rule pill
 *  ------------------------------------------------ */
function RulePill({
  title,
  detail,
  accent = false,
  href,
}: {
  title: string;
  detail: string;
  accent?: boolean;
  href?: string;
}) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={
        accent
          ? 'rounded-2xl border border-emerald-400/35 bg-emerald-500/10 backdrop-blur-xl shadow-sm px-4 py-3 text-center'
          : `rounded-2xl px-4 py-3 ${glass} text-center ${
              href ? 'transition-colors hover:bg-white/70 dark:hover:bg-white/15' : ''
            }`
      }
    >
      <div
        className={`text-sm font-semibold tracking-tight ${
          accent ? 'text-emerald-800 dark:text-emerald-300' : ''
        }`}
      >
        {title}
      </div>
      <div
        className={`text-xs mt-0.5 ${
          accent
            ? 'text-emerald-700/80 dark:text-emerald-400'
            : 'text-neutral-700 dark:text-neutral-300'
        }`}
      >
        {detail}
      </div>
    </motion.div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`Book a ${title.toLowerCase()} facility slot`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      {content}
    </Link>
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
        className="block dark:hidden h-20 w-20 object-contain sm:h-24 sm:w-24"
        priority
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={size}
        height={size}
        className="hidden h-20 w-20 object-contain dark:block sm:h-24 sm:w-24"
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
  reduceMotion,
}: {
  title: string;
  href: string;
  lightIcon: string;
  darkIcon: string;
  blurb: string;
  iconAlt?: string;
  reduceMotion: boolean;
}) {
  return (
    <Link href={href} className="group block focus:outline-none">
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : { y: -4, scale: 1.015, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
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
          <span className="mt-3 inline-flex translate-x-0 items-center gap-1 rounded-full border border-neutral-900/10 bg-white/55 px-3 py-1 text-xs font-semibold text-neutral-900/70 transition-all group-hover:translate-x-1 group-hover:bg-white/80 group-hover:text-neutral-900 dark:border-white/10 dark:bg-white/10 dark:text-neutral-100/80 dark:group-hover:bg-white/15 dark:group-hover:text-neutral-100">
            Open {title} <ArrowRight className="h-3.5 w-3.5" />
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
  const reduceMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const prev = () => setIdx((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setIdx((i) => (i + 1) % carouselSlides.length);

  useEffect(() => {
    if (reduceMotion || paused) return undefined;

    const interval = window.setInterval(() => {
      setIdx((i) => (i + 1) % carouselSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [paused, reduceMotion]);

  return (
    <section className="mx-auto max-w-6xl mt-10 sm:mt-12">
      <div
        className={`${glass} p-4 sm:p-6`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setPaused(false);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg font-semibold">Around James Square</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="rounded-full border border-white/20 bg-white/40 dark:bg-white/5 w-9 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              onClick={next}
              className="rounded-full border border-white/20 bg-white/40 dark:bg-white/5 w-9 h-9 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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
                src={carouselSlides[idx].src}
                alt={carouselSlides[idx].alt}
                width={carouselSlides[idx].w}
                height={carouselSlides[idx].h}
                className="w-full h-[280px] sm:h-[420px] object-cover"
                sizes="(min-width: 1024px) 1000px, 100vw"
                priority={idx === 0}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/10 dark:bg-white/15">
            <motion.div
              key={`progress-${idx}-${paused ? 'paused' : 'running'}`}
              className="h-full origin-left bg-neutral-950/70 dark:bg-white/80"
              initial={{ scaleX: 0 }}
              animate={reduceMotion || paused ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{ duration: reduceMotion || paused ? 0 : 5, ease: 'linear' }}
            />
          </div>
        </div>

        <div className="mt-3 flex justify-center gap-1.5">
          {carouselSlides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition ${
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
 *  Pool & Facilities Notice
 *  ------------------------------------------------ */
function PoolNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-sky-400/30 border-l-sky-400 bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-emerald-500/10 p-6 shadow-lg shadow-sky-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
          Resident notice
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Pool &amp; Facilities Update
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          The pool area is currently closed following a plant room leak which caused an electrical
          fault and dehumidifier failure. The dehumidifier has been repaired and Myreside are
          arranging a full safety assessment before reopening.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="full-update"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-sky-400/30 pt-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Full Update – Pool &amp; Facilities
                </h3>
                <p>
                  Following the earlier incident within the swimming pool plant room, a leak in the
                  chlorine system caused water to come into contact with the electrical fuse box,
                  resulting in an electrical fault.
                </p>
                <p>
                  This fault affected the dehumidifier system, with a key motherboard component
                  requiring replacement. This has now been fitted, and the dehumidifier is back up
                  and running.
                </p>
                <p>
                  During the period where the ventilation system was not operating correctly,
                  elevated humidity levels built up within the pool area. Unfortunately, this
                  prolonged moisture has caused damage to sections of the ceiling, with some areas
                  becoming unsafe and partially falling.
                </p>
                <p>
                  As a result, the pool, gym, and sauna facilities remain closed while the
                  situation is properly assessed.
                </p>
                <p>
                  Myreside Management are currently arranging for a surveyor to attend and carry
                  out a full inspection of the affected areas. They are also in discussions with
                  the building&apos;s insurance provider to determine the necessary remedial works.
                </p>
                <p>
                  Now that the dehumidifier system has been restored, conditions within the pool
                  area can begin to stabilise. Further repairs will follow based on the
                  surveyor&apos;s findings.
                </p>
                <p>
                  The facilities will reopen once all works have been completed and the area has
                  been confirmed safe for residents to use. We appreciate your patience and
                  understanding while this is being resolved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read full update'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  AGM Announcement
 *  ------------------------------------------------ */
function AGMNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-violet-400/30 border-l-violet-400 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 p-6 shadow-lg shadow-violet-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-900 dark:text-violet-200">
          <CalendarDays className="h-3.5 w-3.5" />
          Owners notice
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        AGM – Thursday 4 June 2026
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          The James Square AGM is approaching. Owners can review what&apos;s been happening and
          vote on plans for improvements. Tenants, please make your owner aware.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="agm-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-violet-400/30 pt-4">
                <p>
                  The Annual General Meeting gives owners the opportunity to find out what has
                  been happening at James Square and to vote on plans for improvements going
                  forward. This will be our first AGM with Myreside Management as factors, taking
                  place on Thursday 4th June 2026 via Microsoft Teams.
                </p>
                <p>
                  For more information, and to leave suggestions on what you would like discussed,
                  please visit the AGM page, email Ania at Myreside Management, or leave a
                  comment on the AGM page.
                </p>
                <Link
                  href="/agm"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 transition-colors"
                >
                  <CalendarDays className="h-4 w-4" />
                  View AGM page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Myreside Management Notice
 *  ------------------------------------------------ */
function MyresideNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-emerald-400/30 border-l-emerald-400 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-6 shadow-lg shadow-emerald-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
          <Building2 className="h-3.5 w-3.5" />
          Property management
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Myreside Management
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          Myreside Management are the active property factor for James Square, taking over from
          Fior Asset &amp; Property on 1 February 2026. All owner payments, maintenance requests,
          and management queries should be directed to Myreside.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="myreside-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-emerald-400/30 pt-4">
                <p>
                  Myreside handle day-to-day operations including owner communications, payments,
                  contractor coordination, and routine site oversight.
                </p>
                <p>
                  Owners should no longer make any payments to Fior Asset &amp; Property. If any
                  payments have been made to Fior after 1 February 2026, contact Fior directly to
                  request a refund. If you have not yet set up payment with Myreside, please
                  contact them as soon as possible.
                </p>

                <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-4 space-y-1 text-sm">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">Myreside Management Limited</p>
                  <p>3 Dalkeith Road Mews, Edinburgh EH16 5GA</p>
                  <p>
                    Tel:{' '}
                    <a href="tel:01314663001" className="font-medium hover:underline">
                      0131 466 3001
                    </a>
                  </p>
                  <p>
                    24hr Emergencies:{' '}
                    <span className="font-medium">0131 466 3001 – press 1</span>
                  </p>
                  <p>
                    Email:{' '}
                    <a
                      href="mailto:info@myreside-management.co.uk"
                      className="underline underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      info@myreside-management.co.uk
                    </a>
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
                    Monday – Friday, 9am – 5:30pm
                  </p>
                </div>

                <Link
                  href="/myreside"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  Myreside information page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'View more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Page
 *  ------------------------------------------------ */
export default function HomePageClient() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotion);
  const heroKenBurnsAnimate = shouldReduceMotion
    ? { scale: 1, x: 0, y: 0 }
    : { scale: [1, 1.045, 1], x: [0, 10, 0], y: [0, -7, 0] };
  const heroKenBurnsTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 30, ease: easeOut, repeat: Infinity };

  return (
    <div className="px-4 py-10 sm:py-14">
      {/* HERO */}
      <section className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainerVariants(Boolean(reduceMotion), 0.1)}
          className={`${glass} overflow-hidden`}
        >
          {/* Top image */}
          <motion.div
            variants={
              reduceMotion
                ? fadeUpVariants(true)
                : {
                    hidden: { opacity: 0, scale: 0.97 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.5, ease: easeOut },
                    },
                  }
            }
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, y: 0 }}
              animate={reduceMotion ? { scale: 1, y: 0 } : { scale: 1.035, y: -3 }}
              transition={{
                duration: reduceMotion ? 0 : 45,
                ease: 'linear',
              }}
              style={{
                willChange: 'transform',
              }}
            >
              <Image
                src="/images/buildingimages/Day-drone-js.png"
                alt=""
                width={1536}
                height={1024}
                priority
                aria-hidden="true"
                className="block h-full w-full scale-105 object-cover opacity-30 blur-[6px] saturate-125 contrast-110 dark:hidden"
              />
              <Image
                src="/images/buildingimages/Night-drone-js.png"
                alt=""
                width={1536}
                height={1024}
                priority
                aria-hidden="true"
                className="hidden h-full w-full scale-105 object-cover opacity-40 blur-[6px] saturate-110 contrast-110 dark:block"
              />
            </motion.div>

            <div className="relative z-10 h-[240px] overflow-hidden bg-slate-100/80 dark:bg-[#070d18]/80 sm:h-[430px] lg:h-[460px]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_32%,rgba(255,255,255,0.72)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.18),transparent_46%),linear-gradient(180deg,rgba(2,6,23,0.16)_0%,transparent_34%,rgba(2,6,23,0.62)_100%)]" />
              <motion.div
                className="flex h-full w-full items-center justify-center dark:hidden"
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={heroKenBurnsAnimate}
                transition={heroKenBurnsTransition}
                style={{ willChange: 'transform' }}
              >
                {/* Light mode – daytime drone */}
                <Image
                  src="/images/buildingimages/Day-drone-js.png"
                  alt="James Square aerial daytime"
                  width={1536}
                  height={1024}
                  priority
                  className="block h-[92%] w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.16)] dark:hidden"
                />
              </motion.div>

              <motion.div
                className="hidden h-full w-full items-center justify-center dark:flex"
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={heroKenBurnsAnimate}
                transition={heroKenBurnsTransition}
                style={{ willChange: 'transform' }}
              >
                {/* Dark mode – nighttime drone */}
                <Image
                  src="/images/buildingimages/Night-drone-js.png"
                  alt="James Square aerial nighttime"
                  width={1536}
                  height={1024}
                  priority
                  className="hidden h-[92%] w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.28)] dark:block"
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-28 bg-gradient-to-t from-white/95 via-white/55 to-transparent backdrop-blur-[2px] [-webkit-mask-image:linear-gradient(to_top,black_0%,black_42%,transparent_100%)] [mask-image:linear-gradient(to_top,black_0%,black_42%,transparent_100%)] dark:from-neutral-950/85 dark:via-neutral-950/45 sm:h-36" />

              <motion.h1
                variants={fadeUpVariants(Boolean(reduceMotion))}
                className="absolute inset-x-5 top-[34%] z-20 text-center text-4xl font-bold leading-none tracking-normal text-slate-950 drop-shadow-[0_1px_12px_rgba(255,255,255,0.36)] dark:text-slate-100 dark:drop-shadow-[0_1px_16px_rgba(0,0,0,0.72)] sm:top-[36%] sm:text-6xl lg:text-7xl"
              >
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-0.35em] inset-y-[-0.22em] -z-10 rounded-full bg-white/70 blur-xl dark:hidden" />
                  <span>James</span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">Square</span>
                </span>
              </motion.h1>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/45 to-transparent dark:from-neutral-950/80 dark:via-neutral-950/25 dark:to-transparent" />
          </motion.div>

          <div className="bg-gradient-to-b from-white/95 to-white/60 px-6 pb-6 pt-5 dark:from-neutral-950/60 dark:to-white/5 sm:px-10 sm:pb-8 sm:pt-6">
            <header className="text-center">
              <motion.p
                variants={fadeUpVariants(Boolean(reduceMotion))}
                className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg"
              >
                Stay up to date with notices, building information and shared facilities at James
                Square.
              </motion.p>

              <motion.div
                variants={fadeUpVariants(Boolean(reduceMotion))}
                className="mt-5 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-950/10 transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  Book facilities
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-900/10 bg-white/70 px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Manage bookings
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUpVariants(Boolean(reduceMotion))}
                className="mt-6 border-t border-neutral-200/70 pt-5 dark:border-white/10"
              >
                <h2 className="text-lg sm:text-xl font-semibold">
                  Book the pool, gym &amp; sauna
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Morning and evening sessions need to be booked. Open use does not need a
                  booking.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <RulePill title="Morning" detail="05:30 – 09:30" href="/booking" />
                  <RulePill title="Evening" detail="17:00 – 23:00" href="/booking" />
                  <RulePill title="Open use" detail="11:00 – 17:00" accent />
                  <RulePill title="Daily limit" detail="Max 2 per facility" />
                </div>

                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                  No booking needed during open use hours (11:00 – 17:00)
                </p>
              </motion.div>
            </header>
          </div>
        </motion.div>
      </section>

      {/* NOTICES */}
      <section className="mx-auto max-w-6xl mt-10 sm:mt-12">
        <SectionHeader reduceMotion={Boolean(reduceMotion)}>Latest Updates</SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainerVariants(Boolean(reduceMotion), 0.08)}
          className="space-y-4"
        >
          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <PoolNotice />
          </motion.div>
          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <AGMNotice />
          </motion.div>
          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <MyresideNotice />
          </motion.div>
        </motion.div>
      </section>

      {/* QUICK LINKS */}
      <section className="mx-auto max-w-6xl mt-10 sm:mt-12">
        <SectionHeader reduceMotion={Boolean(reduceMotion)}>Quick Links</SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainerVariants(Boolean(reduceMotion), 0.06)}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <IconCard
              title="Message Board"
              href="/message-board"
              lightIcon="/images/icons/new-message-icon-light.png"
              darkIcon="/images/icons/new-message-icon-dark.png"
              blurb="Share updates, ask questions and discuss anything related to James Square."
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <IconCard
              title="My Dashboard"
              href="/dashboard"
              lightIcon="/images/icons/new-dashboard-icon-light.png"
              darkIcon="/images/icons/new-dashboard-icon-dark.png"
              blurb="View, edit and manage your bookings. Add bookings to your calendar."
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <IconCard
              title="Book Facilities"
              href="/book"
              lightIcon="/images/icons/new-pool-icon-light.png"
              darkIcon="/images/icons/new-pool-icon-dark.png"
              blurb="Reserve time for the pool, gym or sauna."
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <IconCard
              title="Owners Area"
              href="/owners"
              lightIcon="/images/icons/Owner-icon-light.PNG"
              darkIcon="/images/icons/new-Owner-icon-dark.png"
              blurb="Access owner information, voting, and owners-only updates."
              iconAlt="Owners area"
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(Boolean(reduceMotion))}>
            <IconCard
              title="Useful Info"
              href="/local"
              lightIcon="/images/icons/info-icon-light.png"
              darkIcon="/images/icons/new-info-icon-dark.png"
              blurb="Access, bins & recycling, contacts and local picks (food, shops, coffee)."
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* PHOTO CAROUSEL */}
      <PhotoCarousel />

      <MobileAppPoster />
    </div>
  );
}
