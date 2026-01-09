"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

export default function MobileAppPoster() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const leftPhoneInitial = shouldReduceMotion ? false : { x: -120, opacity: 0 };
  const rightPhoneInitial = shouldReduceMotion ? false : { y: 120, opacity: 0 };
  const textInitial = shouldReduceMotion ? false : { y: 20, opacity: 0 };

  return (
    <section className="mt-16 sm:mt-20">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-50 to-blue-100 px-6 py-20 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/5 dark:from-[#0b1220] dark:to-[#0e1a35] sm:px-10 sm:py-24"
      >
        <motion.div
          initial={textInitial}
          animate={{ y: 0, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  delay: 0.2,
                  duration: 0.6,
                  ease: 'easeOut',
                }
          }
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

        <div className="mt-12 flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={leftPhoneInitial}
            animate={{ x: 0, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.6,
                    ease: 'easeOut',
                  }
            }
            className="order-3 md:order-1"
          >
            <Image
              src="/images/brands/step4-removebg-preview.png"
              alt="Add James Square to your home screen"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-40 sm:w-48 md:w-[240px]"
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={() => router.push('/how-to-app')}
            animate={shouldReduceMotion ? {} : { scale: [1, 1.06, 1] }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="group relative order-2 cursor-pointer rounded-full p-1 transition hover:shadow-[0_18px_45px_rgba(59,130,246,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 md:order-2"
            aria-label="Open how to install the James Square app"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-blue-400/30 blur-2xl transition-opacity duration-300 group-hover:opacity-80 dark:bg-blue-500/40" />
            <Image
              src="/images/icons/JS-app-icon-1024.png"
              alt="James Square app icon"
              width={160}
              height={160}
              sizes="(min-width: 1024px) 160px, 140px"
              className="relative h-auto w-28 sm:w-32 md:w-40"
            />
          </motion.button>

          <motion.div
            initial={rightPhoneInitial}
            animate={{ y: 0, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    delay: 0.2,
                    duration: 0.6,
                    ease: 'easeOut',
                  }
            }
            className="order-4 md:order-3"
          >
            <Image
              src="/images/brands/step5-removebg-preview.png"
              alt="James Square app on mobile"
              width={260}
              height={520}
              sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 180px"
              className="h-auto w-40 sm:w-48 md:w-[240px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
