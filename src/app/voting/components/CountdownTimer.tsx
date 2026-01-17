import React, { useEffect, useMemo, useState } from 'react';

interface CountdownTimerProps {
  expiresAt: Date;
  createdAt?: Date;
  label?: string;
  helperText?: string | null;
}

const RADIUS = 34;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CountdownTimer({ expiresAt, createdAt, label, helperText }: CountdownTimerProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (expiresAt.getTime() <= now.getTime()) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt, now]);

  const { remainingMs, percent, isExpired } = useMemo(() => {
    const base = createdAt ?? new Date();
    const total = Math.max(expiresAt.getTime() - base.getTime(), 0);
    const remaining = Math.max(expiresAt.getTime() - now.getTime(), 0);
    const pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
    return { remainingMs: remaining, percent: pct, isExpired: remaining <= 0 };
  }, [createdAt, expiresAt, now]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const timeLabel = isExpired ? 'Closed' : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} remaining`;
  const resolvedHelperText = helperText === undefined ? 'Voting closes automatically' : helperText;

  const strokeDashoffset = CIRCUMFERENCE * (1 - percent);

  let strokeColor = '#22d3ee'; // cyan
  if (isExpired) {
    strokeColor = '#cbd5e1'; // slate-300
  } else if (remainingMs <= 60_000) {
    strokeColor = '#f59e0b'; // amber-500
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {label ? (
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</div>
      ) : null}
      <svg
        width={80}
        height={80}
        viewBox="0 0 80 80"
        className="drop-shadow-sm"
        aria-label={isExpired ? 'Voting closed' : `${label ?? 'Voting closes in'} ${minutes} minutes and ${seconds} seconds`}
      >
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={STROKE}
        />
        <circle
          cx="40"
          cy="40"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: prefersReducedMotion ? undefined : 'stroke-dashoffset 0.6s ease, stroke 0.3s ease',
          }}
          transform="rotate(-90 40 40)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-800 dark:fill-white"
        >
          {isExpired ? 'Closed' : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </text>
      </svg>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
        <div>{timeLabel}</div>
        {resolvedHelperText ? <div className="text-[10px]">{resolvedHelperText}</div> : null}
      </div>
    </div>
  );
}
