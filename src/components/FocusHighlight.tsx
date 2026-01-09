'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  percentX: number;
  percentY: number;
  size?: number;
  label?: string;
  isActive?: boolean;
}

export default function FocusHighlight({
  percentX,
  percentY,
  size = 44,
  label,
  isActive = false,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isActive && !shouldReduceMotion;
  const entryOffset = percentX > 50 ? 40 : -40;
  const pulseEase: [number, number, number, number] = [0.45, 0, 0.55, 1];
  const pulseTransition = shouldAnimate
    ? { duration: 2.1, repeat: Infinity, ease: pulseEase }
    : { duration: 0 };

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${percentX}%`,
        top: `${percentY}%`,
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
        </div>
      </motion.div>
      {label ? (
        <div
          className="absolute mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 drop-shadow-sm"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% + 2.4rem))' }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
