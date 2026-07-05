import type { Metadata } from 'next';
import Image from 'next/image';

import PoolModelViewer from '@/components/PoolModelViewer';

const poolWalkthroughVideo = '/docs/survey/pool-walkthrough-website.mp4';

const poolModel = {
  heading: 'Interactive pool model',
  description:
    'Use the new PlayCanvas viewer to inspect the latest Blender GLB model of the pool area from any angle.',
  ariaLabel: 'Interactive PlayCanvas 3D model of the James Square pool area',
};

const surveyHighlights = [
  'Watch the 10-second walkthrough first for a quick sense of the model layout.',
  'Use the PlayCanvas viewer when you want to inspect details from your own angle.',
  'Use the reference photos at the bottom of the page to match the scan to the real pool area.',
];

export const metadata: Metadata = {
  title: 'Pool 3D Scan – James Square',
  description:
    'Explore an interactive 3D scan and short walkthrough video of the current James Square pool hall, captured to support upcoming maintenance and renovation planning.',
  openGraph: {
    title: 'Pool 3D Scan – James Square',
    description:
      'Explore an interactive 3D scan and short walkthrough video of the current James Square pool hall, captured to support upcoming maintenance and renovation planning.',
    images: [
      {
        url: '/images/buildingimages/pool-3D-facing-south.jpg',
        width: 1301,
        height: 771,
        alt: 'James Square pool hall 3D scan preview',
      },
    ],
  },
};

const poolImages = [
  {
    src: '/images/buildingimages/pool-3D-facing-south.jpg',
    alt: 'Pool area reference photo facing south',
    caption: 'Pool area facing south',
  },
  {
    src: '/images/buildingimages/pool-3D-facing-north.PNG',
    alt: 'Pool area reference photo facing north',
    caption: 'Pool area facing north',
  },
];

export default function Pool3DPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-2 py-6 sm:px-4 lg:py-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-xl shadow-sky-950/5 ring-1 ring-sky-100">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Pool survey
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Explore the pool area in 3D
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              This page brings together the short walkthrough video, the interactive 3D model, and reference photos for the current pool hall so owners and contractors can quickly understand the space before inspecting the model in detail.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">10 sec</p>
                <p className="text-sm text-slate-600">quick video preview</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">1</p>
                <p className="text-sm text-slate-600">PlayCanvas model</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">2</p>
                <p className="text-sm text-slate-600">orientation photos</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-3 shadow-2xl shadow-sky-950/20 ring-1 ring-slate-900/10">
            <video
              className="aspect-video w-full rounded-[1.25rem] bg-slate-900 object-cover"
              src={poolWalkthroughVideo}
              controls
              muted
              playsInline
              preload="metadata"
              poster="/images/buildingimages/pool-3D-facing-south.jpg"
              aria-label="10-second walkthrough video of the James Square pool 3D model"
            />
            <div className="px-2 pb-1 pt-3 text-sm leading-6 text-slate-200">
              <p className="font-semibold text-white">Quick model walkthrough</p>
              <p className="text-slate-300">A short video preview helps orient the interactive model below.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pool-guide-heading" className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6">
        <h2 id="pool-guide-heading" className="text-2xl font-bold text-slate-950">
          How to use this page
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {surveyHighlights.map((highlight, index) => (
            <div key={highlight} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
                {index + 1}
              </p>
              <p className="text-sm leading-6 text-slate-700">{highlight}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          The scan will be refined as more capture data is added.
        </div>
      </section>

      <section aria-labelledby="pool-models-heading" className="space-y-8">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6">
          <h2 id="pool-models-heading" className="text-2xl font-bold text-slate-950">
            Interactive pool viewer
          </h2>
          <p className="mt-2 text-slate-600">
            Drag to rotate, scroll or pinch to zoom, and pan with Shift-drag, middle-drag, or right-drag to inspect the latest Blender GLB model directly on this page.
          </p>
        </div>

        <article className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6">
          <div className="mb-5 max-w-3xl">
            <h3 className="text-xl font-bold text-slate-950">{poolModel.heading}</h3>
            <p className="mt-2 text-slate-600">{poolModel.description}</p>
          </div>
          <PoolModelViewer ariaLabel={poolModel.ariaLabel} />
        </article>
      </section>

      <section aria-labelledby="pool-photos-heading" className="space-y-5">
        <div>
          <h2 id="pool-photos-heading" className="text-2xl font-bold text-slate-950">
            Reference photos
          </h2>
          <p className="mt-2 text-slate-600">
            These images show the same pool area from two directions to help orient the 3D scan.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {poolImages.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-950/5 ring-1 ring-slate-200"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  loading="lazy"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-4 text-sm font-medium text-slate-700">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
