'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const CTA_TEXT = 'Click here for more info';

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
            {CTA_TEXT}
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}
