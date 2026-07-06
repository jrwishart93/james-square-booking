import type { Metadata } from 'next';

import PoolModelViewer from '@/components/PoolModelViewer';

export const metadata: Metadata = {
  title: 'James Square Pool 3D Model',
  description:
    'Scroll-controlled interactive 3D model of the James Square heated indoor pool, created to support repair and refurbishment discussions.',
  openGraph: {
    title: 'James Square Pool 3D Model',
    description:
      'Scroll-controlled interactive 3D model of the James Square heated indoor pool, created to support repair and refurbishment discussions.',
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

const supportingNotes = [
  'Use the scroll sequence for orientation before taking manual control.',
  'The model is a working visual reference for pool repair and refurbishment discussions.',
  'Reduced-motion users see a static interactive viewer without the guided camera path.',
];

export default function Pool3DPage() {
  return (
    <main className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 lg:py-10">
        <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-xl shadow-sky-950/5 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 sm:p-8 lg:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">
            Pool project reference
          </p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                James Square Pool 3D Model
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-200 sm:text-lg">
                Scroll to guide the camera from a dollhouse overview into the pool space, then take control and inspect the model manually.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100">
              Pool currently closed pending repairs and further assessment.
            </div>
          </div>
        </div>
      </section>

      <PoolModelViewer ariaLabel="Scroll-controlled 3D model of the James Square heated indoor pool layout" />

      <section className="mx-auto max-w-5xl px-3 py-10 sm:px-5 lg:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-slate-900/80 sm:p-6">
          <h2 className="text-2xl font-bold">Model notes</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {supportingNotes.map((note) => (
              <p key={note} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
