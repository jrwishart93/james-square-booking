'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

type Item = { id: string; title: string; detail: React.ReactNode; audience?: 'Owners' };

const ITEMS: Item[] = [
  {
    id: 'fobs',
    title: 'Collect your keys, door fob and parking gate fob',
    detail:
      'Ask your landlord, letting agent or the previous owner first. Each property has one gate fob for the car park.',
  },
  {
    id: 'parking',
    title: 'Find your numbered parking space',
    detail: 'Each property has one allocated, numbered space. There is no visitor parking inside James Square.',
  },
  {
    id: 'pool',
    title: 'Get the pool, gym and sauna access code',
    detail: (
      <>
        You need a fob and the code. See <a href="#facilities" className="underline">Pool, gym &amp; sauna</a>.
      </>
    ),
  },
  {
    id: 'whatsapp',
    title: 'Join the community WhatsApp group',
    detail: 'The quickest way to raise an urgent problem or get advice from neighbours, especially out of hours.',
  },
  {
    id: 'factor',
    title: 'Register with the factor, Myreside Management',
    detail: 'Owners: give Myreside your contact details so you receive notices, invoices and AGM papers.',
    audience: 'Owners',
  },
  {
    id: 'deliveries',
    title: 'Add delivery instructions to your shopping accounts',
    detail: (
      <>
        Parcels left in the foyer have gone missing. See <a href="#parcels" className="underline">Parcels</a> for a
        note you can copy.
      </>
    ),
  },
  {
    id: 'bins',
    title: 'Find the bin store and recycling bins',
    detail: (
      <>
        Landfill bins are in the rear car park; recycling is at the front. See{' '}
        <a href="#bins" className="underline">Bins &amp; recycling</a>.
      </>
    ),
  },
  {
    id: 'gp',
    title: 'Register with a GP',
    detail: (
      <>
        Several practices are nearby. See <a href="#around" className="underline">Around Dalry</a>.
      </>
    ),
  },
];

const STORAGE_KEY = 'living-here-checklist';

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Ticks are a per-device convenience kept in this browser only. */
export default function MoveInChecklist() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => setDone(readSaved()), []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable (private browsing); the ticks just won't persist.
      }
      return next;
    });
  };

  const count = ITEMS.filter((item) => done.includes(item.id)).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[color:var(--text-muted)]">
          {count} of {ITEMS.length} done
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/10 dark:bg-white/15" aria-hidden>
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(count / ITEMS.length) * 100}%` }}
          />
        </div>
      </div>
      <ul className="grid gap-2 md:grid-cols-2">
        {ITEMS.map((item) => {
          const checked = done.includes(item.id);
          return (
            <li key={item.id}>
              <div
                className={`flex h-full gap-3 rounded-xl border p-3.5 transition ${
                  checked
                    ? 'border-emerald-500/30 bg-emerald-500/[0.07]'
                    : 'border-black/[0.06] bg-white/60 dark:border-white/10 dark:bg-white/[0.04]'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-labelledby={`check-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                    checked
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-black/25 bg-white dark:border-white/30 dark:bg-transparent'
                  }`}
                >
                  {checked && <Check className="h-4 w-4" aria-hidden />}
                </button>
                <div>
                  <p id={`check-${item.id}`} className={`font-medium ${checked ? 'line-through opacity-60' : ''}`}>
                    {item.title}
                    {item.audience && (
                      <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-[color:var(--text-muted)] no-underline dark:bg-white/10">
                        {item.audience}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">{item.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
