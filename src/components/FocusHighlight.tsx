'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  x: string;
  y: string;
  size?: number;
  label?: string;
  isActive?: boolean;
  enterFrom?: 'left' | 'right' | 'top' | 'bottom';
}

export default function FocusHighlight({
  x,
  y,
  size = 44,
  label,
  isActive = false,
  enterFrom = 'left',
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const showPulse = isActive && !shouldReduceMotion;
  const glowOpacity = showPulse ? [0.35, 0.6, 0.35] : 0.4;
  const entryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const pulseEase: [number, number, number, number] = [0.45, 0, 0.25, 1];
  const entryOffset = 28;
  const entryDelta =
    enterFrom === 'right'
      ? { x: entryOffset, y: 0 }
      : enterFrom === 'top'
        ? { x: 0, y: -entryOffset }
        : enterFrom === 'bottom'
          ? { x: 0, y: entryOffset }
          : { x: -entryOffset, y: 0 };
  const entryTransition = showPulse
    ? { duration: 0.6, ease: entryEase }
    : { duration: 0 };
  const pulseTransition = showPulse
    ? { duration: 1.6, ease: pulseEase, repeat: 2, delay: 0.3 }
    : { duration: 0 };

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-[inherit] bg-black/20"
        style={{
          maskImage: `radial-gradient(circle ${size / 2}px at ${x} ${y}, transparent 55%, black 60%)`,
          WebkitMaskImage: `radial-gradient(circle ${size / 2}px at ${x} ${y}, transparent 55%, black 60%)`,
        }}
      />
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ top: y, left: x, transform: 'translate(-50%, -50%)' }}
        initial={
          shouldReduceMotion
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : { opacity: 0, scale: 0.94, x: entryDelta.x, y: entryDelta.y }
        }
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={entryTransition}
      >
        <motion.div
          className="absolute rounded-full bg-white/35 blur-xl"
          style={{ width: size * 1.4, height: size * 1.4 }}
          animate={showPulse ? { opacity: glowOpacity } : { opacity: glowOpacity }}
          transition={pulseTransition}
        />
        <motion.div
          className="relative rounded-full border-2 border-white/85 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          style={{ width: size, height: size }}
          animate={showPulse ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={pulseTransition}
        >
          <motion.span
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            animate={showPulse ? { scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] } : { scale: 1, opacity: 0.7 }}
            transition={pulseTransition}
          />
        </motion.div>
      </motion.div>
      {label ? (
        <div
          className="absolute mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 drop-shadow-sm"
          style={{ top: y, left: x, transform: 'translate(-50%, calc(-50% + 2.4rem))' }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
