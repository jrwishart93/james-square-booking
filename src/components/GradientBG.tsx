'use client';

import { ReactNode } from 'react';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type GradientBGProps = {
  children: ReactNode;
  className?: string;
};

const GradientBG = ({ children, className }: GradientBGProps) => {
  return (
    <div className={cx('relative w-full', className)}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(246,247,248,0.95),rgba(255,255,255,0.9)_55%,rgba(236,240,243,0.92)),radial-gradient(ellipse_at_bottom,_rgba(228,232,237,0.65),transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.28),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.24),transparent_40%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.35),transparent_70%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_60%)] mix-blend-soft-light opacity-60 dark:opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 opacity-40 dark:from-black/60 dark:via-black/40 dark:to-black/70" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
};

export default GradientBG;
