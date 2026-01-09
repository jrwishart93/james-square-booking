"use client";

import { motion } from "framer-motion";

interface FocusRingProps {
  x: number;
  y: number;
  size: number;
}

export default function FocusRing({ x, y, size }: FocusRingProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          boxShadow: "0 0 0 2px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(4px)",
        }}
      />
    </motion.div>
  );
}
