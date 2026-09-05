'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Megaphone } from 'lucide-react';
import { activeNoticeSummaries, type NoticeSummary } from '@/components/home/notices';
import {
  bookingEnabled,
  facilitiesExplainer,
  facilitiesHeadline,
  facilitiesPageLinkLabel,
  facilityStatuses,
} from '@/components/home/facilityStatus';

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
 *  Facilities status band
 *  ------------------------------------------------ */
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

function FacilitiesStatus({
  noticeCount,
  reduceMotion,
}: {
  noticeCount: number;
  reduceMotion: boolean;
}) {
  return (
    <section className="mx-auto mt-6 max-w-6xl sm:mt-10" aria-labelledby="facilities-status-heading">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUpVariants(reduceMotion)}
        className={`${glass} p-5 sm:p-7`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 sm:text-xs">
          Facilities
        </p>
        <h2
          id="facilities-status-heading"
          className="mt-1.5 text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl"
        >
          {facilitiesHeadline}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {facilityStatuses.map(({ key, name, open, expectedReopen }) => (
            <div
              key={key}
              className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white/55 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <StatusDot open={open} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {name}
                </p>
                <p
                  className={`text-xs font-medium ${
                    open
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {open ? 'Open' : 'Closed'}
                  {!open && expectedReopen ? ` \u00b7 expected ${expectedReopen}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {facilitiesExplainer}
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Link
            href="/updates#pool-facilities"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Read the full facilities update
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/updates"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            {noticeCount} active {noticeCount === 1 ? 'notice' : 'notices'}
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href="/book"
            className={`inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              bookingEnabled
                ? 'text-sm font-semibold text-sky-700 underline dark:text-sky-300'
                : 'text-sm font-medium text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {facilitiesPageLinkLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
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
 *  Audience doors: Owners and Residents
 *  ------------------------------------------------ */
type AudienceDoor = {
  eyebrow: string;
  title: string;
  strapline: string;
  body: string;
  cta: { label: string; href: string };
  links: Array<{ label: string; href: string }>;
};

const audienceDoors: AudienceDoor[] = [
  {
    eyebrow: 'For owners',
    title: 'Owners',
    strapline: 'Governance, money and decisions.',
    body: 'Fior handover and the payments survey, AGM papers and summaries, sinking fund and Trinity balances, voting and consultations, your factor contacts.',
    cta: { label: 'Go to the owners area', href: '/owners' },
    links: [
      { label: 'AGM papers and summaries', href: '/agm' },
      { label: 'Voting and consultations', href: '/voting' },
      { label: 'Fior payments survey', href: '/fior-questionnaire' },
    ],
  },
  {
    eyebrow: 'For residents',
    title: 'Residents',
    strapline: 'Living here, day to day.',
    body: 'Current notices, bin days and recycling, building access and parking, is the pool open, the message board, local recommendations.',
    cta: { label: 'See what is happening', href: '/updates' },
    links: [
      { label: 'Notices and updates', href: '/updates' },
      { label: 'Message board', href: '/message-board' },
      { label: 'Bins, access and parking', href: '/local' },
    ],
  },
];

function AudienceDoors({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="mx-auto mt-12 max-w-6xl sm:mt-16" aria-label="Choose your area">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerContainerVariants(reduceMotion, 0.08)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {audienceDoors.map((door) => (
          <motion.div key={door.title} variants={cardRevealVariants(reduceMotion)} className="h-full">
            <div className={`${glass} flex h-full flex-col p-6 sm:p-7`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 sm:text-xs">
                {door.eyebrow}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                {door.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {door.strapline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {door.body}
              </p>

              <ul className="mt-5 space-y-1.5">
                {door.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                    >
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  href={door.cta.href}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:w-auto"
                >
                  {door.cta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/** ------------------------------------------------
 *  Living here: the day to day practicalities
 *  ------------------------------------------------ */
const livingHereLinks = [
  { title: 'Bins and recycling', blurb: 'Collection days and where the bins are.', href: '/local' },
  { title: 'Access and parking', blurb: 'Entry, fobs, visitors and where to park.', href: '/local' },
  { title: 'Cleaning', blurb: 'Stair and common area cleaning schedule.', href: '/cleaning' },
  { title: 'Message board', blurb: 'Ask neighbours a question or share news.', href: '/message-board' },
  { title: 'Your factor', blurb: 'Myreside Management contacts and reporting.', href: '/myreside' },
  { title: 'Around Dalry', blurb: 'Coffee, food and shops within a short walk.', href: '/local' },
];

function LivingHere({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="mx-auto mt-12 max-w-6xl sm:mt-16">
      <SectionHeader reduceMotion={reduceMotion}>Living Here</SectionHeader>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={staggerContainerVariants(reduceMotion, 0.05)}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {livingHereLinks.map((item) => (
          <motion.div key={item.title} variants={cardRevealVariants(reduceMotion)} className="h-full">
            <Link
              href={item.href}
              className={`${glass} group flex h-full items-center gap-3 p-4 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:hover:translate-y-0 dark:hover:bg-white/15`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold tracking-tight sm:text-base">{item.title}</h3>
                <p className="mt-0.5 text-xs leading-snug text-neutral-600 dark:text-neutral-400 sm:text-sm">
                  {item.blurb}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-500" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/** ------------------------------------------------
 *  New to James Square: visitors and prospective buyers
 *  ------------------------------------------------ */
function NewToJamesSquare({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="mx-auto mt-12 max-w-6xl sm:mt-16" aria-labelledby="new-to-js-heading">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUpVariants(reduceMotion)}
        className={`${glass} p-6 sm:p-7`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 sm:text-xs">
          For visitors
        </p>
        <h2
          id="new-to-js-heading"
          className="mt-1.5 text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl"
        >
          New to James Square
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          James Square is a residential development on Caledonian Crescent in Dalry, Edinburgh. The
          building is managed by Myreside Management, who have been the factor since February 2026.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          The shared pool, gym and sauna are currently closed. Everything else about the building,
          including bins, access and parking, is covered in Living Here.
        </p>
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/local"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            About the building
          </Link>
          <a
            href="mailto:contact@james-square.com"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            Contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/** ------------------------------------------------
 *  Page
 *  ------------------------------------------------ */
export default function HomePageClient() {
  const reduceMotion = Boolean(useReducedMotion());
  const heroKenBurnsAnimate = reduceMotion
    ? { scale: 1, x: 0, y: 0 }
    : { scale: [1, 1.045, 1], x: [0, 10, 0], y: [0, -7, 0] };
  const heroKenBurnsTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 30, ease: easeOut, repeat: Infinity };

  // Time-gated notices are resolved after mount so server and client markup match.
  const [notices, setNotices] = useState(() =>
    activeNoticeSummaries().filter((notice) => !notice.isActive && !notice.endsAt)
  );
  useEffect(() => {
    setNotices(activeNoticeSummaries());
  }, []);

  return (
    <div className="px-4 py-8 sm:py-14">
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
          <div className="relative z-10 flex min-h-[320px] flex-col items-center justify-end px-6 pb-8 pt-16 text-center sm:min-h-[460px] sm:pb-12 lg:min-h-[520px]">
            <motion.p
              variants={fadeUpVariants(reduceMotion)}
              className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-xs"
            >
              Residents&apos; community<span className="hidden sm:inline"> &middot; Edinburgh</span>
            </motion.p>
            <motion.h1
              variants={fadeUpVariants(reduceMotion)}
              className="mt-3 text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(2,6,23,0.5)] sm:text-6xl lg:text-7xl"
            >
              James <span className="text-white/60">Square</span>
            </motion.h1>
            <motion.p
              variants={fadeUpVariants(reduceMotion)}
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
            >
              Notices, building information and shared facilities, all in one place.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* FACILITIES STATUS */}
      <FacilitiesStatus noticeCount={notices.length} reduceMotion={reduceMotion} />

      {/* OWNERS AND RESIDENTS */}
      <AudienceDoors reduceMotion={reduceMotion} />

      {/* LATEST UPDATES */}
      <section className="mx-auto mt-12 max-w-6xl sm:mt-16">
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

      {/* LIVING HERE */}
      <LivingHere reduceMotion={reduceMotion} />

      {/* PHOTO CAROUSEL */}
      <PhotoCarousel />

      {/* NEW TO JAMES SQUARE */}
      <NewToJamesSquare reduceMotion={reduceMotion} />

      {/* INSTALL APP */}
      <InstallAppCard />
    </div>
  );
}
