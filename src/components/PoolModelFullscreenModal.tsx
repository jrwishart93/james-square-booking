'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import PoolModelViewer from '@/components/PoolModelViewer';

type PoolModelFullscreenModalProps = {
  ariaLabel: string;
  autoSpin?: boolean;
  autoSpinSpeed?: number;
  loadingLabel: string;
  modelName: string;
  modelSrc: string;
  onClose: () => void;
  title: string;
};

export default function PoolModelFullscreenModal({
  ariaLabel,
  autoSpin,
  autoSpinSpeed,
  loadingLabel,
  modelName,
  modelSrc,
  onClose,
  title,
}: PoolModelFullscreenModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — full screen view`}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4">
        <h2 className="truncate text-sm font-bold uppercase tracking-[0.18em] text-cyan-100 sm:text-base">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <PoolModelViewer
          modelSrc={modelSrc}
          modelName={modelName}
          loadingLabel={loadingLabel}
          ariaLabel={ariaLabel}
          autoSpin={autoSpin}
          autoSpinSpeed={autoSpinSpeed}
          size="fullscreen"
        />
      </div>
    </div>,
    document.body,
  );
}
