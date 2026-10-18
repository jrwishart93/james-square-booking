'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, MapPin, Phone, Search } from 'lucide-react';
import { DIRECTORY, DIRECTORY_CATEGORIES, type DirectoryCategory } from '../_data/directory';
import { glass } from './ui';

type Filter = DirectoryCategory | 'all';

export default function Directory() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const places = useMemo(() => {
    const term = search.trim().toLowerCase();
    return DIRECTORY.filter(
      (p) =>
        (filter === 'all' || p.category === filter) &&
        (!term || `${p.name} ${p.desc} ${p.address ?? ''}`.toLowerCase().includes(term))
    );
  }, [filter, search]);

  const categoryLabel = (id: DirectoryCategory) => DIRECTORY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
  const chips: { id: Filter; label: string }[] = [{ id: 'all', label: 'All' }, ...DIRECTORY_CATEGORIES];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter places">
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50 dark:focus-visible:ring-white/60 ${
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                    : 'border-black/10 bg-white/60 text-[color:var(--text-muted)] hover:border-black/25 dark:border-white/15 dark:bg-white/5'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-64">
          <span className="sr-only">Search places</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-black/10 bg-white/70 py-2 pl-9 pr-3 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20 dark:border-white/15 dark:bg-white/10 dark:focus:border-white"
          />
        </label>
      </div>

      <p className="text-sm text-[color:var(--text-muted)]" aria-live="polite">
        {places.length} {places.length === 1 ? 'place' : 'places'}
      </p>

      {filter === 'gp' && (
        <p className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-sm">
          Practices have catchment areas and some lists are closed. Search for GPs near your postcode and contact the
          practice that suits you, or has space, to register.
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <li key={`${p.category}-${p.name}`} className={`${glass} flex flex-col overflow-hidden`}>
            {p.img && (
              <div className="relative h-40 w-full bg-black/5 dark:bg-white/5">
                <Image
                  src={p.img}
                  alt={`${p.name} shopfront`}
                  fill
                  sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                {categoryLabel(p.category)}
              </p>
              <h3 className="mt-1 font-semibold">{p.name}</h3>
              <p className="mt-1 flex-1 text-sm text-[color:var(--text-muted)]">{p.desc}</p>
              {p.address && <p className="mt-2 text-xs text-[color:var(--text-muted)]">{p.address}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a
                  href={p.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 font-medium hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden /> Map
                </a>
                {p.phone && (
                  <a
                    href={`tel:${p.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 font-medium hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden /> Call
                  </a>
                )}
                {p.site && (
                  <a
                    href={p.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 font-medium hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Website
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
