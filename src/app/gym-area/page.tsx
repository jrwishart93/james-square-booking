import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Recycle, Rocket, TrendingUp } from 'lucide-react';

import ConceptVideo from './ConceptVideo';
import { PUBLIC_LISTING } from './visibility';

const pageTitle = 'Proposed Gym Relocation — James Square';
const pageDescription =
  "The committee's proposal to relocate the existing gym equipment into the former committee room, with a dedicated entrance from Caledonian Crescent. Watch the concept video and share your views.";

const IMG_DIR = '/images/gym-area';
const IMG_WIDTH = 1086;
const IMG_HEIGHT = 1448;
const OG_IMAGE = `${IMG_DIR}/04-equipment-relocated.jpg`;

const mailto = 'mailto:committee@james-square.com?subject=Gym%20relocation%20proposal';

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
    images: [
      {
        url: OG_IMAGE,
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        alt: "Concept visualisation of the proposed residents' gym",
      },
    ],
  },
};

type Step = {
  number?: string;
  title: string;
  body: string;
  label: 'Current' | 'Concept' | 'Existing door';
  image?: { src: string; alt: string };
};

// Steps without an image yet render as text-only cards. Drop the file into
// public/images/gym-area and add the `image` entry to show it.
const steps: Step[] = [
  {
    title: 'Today',
    label: 'Current',
    body: 'The former committee room is currently used for storage. It is located beneath Block 45 and accessed via the internal staircase and a keypad-controlled door.',
    image: {
      src: `${IMG_DIR}/01-committee-room-current.jpg`,
      alt: 'The former committee room as it is now, with a table, chairs and stored items',
    },
  },
  {
    number: '01',
    title: 'Clearing the space',
    label: 'Concept',
    body: 'Remove the existing furniture and stored items, leaving an empty space ready for its new use.',
    image: {
      src: `${IMG_DIR}/02-room-cleared.jpg`,
      alt: 'Concept visualisation of the committee room cleared of furniture',
    },
  },
  {
    number: '02',
    title: 'Reopening the entrance',
    label: 'Existing door',
    body: 'There is currently an unused external door on Caledonian Crescent that leads directly into the committee room. The plan is to reopen it as the main access point for the proposed gym.',
  },
  {
    number: '03',
    title: 'Relocating the equipment',
    label: 'Concept',
    body: 'Relocate the existing gym equipment from the former pool and gym area, so residents can continue to use these facilities.',
    image: {
      src: `${IMG_DIR}/04-equipment-relocated.jpg`,
      alt: 'Concept visualisation of the existing gym equipment set up in the committee room',
    },
  },
  {
    number: '04',
    title: 'Refreshing the space',
    label: 'Concept',
    body: 'A fresh coat of paint: a simple, low-cost improvement to make the space more welcoming.',
  },
  {
    number: '05',
    title: 'Improving over time',
    label: 'Concept',
    body: 'Looking ahead, the aim is to improve the space gradually, introduce newer equipment and create an even better facility for residents over time.',
  },
];

const approach = [
  { icon: Recycle, text: 'Reuse the equipment we already have.' },
  { icon: Rocket, text: 'Get the gym up and running as quickly and cost-effectively as possible.' },
  { icon: TrendingUp, text: 'Improve the space gradually over time.' },
];

const transcript = [
  "This is our former committee room, currently used for storage. It's located beneath Block 45, accessed via the internal staircase and keypad-controlled door.",
  'Our first step is to completely clear out the committee room, removing all the existing furniture and stored items, leaving us with an empty space ready for its transformation.',
  "There's currently an unused external door on Caledonian Crescent, which leads directly into the committee room. Our plan is to reopen this entrance, making it the main access point for the proposed gym.",
  'Once the room has been cleared, our plan is to relocate the existing gym equipment from the former pool and gym area, creating a space where residents can continue to enjoy these facilities.',
  'Once the equipment has been relocated, the next stage would be to give the room a fresh coat of paint, a simple, low-cost improvement to make the space more welcoming and suitable for residents.',
  'Our initial priority is to get the gym up and running as quickly and cost-effectively as possible, using the equipment we already have.',
  'Looking ahead, we hope to gradually improve the space, introduce newer equipment and create an even better facility for residents over time.',
];

const panel =
  'rounded-3xl border border-white/70 bg-white/65 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]';
const h2Class = 'text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl';

function ImageLabel({ children }: { children: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
      {children}
    </span>
  );
}

export default function GymAreaPage() {
  return (
    <article className="mx-auto max-w-5xl space-y-14 text-slate-800 dark:text-slate-100">
      <div>
        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to James Square
        </Link>

        <header className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            James Square
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Proposed Gym Relocation
          </h1>
          <p className="mt-3 text-xl text-slate-700 dark:text-slate-200">Making better use of our existing space</p>
          <p className="mt-5 inline-flex rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100">
            Proposal — not yet approved
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-200">
            The committee is proposing to relocate the existing gym equipment from the former pool and gym area into
            the former committee room beneath Block 45, with its own entrance from Caledonian Crescent.
          </p>
        </header>
      </div>

      <section aria-labelledby="concept-video" className="space-y-4">
        <h2 id="concept-video" className={h2Class}>
          Concept video
        </h2>
        <ConceptVideo />
        <p className="mx-auto max-w-[420px] text-sm leading-6 text-slate-600 dark:text-slate-300">
          Concept visualisation. From the cleared room onwards, the images are computer-generated illustrations of what
          the space could look like, not photographs of completed work.
        </p>
        <details className={`${panel} mx-auto max-w-2xl p-5`}>
          <summary className="min-h-11 cursor-pointer font-semibold text-slate-950 dark:text-white">
            Read the video transcript
          </summary>
          <div className="mt-3 space-y-3 leading-7 text-slate-700 dark:text-slate-300">
            {transcript.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      </section>

      <section aria-labelledby="proposal-steps" className="space-y-6">
        <h2 id="proposal-steps" className={h2Class}>
          The proposal in five steps
        </h2>
        <ol className="space-y-6">
          {steps.map((step) => (
            <li key={step.title} className={`${panel} overflow-hidden`}>
              <div className={step.image ? 'grid md:grid-cols-2' : ''}>
                {step.image && (
                  <div className="relative aspect-[4/5] bg-slate-200 dark:bg-slate-800">
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      width={IMG_WIDTH}
                      height={IMG_HEIGHT}
                      sizes="(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw"
                      className="h-full w-full object-cover object-center"
                    />
                    <ImageLabel>{step.label}</ImageLabel>
                  </div>
                )}
                <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {step.number ? `Step ${step.number}` : 'Current'}
                    </p>
                    {!step.image && (
                      <span className="rounded-full border border-slate-300 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-600 dark:text-slate-300">
                        {step.label}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                  <p className="leading-7 text-slate-700 dark:text-slate-300">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="before-after" className="space-y-6">
        <h2 id="before-after" className={h2Class}>
          Before and after
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {[
            {
              src: `${IMG_DIR}/01-committee-room-current.jpg`,
              alt: 'The former committee room as it is now',
              label: 'Current',
            },
            {
              src: `${IMG_DIR}/04-equipment-relocated.jpg`,
              alt: 'Concept visualisation of the committee room as a residents’ gym',
              label: 'Proposed',
            },
          ].map((item) => (
            <figure key={item.label} className={`${panel} relative overflow-hidden`}>
              <Image
                src={item.src}
                alt={item.alt}
                width={IMG_WIDTH}
                height={IMG_HEIGHT}
                sizes="(min-width: 1024px) 480px, 50vw"
                className="aspect-[4/5] h-full w-full object-cover object-center"
              />
              <ImageLabel>{item.label}</ImageLabel>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="our-approach" className={`${panel} p-6 sm:p-8`}>
        <h2 id="our-approach" className={h2Class}>
          Our approach
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {approach.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3">
              <Icon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-slate-700 dark:text-slate-300" />
              <span className="leading-7">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="have-your-say" className={`${panel} p-6 text-center sm:p-10`}>
        <h2 id="have-your-say" className={h2Class}>
          Have your say
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-700 dark:text-slate-300">
          No decision has been made. Owners and residents are invited to share their views with the committee before
          the proposal goes any further.
        </p>
        <a
          href={mailto}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:outline-white"
        >
          <Mail aria-hidden="true" className="size-4" />
          Email the committee
        </a>
      </section>
    </article>
  );
}
