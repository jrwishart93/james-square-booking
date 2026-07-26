/**
 * Consent model for James Square.
 *
 * The shape stored on the visitor's device is intentionally small and boring:
 * a version, a timestamp and one boolean per category. Anything richer would be
 * personal data we have no reason to keep.
 */

export const CONSENT_CATEGORIES = [
  'essential',
  'functional',
  'analytics',
  'performance',
  'marketing',
] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

/** Categories a visitor can actually change. Essential is never optional. */
export type OptionalConsentCategory = Exclude<ConsentCategory, 'essential'>;

export const OPTIONAL_CONSENT_CATEGORIES: readonly OptionalConsentCategory[] = [
  'functional',
  'analytics',
  'performance',
  'marketing',
];

export type ConsentDecisions = Record<ConsentCategory, boolean>;

/**
 * Bumping this invalidates stored consent and re-prompts everyone. Increment it
 * only when the categories or the services inside them materially change —
 * re-asking without cause is its own kind of dark pattern.
 */
export const CONSENT_VERSION = 1;

export type ConsentRecord = {
  version: number;
  /** ISO-8601 timestamp of the decision, used to show "last reviewed" and to expire consent. */
  decidedAt: string;
  /** How the decision was made, so we can evidence that it was a real choice. */
  method: 'accept-all' | 'essential-only' | 'preferences';
  decisions: ConsentDecisions;
};

/** UK ICO guidance: re-ask periodically rather than treating consent as forever. */
export const CONSENT_MAX_AGE_DAYS = 182;

export const ESSENTIAL_ONLY_DECISIONS: ConsentDecisions = {
  essential: true,
  functional: false,
  analytics: false,
  performance: false,
  marketing: false,
};

export const ACCEPT_ALL_DECISIONS: ConsentDecisions = {
  essential: true,
  functional: true,
  analytics: true,
  performance: true,
  marketing: true,
};

/**
 * What we assume before a visitor has decided anything: nothing optional runs.
 * This is the default the whole app reads from during server rendering too, so
 * there is no window in which an optional script could slip through.
 */
export const DEFAULT_DECISIONS: ConsentDecisions = ESSENTIAL_ONLY_DECISIONS;

export function isConsentCategory(value: unknown): value is ConsentCategory {
  return typeof value === 'string' && (CONSENT_CATEGORIES as readonly string[]).includes(value);
}

/** Normalises anything we read back from storage into a trustworthy record. */
export function normaliseConsentRecord(input: unknown): ConsentRecord | null {
  if (!input || typeof input !== 'object') return null;

  const candidate = input as Partial<ConsentRecord> & { decisions?: unknown };
  if (candidate.version !== CONSENT_VERSION) return null;
  if (typeof candidate.decidedAt !== 'string') return null;

  const decidedAt = new Date(candidate.decidedAt);
  if (Number.isNaN(decidedAt.getTime())) return null;

  const ageDays = (Date.now() - decidedAt.getTime()) / 86_400_000;
  if (ageDays > CONSENT_MAX_AGE_DAYS || ageDays < -1) return null;

  const rawDecisions = (candidate.decisions ?? {}) as Record<string, unknown>;
  const decisions = CONSENT_CATEGORIES.reduce((acc, category) => {
    acc[category] = category === 'essential' ? true : rawDecisions[category] === true;
    return acc;
  }, {} as ConsentDecisions);

  const method: ConsentRecord['method'] =
    candidate.method === 'accept-all' || candidate.method === 'essential-only'
      ? candidate.method
      : 'preferences';

  return { version: CONSENT_VERSION, decidedAt: decidedAt.toISOString(), method, decisions };
}
