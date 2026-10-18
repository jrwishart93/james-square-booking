'use client';

import { useEffect, useRef, useState } from 'react';

export type NavItem = { id: string; label: string };

/**
 * Sticky, horizontally scrolling jump links. Each section has a real anchor, so
 * any of them can be shared as a link (for example /local#parking).
 */
export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  // Keep the active pill in view on narrow screens.
  useEffect(() => {
    // Scroll the list itself: scrollIntoView would also cancel a smooth page scroll in progress.
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.clientWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      // The site header hides on scroll on mobile but stays put from md up, so only offset it there.
      // Important (!) so these beat the app-mode `nav { top: 0 }` rule in globals.css.
      className="sticky z-30 -mx-4 top-[calc(var(--safe-top)+8px)]! px-4 sm:mx-0 sm:px-0 md:top-[calc(var(--safe-top)+var(--nav-height)+14px)]!"
    >
      <ul
        ref={listRef}
        className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-full border border-white/20 bg-white/75 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:bg-neutral-900/75"
      >
        {items.map(({ id, label }) => {
          const isActive = id === active;
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                data-id={id}
                aria-current={isActive ? 'location' : undefined}
                className={`block rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 dark:focus-visible:ring-white/70 ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-[color:var(--text-muted)] hover:bg-black/5 hover:text-[color:var(--text-primary)] dark:hover:bg-white/10'
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
