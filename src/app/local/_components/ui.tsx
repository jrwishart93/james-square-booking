import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/55 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]';

export const pillButton =
  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900/60 dark:focus-visible:ring-white/70 dark:focus-visible:ring-offset-neutral-900';

export const primaryButton = `${pillButton} bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200`;

export const secondaryButton = `${pillButton} border border-black/10 bg-white/70 text-neutral-900 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15`;

export function Section({
  id,
  eyebrow,
  title,
  intro,
  icon: Icon,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-40">
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
              {eyebrow}
            </p>
          )}
          <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {intro && <p className="mt-2 max-w-3xl text-[color:var(--text-muted)]">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`${glass} p-5 ${className}`}>{children}</div>;
}

/** A short, scannable rule or fact with an icon. */
export function Fact({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--text-muted)]" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5 text-sm text-[color:var(--text-muted)]">{children}</div>
      </div>
    </div>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning';
  title: string;
  children: ReactNode;
}) {
  const tones = {
    info: 'border-sky-500/30 bg-sky-500/10 text-sky-950 dark:text-sky-100',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  };
  return (
    <div className={`rounded-xl border p-4 text-sm ${tones[tone]}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1 space-y-2 opacity-90">{children}</div>
    </div>
  );
}
