'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface FocusHighlightProps {
  xPct: number;
  yPct: number;
  size?: number;
  label?: string;
  isActive?: boolean;
  enterFrom?: 'left' | 'right';
  delay?: number;
}

export default function FocusHighlight({
  xPct,
  yPct,
  size = 44,
  label,
  isActive = false,
  enterFrom = 'left',
  delay = 0,
}: FocusHighlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isActive && !shouldReduceMotion;
  const glowOpacity = shouldAnimate ? [0.35, 0.6, 0.35] : 0.4;
  const entryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const pulseEase: [number, number, number, number] = [0.45, 0, 0.25, 1];
  const entryOffset = 28;
  const entryDelta = enterFrom === 'right' ? entryOffset : -entryOffset;
  const entryTransition = shouldAnimate
    ? { type: 'spring', stiffness: 260, damping: 22, delay, ease: entryEase }
    : { duration: 0 };
  const pulseTransition = shouldAnimate
    ? { duration: 1.9, ease: pulseEase, repeat: Infinity, delay: 0.4 }
    : { duration: 0 };

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-[inherit] bg-black/20"
        style={{
          maskImage: `radial-gradient(circle ${size / 2}px at ${xPct}% ${yPct}%, transparent 55%, black 60%)`,
          WebkitMaskImage: `radial-gradient(circle ${size / 2}px at ${xPct}% ${yPct}%, transparent 55%, black 60%)`,
        }}
      />
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ top: `${yPct}%`, left: `${xPct}%`, transform: 'translate(-50%, -50%)' }}
        initial={shouldReduceMotion ? 'idle' : 'enter'}
        animate={isActive ? 'active' : 'idle'}
        variants={{
          enter: { opacity: 0, scale: 0.92, x: entryDelta },
          active: { opacity: 1, scale: 1, x: 0 },
          idle: { opacity: 0, scale: 0.92, x: entryDelta },
        }}
        transition={entryTransition}
      >
        <motion.div
          className="absolute rounded-full bg-white/35 blur-xl"
          style={{ width: size * 1.4, height: size * 1.4 }}
          animate={shouldAnimate ? { opacity: glowOpacity } : { opacity: glowOpacity }}
          transition={pulseTransition}
        />
        <motion.div
          className="relative rounded-full border-2 border-white/85 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.35)]"
          style={{ width: size, height: size }}
          animate={shouldAnimate ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={pulseTransition}
        >
          <motion.span
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            animate={
              shouldAnimate
                ? { scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }
                : { scale: 1, opacity: 0.7 }
            }
            transition={pulseTransition}
          />
        </motion.div>
      </motion.div>
      {label ? (
        <div
          className="absolute mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 drop-shadow-sm"
          style={{ top: `${yPct}%`, left: `${xPct}%`, transform: 'translate(-50%, calc(-50% + 2.4rem))' }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}
