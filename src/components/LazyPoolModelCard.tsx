'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import PoolModelViewer from '@/components/PoolModelViewer';

type PoolModelViewerSize = 'hero' | 'standard' | 'compact';

type LazyPoolModelCardProps = {
  ariaLabel: string;
  autoSpin?: boolean;
  autoSpinSpeed?: number;
  badgeLabel: string;
  description: string;
  isActive: boolean;
  loadingLabel: string;
  modelName: string;
  modelSrc: string;
  onActivate: () => void;
  size: PoolModelViewerSize;
  thumbnailAlt: string;
  thumbnailSrc: string;
  title: string;
};

const previewHeightClasses: Record<PoolModelViewerSize, string> = {
  hero: 'h-[360px] sm:h-[520px] lg:h-[680px]',
  standard: 'h-[320px] sm:h-[440px] lg:h-[560px]',
  compact: 'h-[280px] sm:h-[380px] lg:h-[480px]',
};

export default function LazyPoolModelCard({
  ariaLabel,
  autoSpin = false,
  autoSpinSpeed = 2,
  badgeLabel,
  description,
  isActive,
  loadingLabel,
  modelName,
  modelSrc,
  onActivate,
  size,
  thumbnailAlt,
  thumbnailSrc,
  title,
}: LazyPoolModelCardProps) {
  const [hasBeenActivated, setHasBeenActivated] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setHasBeenActivated(true);
    }
  }, [isActive]);

  const handleActivate = () => {
    setHasBeenActivated(true);
    onActivate();
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 px-2 pt-2 sm:px-3">
        <span className="w-fit rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/10 dark:text-sky-100">
          {badgeLabel}
        </span>
        <h3 className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
          {title}
        </h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>

      {isActive ? (
        <PoolModelViewer
          modelSrc={modelSrc}
          modelName={modelName}
          loadingLabel={loadingLabel}
          ariaLabel={ariaLabel}
          autoSpin={autoSpin}
          autoSpinSpeed={autoSpinSpeed}
          size={size}
        />
      ) : (
        <button
          type="button"
          onClick={handleActivate}
          aria-label={`${ariaLabel}. Click to view and interact with 3D scan.`}
          className="group relative block w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-left shadow-2xl shadow-sky-950/20 outline-none transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] focus-visible:ring-4 focus-visible:ring-sky-400/70 dark:border-white/10"
        >
          <span className={`relative block w-full ${previewHeightClasses[size]}`}>
            <Image
              src={thumbnailSrc}
              alt={thumbnailAlt}
              fill
              sizes={size === 'hero' ? '100vw' : '(min-width: 1024px) 50vw, 100vw'}
              className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-95"
              priority={size === 'hero'}
              unoptimized
            />
            <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-cyan-950/20" />
            <span className="absolute inset-4 rounded-[1.35rem] border border-white/25 ring-2 ring-sky-300/30 transition duration-300 group-hover:ring-4 group-hover:ring-cyan-300/50 sm:inset-6" />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 text-center text-white">
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                <span className="absolute inset-0 rounded-full border border-cyan-200/70 animate-ping" />
                <span className="absolute inset-2 rounded-full border border-white/60 animate-pulse" />
                <span className="ml-1 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-white drop-shadow-lg" />
              </span>
              <span className="max-w-xs rounded-2xl border border-white/20 bg-slate-950/70 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] shadow-xl backdrop-blur-md animate-pulse sm:text-base">
                Click to view and interact with 3D scan
              </span>
              {hasBeenActivated ? (
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-900">
                  Switch back to this model
                </span>
              ) : null}
            </span>
          </span>
        </button>
      )}
    </>
  );
}
