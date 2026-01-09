"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

type AppPromoSectionProps = {
  className?: string;
};

export default function AppPromoSection({ className = '' }: AppPromoSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });

  const wrapperAnimation = shouldReduceMotion
    ? { opacity: isInView ? 1 : 0 }
    : { opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9, y: isInView ? 0 : 40 };

  const wrapperTransition = { duration: 0.6, ease: easing };

  return (
    <section
      ref={ref}
      className={`app-promo-section px-4 py-12 pb-16 text-center md:px-0 md:py-24 md:pb-36 ${className}`.trim()}
    >
      <motion.div
        className="app-promo-icon-wrapper inline-flex transform-gpu drop-shadow-[0_0_28px_rgba(96,165,250,0.35)]"
        animate={wrapperAnimation}
        transition={wrapperTransition}
      >
        <Link
          href="/how-to-app"
          className="flex flex-col items-center gap-2 text-[0.85rem] font-medium text-blue-600 transition hover:underline dark:text-blue-300"
        >
          <motion.div
            animate={
              isInView && !shouldReduceMotion
                ? { scale: [1, 1.02, 1] }
                : { scale: 1 }
            }
            transition={
              isInView && !shouldReduceMotion
                ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0 }
            }
            className="relative"
          >
            <motion.span
              className="pointer-events-none absolute -inset-5 rounded-[28%] bg-blue-400/30 blur-2xl dark:bg-blue-400/35"
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={wrapperTransition}
            />
            <div className="app-promo-icon-clip relative h-[72px] w-[72px] overflow-hidden rounded-[22%] bg-[#0b1220] md:h-28 md:w-28">
              <span className="pointer-events-none absolute inset-0 rounded-[22%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]" />
              <Image
                src="/images/icons/JS-app-icon-1024.png"
                alt="James Square App"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 112px, 96px"
              />
            </div>
          </motion.div>
          <motion.span
            className="mt-1.5"
            animate={{ opacity: isInView ? 1 : 0, y: shouldReduceMotion ? 0 : isInView ? 0 : 8 }}
            transition={wrapperTransition}
          >
            Click here for more info
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}
