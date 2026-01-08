'use client';

import { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type GlassCardProps = {
  title?: ReactNode;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
  titleClassName?: string;
  subtitleClassName?: string;
};

export const GlassCard = ({
  title,
  subtitle,
  footer,
  children,
  className,
  as = 'section',
  titleClassName,
  subtitleClassName,
}: GlassCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent: ElementType = as === 'div' ? motion.div : motion.section;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
      className={cx(
        'relative overflow-hidden rounded-3xl border backdrop-blur-2xl',
        'bg-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-white/70',
        'dark:bg-white/5 dark:border-white/10 dark:shadow-[0_20px_45px_-25px_rgba(15,23,42,0.5)]',
        "p-6 md:p-8 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-white/50 before:content-['']",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_35%)] after:opacity-70 after:content-['']",
        className,
      )}
    >
      <div className="relative z-10 space-y-5">
        {(title || subtitle) && (
          <header className="space-y-1">
            {title && (
              <h2 className={cx('text-xl font-semibold text-slate-900 dark:text-slate-100', titleClassName)}>{title}</h2>
            )}
            {subtitle && (
              <p className={cx('text-sm text-slate-600 dark:text-slate-300', subtitleClassName)}>{subtitle}</p>
            )}
          </header>
        )}

        <div className="space-y-4 text-slate-800 dark:text-slate-100">{children}</div>

        {footer && <footer className="text-xs text-slate-500 dark:text-slate-400">{footer}</footer>}
      </div>
    </MotionComponent>
  );
};

export default GlassCard;
