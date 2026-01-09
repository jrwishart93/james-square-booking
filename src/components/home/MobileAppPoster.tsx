'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function MobileAppPoster() {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.65 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0.2 1', '0.8 0'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const yProgress = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, 40]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const ctaOpacity = useTransform(scrollYProgress, [0.2, 0.6, 1], [0, 1, 0]);
  const ctaYProgress = useTransform(scrollYProgress, [0.2, 0.6, 1], [6, 0, 6]);
  const y = shouldReduceMotion ? 0 : yProgress;
  const scale = shouldReduceMotion ? 1 : scaleProgress;
  const ctaY = shouldReduceMotion ? 0 : ctaYProgress;

  return (
    <section ref={ref} className="mx-auto mt-10 max-w-5xl">
      <motion.div
        style={{ opacity }}
        className="rounded-3xl border border-slate-200/60 bg-slate-50/70 px-6 py-8 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-800/70 dark:bg-slate-950/80"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
          James-Square.com now runs on mobile like an app
        </p>
        <Link
          href="/how-to-app"
          className="group mt-6 inline-flex flex-col items-center gap-3 text-center focus:outline-none"
        >
          <motion.div style={{ y, scale }} className="relative">
            <motion.div
              animate={isInView && !shouldReduceMotion ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={
                isInView && !shouldReduceMotion
                  ? { duration: 2.2, ease: 'easeInOut', repeat: Infinity }
                  : { duration: 0 }
              }
              style={{
                boxShadow: isInView
                  ? '0 12px 40px rgba(59,130,246,0.25)'
                  : '0 8px 24px rgba(15,23,42,0.18)',
              }}
              className="relative h-[100px] w-[100px] rounded-[22%] bg-slate-900/90 ring-1 ring-white/10 dark:bg-slate-950/90 sm:h-[132px] sm:w-[132px]"
            >
              <span className="pointer-events-none absolute inset-0 rounded-[22%] shadow-[inset_0_1px_8px_rgba(255,255,255,0.2)]" />
              <span className="pointer-events-none absolute inset-0 rounded-[22%] bg-gradient-to-br from-white/10 to-transparent" />
              <Image
                src="/images/icons/JS-app-icon-1024.png"
                alt="James Square app icon"
                width={160}
                height={160}
                className="h-full w-full rounded-[22%] object-cover"
              />
            </motion.div>
          </motion.div>
          <motion.span
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500 transition group-hover:underline group-hover:underline-offset-4"
          >
            Click here for more info
          </motion.span>
        </Link>
      </motion.div>
"use client";

import Image from 'next/image';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AppPromoSection from '@/components/AppPromo/AppPromoSection';

export default function MobileAppPoster() {
  const shouldReduceMotion = useReducedMotion();
  const visualsRef = useRef<HTMLDivElement | null>(null);
  const visualsInView = useInView(visualsRef, { margin: '-20% 0px -20% 0px' });
  const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const { scrollYProgress } = useScroll({
    target: visualsRef,
    offset: ['start end', 'end start'],
  });
  const phoneScale = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.96, 1.03, 0.98]);
  const phoneLift = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [12, 0, 8]);

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
            style={shouldReduceMotion ? undefined : { scale: phoneScale, y: phoneLift }}
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
            style={shouldReduceMotion ? undefined : { scale: phoneScale, y: phoneLift }}
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
