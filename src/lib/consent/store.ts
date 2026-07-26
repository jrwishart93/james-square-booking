'use client';

import {
  ACCEPT_ALL_DECISIONS,
  CONSENT_VERSION,
  DEFAULT_DECISIONS,
  ESSENTIAL_ONLY_DECISIONS,
  OPTIONAL_CONSENT_CATEGORIES,
  normaliseConsentRecord,
  type ConsentCategory,
  type ConsentDecisions,
  type ConsentRecord,
} from './types';

/**
 * Where the decision lives.
 *
 * localStorage is deliberate: the record never needs to reach the server, so
 * sending it on every request as a cookie would be gratuitous. A first-party
 * cookie mirror is written too, so that server-rendered pages and any future
 * edge logic can read the decision without JavaScript.
 */
const STORAGE_KEY = 'js-consent';
export const CONSENT_COOKIE_NAME = 'js-consent';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

type Listener = (state: ConsentState) => void;

export type ConsentState = {
  /** null until the visitor has made a choice (or their old choice expired). */
  record: ConsentRecord | null;
  decisions: ConsentDecisions;
  /** True once we have actually looked at storage — prevents a flash of the banner. */
  hydrated: boolean;
};

let state: ConsentState = {
  record: null,
  decisions: DEFAULT_DECISIONS,
  hydrated: false,
};

const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(state);
}

function setState(next: ConsentState) {
  state = next;
  emit();
}

function readStoredRecord(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = normaliseConsentRecord(JSON.parse(raw));
      if (parsed) return parsed;
      // Expired or from an older version — clear it rather than leave litter.
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private browsing or storage disabled. Treat as "no decision yet".
  }

  return readCookieRecord();
}

function readCookieRecord(): ConsentRecord | null {
  if (typeof document === 'undefined') return null;

  try {
    const match = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));
    if (!match) return null;
    const value = decodeURIComponent(match.slice(CONSENT_COOKIE_NAME.length + 1));
    return normaliseConsentRecord(JSON.parse(value));
  } catch {
    return null;
  }
}

function persist(record: ConsentRecord | null) {
  if (typeof window === 'undefined') return;

  try {
    if (record) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable — the cookie mirror below is the fallback.
  }

  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';

  if (record) {
    const value = encodeURIComponent(JSON.stringify(record));
    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  } else {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  }
}

/** Reads storage once and flips `hydrated`. Safe to call repeatedly. */
export function hydrateConsent(): ConsentState {
  if (state.hydrated) return state;

  const record = readStoredRecord();
  setState({
    record,
    decisions: record ? record.decisions : DEFAULT_DECISIONS,
    hydrated: true,
  });

  return state;
}

export function getConsentState(): ConsentState {
  return state;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'essential') return true;
  return state.decisions[category] === true;
}

export function subscribeToConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(decisions: ConsentDecisions, method: ConsentRecord['method']) {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    method,
    decisions: { ...decisions, essential: true },
  };

  persist(record);
  setState({ record, decisions: record.decisions, hydrated: true });
}

export function acceptAll() {
  commit(ACCEPT_ALL_DECISIONS, 'accept-all');
}

export function acceptEssentialOnly() {
  commit(ESSENTIAL_ONLY_DECISIONS, 'essential-only');
}

export function savePreferences(partial: Partial<Record<ConsentCategory, boolean>>) {
  const decisions = OPTIONAL_CONSENT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = partial[category] === true;
      return acc;
    },
    { essential: true } as ConsentDecisions,
  );

  commit(decisions, 'preferences');
}

/**
 * Full withdrawal: forgets the decision entirely so the visitor is asked again.
 * Also clears any storage written by optional services that are now switched off.
 */
export function withdrawConsent() {
  persist(null);
  setState({ record: null, decisions: DEFAULT_DECISIONS, hydrated: true });
}
