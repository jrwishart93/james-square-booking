'use client';

import { ArrowRight, Box, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import PoolModelFullscreenModal from '@/components/PoolModelFullscreenModal';
import PoolModelViewer from '@/components/PoolModelViewer';

type PoolModelViewerSize = 'hero' | 'standard' | 'compact';

type LazyPoolModelCardProps = {
  ariaLabel: string;
  autoSpin?: boolean;
  autoSpinSpeed?: number;
  description: string;
  footer?: string;
  isActive: boolean;
  loadingLabel: string;
  modelName: string;
  modelSrc: string;
  onActivate: () => void;
  priority?: boolean;
  size: PoolModelViewerSize;
  subtitle: string;
  thumbnailAlt: string;
  thumbnailPosition?: string;
  thumbnailSrc: string;
  title: string;
};

export default function LazyPoolModelCard({
  ariaLabel,
  autoSpin = false,
  autoSpinSpeed = 2,
  description,
  footer,
  isActive,
  loadingLabel,
  modelName,
  modelSrc,
  onActivate,
  priority = false,
  size,
  subtitle,
  thumbnailAlt,
  thumbnailPosition = 'object-center',
  thumbnailSrc,
  title,
}: LazyPoolModelCardProps) {
  const [hasBeenActivated, setHasBeenActivated] = useState(isActive);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isActive) {
      setHasBeenActivated(true);
    }
  }, [isActive]);

  const handleActivate = () => {
    setHasBeenActivated(true);
    onActivate();
  };

  const handleExpand = () => {
    handleActivate();
    setIsFullscreen(true);
  };

  return (
    <article className="flex flex-col rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-sky-950/10 dark:border-white/10 dark:bg-slate-900/90 sm:p-4">
      {isActive ? (
        <div className="relative">
          <PoolModelViewer
            modelSrc={modelSrc}
            modelName={modelName}
            loadingLabel={loadingLabel}
            ariaLabel={ariaLabel}
            autoSpin={autoSpin}
            autoSpinSpeed={autoSpinSpeed}
            size={size}
          />
          <button
            type="button"
            onClick={handleExpand}
            aria-label={`Expand ${title} to full screen`}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-slate-950/90 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Full screen</span>
          </button>
        </div>
      ) : (
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-xl shadow-sky-950/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30">
          <button
            type="button"
            onClick={handleActivate}
            aria-label={`${ariaLabel}. Tap to view in 3D.`}
            className="absolute inset-0 block h-full w-full text-left outline-none active:scale-[0.97] active:duration-150 focus-visible:ring-4 focus-visible:ring-sky-400/70"
          >
            <Image
              src={thumbnailSrc}
              alt={thumbnailAlt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className={`object-cover ${thumbnailPosition} transition-transform duration-500 ease-out group-hover:scale-105`}
              priority={priority}
              unoptimized
            />

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

            <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-cyan-100 shadow-lg ring-1 ring-white/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <span className="absolute inset-0 rounded-full ring-2 ring-cyan-300/40 animate-ping" />
              <Box className="relative h-4 w-4" strokeWidth={2} />
            </span>

            <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:p-5">
              <span className="text-lg font-bold leading-tight text-white drop-shadow-sm sm:text-xl">
                {title}
              </span>
              <span className="text-xs text-slate-200 drop-shadow-sm sm:text-sm">{subtitle}</span>
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors duration-300 group-hover:border-cyan-200/70 group-hover:bg-white/20 sm:text-xs">
                Tap to view in 3D
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </span>
              {hasBeenActivated ? (
                <span className="mt-1 w-fit rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900">
                  Tap to reopen this view
                </span>
              ) : null}
            </span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleExpand();
            }}
            aria-label={`Expand ${title} to full screen`}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-slate-950/90 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Full screen</span>
          </button>
        </div>
      )}

      <div className="mt-4 px-1 sm:px-2">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        {footer ? (
          <p className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            {footer}
          </p>
        ) : null}
      </div>

      {isFullscreen ? (
        <PoolModelFullscreenModal
          title={title}
          modelSrc={modelSrc}
          modelName={modelName}
          loadingLabel={loadingLabel}
          ariaLabel={ariaLabel}
          autoSpin={autoSpin}
          autoSpinSpeed={autoSpinSpeed}
          onClose={() => setIsFullscreen(false)}
        />
      ) : null}
    </article>
  );
}
