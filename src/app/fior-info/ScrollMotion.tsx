"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

// Scroll-linked motion for /fior-info. Purely decorative: every element here is
// aria-hidden, and with reduced motion each one renders in its finished state.

/** Thin reading-progress bar along the top of the viewport. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-400 print:hidden"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}

/**
 * A vertical line that draws itself as its container scrolls through the
 * viewport. Place inside a `relative` parent; positioning comes from className.
 */
export function ScrollLine({ className = "", trackClassName = "", fillClassName = "" }: {
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <span ref={ref} aria-hidden="true" className={`absolute w-px ${className}`}>
      <span className={`absolute inset-0 ${trackClassName}`} />
      <motion.span
        className={`absolute inset-y-0 -left-[0.5px] w-[2px] origin-top rounded-full ${fillClassName}`}
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
    </span>
  );
}

/** Drifts its children vertically at a fraction of the scroll speed (hero glow). */
export function Parallax({ children, distance = 120, className = "" }: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, distance]);
  return (
    <motion.div aria-hidden="true" className={`pointer-events-none ${className}`} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}
