'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  x: string;
  y: string;
  size?: number;
  label?: string;
  isActive?: boolean;
}

export default function FocusHighlight({
  x,
  y,
  size = 44,
  label,
  isActive = false,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const showPulse = isActive && !shouldReduceMotion;
  const glowOpacity = showPulse ? [0.35, 0.6, 0.35] : 0.4;

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
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
        animate={
          showPulse
            ? {
                opacity: 1,
                scale: [1, 1.04, 1],
              }
            : { opacity: 1, scale: 1 }
        }
        transition={
          showPulse
            ? { duration: 1.6, ease: [0.45, 0, 0.25, 1], repeat: 2 }
            : { duration: 0 }
        }
      >
        <motion.div
          className="absolute rounded-full bg-white/30 blur-lg"
          style={{ width: size * 1.4, height: size * 1.4 }}
          animate={showPulse ? { opacity: glowOpacity } : { opacity: glowOpacity }}
          transition={showPulse ? { duration: 1.6, ease: [0.45, 0, 0.25, 1], repeat: 2 } : { duration: 0 }}
        />
        <div
          className="relative rounded-full border-2 border-white/85 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          style={{ width: size, height: size }}
        >
          <motion.span
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            animate={showPulse ? { scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] } : { scale: 1, opacity: 0.7 }}
            transition={showPulse ? { duration: 1.6, ease: [0.45, 0, 0.25, 1], repeat: 2 } : { duration: 0 }}
          />
        </div>
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
