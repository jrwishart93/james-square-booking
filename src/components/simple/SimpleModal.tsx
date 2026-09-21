"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function SimpleModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button, textarea, a")?.focus(), 0);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>('button, textarea, a[href], [tabindex]:not([tabindex="-1"])')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", keydown); lastFocus.current?.focus(); };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="simple-modal-title" className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/30 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:rounded-3xl sm:p-7">
      <header className="mb-5 flex items-center justify-between gap-4"><h2 id="simple-modal-title" className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2><button onClick={onClose} aria-label="Close dialog" className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white"><X size={20}/></button></header>
      {children}
    </div>
  </div>;
}

