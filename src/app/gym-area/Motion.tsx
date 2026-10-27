'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// Scroll motion for /gym-area. With reduced motion everything renders in its
// finished state, and the same element is always rendered so hydration matches.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  // A negative delay means reduced motion: show immediately.
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition:
      delay < 0 ? { duration: 0 } : { duration: 0.6, delay: delay * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/** Fades its children up as they enter the viewport. Use `delay` to stagger siblings. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li';
}) {
  const reduce = useReducedMotion();
  const MotionTag = as === 'li' ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      custom={reduce ? -1 : delay}
      initial="hidden"
      animate={reduce ? 'visible' : undefined}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </MotionTag>
  );
}

/** Moves its children vertically by up to `distance`px as it scrolls through the viewport. */
export function Drift({
  children,
  distance = 40,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}

/** A vertical line that draws itself as its container scrolls through. Place inside a `relative` parent. */
export function ScrollLine({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <span ref={ref} aria-hidden="true" className={`absolute w-[2px] rounded-full bg-slate-200 dark:bg-white/10 ${className}`}>
      <motion.span
        className="absolute inset-0 origin-top rounded-full bg-emerald-500 dark:bg-emerald-400"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
    </span>
  );
}

/** Horizontal progress bar that fills when scrolled into view. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
    >
      <motion.div
        className="h-full origin-left rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
        style={{ width: `${value}%` }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
