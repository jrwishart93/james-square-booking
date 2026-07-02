import type { Metadata } from 'next';
import Image from 'next/image';

import PoolModelViewer from '@/components/PoolModelViewer';

const modelHref = '/docs/survey/pool-area-scan-polycam.glb';

export const metadata: Metadata = {
  title: 'Pool 3D Scan | James Square',
  description:
    'Explore the James Square pool area with an interactive 3D scan and reference photos.',
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
            Use the interactive scan below to rotate, pan, and zoom around the James Square pool area.
            The model is provided alongside two reference photos so residents can compare the scan with
            fixed views of the space.
          </p>
        </div>
      </section>

      <section aria-labelledby="pool-model-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="pool-model-heading" className="text-2xl font-bold text-slate-950">
              Interactive pool model
            </h2>
            <p className="mt-2 text-slate-600">
              Drag to rotate, scroll or pinch to zoom, and use touch gestures to inspect the 3D scan.
            </p>
          </div>
          <a
            href={modelHref}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
          >
            Download/open GLB model
          </a>
        </div>
        <PoolModelViewer />
        <p className="text-sm text-slate-500">
          If the 3D viewer does not load in your browser, use the download/open link above to access the GLB file directly.
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
