'use client';

import { useEffect, useRef, useState } from 'react';

type PoolModelViewerProps = {
  src: string;
  poster?: string;
  ariaLabel?: string;
};

const EXTERNAL_CAMERA_ORBIT = '35deg 62deg 10m';
const EXTERNAL_CAMERA_TARGET = '0m 0m 0m';
const INSIDE_CAMERA_ORBIT = '180deg 88deg 2m';
const INSIDE_CAMERA_TARGET = '0m 1.4m -2m';
const INSIDE_MODEL_ROTATION_SPEED = 9;

export default function PoolModelViewer({
  src,
  poster = '/images/buildingimages/pool-3D-facing-south.jpg',
  ariaLabel = 'Interactive 3D model of the James Square pool area',
}: PoolModelViewerProps) {
  const viewerRef = useRef<HTMLElement | null>(null);
  const [insideView, setInsideView] = useState(false);

  useEffect(() => {
    void import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    if (!insideView) {
      viewer.setAttribute('orientation', '0deg 0deg 0deg');
      return;
    }

    let frameId = 0;
    let previousTimestamp = performance.now();
    let yRotation = 0;

    const rotateModel = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
      previousTimestamp = timestamp;
      yRotation = (yRotation + deltaSeconds * INSIDE_MODEL_ROTATION_SPEED) % 360;
      viewer.setAttribute('orientation', `0deg ${yRotation.toFixed(3)}deg 0deg`);
      frameId = window.requestAnimationFrame(rotateModel);
    };

    frameId = window.requestAnimationFrame(rotateModel);

    return () => {
      window.cancelAnimationFrame(frameId);
      viewer.setAttribute('orientation', '0deg 0deg 0deg');
    };
  }, [insideView]);

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-slate-950 shadow-2xl shadow-sky-950/20">
      <div className="relative">
        <button
          type="button"
          aria-pressed={insideView}
          onClick={() => setInsideView((enabled) => !enabled)}
          className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:right-4 sm:top-4"
        >
          Inside View
        </button>
        <model-viewer
          ref={viewerRef}
          src={src}
          poster={poster}
          camera-controls
          {...(!insideView ? { 'auto-rotate': true } : {})}
          touch-action="pan-y"
          shadow-intensity="0.65"
          exposure="0.95"
          camera-orbit={insideView ? INSIDE_CAMERA_ORBIT : EXTERNAL_CAMERA_ORBIT}
          camera-target={insideView ? INSIDE_CAMERA_TARGET : EXTERNAL_CAMERA_TARGET}
          min-camera-orbit={insideView ? '170deg 82deg 1.6m' : 'auto auto 3m'}
          max-camera-orbit={insideView ? '190deg 96deg 2.7m' : 'auto auto 14m'}
          field-of-view={insideView ? '55deg' : '45deg'}
          min-field-of-view={insideView ? '50deg' : '25deg'}
          max-field-of-view={insideView ? '60deg' : '75deg'}
          interaction-prompt={insideView ? 'none' : 'auto'}
          aria-label={`${ariaLabel}${insideView ? ' in inside view mode' : ''}`}
          className="block h-[420px] w-full bg-slate-950 sm:h-[560px] lg:h-[680px]"
        />
      </div>
    </div>
  );
}
