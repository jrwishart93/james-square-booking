"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SectionItem = { id: string; label: string };

const SECTIONS: SectionItem[] = [
  { id: "factor", label: "Factor" },
  { id: "agm", label: "AGM" },
  { id: "projects", label: "Projects" },
  { id: "bins", label: "Bins & Recycling" },
  { id: "restaurants", label: "Restaurants" },
  { id: "groceries", label: "Groceries" },
  { id: "coffee", label: "Coffee" },
];

export default function SectionTabs() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const smoothTo = useCallback((id: string, updateHash = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    if (updateHash) {
      window.history.replaceState(null, "", `#${id}`);
    }
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      Boolean,
    ) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (topMost?.target?.id) {
          setActive(topMost.target.id);
        }
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    nodes.forEach((node) => observerRef.current?.observe(node));

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (!hash) return;
    const match = SECTIONS.find((section) => section.id === hash);
    if (!match) return;

    setActive(hash);
    // Wait for the browser to finish its own hash scrolling before adjusting for the sticky tabs.
    window.requestAnimationFrame(() => smoothTo(hash, false));
  }, [smoothTo]);

  return (
    <div className="sticky top-16 z-30 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <nav className="px-4 py-3">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto scroll-px-4">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => {
                  setActive(section.id);
                  smoothTo(section.id);
                }}
                className={[
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                  active === section.id
                    ? "border-white/30 bg-white/10 shadow-[0_0_24px_rgba(122,162,255,.35)]"
                    : "border-white/10 hover:border-white/20",
                ].join(" ")}
                aria-current={active === section.id ? "true" : "false"}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
