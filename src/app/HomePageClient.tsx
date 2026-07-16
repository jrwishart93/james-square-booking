'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Waves,
  Dumbbell,
  Flame,
  Megaphone,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { activeNoticeSummaries, type NoticeSummary } from '@/components/home/notices';

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
  {
    src: '/images/home-photos/01-calecresc.png',
    alt: 'Caledonian Crescent near James Square',
    w: 1235,
    h: 956,
  },
  {
    src: '/images/home-photos/02-poolatnight.png',
    alt: 'Pool area at night',
    w: 1536,
    h: 1024,
  },
  {
    src: '/images/home-photos/03-snowgarden.png',
    alt: 'James Square garden in the snow',
    w: 1329,
    h: 1086,
  },
  {
    src: '/images/home-photos/04-coffeeshop.png',
    alt: 'Local coffee shop near James Square',
    w: 1449,
    h: 1086,
  },
  {
    src: '/images/home-photos/05-bench.png',
    alt: 'Bench in the James Square garden',
    w: 1448,
    h: 1086,
  },
  {
    src: '/images/home-photos/06-building39.png',
    alt: 'James Square building 39',
    w: 1524,
    h: 1032,
  },
  {
    src: '/images/home-photos/07-building57.png',
    alt: 'James Square building 57',
    w: 1448,
    h: 1086,
  },
  {
    src: '/images/home-photos/08-building55.png',
    alt: 'James Square building 55',
    w: 1448,
    h: 1086,
  },
  {
    src: '/images/home-photos/09-building61.png',
    alt: 'James Square building 61',
    w: 1448,
    h: 1086,
  },
  {
    src: '/images/home-photos/10-frontgate.png',
    alt: 'Front gate at James Square',
    w: 1448,
    h: 1086,
  },
];
const carouselSlideDurationSeconds = 6.5;

function SectionHeader({
  children,
  action,
  reduceMotion,
}: {
  children: string;
  action?: React.ReactNode;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={sectionHeaderVariants(reduceMotion)}
      className="mb-5 flex items-center gap-3"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80 dark:bg-neutral-500" />
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {children}
      </p>
      <div className="flex-1 border-t border-neutral-200 dark:border-white/10" />
      {action}
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
  className = 'h-14 w-14 object-contain sm:h-16 sm:w-16',
}: {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={size}
        height={size}
        className={`block dark:hidden ${className}`}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={size}
        height={size}
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}

/** ------------------------------------------------
 *  Compact quick-action card
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
    <Link href={href} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-2xl">
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : { y: -3, boxShadow: '0 14px 34px rgba(0,0,0,0.10)' }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className={`${glass} flex h-full items-center gap-4 p-4 sm:p-5`}
      >
        <div className="shrink-0">
          <DualModeIcon lightSrc={lightIcon} darkSrc={darkIcon} alt={iconAlt ?? title} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-0.5 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
            {blurb}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-500" />
      </motion.div>
    </Link>
  );
}

/** ------------------------------------------------
 *  Building status panel
 *  ------------------------------------------------ */
const facilityStatuses = [
  { name: 'Swimming Pool', icon: Waves, open: false },
  { name: 'Gym', icon: Dumbbell, open: false },
  { name: 'Sauna', icon: Flame, open: false },
] as const;

function StatusDot({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 [animation-duration:2.4s] motion-reduce:animate-none ${
          open ? 'bg-emerald-400' : 'bg-rose-400'
        }`}
      />
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${
          open ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
    </span>
  );
}

function BuildingStatus({
  noticeCount,
  reduceMotion,
}: {
  noticeCount: number;
  reduceMotion: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl mt-10 sm:mt-14" aria-label="Building status">
      <SectionHeader reduceMotion={reduceMotion}>Building Status</SectionHeader>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerContainerVariants(reduceMotion, 0.05)}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {facilityStatuses.map(({ name, icon: Icon, open }) => (
          <motion.div key={name} variants={cardRevealVariants(reduceMotion)} className="h-full">
            <Link
              href="/updates#pool-facilities"
              className={`${glass} flex h-full flex-col gap-2 p-4 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:hover:translate-y-0 dark:hover:bg-white/15`}
            >
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot open={open} />
                <span
                  className={`text-sm font-semibold ${
                    open
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {open ? 'Open' : 'Temporarily closed'}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}

        <motion.div variants={cardRevealVariants(reduceMotion)} className="h-full">
          <Link
            href="/updates"
            className={`${glass} flex h-full flex-col gap-2 p-4 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:hover:translate-y-0 dark:hover:bg-white/15`}
          >
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Megaphone className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Building Notices</span>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
              <span className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                {noticeCount} active {noticeCount === 1 ? 'notice' : 'notices'}
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** ------------------------------------------------
 *  Latest updates — compact cards
 *  ------------------------------------------------ */
const noticeToneStyles: Record<NoticeSummary['tone'], { border: string; badge: string }> = {
  urgent: {
    border: 'border-l-rose-400',
    badge:
      'border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300',
  },
  action: {
    border: 'border-l-amber-400',
    badge:
      'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  },
  info: {
    border: 'border-l-neutral-300 dark:border-l-neutral-600',
    badge:
      'border-neutral-400/40 bg-neutral-500/10 text-neutral-700 dark:text-neutral-300',
  },
};

function UpdateCard({ notice }: { notice: NoticeSummary }) {
  const tone = noticeToneStyles[notice.tone];
  return (
    <Link
      href={`/updates#${notice.id}`}
      className={`${glass} group flex h-full flex-col border-l-[3px] ${tone.border} p-5 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:hover:translate-y-0 dark:hover:bg-white/15`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tone.badge}`}
        >
          {notice.badge}
        </span>
        <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
          {notice.date}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight">{notice.title}</h3>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {notice.summary}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
        Read more <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

/** ------------------------------------------------
 *  Facilities — hours & booking summary
 *  ------------------------------------------------ */
const facilityHours = [
  { label: 'Morning', hours: '05:30 – 09:30', note: 'Booking recommended' },
  { label: 'Open use', hours: '11:00 – 17:00', note: 'No booking needed' },
  { label: 'Evening', hours: '17:00 – 23:00', note: 'Booking recommended' },
];

const facilityCards = [
  { name: 'Swimming Pool', icon: Waves, href: '/book/pool' },
  { name: 'Gym', icon: Dumbbell, href: '/book/gym' },
  { name: 'Sauna', icon: Flame, href: '/book/sauna' },
];

function FacilityCard({
  name,
  icon: Icon,
  href,
}: {
  name: string;
  icon: typeof Waves;
  href: string;
}) {
  return (
    <div className={`${glass} flex h-full flex-col p-5`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/5 text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <h3 className="text-base font-semibold tracking-tight">{name}</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Closed
        </span>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        {facilityHours.map(({ label, hours, note }) => (
          <li key={label} className="flex items-baseline justify-between gap-2">
            <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
            <span className="text-right">
              <span className="font-medium tabular-nums">{hours}</span>
              <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">
                {note}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <Link
          href={href}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-900/10 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          Book {name.toLowerCase().replace('swimming ', '')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Lightweight photo carousel
 *  ------------------------------------------------ */
function PhotoCarousel() {
  const reduceMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeSlide = carouselSlides[idx];
  const panDirection = idx % 2 === 0 ? 1 : -1;
  const prev = () => setIdx((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setIdx((i) => (i + 1) % carouselSlides.length);

  useEffect(() => {
    if (reduceMotion || paused) return undefined;

    const interval = window.setInterval(() => {
      setIdx((i) => (i + 1) % carouselSlides.length);
    }, carouselSlideDurationSeconds * 1000);

    return () => window.clearInterval(interval);
  }, [paused, reduceMotion]);

  return (
    <section className="mx-auto max-w-6xl mt-14 sm:mt-16">
      <SectionHeader reduceMotion={Boolean(reduceMotion)}>Around James Square</SectionHeader>
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
        <div className="flex items-center justify-end mb-3 sm:mb-4">
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

        <div className="relative overflow-hidden rounded-xl bg-neutral-950">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: easeOut }}
              className="relative h-[280px] w-full sm:h-[420px]"
            >
              <Image
                src={activeSlide.src}
                alt=""
                width={activeSlide.w}
                height={activeSlide.h}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl saturate-125"
                sizes="(min-width: 1024px) 1000px, 100vw"
              />
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.03, x: 0, y: 0 }}
                animate={
                  reduceMotion
                    ? { scale: 1.03, x: 0, y: 0 }
                    : { scale: 1.12, x: panDirection * 14, y: -10 }
                }
                transition={{
                  duration: reduceMotion ? 0 : carouselSlideDurationSeconds,
                  ease: 'linear',
                }}
                style={{ willChange: 'transform' }}
              >
                <Image
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  width={activeSlide.w}
                  height={activeSlide.h}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 1000px, 100vw"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/10 dark:bg-white/15">
            <motion.div
              key={`progress-${idx}-${paused ? 'paused' : 'running'}`}
              className="h-full origin-left bg-neutral-950/70 dark:bg-white/80"
              initial={{ scaleX: 0 }}
              animate={reduceMotion || paused ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{
                duration: reduceMotion || paused ? 0 : carouselSlideDurationSeconds,
                ease: 'linear',
              }}
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

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
          Have a photo of James Square you would like to share on the website? Email it to{' '}
          <a
            href="mailto:contact@james-square.com"
            className="font-medium text-neutral-900 underline underline-offset-2 hover:text-sky-700 dark:text-neutral-100 dark:hover:text-sky-300"
          >
            contact@james-square.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/** ------------------------------------------------
 *  Subtle install-app card
 *  ------------------------------------------------ */
function InstallAppCard() {
  return (
    <section className="mx-auto max-w-6xl mt-14 sm:mt-16">
      <Link
        href="/how-to-app"
        className={`${glass} group flex items-center gap-4 p-4 transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/15 sm:p-5`}
      >
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[22%] bg-[#0b1220] shadow-sm">
          <Image
            src="/images/icons/JS-app-icon-1024.png"
            alt="James Square app icon"
            fill
            className="object-cover"
            sizes="48px"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold tracking-tight sm:text-base">
            Use James Square as an app
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-neutral-600 dark:text-neutral-400 sm:text-sm">
            Add the site to your phone&apos;s home screen for a fast, app-like experience.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100 sm:text-sm">
          How to install <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </section>
  );
}

/** ------------------------------------------------
 *  Page
 *  ------------------------------------------------ */
export default function HomePageClient() {
  const reduceMotion = Boolean(useReducedMotion());
  const { user } = useAuth();
  const heroKenBurnsAnimate = reduceMotion
    ? { scale: 1, x: 0, y: 0 }
    : { scale: [1, 1.045, 1], x: [0, 10, 0], y: [0, -7, 0] };
  const heroKenBurnsTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 30, ease: easeOut, repeat: Infinity };

  // Time-gated notices are resolved after mount so server and client markup match.
  const [notices, setNotices] = useState(() =>
    activeNoticeSummaries().filter((notice) => !notice.isActive)
  );
  useEffect(() => {
    setNotices(activeNoticeSummaries());
  }, []);

  return (
    <div className="px-4 py-10 sm:py-14">
      {/* HERO */}
      <section className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainerVariants(reduceMotion, 0.12)}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.25)]"
        >
          {/* Ken Burns background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 1, ...heroKenBurnsAnimate }}
            transition={{
              ...heroKenBurnsTransition,
              opacity: { duration: reduceMotion ? 0 : 1.1, ease: 'easeOut' },
            }}
            style={{ willChange: 'transform' }}
          >
            <Image
              src="/images/buildingimages/Day-drone-js.png"
              alt="Aerial view of James Square, Edinburgh, by day"
              width={1536}
              height={1024}
              priority
              className="block h-full w-full object-cover dark:hidden"
              sizes="(min-width: 1152px) 1152px, 100vw"
            />
            <Image
              src="/images/buildingimages/Night-drone-js.png"
              alt="Aerial view of James Square, Edinburgh, at night"
              width={1536}
              height={1024}
              priority
              className="hidden h-full w-full object-cover dark:block"
              sizes="(min-width: 1152px) 1152px, 100vw"
            />
          </motion.div>

          {/* Scrim for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/20" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,6,23,0.35)_100%)]" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[440px] flex-col items-center justify-end px-6 pb-12 pt-24 text-center sm:min-h-[560px] sm:pb-16 lg:min-h-[620px]">
            <motion.p
              variants={fadeUpVariants(reduceMotion)}
              className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-xs"
            >
              Residents&apos; community<span className="hidden sm:inline"> · Edinburgh</span>
            </motion.p>
            <motion.h1
              variants={fadeUpVariants(reduceMotion)}
              className="mt-3 text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(2,6,23,0.5)] sm:text-6xl lg:text-7xl"
            >
              James <span className="text-white/60">Square</span>
            </motion.h1>
            <motion.p
              variants={fadeUpVariants(reduceMotion)}
              className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
            >
              Notices, building information and shared facilities — all in one place.
            </motion.p>

            <motion.div
              variants={fadeUpVariants(reduceMotion)}
              className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-slate-950/30 transition-colors hover:bg-neutral-200"
              >
                Book facilities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Manage bookings
                </Link>
              ) : (
                <Link
                  href="/owners"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Owners area
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* BUILDING STATUS */}
      <BuildingStatus noticeCount={notices.length} reduceMotion={reduceMotion} />

      {/* QUICK ACTIONS */}
      <section className="mx-auto max-w-6xl mt-14 sm:mt-16">
        <SectionHeader reduceMotion={reduceMotion}>Quick Actions</SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainerVariants(reduceMotion, 0.05)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="Book Facilities"
              href="/book"
              lightIcon="/images/icons/new-pool-icon-light.png"
              darkIcon="/images/icons/new-pool-icon-dark.png"
              blurb="Reserve time for the pool, gym or sauna."
              reduceMotion={reduceMotion}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="My Dashboard"
              href="/dashboard"
              lightIcon="/images/icons/new-dashboard-icon-light.png"
              darkIcon="/images/icons/new-dashboard-icon-dark.png"
              blurb="View, edit and manage your bookings."
              reduceMotion={reduceMotion}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="Owners Area"
              href="/owners"
              lightIcon="/images/icons/Owner-icon-light.PNG"
              darkIcon="/images/icons/new-Owner-icon-dark.png"
              blurb="Owner information, voting and updates."
              iconAlt="Owners area"
              reduceMotion={reduceMotion}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="Message Board"
              href="/message-board"
              lightIcon="/images/icons/new-message-icon-light.png"
              darkIcon="/images/icons/new-message-icon-dark.png"
              blurb="Share updates and ask questions."
              reduceMotion={reduceMotion}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="Useful Info"
              href="/local"
              lightIcon="/images/icons/info-icon-light.png"
              darkIcon="/images/icons/new-info-icon-dark.png"
              blurb="Access, bins, contacts and local picks."
              reduceMotion={reduceMotion}
            />
          </motion.div>

          <motion.div variants={cardRevealVariants(reduceMotion)}>
            <IconCard
              title="Fior Payments Survey"
              href="/fior-questionnaire"
              lightIcon="/images/icons/q&a-light.png"
              darkIcon="/images/icons/q&a-dark.png"
              blurb="Tell us about additional payments made to Fior."
              reduceMotion={reduceMotion}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* LATEST UPDATES */}
      <section className="mx-auto max-w-6xl mt-14 sm:mt-16">
        <SectionHeader
          reduceMotion={reduceMotion}
          action={
            <Link
              href="/updates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              View all updates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          Latest Updates
        </SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainerVariants(reduceMotion, 0.08)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {notices.slice(0, 3).map((notice) => (
            <motion.div
              key={notice.id}
              variants={cardRevealVariants(reduceMotion)}
              className="h-full"
            >
              <UpdateCard notice={notice} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FACILITIES */}
      <section className="mx-auto max-w-6xl mt-14 sm:mt-16">
        <SectionHeader reduceMotion={reduceMotion}>Facilities</SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainerVariants(reduceMotion, 0.06)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {facilityCards.map((facility) => (
            <motion.div
              key={facility.name}
              variants={cardRevealVariants(reduceMotion)}
              className="h-full"
            >
              <FacilityCard {...facility} />
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Bookings are recommended for morning and evening sessions — open use during the day does
          not require a booking. Maximum of 2 bookings per facility per day.
        </p>
      </section>

      {/* PHOTO CAROUSEL */}
      <PhotoCarousel />

      {/* INSTALL APP */}
      <InstallAppCard />
    </div>
  );
}
