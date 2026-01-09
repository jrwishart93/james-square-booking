"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HowToStepCard from "./HowToStepCard";
import type { HowToStep } from "./types";
import styles from "./howto.module.css";

type Props = {
  steps: HowToStep[];
};

export default function HowToCarousel({ steps }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const ids = useMemo(() => steps.map((s) => s.id), [steps]);

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(index, steps.length - 1));
    const el = cardRefs.current[clamped];
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const left = el.offsetLeft - (scroller.clientWidth - el.clientWidth) / 2;

    scroller.scrollTo({ left, behavior: "smooth" });
  }

  function prev() {
    scrollToIndex(activeIndex - 1);
  }

  function next() {
    scrollToIndex(activeIndex + 1);
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible) return;
        const id = visible.target.getAttribute("data-step-id");
        const idx = ids.indexOf(id || "");
        if (idx !== -1) setActiveIndex(idx);
      },
      {
        root: scroller,
        threshold: [0.35, 0.5, 0.65, 0.8],
      }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      if (!scroller.contains(event.target as Node)) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      if (absY > absX) {
        event.preventDefault();
        scroller.scrollLeft += event.deltaY * 1.1;
      }
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/70 text-sm">
          Step <span className="text-white font-medium">{activeIndex + 1}</span> of{" "}
          <span className="text-white/80">{steps.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={prev} className={styles.navBtn} aria-label="Previous step">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={next} className={styles.navBtn} aria-label="Next step">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={`${styles.scroller} pb-6`}
        aria-label="How to add to Home Screen steps"
      >
        {steps.map((step, idx) => (
          <div
            key={step.id}
            data-step-id={step.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className={styles.slide}
          >
            <HowToStepCard step={step} isActive={idx === activeIndex} />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => scrollToIndex(index)}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
