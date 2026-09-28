"use client";

import { useEffect, useState } from "react";
import { focusRing } from "./ui";

// Compact sticky navigation between the three parts of /fior-info. It only
// reads scroll position to highlight the current part; nothing is recorded.

const parts = [
  { id: "part-1", number: "1", label: "Background", short: "Background" },
  { id: "part-2", number: "2", label: "Recovering your money", short: "Recovery" },
  { id: "part-3", number: "3", label: "Police Scotland & FAQs", short: "Police & FAQs" },
];

export default function SectionNav() {
  const [active, setActive] = useState("part-1");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // A part becomes current once its top passes roughly a third of the way down the viewport.
      const line = window.innerHeight / 3;
      let current = parts[0].id;
      for (const { id } of parts) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="FIOR information sections"
      className="sticky top-[calc(var(--safe-top,0px)+var(--nav-height,4rem)+0.5rem)] z-30 mx-auto mt-2 w-fit max-w-full print:hidden"
    >
      <ol className="flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
        {parts.map(({ id, number, label, short }) => {
          const current = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? "location" : undefined}
                className={`flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition sm:px-4 sm:text-sm ${focusRing} ${
                  current
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                }`}
              >
                <span className={`hidden font-mono text-[11px] sm:inline ${current ? "opacity-70" : "text-slate-400 dark:text-slate-500"}`} aria-hidden="true">
                  {number}
                </span>
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
