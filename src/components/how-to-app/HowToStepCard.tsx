"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HowToStep } from "./types";
import styles from "./howto.module.css";

type Props = {
  step: HowToStep;
  isActive: boolean;
};

export default function HowToStepCard({ step, isActive }: Props) {
  const hs = step.hotspot;

  const leftPct = `${hs.x * 100}%`;
  const topPct = `${hs.y * 100}%`;
  const sizePct = `${hs.size * 100}%`;

  return (
    <div className={styles.card}>
      <div className={styles.imageStage}>
        <div className={styles.imageWrap}>
          <Image
            src={step.image}
            alt={`${step.title} screenshot`}
            width={820}
            height={1640}
            priority={step.stepNumber === 1}
            className={styles.phoneImg}
          />

          <div
            className={styles.hotspotWrap}
            style={{
              left: leftPct,
              top: topPct,
              width: sizePct,
              height: sizePct,
            }}
            aria-hidden="true"
          >
            <div className={styles.hotspotRing} />
            <div className={styles.hotspotPulse} />

            <div
              className={styles.hotspotLabel}
              style={{
                transform: `translate(calc(-50% + ${hs.labelOffset.dx}px), calc(-50% + ${hs.labelOffset.dy}px))`,
              }}
            >
              {hs.label}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className={styles.textBlock}
        animate={{ opacity: isActive ? 1 : 0.72 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.kicker}>{step.kicker}</div>

        <div className="flex items-baseline gap-3 mt-1">
          <div className={styles.stepTag}>STEP {step.stepNumber}</div>
          <h3 className={styles.title}>{step.title}</h3>
        </div>

        <p className={styles.desc}>{step.description}</p>
      </motion.div>
    </div>
  );
}
