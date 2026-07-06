'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/images/pool/3D model.mp4';
const SCROLL_EPSILON_SECONDS = 0.02;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export default function PoolBuildHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const completeProgress = reducedMotion || isMobile ? 1 : progress;
  const easedProgress = easeOutCubic(completeProgress);
  const textOpacity = clamp((completeProgress - 0.58) / 0.28);
  const finalOpacity = clamp((completeProgress - 0.82) / 0.16);
  const videoScale = 0.96 + easedProgress * 0.04;
  const videoTranslate = 20 - easedProgress * 20;

  const scrollToModel = useCallback(() => {
    document.getElementById('pool-interactive-model')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncQueries = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    syncQueries();
    mobileQuery.addEventListener('change', syncQueries);
    motionQuery.addEventListener('change', syncQueries);

    return () => {
      mobileQuery.removeEventListener('change', syncQueries);
      motionQuery.removeEventListener('change', syncQueries);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMetadata = () => {
      setDuration(video.duration || 0);
      setIsReady(true);
      if (reducedMotion && Number.isFinite(video.duration)) {
        video.currentTime = video.duration;
        lastTimeRef.current = video.duration;
        setProgress(1);
      }
    };

    if (video.readyState >= 1) onMetadata();
    video.addEventListener('loadedmetadata', onMetadata);
    return () => video.removeEventListener('loadedmetadata', onMetadata);
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !duration) return;

    video.pause();

    if (reducedMotion) {
      video.currentTime = duration;
      lastTimeRef.current = duration;
      setProgress(1);
      return;
    }

    if (isMobile) {
      video.currentTime = 0;
      lastTimeRef.current = 0;
      setProgress(0);
      const playPromise = video.play();
      playPromise?.catch(() => {
        video.muted = true;
        void video.play().catch(() => undefined);
      });
      return;
    }

    video.currentTime = 0;
    lastTimeRef.current = 0;
    setProgress(0);
  }, [duration, isMobile, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHasEntered(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered || isMobile || reducedMotion || !duration) return;

    const update = () => {
      frameRef.current = null;
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / scrollable);
      const nextTime = nextProgress * duration;

      setProgress(nextProgress);
      if (Math.abs(nextTime - lastTimeRef.current) >= SCROLL_EPSILON_SECONDS) {
        video.currentTime = nextTime;
        lastTimeRef.current = nextTime;
      }
    };

    const requestUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(update);
      }
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [duration, hasEntered, isMobile, reducedMotion]);

  return (
    <section ref={sectionRef} className="relative -mx-3 h-auto overflow-clip bg-slate-950 text-white sm:-mx-5 md:h-[160vh] lg:-mx-[calc((100vw-80rem)/2)]" aria-labelledby="pool-build-hero-title">
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.20),transparent_34%),radial-gradient(circle_at_50%_115%,rgba(14,165,233,0.16),transparent_45%),linear-gradient(180deg,#020617_0%,#06111f_52%,#020617_100%)] px-5 py-10 sm:px-8 md:sticky md:top-0 md:h-screen md:py-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(2,6,23,0.72)_100%)]" />

        <div className="relative z-10 flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8">
          <div className="text-center transition-opacity duration-700" style={{ opacity: isReady ? 1 : 0 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-100/70">James Square</p>
            <h1 id="pool-build-hero-title" className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Swimming Pool 3D Model
            </h1>
            <p className="mt-5 text-sm font-medium text-slate-300 sm:text-base">Scroll to watch the digital model come to life.</p>
          </div>

          <div className="relative w-full max-w-5xl transition-transform duration-200 will-change-transform" style={{ transform: `translate3d(0, ${videoTranslate}px, 0) scale(${videoScale})` }}>
            <div className="absolute -inset-8 rounded-[3rem] bg-cyan-200/10 blur-3xl" />
            <div className="relative h-[300px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_2rem_5rem_rgba(0,0,0,0.55)] sm:h-[420px] md:h-[480px] lg:h-[600px]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={VIDEO_SRC}
                muted
                playsInline
                loop={isMobile}
                preload={isMobile ? 'metadata' : 'auto'}
                onEnded={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  video.pause();
                  setProgress(1);
                }}
                aria-label="Scroll controlled animation showing the James Square swimming pool 3D model being constructed"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(2,6,23,0.45)_100%)]" />
            </div>
          </div>

          <div className="max-w-2xl text-center transition duration-700" style={{ opacity: Math.max(textOpacity, reducedMotion ? 1 : 0), transform: `translateY(${(1 - textOpacity) * 12}px)` }}>
            <p className="text-base leading-7 text-slate-300 sm:text-lg">
              A clean construction sequence introduces the completed pool model before handing you directly into the interactive PlayCanvas viewer.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{ opacity: Math.max(finalOpacity, reducedMotion ? 1 : 0) }}>
              <button type="button" onClick={scrollToModel} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
                Explore the Model
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/60">Interactive model below</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
