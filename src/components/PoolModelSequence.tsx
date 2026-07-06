'use client';

import { useState } from 'react';

import LazyPoolModelCard from '@/components/LazyPoolModelCard';

const poolModels = [
  {
    id: 'clean-model',
    wrapperClassName:
      'rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-sky-950/10 dark:border-white/10 dark:bg-slate-900/90 sm:p-4',
    badgeLabel: 'Clean model',
    title: 'Featured pool area model',
    description:
      'Use this cleaned GLB model as the primary coordination reference for layout, circulation, repair scope conversations and early refurbishment discussions.',
    modelSrc: '/images/pool/pool-area-3D-model.glb',
    modelName: 'James Square pool area 3D model',
    loadingLabel: 'Loading the modelled pool area…',
    ariaLabel: 'Interactive 3D model of the James Square heated indoor pool layout',
    size: 'hero' as const,
    thumbnailSrc: '/images/pool/Pool-facing-south.png',
    thumbnailAlt: 'Preview image of the James Square pool area facing south',
    autoSpin: true,
    autoSpinSpeed: 1.4,
    footer:
      'This model is a working visual reference created from the scan and may be refined as further photos, measurements and survey information become available.',
  },
  {
    id: 'photo-scan',
    wrapperClassName:
      'rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-sky-950/10 dark:border-white/10 dark:bg-slate-900/90 sm:p-4',
    badgeLabel: 'Photo scan',
    title: 'Pool capture reference',
    description:
      'Compare the cleaned model against the original photo scan to understand captured geometry, finishes and areas that may need survey confirmation.',
    modelSrc: '/images/pool/pool-3D-photo-scan.glb',
    modelName: 'James Square pool photo scan',
    loadingLabel: 'Loading the pool photo scan…',
    ariaLabel: 'Interactive 3D photo scan of the James Square heated indoor pool area',
    size: 'compact' as const,
    thumbnailSrc: '/images/pool/3Dimage-facing-north.jpg',
    thumbnailAlt: 'Preview image of the 3D pool model view facing north',
    autoSpin: true,
    autoSpinSpeed: 1.1,
  },
  {
    id: 'plant-room',
    wrapperClassName:
      'rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-sky-950/10 dark:border-white/10 dark:bg-slate-900/90 sm:p-4',
    badgeLabel: 'Plant room',
    title: 'Plant room and office scan',
    description:
      'Review this separate scan for plant, office and back-of-house context that supports contractor access planning and services discussions.',
    modelSrc: '/images/pool/plant-room-and-office.glb',
    modelName: 'James Square plant room and office scan',
    loadingLabel: 'Loading the plant room and office scan…',
    ariaLabel: 'Interactive 3D scan of the James Square pool plant room and office',
    size: 'compact' as const,
    thumbnailSrc: '/images/pool/Pool-entrance.png',
    thumbnailAlt: 'Preview image of the James Square pool entrance area',
    autoSpin: true,
    autoSpinSpeed: 1.1,
  },
];

export default function PoolModelSequence() {
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [featuredModel, ...supportingModels] = poolModels;

  return (
    <>
      <article className={featuredModel.wrapperClassName}>
        <div className="mb-3 flex justify-end px-2 pt-2 sm:px-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {featuredModel.modelSrc}
          </p>
        </div>
        <LazyPoolModelCard
          {...featuredModel}
          isActive={activeModelId === featuredModel.id}
          onActivate={() => setActiveModelId(featuredModel.id)}
        />
        {featuredModel.footer ? (
          <p className="px-2 pt-4 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:px-3">
            {featuredModel.footer}
          </p>
        ) : null}
      </article>

      <div className="grid gap-5 lg:grid-cols-2">
        {supportingModels.map((model) => (
          <article key={model.id} className={model.wrapperClassName}>
            <LazyPoolModelCard
              {...model}
              isActive={activeModelId === model.id}
              onActivate={() => setActiveModelId(model.id)}
            />
          </article>
        ))}
      </div>
    </>
  );
}
