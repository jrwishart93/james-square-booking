import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  CircleDashed,
  Clock,
  DoorOpen,
  Droplets,
  Dumbbell,
  Fan,
  HandHeart,
  KeyRound,
  Lightbulb,
  Mail,
  MessageSquare,
  PaintRoller,
  PiggyBank,
  Play,
  Recycle,
  ShieldCheck,
  SprayCan,
  Thermometer,
  Waves,
  Wind,
  Wrench,
} from 'lucide-react';

import ConceptVideo from './ConceptVideo';
import { Drift, ProgressBar, Reveal, ScrollLine } from './Motion';
import SectionNav from './SectionNav';
import VolunteerForm from './VolunteerForm';
import WhatsAppInvite from './WhatsAppInvite';
import { PUBLIC_LISTING } from './visibility';

const pageTitle = 'A New Space for Our Gym — James Square';
const pageDescription =
  'The committee supports relocating suitable gym equipment from the closed pool area into the former committee room. Read the plan, the current position and how to get involved.';

const IMG_DIR = '/images/gym-area';
const IMG_WIDTH = 1086;
const IMG_HEIGHT = 1448;
const OG_IMAGE = `${IMG_DIR}/04-equipment-relocated.jpg`;

const committeeEmail = 'committee@james-square.com';
const feedbackMailto = `mailto:${committeeEmail}?subject=Gym%20proposal%20feedback`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  ...(PUBLIC_LISTING
    ? {}
    : {
        // Shared with owners by direct link. next.config also sends a matching
        // X-Robots-Tag header while PUBLIC_LISTING is false.
        robots: {
          index: false,
          follow: false,
          nocache: true,
          googleBot: { index: false, follow: false, noimageindex: true },
        },
      }),
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    siteName: 'James Square',
    type: 'article',
    images: [
      {
        url: OG_IMAGE,
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        alt: "Concept visualisation of the proposed residents' gym in the former committee room",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [{ url: OG_IMAGE, alt: "Concept visualisation of the proposed residents' gym" }],
  },
};

// ───────────────────────── Content ─────────────────────────

const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Recycle,
    title: 'Reuse Existing Equipment',
    body: 'Clean, inspect and refurbish suitable equipment rather than immediately purchasing replacements.',
  },
  {
    icon: PiggyBank,
    title: 'Keep Costs Low',
    body: 'Make use of an existing room and carry out straightforward improvements with help from volunteers.',
  },
  {
    icon: Droplets,
    title: 'A Better Environment',
    body: 'Move equipment away from the humid swimming pool environment, which has contributed to rust and deterioration.',
  },
];

const transformation: { icon: LucideIcon; title: string; body: string[] }[] = [
  {
    icon: Boxes,
    title: 'Clear the Room',
    body: ['Remove stored items from the former committee room and prepare the space for its new purpose.'],
  },
  {
    icon: SprayCan,
    title: 'Clean and Refresh',
    body: [
      'Thoroughly clean the room, assess and address any damp issues, prepare the surfaces and apply a fresh coat of paint.',
    ],
  },
  {
    icon: Dumbbell,
    title: 'Relocate Existing Equipment',
    body: [
      'Inspect, clean and refurbish suitable gym equipment before relocating it from the pool area.',
      'Equipment that is damaged or unsuitable for continued use will not be installed.',
    ],
  },
  {
    icon: DoorOpen,
    title: 'Reopen the External Entrance',
    body: [
      'The intention is to reopen the currently disused entrance directly onto Caledonian Crescent.',
      'Subject to the necessary checks and approvals, a simple keypad entry system could provide controlled access for residents.',
      'The existing internal entrance from Block 45 would also be considered as part of the access arrangements.',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Improve the Lighting',
    body: ['Replace or upgrade the existing ceiling lighting with a modern, energy-efficient LED fitting.'],
  },
  {
    icon: CheckCircle2,
    title: 'Open the Gym',
    body: [
      'Once the necessary works, inspections and approvals have been completed, the room could be made available for residents to use.',
    ],
  },
];

const conditions: { icon: LucideIcon; label: string }[] = [
  { icon: Thermometer, label: 'Improved room conditions' },
  { icon: Waves, label: 'Reduced exposure to pool humidity' },
  { icon: Wind, label: 'Ventilation assessment' },
  { icon: Fan, label: 'Potential future climate-control improvements' },
];

const costs: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: PaintRoller, title: 'Painting and Decorating', body: 'Paint and basic preparation materials to refresh the room.' },
  {
    icon: KeyRound,
    title: 'Access Improvements',
    body: 'Suitable keypad access for the proposed Caledonian Crescent entrance, subject to approval.',
  },
  { icon: Lightbulb, title: 'Lighting', body: 'A simple upgrade to the existing ceiling lighting.' },
  { icon: Wrench, title: 'Equipment Refurbishment', body: 'Cleaning and minor repairs to suitable existing gym equipment.' },
  {
    icon: HandHeart,
    title: 'Volunteer Support',
    body: 'Residents helping with clearing, cleaning and decorating where appropriate.',
  },
];

type StageStatus = 'done' | 'active' | 'pending' | 'future';

const stages: { title: string; status: string; tone: StageStatus; body: string[] }[] = [
  {
    title: 'Committee Discussion',
    status: 'Completed',
    tone: 'done',
    body: ['The committee has discussed and supported making better use of the former committee room.'],
  },
  {
    title: 'Resident Consultation',
    status: 'Initial Feedback Received',
    tone: 'active',
    body: [
      'The proposal has been shared with residents and owners.',
      'Feedback has been largely positive, with questions raised about the pool refurbishment and ventilation.',
      'These concerns have been acknowledged and will be considered as the proposal progresses.',
    ],
  },
  {
    title: 'Expenditure and Approvals',
    status: 'Pending',
    tone: 'pending',
    body: [
      'Submit the proposed expenditure request and establish any necessary permissions, safety requirements and practical arrangements.',
    ],
  },
  {
    title: 'Room Preparation',
    status: 'Not Started',
    tone: 'future',
    body: ['Clear the room, carry out cleaning and decoration, and prepare suitable equipment for relocation.'],
  },
  {
    title: 'Access and Final Checks',
    status: 'Not Started',
    tone: 'future',
    body: ['Address entrance arrangements, lighting and any necessary safety or operational requirements.'],
  },
  {
    title: 'Gym Opening',
    status: 'To Be Confirmed',
    tone: 'future',
    body: ['Open the space once the necessary works and approvals have been completed.'],
  },
];

// One stage complete and one under way out of six.
const stagesProgress = ((1 + 0.5) / stages.length) * 100;

const futureIdeas = [
  'Modern exercise equipment',
  'A treadmill or other cardio machines',
  'Improved weight-training equipment',
  'Additional mirrors and flooring',
  'Better lighting',
  'Improved ventilation or climate control',
  'Additional storage and accessories',
];

const visualStages = [
  {
    src: `${IMG_DIR}/01-committee-room-current.jpg`,
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    label: 'Photo',
    title: 'Today',
    body: 'The former committee room as it is now, used mainly for storage.',
    alt: 'Photograph of the former committee room today, with a table, chairs and stored items',
  },
  {
    src: `${IMG_DIR}/02-room-cleared.jpg`,
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    label: 'Concept',
    title: 'Cleared and ready',
    body: 'Furniture and stored items removed, leaving an empty room to clean and prepare.',
    alt: 'Concept visualisation of the former committee room cleared of furniture',
  },
  {
    src: `${IMG_DIR}/05-painted-and-equipped.jpg`,
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    label: 'Concept',
    title: 'Painted, with our existing equipment',
    body: 'A fresh coat of paint and the gym equipment we already own, moved from the pool area.',
    alt: 'Concept visualisation of the room painted grey and white, with the existing benches, power rack, kettlebells and dumbbells',
  },
  {
    src: `${IMG_DIR}/06-longer-term.jpg`,
    width: 948,
    height: 1660,
    label: 'Future concept',
    title: 'What it could become',
    body: 'An idea of what further investment in newer equipment might allow. Not planned or funded.',
    alt: 'Concept visualisation of a possible longer-term gym with a treadmill, exercise bike, cable machine and dumbbell rack',
  },
];

// ───────────────────────── Styles ─────────────────────────

const card =
  'rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]';
const hoverLift =
  'transition duration-300 motion-safe:md:hover:-translate-y-1 md:hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)] dark:md:hover:shadow-[0_24px_56px_rgba(0,0,0,0.5)]';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400';
const h2Class = 'text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl dark:text-white';
const copy = 'space-y-4 text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8 dark:text-slate-300';
const anchor = 'scroll-mt-[calc(var(--safe-top,0px)+var(--nav-height,4rem)+4.5rem)]';
const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-base';

const statusStyles: Record<StageStatus, { badge: string; dot: string; icon: LucideIcon }> = {
  done: {
    badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100',
    dot: 'bg-emerald-600 text-white dark:bg-emerald-500',
    icon: CheckCircle2,
  },
  active: {
    badge: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100',
    dot: 'bg-sky-600 text-white dark:bg-sky-500',
    icon: MessageSquare,
  },
  pending: {
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100',
    dot: 'bg-amber-500 text-white',
    icon: Clock,
  },
  future: {
    badge: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
    dot: 'bg-white text-slate-400 ring-1 ring-slate-300 dark:bg-slate-900 dark:text-slate-500 dark:ring-slate-600',
    icon: CircleDashed,
  },
};

function SectionHeading({ id, kicker, title, intro }: { id: string; kicker: string; title: string; intro?: string }) {
  return (
    <Reveal className="max-w-3xl">
      <p className={eyebrow}>{kicker}</p>
      <h2 id={id} className={`mt-3 ${h2Class}`}>{title}</h2>
      {intro && <p className="mt-4 text-base leading-8 text-slate-700 sm:text-lg dark:text-slate-300">{intro}</p>}
    </Reveal>
  );
}

function ImageLabel({ children }: { children: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
      {children}
    </span>
  );
}

// ───────────────────────── Page ─────────────────────────

export default function GymAreaPage() {
  return (
    <article className="mx-auto max-w-6xl text-slate-800 dark:text-slate-100">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 pb-10 pt-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:px-10 sm:pt-14 lg:px-14 lg:pb-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-emerald-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-sky-500/15 blur-3xl"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              James Square Residents and Proprietors Association
            </p>
            <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.05] tracking-tight sm:text-6xl">
              A New Space for Our Gym
            </h1>
            <p className="mt-4 text-lg text-slate-300 sm:text-xl">
              Making better use of our existing facilities at James Square.
            </p>
            <p className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-emerald-100">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Committee Supported
              </span>
              <span className="sr-only"> | </span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-slate-200">
                Planning &amp; Preparation
              </span>
            </p>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
              <p>
                Following requests from residents to make use of the gym equipment currently sitting unused in the
                closed pool area, the committee has agreed to progress plans to relocate suitable equipment into the
                former committee room.
              </p>
              <p>
                The aim is to create a small, accessible gym for residents while keeping initial costs to a minimum.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#video"
                className={`${buttonBase} bg-white text-slate-950 hover:bg-slate-200 focus-visible:outline-white`}
              >
                <Play aria-hidden="true" className="size-4 fill-current" />
                Watch the proposal video
              </a>
              <a
                href="#get-involved"
                className={`${buttonBase} border border-white/25 text-white hover:bg-white/10 focus-visible:outline-white`}
              >
                Volunteer to help
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </Reveal>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
            <Drift distance={14}>
              <figure className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src={`${IMG_DIR}/01-committee-room-current.jpg`}
                  alt="The former committee room today, used for storage, with a table and chairs"
                  width={IMG_WIDTH}
                  height={IMG_HEIGHT}
                  priority
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="aspect-[3/4] h-full w-full object-cover"
                />
                <ImageLabel>Today</ImageLabel>
              </figure>
            </Drift>
            <Drift distance={-14} className="mt-10">
              <figure className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src={`${IMG_DIR}/04-equipment-relocated.jpg`}
                  alt="Concept visualisation of the existing gym equipment set up in the former committee room"
                  width={IMG_WIDTH}
                  height={IMG_HEIGHT}
                  priority
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="aspect-[3/4] h-full w-full object-cover"
                />
                <ImageLabel>Concept</ImageLabel>
              </figure>
            </Drift>
            <p className="col-span-2 text-xs leading-5 text-slate-400">
              Left: the room as it is today. Right: a computer-generated concept of how it could look, not a photograph
              of completed work.
            </p>
          </div>
        </div>
      </header>

      <SectionNav />

      {/* ───── Overview ───── */}
      <div id="overview" className={`${anchor} mt-14 space-y-20 sm:mt-20 sm:space-y-28`}>
        <section aria-labelledby="why" className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Reveal>
                <p className={eyebrow}>Why are we doing this?</p>
                <h2 id="why" className={`mt-3 ${h2Class}`}>
                  Making Better Use of What We Already Have
                </h2>
              </Reveal>
            </div>
            <Reveal className={copy} delay={1}>
              <p>
                Several residents have asked whether the gym equipment currently located within the closed pool area
                could be made available for use.
              </p>
              <p>
                The committee considered these requests and agreed that providing a shared space would be preferable to
                allowing equipment to be taken into individual residences, where it may not be available to everyone.
              </p>
              <p>
                The former committee room offers an opportunity to create a dedicated gym using much of the equipment we
                already own.
              </p>
              <p>
                Rather than leaving the equipment unused, the proposal would allow residents to benefit from it again
                while the wider pool refurbishment project continues.
              </p>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {benefits.map(({ icon: Icon, title, body }, index) => (
              <Reveal as="li" key={title} delay={index} className={`${card} ${hoverLift} p-6 sm:p-7`}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{body}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section id="video" aria-labelledby="video-heading" className={`${anchor} grid items-center gap-8 lg:grid-cols-2`}>
          <Reveal>
            <p className={eyebrow}>Proposal video</p>
            <h2 id="video-heading" className={`mt-3 ${h2Class}`}>
              Watch the proposal
            </h2>
            <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
              A short narrated walkthrough of the former committee room and how it could be transformed. From the
              cleared room onwards, the images are computer-generated illustrations of what the space could look like,
              not photographs of completed work.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ConceptVideo />
          </Reveal>
        </section>
      </div>

      {/* ───── The Plan ───── */}
      <div id="plan" className={`${anchor} mt-20 space-y-20 sm:mt-28 sm:space-y-28`}>
        <section aria-labelledby="transformation" className="space-y-10">
          <SectionHeading id="transformation" kicker="What will change?" title="The Proposed Transformation" />
          <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {transformation.map(({ icon: Icon, title, body }, index) => (
              <Reveal as="li" key={title} delay={index % 3} className={`${card} ${hoverLift} relative p-6 sm:p-7`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="font-mono text-3xl font-semibold text-slate-200 dark:text-white/15" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                  <span className="sr-only">Step {index + 1}: </span>
                  {title}
                </h3>
                <div className="mt-2 space-y-2 leading-7 text-slate-700 dark:text-slate-300">
                  {body.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="stages" className="space-y-10">
          <SectionHeading
            id="stages"
            kicker="Four stages"
            title="From Storage Room to Residents’ Gym"
            intro="How the room could change, from how it looks today to what might be possible in the longer term. Only the first image is a photograph; the others are computer-generated concepts."
          />
          <ol className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {visualStages.map((stage, index) => (
              <Reveal as="li" key={stage.src} delay={index} className="group">
                <figure>
                  <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.10)] dark:bg-slate-800">
                    <Image
                      src={stage.src}
                      alt={stage.alt}
                      width={stage.width}
                      height={stage.height}
                      sizes="(min-width: 1152px) 270px, (min-width: 1024px) 24vw, 50vw"
                      className="aspect-[3/4] h-full w-full object-cover transition duration-700 motion-safe:md:group-hover:scale-[1.03]"
                    />
                    <ImageLabel>{stage.label}</ImageLabel>
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Stage {index + 1}
                    </p>
                    <h3 className="mt-1 font-semibold leading-snug text-slate-950 sm:text-lg dark:text-white">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-300">{stage.body}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="pool"
          className="relative overflow-hidden rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 sm:p-10 lg:p-14 dark:border-sky-900/60 dark:from-sky-950/60 dark:to-slate-950"
        >
          <Waves
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 size-40 text-sky-200/70 dark:text-sky-800/30"
          />
          <Reveal className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-800 dark:text-sky-300">
              What about the swimming pool?
            </p>
            <h2 id="pool" className={`mt-3 ${h2Class}`}>
              The Pool Refurbishment Remains a Separate Priority
            </h2>
          </Reveal>
          <Reveal delay={1} className="relative mt-6 rounded-2xl border-l-4 border-sky-600 bg-white p-5 shadow-sm sm:p-6 dark:border-sky-400 dark:bg-slate-900">
            <p className="text-lg font-semibold leading-8 text-slate-950 sm:text-xl dark:text-white">
              The new gym proposal does not replace or delay the swimming pool refurbishment project.
            </p>
          </Reveal>
          <Reveal delay={2} className={`relative mt-6 max-w-3xl ${copy}`}>
            <p>
              We appreciate that residents are keen to see the swimming pool, sauna, changing facilities and existing
              leisure area reopened. The committee shares that frustration and wants to see these facilities brought
              back into use as soon as it is safe and practical to do so.
            </p>
            <p>
              The proposed gym relocation is a separate project and is not intended to replace, delay or divert attention
              from the wider pool refurbishment.
            </p>
            <p>The pool area has outstanding safety and maintenance issues that need to be addressed before it can reopen.</p>
            <p>
              Relocating suitable gym equipment would simply allow residents to make use of some existing facilities while
              work towards reopening the pool continues.
            </p>
          </Reveal>
          <Reveal delay={3} className="relative mt-6">
            <Link
              href="/pool-safety"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-sky-800 underline-offset-4 hover:underline dark:text-sky-300"
            >
              Pool Safety &amp; Operations Centre
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Reveal>
        </section>

        <section aria-labelledby="conditions" className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
          <div>
            <Reveal>
              <p className={eyebrow}>Ventilation and room conditions</p>
              <h2 id="conditions" className={`mt-3 ${h2Class}`}>
                Creating a Comfortable Space
              </h2>
            </Reveal>
            <Reveal delay={1} className={`mt-6 ${copy}`}>
              <p>
                Some residents have raised reasonable questions about ventilation and the existing condition of the
                former committee room.
              </p>
              <p>
                The room has been used primarily for storage and would benefit from cleaning, decoration and more regular
                use.
              </p>
              <p>
                Reopening the external entrance may help improve opportunities for ventilation, although the room’s
                suitability and ventilation requirements will need to be assessed before opening.
              </p>
              <p>
                If additional ventilation or humidity control is required, the committee could consider further
                improvements such as a dehumidifier, mechanical ventilation or air conditioning.
              </p>
              <p>
                The intention is to create a comfortable environment that is more suitable for gym equipment than the
                current humid poolside location.
              </p>
            </Reveal>
          </div>
          <Reveal delay={2} className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.3)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">What we are aiming for</p>
            <ul className="mt-6 space-y-3">
              {conditions.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-medium leading-6">{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-slate-400">
              Opening the door alone is not expected to resolve ventilation or damp. Both will be assessed before the room
              is used.
            </p>
          </Reveal>
        </section>

        <section aria-labelledby="costs" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="costs"
              kicker="Initial budget and expenditure"
              title="Keeping Initial Costs to a Minimum"
              intro="The committee intends to submit a modest expenditure request to prepare the room. The initial proposal is to reuse existing equipment and avoid unnecessary purchases."
            />
            <Reveal delay={1} className="shrink-0 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-950/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Expenditure request
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-950 dark:text-amber-50">To Be Submitted</p>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {costs.map(({ icon: Icon, title, body }, index) => (
              <Reveal as="li" key={title} delay={index} className={`${card} ${hoverLift} p-5 sm:p-6`}>
                <Icon aria-hidden="true" className="size-6 text-emerald-700 dark:text-emerald-400" />
                <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{body}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="flex gap-3 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-300">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-slate-500 dark:text-slate-400" />
              Any works affecting fire safety, access arrangements, building fabric or electrical installations must be
              assessed and carried out appropriately.
            </p>
          </Reveal>
        </section>
      </div>

      {/* ───── Timeline ───── */}
      <div id="timeline" className={`${anchor} mt-20 space-y-20 sm:mt-28 sm:space-y-28`}>
        <section aria-labelledby="next" className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--nav-height,4rem)+5rem)] lg:self-start">
            <Reveal>
              <p className={eyebrow}>Project timeline</p>
              <h2 id="next" className={`mt-3 ${h2Class}`}>
                What Happens Next?
              </h2>
            </Reveal>
            <Reveal delay={1} className={`${card} mt-8 p-6`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">Progress so far</span>
                <span className="text-slate-600 dark:text-slate-400">Stage 2 of {stages.length}</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={stagesProgress} label="Project progress: stage 2 of 6" />
              </div>
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Indicative timescale
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                  Target: Approximately One Month Following Approval
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  This is an indicative target only and will depend on the required approvals, condition of the room,
                  availability of volunteers and any additional work identified.
                </p>
              </div>
            </Reveal>
          </div>

          <ol className="relative space-y-4">
            <ScrollLine className="bottom-6 left-[1.6rem] top-6 sm:left-[1.85rem]" />
            {stages.map(({ title, status, tone, body }, index) => {
              const style = statusStyles[tone];
              const Icon = style.icon;
              return (
                <Reveal as="li" key={title} delay={index % 2} className="relative flex gap-4 sm:gap-5">
                  <span
                    className={`relative z-10 mt-5 inline-flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10 ${style.dot} ml-3`}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className={`${card} flex-1 p-5 sm:p-6`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-semibold text-slate-950 dark:text-white">
                        <span className="text-slate-400 dark:text-slate-500">{index + 1}. </span>
                        {title}
                      </h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
                        <span className="sr-only">Status: </span>
                        {status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                      {body.map(paragraph => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="future" className="overflow-hidden rounded-[2rem] bg-slate-950 text-white">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="p-6 sm:p-10 lg:p-14">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Future improvements</p>
                <h2 id="future" className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
                  A Gym We Can Improve Over Time
                </h2>
              </Reveal>
              <Reveal delay={1} className="mt-6 space-y-4 leading-8 text-slate-300">
                <p>The initial project is focused on making use of existing equipment.</p>
                <p>Longer term, the committee would like to explore gradual improvements to the space. These could include:</p>
              </Reveal>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {futureIdeas.map((idea, index) => (
                  <Reveal as="li" key={idea} delay={index} className="flex items-start gap-3 text-[15px] leading-6">
                    <Dumbbell aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    {idea}
                  </Reveal>
                ))}
              </ul>
              <Reveal className="mt-8 space-y-4 leading-7 text-slate-300">
                <p>
                  Future improvements could potentially be supported through voluntary donations from residents and
                  owners. No donations are being collected at this stage.
                </p>
                <p className="rounded-2xl bg-white/[0.06] p-4 font-semibold text-white ring-1 ring-white/10">
                  The initial aim is to create a usable gym at minimal cost. Further improvements can be considered over
                  time.
                </p>
              </Reveal>
            </div>
            <div className="relative min-h-[22rem] lg:min-h-full">
              <Image
                src={`${IMG_DIR}/06-longer-term.jpg`}
                alt="Concept visualisation of how the gym could look in the longer term with newer equipment"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent lg:bg-gradient-to-r lg:from-slate-950/50" />
              <ImageLabel>Future concept</ImageLabel>
            </div>
          </div>
        </section>
      </div>

      {/* ───── Get Involved ───── */}
      <div id="get-involved" className={`${anchor} mt-20 space-y-10 sm:mt-28`}>
        <section aria-labelledby="volunteer" className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <div>
            <Reveal>
              <p className={eyebrow}>Get involved</p>
              <h2 id="volunteer" className={`mt-3 ${h2Class}`}>
                Fancy Lending a Hand?
              </h2>
            </Reveal>
            <Reveal delay={1} className={`mt-6 ${copy}`}>
              <p>
                We’re hoping to keep costs down by carrying out some of the simpler preparation and decorating work with
                help from residents.
              </p>
              <p>
                If you’re happy to help with clearing the room, cleaning, painting or other suitable tasks, we’d love to
                hear from you.
              </p>
              <p>
                There may also be opportunities to contribute towards future equipment upgrades once the gym is
                operational.
              </p>
            </Reveal>
          </div>
          <div className="space-y-5">
            <Reveal delay={1} className={`${card} p-5 sm:p-8`}>
              <VolunteerForm />
            </Reveal>
            <Reveal delay={2}>
              <WhatsAppInvite />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="feedback" className={`${card} p-6 text-center sm:p-12`}>
          <Reveal>
            <MessageSquare aria-hidden="true" className="mx-auto size-8 text-emerald-700 dark:text-emerald-400" />
            <h2 id="feedback" className={`mt-4 ${h2Class}`}>
              Your Feedback Matters
            </h2>
            <div className="mx-auto mt-5 max-w-2xl space-y-4 leading-8 text-slate-700 dark:text-slate-300">
              <p>
                The proposal has already received positive feedback from residents, alongside some reasonable questions
                and concerns.
              </p>
              <p>
                The committee welcomes constructive feedback and will continue to consider suggestions as the project
                progresses.
              </p>
              <p>
                If you have any thoughts about the proposed gym, equipment, access arrangements or future improvements,
                please get in touch.
              </p>
            </div>
            <a
              href={feedbackMailto}
              className={`${buttonBase} mt-8 bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:outline-white`}
            >
              <Mail aria-hidden="true" className="size-4" />
              Email the committee
            </a>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{committeeEmail}</p>
          </Reveal>
        </section>
      </div>
    </article>
  );
}
