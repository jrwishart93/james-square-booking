import type { Metadata } from 'next';
import Image from 'next/image';

import PoolModelViewer from '@/components/PoolModelViewer';

const poolWalkthroughVideo = '/docs/survey/pool-walkthrough-website.mp4';

const infoCards = [
  {
    title: 'About the pool area',
    summary:
      'James Square has a heated indoor residents’ pool area with associated gym, sauna, changing and shower facilities.',
    details:
      'The pool area forms part of the original James Square leisure facilities. It includes the heated indoor swimming pool, gym, sauna, changing rooms, showers, seating and plant room. This digital model is intended to help explain the general layout of the space.',
  },
  {
    title: 'Current repair position',
    summary:
      'The pool is temporarily closed following issues linked to the electrical fault and issues with ventilation/dehumidification system and resulting high humidity.',
    details:
      'The pool area has recently been affected by high humidity levels following an electrical fault and knock-on issues with the ventilation/dehumidification system. The elevated moisture levels caused damage to parts of the pool area, including ceiling finishes that now require repair. Further surveys, assessments and repair works are being considered so the facilities can be reopened safely.',
  },
  {
    title: 'Purpose of this page',
    summary:
      'This page can be shared with contractors, designers, surveyors and others involved in reviewing the pool area.',
    details:
      'This page is intended to provide a useful visual reference for anyone involved in the pool repair and refurbishment process. It may assist contractors, designers, architects, surveyors, RLSS UK, committee members and residents by giving them a better understanding of the layout before visiting or reviewing the space. The page is still in its early stages and more information, images and updates may be added in due course.',
  },
];

export const metadata: Metadata = {
  title: 'James Square Pool 3D Model',
  description:
    'Interactive digital model of the James Square heated indoor pool, created to support repair and refurbishment discussions.',
  openGraph: {
    title: 'James Square Pool 3D Model',
    description:
      'Interactive digital model of the James Square heated indoor pool, created to support repair and refurbishment discussions.',
    images: [
      {
        url: '/images/pool/Pool-facing-south.png',
        width: 1301,
        height: 771,
        alt: 'James Square pool area preview',
      },
    ],
  },
};

const poolImages = [
  {
    src: '/images/pool/Pool-facing-south.png',
    alt: 'Pool area facing south',
    caption: 'Pool area facing south',
  },
  {
    src: '/images/pool/3Dimage-facing-north.jpg',
    alt: '3D pool model view facing north',
    caption: '3D model facing north',
  },
  {
    src: '/images/pool/01-entrance-hallway.jpeg',
    alt: 'Pool entrance hallway',
    caption: 'Entrance hallway',
  },
  {
    src: '/images/pool/03-gym-facing-south.jpeg',
    alt: 'Gym area facing south',
    caption: 'Gym area',
  },
  {
    src: '/images/pool/05-sauna-entrance-door.jpeg',
    alt: 'Sauna entrance door',
    caption: 'Sauna entrance',
  },
  {
    src: '/images/pool/08-ceiling-damage.jpeg',
    alt: 'Ceiling finishes requiring repair',
    caption: 'Ceiling repair area',
  },
];

export default function Pool3DPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-3 py-6 sm:px-5 lg:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-xl shadow-sky-950/5 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">
            Pool project reference
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            James Square Pool 3D Model
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-200 sm:text-lg">
            An interactive digital model of the James Square heated indoor pool, created to help visualise the layout and support future repair and refurbishment discussions.
          </p>
          <div className="mt-6 inline-flex rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100">
            Pool currently closed pending repairs and further assessment.
          </div>
        </div>
      </section>

      <section aria-labelledby="pool-model-heading" className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-sky-950/10 dark:border-white/10 dark:bg-slate-900/90 sm:p-4">
          <div className="mb-4 flex flex-col gap-2 px-2 pt-2 sm:px-3">
            <h2 id="pool-model-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
              Interactive 3D pool model
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Rotate, zoom and pan the latest pool model directly in the viewer.
            </p>
          </div>
          <PoolModelViewer ariaLabel="Interactive 3D model of the James Square heated indoor pool layout" />
        </div>
        <p className="px-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This model is a working visual reference and may be refined as further photos, measurements and survey information become available.
        </p>
      </section>

      <section aria-labelledby="pool-scan-heading" className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900/80 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_340px] md:items-center">
          <div>
            <h2 id="pool-scan-heading" className="text-xl font-bold text-slate-950 dark:text-white">
              3D scan preview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              A short scan walkthrough is available as a secondary reference alongside the interactive model.
            </p>
          </div>
          <video
            className="aspect-video w-full rounded-2xl bg-slate-950 object-cover shadow-lg"
            src={poolWalkthroughVideo}
            controls
            muted
            playsInline
            preload="metadata"
            poster="/images/pool/Pool-facing-south.png"
            aria-label="Walkthrough video scan of the James Square pool 3D model"
          />
        </div>
      </section>

      <section aria-labelledby="pool-details-heading" className="space-y-4">
        <h2 id="pool-details-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Project information
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {infoCards.map((card) => (
            <details key={card.title} className="group rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900/80">
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.summary}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/10 dark:text-sky-100">
                    <span className="group-open:hidden">View more</span>
                    <span className="hidden group-open:inline">Hide details</span>
                  </span>
                </div>
              </summary>
              <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:text-slate-200">
                {card.details}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="pool-gallery-heading" className="space-y-4 pb-4">
        <div className="max-w-3xl">
          <h2 id="pool-gallery-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
            Pool image gallery
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Reference images are included for orientation and remain secondary to the interactive model.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {poolImages.map((image) => (
            <a key={image.src} href={image.src} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
              <figure>
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" loading="lazy" unoptimized className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <figcaption className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">{image.caption}</figcaption>
              </figure>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
