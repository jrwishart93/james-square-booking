'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface FocusHighlightProps {
  x: number;
  y: number;
  size?: number;
  label?: string;
  isActive?: boolean;
  entryFrom?: 'left' | 'right' | 'top' | 'bottom';
  entryDistance?: number;
}

export default function FocusHighlight({
  x,
  y,
  size = 44,
  label,
  isActive = false,
  entryFrom = 'left',
  entryDistance,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isActive && !shouldReduceMotion;
  const [isMobile, setIsMobile] = useState(false);
  const pulseEase: [number, number, number, number] = [0.45, 0, 0.55, 1];
  const resolvedEntryDistance = entryDistance ?? (isMobile ? 24 : 32);
  const resolvedSize = isMobile ? Math.max(36, size * 0.9) : size;
  const entryDelta =
    entryFrom === 'right'
      ? { x: resolvedEntryDistance, y: 0 }
      : entryFrom === 'top'
        ? { x: 0, y: -resolvedEntryDistance }
        : entryFrom === 'bottom'
          ? { x: 0, y: resolvedEntryDistance }
          : { x: -resolvedEntryDistance, y: 0 };
  const pulseTransition = shouldAnimate
    ? { duration: 2.1, repeat: Infinity, ease: pulseEase }
    : { duration: 0 };
  const labelTransition = shouldAnimate
    ? { duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const }
    : { duration: 0 };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(max-width: 640px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

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
            : { opacity: 0, x: entryDelta.x, y: entryDelta.y, scale: 0.9 }
        }
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={
          shouldAnimate
            ? { type: 'spring' as const, stiffness: 140, damping: 18 }
            : { duration: 0 }
        }
      >
        <div className="relative" style={{ width: resolvedSize, height: resolvedSize }}>
          {shouldAnimate ? (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/40"
              animate={{ scale: [1, 1.24], opacity: [0.55, 0] }}
              transition={pulseTransition}
            />
          ) : null}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/30 blur-lg"
            animate={shouldAnimate ? { scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] } : { opacity: 0.4 }}
            transition={pulseTransition}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-white/80 bg-white/10 shadow-[0_0_28px_rgba(255,255,255,0.45)]"
            animate={shouldAnimate ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={pulseTransition}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95"
            animate={shouldAnimate ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
            transition={pulseTransition}
          />
        </div>
      </motion.div>
      {label ? (
        <motion.div
          className="absolute mt-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 shadow-[0_0_24px_rgba(255,255,255,0.25)] backdrop-blur-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={labelTransition}
        >
          {label}
        </motion.div>
      ) : null}
    </div>
  );
}
