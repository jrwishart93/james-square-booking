'use client';

import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

export default function EdinburghParallaxScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /*
   * Desktop movement
   *
   * Background moves very little.
   * Castle moves moderately.
   * Foreground moves most.
   *
   * The transforms remain tied directly to scroll position.
   */
  const hillsY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 15]
  );

  const hillsScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1.035, 1.035] : [1.05, 1.02]
  );

  const castleY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [15, -35]
  );

  const castleScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1.02, 1.02] : [1.02, 1.035]
  );

  const foregroundY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [25, -80]
  );

  const foregroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1, 1.045]
  );

  /*
   * Very subtle atmospheric transition.
   * This helps the scene acquire depth without making
   * the individual PNG layers look animated separately.
   */
  const castleOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [0.96, 1, 1]
  );

  const foregroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [0.98, 1, 1]
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Layered Edinburgh landscape"
      className="relative h-[200svh] w-full"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#dfc7a0]">
        {/* ------------------------------------------------
            BACKGROUND: PENTLAND HILLS
        ------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[1] will-change-transform"
          style={{
            y: hillsY,
            scale: hillsScale,
          }}
        >
          <Image
            src="/images/area/background-pentland-hills.PNG"
            alt=""
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-[52%_50%]
              saturate-[0.92]
              contrast-[0.94]
              brightness-[1.02]
              md:object-center
            "
          />

          {/* Gentle atmospheric wash */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-b
              from-[#f8dbaa]/10
              via-[#eebd78]/5
              to-[#83725e]/10
            "
          />
        </motion.div>

        {/* ------------------------------------------------
            DISTANT EDINBURGH / CASTLE
        ------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          className="
            absolute
            z-[3]
            left-1/2
            bottom-[15%]
            h-[47svh]
            w-[128vw]
            -translate-x-1/2
            will-change-transform

            sm:bottom-[13%]
            sm:h-[50svh]
            sm:w-[116vw]

            md:bottom-[10%]
            md:h-[54svh]
            md:w-[108vw]

            lg:bottom-[8%]
            lg:h-[56svh]
            lg:w-[104vw]

            xl:h-[58svh]
            xl:w-[100vw]
          "
          style={{
            y: castleY,
            scale: castleScale,
            opacity: castleOpacity,
          }}
        >
          <Image
            src="/images/area/midground-edinburgh-castle.PNG"
            alt=""
            fill
            sizes="120vw"
            className="
              object-contain
              object-bottom
              saturate-[0.92]
              contrast-[0.91]
              brightness-[0.98]
              sepia-[0.04]
            "
          />

          {/* Subtle golden-hour colour integration */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-[#d89e58]/[0.035]
              mix-blend-soft-light
            "
          />
        </motion.div>

        {/* ------------------------------------------------
            FOREGROUND: PRINCES STREET
        ------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          className="
            absolute
            z-[5]
            left-1/2
            bottom-[-1%]
            h-[42svh]
            w-[160vw]
            -translate-x-[44%]
            will-change-transform

            sm:h-[45svh]
            sm:w-[138vw]
            sm:-translate-x-[47%]

            md:h-[47svh]
            md:w-[119vw]
            md:-translate-x-1/2

            lg:h-[49svh]
            lg:w-[110vw]

            xl:h-[50svh]
            xl:w-[104vw]
          "
          style={{
            y: foregroundY,
            scale: foregroundScale,
            opacity: foregroundOpacity,
          }}
        >
          <Image
            src="/images/area/foreground-edinburgh-scott.PNG"
            alt=""
            fill
            sizes="140vw"
            className="
              object-contain
              object-bottom
              saturate-[0.98]
              contrast-[1.025]
              brightness-[0.99]
              sepia-[0.035]
            "
          />

          {/* Warm light matching Pentlands */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-[#e6a65d]/[0.035]
              mix-blend-soft-light
            "
          />
        </motion.div>

        {/* ------------------------------------------------
            DEPTH / COLOUR INTEGRATION
        ------------------------------------------------ */}

        {/* Slight haze behind the city */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-0 bottom-[23%] z-[2]
            h-[20svh]
            bg-gradient-to-b
            from-transparent
            via-[#e9c48e]/[0.035]
            to-[#d6b17e]/[0.07]
            blur-2xl
          "
        />

        {/* Very light overall cinematic grade */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-0 z-[10]
            bg-gradient-to-b
            from-[#fff4d7]/[0.015]
            via-transparent
            to-black/[0.07]
          "
        />

        {/* ------------------------------------------------
            OPTIONAL CONTENT LAYER

            Add text/buttons here later if wanted.
            It intentionally sits above every landscape plane.
        ------------------------------------------------ */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="mx-auto flex h-full max-w-6xl items-start px-5 pt-[12svh] sm:px-8 md:pt-[14svh]">
            {/*
              Example:

              <div className="pointer-events-auto max-w-xl text-white">
                <p>James Square</p>
                <h2>In the heart of Edinburgh</h2>
              </div>
            */}
          </div>
        </div>

        {/* Bottom transition into the existing website */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-0 bottom-0 z-[12]
            h-24
            bg-gradient-to-b
            from-transparent
            to-[color:var(--background)]
          "
        />
      </div>
    </section>
  );
}
