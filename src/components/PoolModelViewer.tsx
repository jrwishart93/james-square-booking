'use client';

import { useEffect } from 'react';

type PoolModelViewerProps = {
  src: string;
  poster?: string;
  ariaLabel?: string;
};

export default function PoolModelViewer({
  src,
  poster = '/images/buildingimages/pool-3D-facing-south.jpg',
  ariaLabel = 'Interactive 3D model of the James Square pool area',
}: PoolModelViewerProps) {
  useEffect(() => {
    void import('@google/model-viewer');
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-slate-950 shadow-2xl shadow-sky-950/20">
      <model-viewer
        src={src}
        poster={poster}
        camera-controls
        auto-rotate
        touch-action="pan-y"
        shadow-intensity="0.65"
        exposure="0.95"
        aria-label={ariaLabel}
        className="block h-[420px] w-full bg-slate-950 sm:h-[560px] lg:h-[680px]"
      />
    </div>
  );
}
