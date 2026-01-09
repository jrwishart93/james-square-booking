'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  top: string;
  left: string;
  size?: number;
  label?: string;
  isActive?: boolean;
}

export default function FocusHighlight({
  top,
  left,
  size = 44,
  label,
  isActive = false,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const showPulse = isActive && !shouldReduceMotion;

  return (
    <div
      className="pointer-events-none absolute"
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      aria-hidden="true"
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={
          showPulse
            ? {
                scale: [1, 1.05, 1],
              }
            : { scale: 1 }
        }
        transition={
          showPulse
            ? { duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.25, 1] }
            : { duration: 0 }
        }
      >
        <div
          className="rounded-full border-2 border-white/80 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.35)]"
          style={{ width: size, height: size }}
        />
      </motion.div>
      {label ? (
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
          {label}
        </div>
      ) : null}
    </div>
  );
}
