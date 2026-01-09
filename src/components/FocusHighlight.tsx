'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  x: number;
  y: number;
  size?: number;
  label?: string;
  isActive?: boolean;
  enterFrom?: 'left' | 'right';
  labelOffset?: { x?: number; y?: number };
}

export default function FocusHighlight({
  x,
  y,
  size = 44,
  label,
  isActive = false,
  enterFrom = 'left',
  labelOffset,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isActive && !shouldReduceMotion;
  const entryOffset = enterFrom === 'right' ? 40 : -40;
  const pulseEase: [number, number, number, number] = [0.45, 0, 0.55, 1];
  const pulseTransition = shouldAnimate
    ? { duration: 2.1, repeat: Infinity, ease: pulseEase }
    : { duration: 0 };

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={
          shouldReduceMotion
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: entryOffset, scale: 0.9 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={
          shouldAnimate
            ? { type: 'spring', stiffness: 140, damping: 18 }
            : { duration: 0 }
        }
      >
        <div
          className="relative rounded-full border border-white/80 bg-white/10 shadow-[0_0_28px_rgba(255,255,255,0.45)]"
          style={{ width: size, height: size }}
        >
          {shouldAnimate ? (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/40"
              animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
              transition={pulseTransition}
            />
          ) : null}
          <motion.div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90"
            animate={shouldAnimate ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
            transition={pulseTransition}
          />
        </div>
      </motion.div>
      {label ? (
        <div
          className="absolute mt-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 shadow-[0_0_24px_rgba(255,255,255,0.25)] backdrop-blur-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
          style={{
            left: `calc(50% + ${labelOffset?.x ?? 0}px)`,
            top: `calc(50% + ${labelOffset?.y ?? 36}px)`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
