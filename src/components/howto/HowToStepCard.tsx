"use client";

import Image from "next/image";
import HighlightOverlay from "./HighlightOverlay";
import type { HowToStep } from "./HowToCarousel";

export default function HowToStepCard({
  step,
  isActive,
}: {
  step: HowToStep;
  isActive: boolean;
}) {
  return (
    <article
      className={[
        "relative w-[86vw] max-w-[560px] rounded-3xl border border-slate-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none",
        "px-5 py-6 sm:px-7 sm:py-7",
        "transition",
        isActive ? "opacity-100" : "opacity-65 hover:opacity-85",
      ].join(" ")}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_1.05fr] md:gap-7">
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={step.imageSrc}
                alt={`Step ${step.id} screenshot`}
                fill
                className="object-contain"
                priority={step.id <= 2}
              />
              <HighlightOverlay spec={step.highlight} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.32em] text-slate-500 dark:text-white/55">
            STEP {step.id}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {step.title}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-white/70">
            {step.description}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-white/35" />
            Swipe to continue
          </div>
        </div>
      </div>
    </article>
  );
}
