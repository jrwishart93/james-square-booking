'use client';

import type { ReactNode } from 'react';

import type { ConsentCategory } from '@/lib/consent/types';

import { useConsent } from './ConsentProvider';
import { getCategoryInfo } from '@/lib/consent/categories';

/**
 * Wraps anything that must not load before consent — a Google Map, a Vimeo or
 * social embed, a future AI assistant. Until consent exists the children are
 * never rendered, so no third-party request is made at all.
 *
 *   <ConsentGate category="functional" label="Google Maps">
 *     <iframe src="https://www.google.com/maps/embed?..." />
 *   </ConsentGate>
 */
export default function ConsentGate({
  category,
  children,
  label,
  fallback,
  className,
}: {
  category: ConsentCategory;
  children: ReactNode;
  /** Name of the embedded service, shown in the placeholder. */
  label: string;
  /** Custom placeholder. Defaults to a glass panel offering to enable it. */
  fallback?: ReactNode;
  className?: string;
}) {
  const { hasConsent, openPreferences } = useConsent();

  if (hasConsent(category)) {
    return <>{children}</>;
  }

  if (fallback !== undefined) return <>{fallback}</>;

  const info = getCategoryInfo(category);

  return (
    <div
      className={`consent-surface flex flex-col items-center justify-center gap-3 p-6 text-center ${className ?? ''}`}
    >
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{label} is switched off</p>
      <p className="max-w-sm text-xs leading-relaxed text-[color:var(--text-secondary)]">
        This content is provided by {label} and is only loaded once you allow{' '}
        {info.label.toLowerCase()} cookies. Nothing is requested from them until you do.
      </p>
      <button className="consent-btn consent-btn--secondary" onClick={openPreferences} type="button">
        Cookie Preferences
      </button>
    </div>
  );
}
