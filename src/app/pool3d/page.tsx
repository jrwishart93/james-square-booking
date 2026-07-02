import type { Metadata } from 'next';
import Image from 'next/image';

import PoolModelViewer from '@/components/PoolModelViewer';

const poolModels = [
  {
    heading: 'Current scanned pool area',
    description:
      'View the latest scan of the existing pool area. This viewer is intended for on-page inspection only, so residents can rotate, pan, and zoom without needing to download the scan file.',
    src: '/docs/survey/pool-area-scan-polycam.glb',
    poster: '/images/buildingimages/pool-3D-facing-south.jpg',
    ariaLabel: 'Interactive 3D scan of the current James Square pool area',
  },
  {
    heading: 'Draft digital pool improvement model',
    description:
      'Compare the current scan with an early digital planning model for possible pool-area improvements. More renovation mock-ups will be added as the design work develops.',
    src: '/docs/survey/pool-3D-modelglb.glb',
    poster: '/images/buildingimages/pool-3D-facing-north.PNG',
    ariaLabel: 'Interactive draft digital model of possible James Square pool area improvements',
  },
];

export const metadata: Metadata = {
  title: 'Pool 3D Scan | James Square',
  description:
    'View the James Square pool area with interactive 3D scans, planning models, and reference photos.',
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
            Use the interactive viewers below to rotate, pan, and zoom around the James Square pool area.
            The current scan is presented alongside an early draft digital model and reference photos so
            residents can compare the existing space with future renovation ideas.
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            <strong className="font-semibold">Work in progress:</strong> this page is still being edited and
            will be updated soon with potential mock-ups showing what the pool area could look like after renovation.
          </div>
        </div>
      </section>

      <section aria-labelledby="pool-models-heading" className="space-y-8">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6">
          <h2 id="pool-models-heading" className="text-2xl font-bold text-slate-950">
            Interactive pool viewers
          </h2>
          <p className="mt-2 text-slate-600">
            Drag to rotate, scroll or pinch to zoom, and use touch gestures to inspect each model directly on this page.
            Download/open links have been removed from the viewer area so the scans stay out of the way on mobile.
          </p>
        </div>

        {poolModels.map((model) => (
          <article
            key={model.src}
            className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-950/5 ring-1 ring-slate-200 sm:p-6"
          >
            <div className="mb-5 max-w-3xl">
              <h3 className="text-xl font-bold text-slate-950">{model.heading}</h3>
              <p className="mt-2 text-slate-600">{model.description}</p>
            </div>
            <PoolModelViewer
              src={model.src}
              poster={model.poster}
              ariaLabel={model.ariaLabel}
            />
          </article>
        ))}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          <p>
            This is a view-only page for reviewing the pool scan and digital version. A separate download option will be
            placed at the bottom of the page when the shared files are ready.
          </p>
        </div>
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
