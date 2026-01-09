'use client';

import Image from 'next/image';
import FocusHighlight from '@/components/FocusHighlight';

interface GuidedScreenshotProps {
  src: string;
  alt: string;
  highlight?: {
    x: number;
    y: number;
    size?: number;
    label?: string;
  };
  isActive?: boolean;
}

export default function GuidedScreenshot({ src, alt, highlight, isActive = false }: GuidedScreenshotProps) {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={640}
        className="h-auto w-full drop-shadow-[0_20px_40px_rgba(15,23,42,0.35)]"
      />
      {isActive && highlight ? (
        <FocusHighlight
          percentX={highlight.x}
          percentY={highlight.y}
          size={highlight.size}
          label={highlight.label}
          isActive={isActive}
        />
      ) : null}
    </div>
  );
}
