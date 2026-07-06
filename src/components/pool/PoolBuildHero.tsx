'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/images/pool/3D model.mp4';
const REVERSE_END_THRESHOLD_SECONDS = 0.05;

type PlaybackDirection = 'forward' | 'reverse';

export default function PoolBuildHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const directionRef = useRef<PlaybackDirection>('forward');
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scrollToModel = useCallback(() => {
    document.getElementById('pool-interactive-model')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener('change', sync);
    return () => motionQuery.removeEventListener('change', sync);
  }, []);

  // Native reverse playback (negative playbackRate) isn't supported reliably
  // across browsers, so the reverse phase is driven by manually stepping
  // currentTime backwards on each animation frame instead.
  const stepReverse = useCallback((timestamp: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }
    const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
    lastTimestampRef.current = timestamp;

    const nextTime = video.currentTime - deltaSeconds;

    if (nextTime <= REVERSE_END_THRESHOLD_SECONDS) {
      video.currentTime = 0;
      lastTimestampRef.current = null;
      directionRef.current = 'forward';
      void video.play().catch(() => undefined);
      return;
    }

    video.currentTime = nextTime;
    rafRef.current = window.requestAnimationFrame(stepReverse);
  }, []);

  const startReverse = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    directionRef.current = 'reverse';
    lastTimestampRef.current = null;
    rafRef.current = window.requestAnimationFrame(stepReverse);
  }, [stepReverse]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsReady(true);
    const handleEnded = () => {
      if (directionRef.current === 'forward') {
        startReverse();
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    if (video.readyState >= 2) setIsReady(true);

    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
    } else {
      directionRef.current = 'forward';
      const playPromise = video.play();
      playPromise?.catch(() => {
        video.muted = true;
        void video.play().catch(() => undefined);
      });
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, startReverse]);

  return (
    <section className="relative -mx-3 overflow-hidden bg-slate-950 text-white sm:-mx-5 lg:-mx-[calc((100vw-80rem)/2)]" aria-labelledby="pool-build-hero-title">
      <div className="relative flex flex-col items-center justify-center gap-8 overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.20),transparent_34%),radial-gradient(circle_at_50%_115%,rgba(14,165,233,0.16),transparent_45%),linear-gradient(180deg,#020617_0%,#06111f_52%,#020617_100%)] px-5 py-10 sm:px-8 md:py-14">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-100/70">James Square</p>
          <h1 id="pool-build-hero-title" className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Swimming Pool 3D Model
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          <div className="absolute -inset-8 rounded-[3rem] bg-cyan-200/10 blur-3xl" />
          <div className="relative h-[260px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_2rem_5rem_rgba(0,0,0,0.55)] sm:h-[380px] md:h-[460px] lg:h-[560px]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: isReady ? 1 : 0 }}
              src={VIDEO_SRC}
              muted
              autoPlay
              playsInline
              preload="auto"
              aria-label="Looping animation of the James Square swimming pool 3D model playing forward then in reverse"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(2,6,23,0.45)_100%)]" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 sm:pb-7">
              <span className="rounded-full border border-white/15 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-md sm:text-sm">
                Explore the Pool Area in 3D
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3 sm:flex-row">
          <button type="button" onClick={scrollToModel} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
            Explore the Model
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/60">Interactive model below</span>
        </div>
      </div>
    </section>
  );
}
