"use client";

import HowToCarousel from "./HowToCarousel";
import type { HowToStep } from "./types";

const steps: HowToStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    kicker: "IPHONE · SAFARI",
    title: "Open Safari",
    description:
      "Open Safari and go to www.james-square.com, then tap the three dots in the bottom-right corner.",
    image: "/images/how-to-app/step-1.png",
    hotspot: {
      // EDIT THESE NUMBERS to move the circle.
      // x/y are percentages of the image box (0 to 1).
      x: 0.84,
      y: 0.87,
      size: 0.12,
      label: "MENU",
      labelOffset: { dx: 22, dy: 20 },
    },
  },
  {
    id: "step-2",
    stepNumber: 2,
    kicker: "IPHONE · SAFARI",
    title: "Tap Share",
    description: "From the menu, tap Share to open the iOS sharing options.",
    image: "/images/how-to-app/step-2.png",
    hotspot: {
      x: 0.44,
      y: 0.58,
      size: 0.13,
      label: "SHARE",
      labelOffset: { dx: -10, dy: -42 },
    },
  },
  {
    id: "step-3",
    stepNumber: 3,
    kicker: "IPHONE · SAFARI",
    title: "Add to Home Screen",
    description: "Scroll down and tap Add to Home Screen.",
    image: "/images/how-to-app/step-3.png",
    hotspot: {
      x: 0.5,
      y: 0.82,
      size: 0.14,
      label: "ADD",
      labelOffset: { dx: 0, dy: 42 },
    },
  },
  {
    id: "step-4",
    stepNumber: 4,
    kicker: "IPHONE · SAFARI",
    title: "Confirm details",
    description: "Check the details and make sure Open as Web App is enabled, then tap Add.",
    image: "/images/how-to-app/step-4.png",
    hotspot: {
      x: 0.83,
      y: 0.14,
      size: 0.14,
      label: "ADD",
      labelOffset: { dx: 54, dy: 34 },
    },
  },
  {
    id: "step-5",
    stepNumber: 5,
    kicker: "IPHONE · SAFARI",
    title: "Launch James Square",
    description: "James Square will now appear on your home screen. Tap it to open like an app.",
    image: "/images/how-to-app/step-5.png",
    hotspot: {
      x: 0.73,
      y: 0.56,
      size: 0.18,
      label: "OPEN",
      labelOffset: { dx: 0, dy: 58 },
    },
  },
];

export default function HowToAppGuide() {
  return (
    <section className="w-full">
      <div className="mb-8">
        <div className="text-[11px] tracking-[0.28em] text-white/55 uppercase">
          Your guided setup
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold text-white">
          Add James Square to your Home Screen
        </h1>
        <p className="mt-3 text-base sm:text-lg text-white/70 max-w-2xl">
          Swipe through the steps. If anything looks slightly off on your device, you can fine-tune
          the circle position by adjusting the x/y numbers in the steps array.
        </p>
      </div>

      <HowToCarousel steps={steps} />
    </section>
  );
}
