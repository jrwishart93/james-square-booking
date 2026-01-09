"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FocusRing from "./FocusRing";
import { HowToStepData } from "./howToSteps";

export default function HowToStep({ step }: { step: HowToStepData }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[320px] md:w-[360px] lg:w-[380px]"
      initial={{ opacity: 0.5, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative mx-auto">
        <Image
          src={step.image}
          alt={step.title}
          width={360}
          height={720}
          className="select-none"
          priority
        />
        <FocusRing {...step.focus} />
      </div>

      <div className="mt-6 px-2 text-center">
        <h3 className="text-lg font-semibold text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]">
          {step.title}
        </h3>
        <p className="mt-2 text-sm text-white/80 leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}
