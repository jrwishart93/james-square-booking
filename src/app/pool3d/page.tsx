import type { Metadata } from 'next';
import Image from 'next/image';

import PoolModelViewer from '@/components/PoolModelViewer';

const poolModels = [
  {
    heading: 'Current scanned pool area',
    description:
      'This scan captures the current pool area so residents can rotate, pan, and zoom around the existing space.',
    src: '/docs/survey/pool-area-scan-polycam.glb',
    poster: '/images/buildingimages/pool-3D-facing-south.jpg',
    ariaLabel: 'Interactive 3D scan of the current James Square pool area',
    fallbackLabel: 'Open the current pool area scan',
    linkLabel: 'Download/open current scan GLB',
  },
  {
    heading: 'Draft digital pool improvement model',
    description:
      'This draft digital version is an early planning model for considering future pool-area improvements. It is shared with owners and interested James Square residents to support discussion and feedback.',
    src: '/docs/survey/pool-3D-modelglb.glb',
    poster: '/images/buildingimages/pool-3D-facing-north.PNG',
    ariaLabel: 'Interactive draft digital model of possible James Square pool area improvements',
    fallbackLabel: 'Open the draft pool improvement model',
    linkLabel: 'Download/open draft improvement GLB',
  },
];

export const metadata: Metadata = {
  title: 'Pool 3D Scan | James Square',
  description:
    'Explore the James Square pool area with interactive 3D models and reference photos.',
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
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-xl shadow-sky-950/5 ring-1 ring-sky-100 sm:p-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Pool survey
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Explore the pool area in 3D
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Use the interactive models below to rotate, pan, and zoom around the James Square pool area.
            The current scan is presented alongside an early draft improvement model and two reference photos
            so residents can compare the existing space with planning ideas.
          </p>
        </div>
      </section>

      <section aria-labelledby="pool-models-heading" className="space-y-8">
        <div>
          <h2 id="pool-models-heading" className="text-2xl font-bold text-slate-950">
            Interactive pool models
          </h2>
          <p className="mt-2 text-slate-600">
            Drag to rotate, scroll or pinch to zoom, and use touch gestures to inspect each 3D model.
          </p>
        </div>

        {poolModels.map((model) => (
          <article key={model.src} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950">{model.heading}</h3>
                <p className="mt-2 max-w-3xl text-slate-600">{model.description}</p>
              </div>
              <a
                href={model.src}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
              >
                {model.linkLabel}
              </a>
            </div>
            <PoolModelViewer
              src={model.src}
              poster={model.poster}
              ariaLabel={model.ariaLabel}
              fallbackLabel={model.fallbackLabel}
            />
          </article>
        ))}

        <p className="text-sm text-slate-500">
          If a 3D viewer does not load in your browser, use the download/open link above that model to access its GLB file directly.
        </p>
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
                  sizes="(min-width: 768px) 50vw, 100vw"
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
