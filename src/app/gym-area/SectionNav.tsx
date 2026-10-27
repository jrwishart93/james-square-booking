'use client';

import { useEffect, useState } from 'react';

// Compact sticky navigation between the parts of /gym-area. It only reads the
// scroll position to highlight the current part; nothing is recorded.

const parts = [
  { id: 'overview', label: 'Overview' },
  { id: 'plan', label: 'The Plan' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'get-involved', label: 'Get Involved' },
];

export default function SectionNav() {
  const [active, setActive] = useState(parts[0].id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Gym proposal sections"
      className="sticky top-[calc(var(--safe-top,0px)+var(--nav-height,4rem)+0.5rem)] z-30 mx-auto mt-6 w-fit max-w-full print:hidden"
    >
      <ol className="flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-white/85 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
        {parts.map(({ id, label }) => {
          const current = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? 'location' : undefined}
                className={`flex min-h-10 items-center whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] min-[400px]:px-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:px-4 sm:text-sm dark:focus-visible:outline-white ${
                  current
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white'
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
