"use client";

import { motion, useReducedMotion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  // A negative delay means reduced motion: show immediately.
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition:
      delay < 0 ? { duration: 0 } : { duration: 0.55, delay: delay * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  // Always render the same element so server HTML and hydration match; with
  // reduced motion the content is shown immediately instead of on scroll.
  const reduce = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      custom={reduce ? -1 : delay}
      initial="hidden"
      animate={reduce ? "visible" : undefined}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </MotionTag>
  );
}
