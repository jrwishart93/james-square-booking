"use client";

import type { CSSProperties } from "react";
import type { HighlightSpec } from "./HowToCarousel";

export default function HighlightOverlay({ spec }: { spec: HighlightSpec }) {
  const x = clamp(spec.xPct, 0, 100);
  const y = clamp(spec.yPct, 0, 100);
  const r = clamp(spec.rPct, 2, 40);

  const style: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${r * 2}%`,
    height: `${r * 2}%`,
    transform: "translate(-50%, -50%)",
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute rounded-full" style={style}>
        <div className="absolute inset-0 rounded-full ring-base" />
        <div className="absolute inset-0 rounded-full ring-pulse" />
      </div>

      <style jsx>{`
        .ring-base {
          border: 2px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.22),
            0 0 18px rgba(80, 200, 255, 0.55),
            0 0 42px rgba(80, 200, 255, 0.28);
        }

        .ring-pulse {
          border: 2px solid rgba(120, 220, 255, 0.55);
          box-shadow:
            0 0 14px rgba(120, 220, 255, 0.45),
            0 0 34px rgba(120, 220, 255, 0.22);
          animation: pulseGlow 1.8s ease-in-out infinite;
          opacity: 0.65;
        }

        @keyframes pulseGlow {
          0% {
            transform: scale(0.98);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.85;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
