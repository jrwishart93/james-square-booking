"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export default function MobileAppPoster() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isIconVisible, setIsIconVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const iconOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [0, 1, 1, 0]);
  const iconY = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [40, 0, 0, 40]);
  const iconScale = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [0.9, 1, 1, 0.9]);
  const glowOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.65, 0.75], [0, 0.9, 0.9, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.26, 0.4, 0.65, 0.8], [0, 1, 1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsIconVisible(latest > 0.32 && latest < 0.68);
  });

  const leftPhoneInitial = shouldReduceMotion ? { opacity: 0 } : { x: -120, rotate: -8, opacity: 0 };
  const rightPhoneInitial = shouldReduceMotion ? { opacity: 0 } : { y: 140, rotate: 8, opacity: 0 };
  const textInitial = shouldReduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 };
  const iconInitial = shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 };

  return (
    <section ref={sectionRef} className="mt-16 sm:mt-20">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-50 to-blue-100 px-6 py-20 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/5 dark:from-[#0b1220] dark:to-[#0e1a35] sm:px-10 sm:py-24"
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

        <div className="relative mt-12 flex flex-col items-center gap-10 md:mt-16 md:h-[520px]">
          <motion.div
            initial={leftPhoneInitial}
            whileInView={{ x: 0, rotate: shouldReduceMotion ? 0 : -6, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.25 }
                : {
                    duration: 0.6,
                    ease: 'easeOut',
                  }
            }
            viewport={{ once: true, amount: 0.25 }}
            className="order-3 md:absolute md:bottom-0 md:left-2 md:z-10 md:translate-x-6"
          >
            <Image
              src="/images/brands/step4-removebg-preview.png"
              alt="Add James Square to your home screen"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-40 sm:w-48 md:w-[250px]"
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={() => router.push('/how-to-app')}
            initial={iconInitial}
            style={{
              opacity: iconOpacity,
              y: shouldReduceMotion ? 0 : iconY,
              scale: shouldReduceMotion ? 1 : iconScale,
            }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            className="group relative order-2 cursor-pointer rounded-3xl p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 md:absolute md:bottom-4 md:left-1/2 md:z-30 md:-translate-x-1/2"
            aria-label="Open how to install the James Square app"
          >
            <motion.span
              className="pointer-events-none absolute -inset-3 rounded-[28%] bg-blue-300/30 blur-2xl dark:bg-blue-500/40"
              style={{ opacity: shouldReduceMotion ? 0.45 : glowOpacity }}
            />
            <motion.div
              animate={isIconVisible && !shouldReduceMotion ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={
                isIconVisible && !shouldReduceMotion
                  ? {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : { duration: 0 }
              }
              className="relative rounded-[22%] bg-white/90 p-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_40px_rgba(59,130,246,0.25)] ring-1 ring-white/70 dark:bg-slate-900/80 dark:ring-white/10"
            >
              <div className="absolute inset-0 rounded-[22%] shadow-[inset_0_1px_8px_rgba(15,23,42,0.2)]" />
              <Image
                src="/images/icons/JS-app-icon-1024.png"
                alt="James Square app icon"
                width={140}
                height={140}
                sizes="(min-width: 1024px) 140px, (min-width: 768px) 120px, 110px"
                className="relative h-auto w-24 sm:w-28 md:w-32"
              />
            </motion.div>
            <motion.span
              className="mt-3 block text-xs font-medium text-blue-600 transition group-hover:underline dark:text-blue-300"
              style={{ opacity: ctaOpacity }}
            >
              Click here for more info
            </motion.span>
          </motion.button>

          <motion.div
            initial={rightPhoneInitial}
            whileInView={{ y: 0, rotate: shouldReduceMotion ? 0 : 6, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.25 }
                : {
                    delay: 0.15,
                    duration: 0.6,
                    ease: 'easeOut',
                  }
            }
            viewport={{ once: true, amount: 0.45 }}
            className="order-4 md:absolute md:bottom-0 md:right-2 md:z-20 md:-translate-x-6"
          >
            <Image
              src="/images/brands/step5-removebg-preview.png"
              alt="James Square app on mobile"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-40 sm:w-48 md:w-[250px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
