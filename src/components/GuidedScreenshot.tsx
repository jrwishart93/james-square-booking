'use client';

import Image from 'next/image';
import FocusHighlight from '@/components/FocusHighlight';
import { AnimatePresence } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useMemo } from 'react';

interface GuidedScreenshotProps {
  src: string;
  alt: string;
  highlight?: {
    x: number;
    y: number;
    size?: number;
    label?: string;
    enterFrom?: 'left' | 'right';
    labelOffset?: { x?: number; y?: number };
  };
  isActive?: boolean;
  stepId?: number;
}

export default function GuidedScreenshot({
  src,
  alt,
  highlight,
  isActive = false,
  stepId,
}: GuidedScreenshotProps) {
  const shouldCalibrate = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return process.env.NODE_ENV === 'development' && window.location.search.includes('calibrate=1');
  }, []);

  const handleCalibrate = (event: MouseEvent<HTMLDivElement>) => {
    if (!shouldCalibrate) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xPct = ((event.clientX - rect.left) / rect.width) * 100;
    const yPct = ((event.clientY - rect.top) / rect.height) * 100;
    // eslint-disable-next-line no-console
    console.log(`Step ${stepId ?? ''} hotspot`, { x: Number(xPct.toFixed(1)), y: Number(yPct.toFixed(1)) });
  };

  return (
    <div className="relative mx-auto w-full max-w-[320px]" onClick={handleCalibrate}>
      <Image
        src={src}
        alt={alt}
        width={320}
        height={640}
        className="h-auto w-full ring-1 ring-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      />
      <AnimatePresence mode="wait">
        {isActive && highlight ? (
          <FocusHighlight
            key={`focus-${stepId ?? 'active'}`}
            x={highlight.x}
            y={highlight.y}
            size={highlight.size}
            label={highlight.label}
            enterFrom={highlight.enterFrom}
            labelOffset={highlight.labelOffset}
            isActive={isActive}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
