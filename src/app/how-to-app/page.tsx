"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HowToCarousel from "@/components/howto/HowToCarousel";
import AndroidCarousel from "@/components/howto/AndroidCarousel";
import PlatformSwitcher from "@/components/howto/PlatformSwitcher";
import type { HowToStep } from "@/components/howto/HowToCarousel";

export default function HowToAppPage() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  /**
   * ✅ EDIT HIGHLIGHT POSITIONS HERE
   * --------------------------------
   * Each highlight uses % coordinates relative to the IMAGE area.
   *
   * xPct: 0–100 (left → right)
   * yPct: 0–100 (top → bottom)
   * rPct: ring radius (roughly “size”), also in % of the image width
   *
   * TIP:
   * - If ring is too far RIGHT, reduce xPct.
   * - If ring is too far LEFT, increase xPct.
   * - If ring is too LOW, reduce yPct.
   * - If ring is too HIGH, increase yPct.
   * - If ring is too big/small, adjust rPct.
   */
  const steps: HowToStep[] = [
    {
      id: 1,
      title: "Open Safari",
      description:
        "Open Safari and go to www.james-square.com, then tap the three dots in the bottom-right corner.",
      imageSrc: "/images/brands/step1-removebg-preview.png",
      highlight: {
        xPct: 86,
        yPct: 84,
        rPct: 10,
      },
    },
    {
      id: 2,
      title: "Tap Share",
      description: "From the menu, tap Share to open the iOS sharing options.",
      imageSrc: "/images/brands/step2-removebg-preview.png",
      highlight: {
        xPct: 50,
        yPct: 56,
        rPct: 12,
      },
    },
    {
      id: 3,
      title: "Add to Home Screen",
      description: "Scroll down and tap Add to Home Screen.",
      imageSrc: "/images/brands/step3-removebg-preview.png",
      highlight: {
        xPct: 50,
        yPct: 78,
        rPct: 12,
      },
    },
    {
      id: 4,
      title: "Confirm details",
      description: "Check the details and make sure Open as Web App is enabled, then tap Add.",
      imageSrc: "/images/brands/step4-removebg-preview.png",
      highlight: {
        xPct: 86,
        yPct: 17,
        rPct: 10,
      },
    },
    {
      id: 5,
      title: "Launch James Square",
      description:
        "James Square will now appear on your home screen. Tap it to open like an app.",
      imageSrc: "/images/brands/step5-removebg-preview.png",
      highlight: {
        xPct: 73,
        yPct: 56,
        rPct: 14,
      },
    },
  ];

  return (
    <motion.main
      className="min-h-[calc(100vh-64px)] w-full bg-slate-50 text-slate-900 dark:bg-[#070B14] dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-2 text-xs tracking-[0.28em] text-slate-500 dark:text-white/60">
            ADD TO HOME SCREEN
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Your guided setup</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-white/70">
            Follow the steps below to install James Square on your phone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          <PlatformSwitcher platform={platform} setPlatform={setPlatform} />
        </motion.div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {platform === "ios" ? <HowToCarousel steps={steps} /> : <AndroidCarousel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.main>
  );
}
