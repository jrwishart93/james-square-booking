'use client';

import { useEffect } from 'react';

const modelHref = '/docs/survey/pool-area-scan-polycam.glb';

export default function PoolModelViewer() {
  useEffect(() => {
    void import('@google/model-viewer');
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-slate-950 shadow-2xl shadow-sky-950/20">
      <model-viewer
        src={modelHref}
        poster="/images/buildingimages/pool-3D-facing-south.jpg"
        camera-controls
        auto-rotate
        touch-action="pan-y"
        shadow-intensity="0.65"
        exposure="0.95"
        aria-label="Interactive 3D scan of the James Square pool area"
        className="block h-[420px] w-full bg-slate-950 sm:h-[560px] lg:h-[680px]"
      >
        <a
          href={modelHref}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-sky-50"
        >
          Open the pool 3D model
        </a>
      </model-viewer>
    </div>
  );
}