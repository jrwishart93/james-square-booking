'use client';

import { motion, useReducedMotion } from 'framer-motion';

export type FocusHighlightProps = {
  x: string;
  y: string;
  size: number;
  className?: string;
};

const easeOutCubic: [number, number, number, number] = [0.33, 1, 0.68, 1];

const FocusHighlight = ({ x, y, size, className }: FocusHighlightProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className={
          className ??
          'pointer-events-none absolute rounded-full border border-white/70 bg-white/15 shadow-[0_0_24px_rgba(59,130,246,0.45)]'
        }
        style={{ left: x, top: y, width: size, height: size, transform: 'translate(-50%, -50%)' }}
      />
    );
  }

  return (
    <motion.div
      initial={{ x: '-40%', opacity: 0, scale: 0.92 }}
      animate={{ x: ['-40%', '6%', '0%'], opacity: [0, 1, 1], scale: [0.92, 1.05, 1] }}
      transition={{ duration: 0.9, ease: easeOutCubic }}
      className="pointer-events-none absolute"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: easeOutCubic }}
        className={
          className ??
          'relative flex items-center justify-center rounded-full border border-white/70 bg-white/20 shadow-[0_0_30px_rgba(59,130,246,0.45)]'
        }
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-2 rounded-full bg-white/25 backdrop-blur" />
        <div className="absolute -inset-3 rounded-full bg-blue-400/20 blur-xl" />
      </motion.div>
    </motion.div>
  );
};

export default FocusHighlight;
