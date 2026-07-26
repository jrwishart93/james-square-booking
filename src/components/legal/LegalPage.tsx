import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared shell for the privacy and legal documents, so all five read as one set
 * and inherit the site's glass surfaces rather than looking like pasted text.
 */

export const LEGAL_CONTACT_EMAIL = 'privacy@james-square.com';

const OTHER_DOCUMENTS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/acceptable-use', label: 'Acceptable Use' },
  { href: '/data-retention', label: 'Data Retention' },
];

export function LegalPage({
  title,
  summary,
  lastUpdated,
  currentPath,
  children,
}: {
  title: string;
  /** One-paragraph plain-English précis, shown above the document proper. */
  summary: string;
  lastUpdated: string;
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)] sm:text-4xl">
          {title}
        </h1>
        <p className="text-sm text-[color:var(--text-secondary)]">Last updated: {lastUpdated}</p>
        <div
          className="rounded-2xl border p-4 text-sm leading-relaxed text-[color:var(--text-secondary)]"
          style={{
            borderColor: 'hsl(var(--glass-border))',
            background: 'color-mix(in srgb, var(--glass-bg-light) 60%, transparent)',
          }}
        >
          <p className="font-medium text-[color:var(--text-primary)]">In short</p>
          <p className="mt-1">{summary}</p>
        </div>
      </header>

      <div className="space-y-8 text-base leading-relaxed text-[color:var(--text-secondary)]">
        {children}
      </div>

      <nav
        aria-label="Other privacy and legal documents"
        className="space-y-3 border-t pt-6"
        style={{ borderColor: 'hsl(var(--glass-border))' }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-secondary)]">
          Related documents
        </h2>
        <ul className="flex flex-wrap gap-2">
          {OTHER_DOCUMENTS.filter((document) => document.href !== currentPath).map((document) => (
            <li key={document.href}>
              <Link
                className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                href={document.href}
                style={{
                  borderColor: 'hsl(var(--glass-border))',
                  background: 'color-mix(in srgb, var(--glass-bg-light) 50%, transparent)',
                }}
              >
                {document.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

/** A titled section. Headings carry ids so they can be linked to directly. */
export function LegalSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  const slug = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <section aria-labelledby={slug} className="space-y-3">
      <h2
        className="text-xl font-semibold text-[color:var(--text-primary)] scroll-mt-24"
        id={slug}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Bulleted list with the spacing used across the site's prose. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Data table used by the Cookie and Retention policies. Scrolls inside its own
 * container so a narrow phone never scrolls the whole page sideways.
 */
export function LegalTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div
      className="overflow-x-auto rounded-2xl border"
      style={{ borderColor: 'hsl(var(--glass-border))' }}
    >
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr style={{ background: 'color-mix(in srgb, var(--glass-bg-light) 70%, transparent)' }}>
            {headers.map((header) => (
              <th
                className="border-b px-4 py-3 font-semibold text-[color:var(--text-primary)]"
                key={header}
                scope="col"
                style={{ borderColor: 'hsl(var(--glass-border))' }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className="border-b px-4 py-3 align-top text-[color:var(--text-secondary)]"
                  key={cellIndex}
                  style={{ borderColor: 'hsl(var(--glass-border))' }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
