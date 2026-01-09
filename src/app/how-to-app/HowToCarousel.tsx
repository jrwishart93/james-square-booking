"use client";

import { HOW_TO_STEPS } from "./howToSteps";
import HowToStep from "./HowToStep";

export default function HowToCarousel() {
  return (
    <div className="relative">
      <div
        className="flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[20vw] py-12"
      >
        {HOW_TO_STEPS.map((step) => (
          <div key={step.id} className="snap-center">
            <HowToStep step={step} />
          </div>
        ))}
      </div>
    </div>
  );
}
