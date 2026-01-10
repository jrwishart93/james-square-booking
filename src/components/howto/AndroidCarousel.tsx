"use client";

import AndroidStepCard from "./AndroidStepCard";

const androidSteps = [
  {
    id: 1,
    title: "Open Chrome",
    text: "Open Google Chrome on your Android phone and go to www.james-square.com.",
  },
  {
    id: 2,
    title: "Open menu",
    text: "Tap the three dots in the top-right corner of Chrome.",
  },
  {
    id: 3,
    title: "Add to Home screen",
    text: "Tap “Add to Home screen” from the menu.",
  },
  {
    id: 4,
    title: "Confirm",
    text: "Confirm the name and tap Add.",
  },
  {
    id: 5,
    title: "Launch",
    text: "James Square will now appear on your home screen like an app.",
  },
];

export default function AndroidCarousel() {
  return (
    <div
      className="flex gap-4 overflow-x-auto pb-6 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
      style={{ scrollSnapType: "x mandatory" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-4 shrink-0" />

      {androidSteps.map((step) => (
        <div key={step.id} className="shrink-0" style={{ scrollSnapAlign: "center" }}>
          <AndroidStepCard step={step} />
        </div>
      ))}

      <div className="w-4 shrink-0" />
    </div>
  );
}
