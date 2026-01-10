"use client";

import { useEffect, useRef, useState } from "react";
import HowToStepCard from "./HowToStepCard";

export type HighlightSpec = {
  xPct: number;
  yPct: number;
  rPct: number;
};

export type HowToStep = {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  highlight: HighlightSpec;
};

export default function HowToCarousel({ steps }: { steps: HowToStep[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const stepCount = steps.length;

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(stepCount - 1, idx));
    const child = track.children.item(clamped) as HTMLElement | null;
    if (!child) return;

    child.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      Array.from(track.children).forEach((child, idx) => {
        const childRect = (child as HTMLElement).getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const dist = Math.abs(centerX - childCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActive(bestIdx);
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const canPrev = active > 0;
  const canNext = active < stepCount - 1;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-2 top-[-56px] hidden items-center gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollToIndex(active - 1)}
          disabled={!canPrev}
          className="pointer-events-auto rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/10 disabled:opacity-40"
          aria-label="Previous step"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(active + 1)}
          disabled={!canNext}
          className="pointer-events-auto rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/10 disabled:opacity-40"
          aria-label="Next step"
        >
          →
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex w-full gap-5 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="w-4 shrink-0 sm:w-10" aria-hidden />

        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="shrink-0"
            style={{
              scrollSnapAlign: "center",
            }}
          >
            <HowToStepCard step={step} isActive={idx === active} />
          </div>
        ))}

        <div className="w-4 shrink-0 sm:w-10" aria-hidden />
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {steps.map((_, idx) => (
          <button
            key={`step-dot-${idx}`}
            type="button"
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to step ${idx + 1}`}
            className={[
              "h-2.5 w-2.5 rounded-full transition",
              idx === active ? "bg-white/80" : "bg-white/20 hover:bg-white/35",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
