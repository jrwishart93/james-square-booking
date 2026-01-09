"use client";

import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import AppPromoSection from '@/components/AppPromo/AppPromoSection';

export default function MobileAppPoster() {
  const shouldReduceMotion = useReducedMotion();
  const visualsRef = useRef<HTMLDivElement | null>(null);
  const visualsInView = useInView(visualsRef, { margin: '-20% 0px -20% 0px' });
  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const leftPhoneInitial = shouldReduceMotion ? { opacity: 0 } : { x: -30, rotate: -12, opacity: 0 };
  const rightPhoneInitial = shouldReduceMotion ? { opacity: 0 } : { x: 30, rotate: 12, opacity: 0 };
  const textInitial = shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 };

  const leftPhoneAnimation = shouldReduceMotion
    ? { opacity: visualsInView ? 1 : 0 }
    : { opacity: visualsInView ? 1 : 0, x: visualsInView ? 0 : -30, rotate: visualsInView ? -8 : -12 };
  const rightPhoneAnimation = shouldReduceMotion
    ? { opacity: visualsInView ? 1 : 0 }
    : { opacity: visualsInView ? 1 : 0, x: visualsInView ? 0 : 30, rotate: visualsInView ? 8 : 12 };
  const phoneTransition = shouldReduceMotion
    ? { duration: 0.25 }
    : {
        duration: 0.6,
        ease: easing,
      };
  return (
    <section className="mt-16 sm:mt-20">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-50 to-blue-100 px-6 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/5 dark:from-[#0b1220] dark:to-[#0e1a35] sm:px-10 sm:py-16 md:py-24"
      >
        <motion.div
          initial={textInitial}
          whileInView={{ y: 0, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.25 }
              : {
                  delay: 0.15,
                  duration: 0.6,
                  ease: 'easeOut',
                }
          }
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            James-Square.com
            <span className="mt-2 block text-blue-600 dark:text-blue-300">
              now runs on mobile like an app
            </span>
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Add the James Square app icon to your home screen for a fast, native feel.
          </p>
        </motion.div>

        <div
          ref={visualsRef}
          className="app-promo-visuals relative mt-6 flex items-center justify-center gap-3.5 md:mt-16 md:h-[520px] md:block"
        >
          <motion.div
            initial={leftPhoneInitial}
            animate={leftPhoneAnimation}
            transition={phoneTransition}
            className="app-promo-phone left order-1 block visible z-20 md:absolute md:bottom-0 md:left-2 md:translate-x-6"
          >
            <Image
              src="/images/brands/step4-removebg-preview.png"
              alt="Add James Square to your home screen"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-24 max-w-[28vw] sm:w-28 md:w-[250px] md:max-w-none"
            />
          </motion.div>

          <AppPromoSection className="order-2 z-30 px-0 py-0 pb-0 md:absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:py-0 md:pb-0" />

          <motion.div
            initial={rightPhoneInitial}
            animate={rightPhoneAnimation}
            transition={phoneTransition}
            className="app-promo-phone right order-3 block visible z-20 md:absolute md:bottom-0 md:right-2 md:-translate-x-6"
          >
            <Image
              src="/images/brands/step5-removebg-preview.png"
              alt="James Square app on mobile"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-24 max-w-[28vw] sm:w-28 md:w-[250px] md:max-w-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
