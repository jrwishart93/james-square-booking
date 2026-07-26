'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { reconcileConsentServices } from '@/lib/consent/registry';
import {
  acceptAll as storeAcceptAll,
  acceptEssentialOnly as storeAcceptEssentialOnly,
  getConsentState,
  hydrateConsent,
  savePreferences as storeSavePreferences,
  subscribeToConsent,
  withdrawConsent as storeWithdrawConsent,
  type ConsentState,
} from '@/lib/consent/store';
import type { ConsentCategory, ConsentDecisions } from '@/lib/consent/types';

type ConsentContextValue = ConsentState & {
  /** True when the banner should be shown: hydrated, with no valid decision. */
  needsDecision: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  savePreferences: (decisions: Partial<Record<ConsentCategory, boolean>>) => void;
  withdrawConsent: () => void;
  hasConsent: (category: ConsentCategory) => boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Custom event so a plain anchor anywhere can open the panel without prop drilling. */
export const OPEN_PREFERENCES_EVENT = 'js:open-cookie-preferences';

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConsentState>(() => getConsentState());
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // Subscribe before hydrating so we never miss the first transition.
    const unsubscribe = subscribeToConsent(setState);
    setState(hydrateConsent());
    reconcileConsentServices();
    return unsubscribe;
  }, []);

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  useEffect(() => {
    const handler = () => openPreferences();
    window.addEventListener(OPEN_PREFERENCES_EVENT, handler);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handler);
  }, [openPreferences]);

  const value = useMemo<ConsentContextValue>(() => {
    const decisions: ConsentDecisions = state.decisions;

    return {
      ...state,
      needsDecision: state.hydrated && state.record === null,
      isPreferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll: () => {
        storeAcceptAll();
        setPreferencesOpen(false);
      },
      acceptEssentialOnly: () => {
        storeAcceptEssentialOnly();
        setPreferencesOpen(false);
      },
      savePreferences: (next) => {
        storeSavePreferences(next);
        setPreferencesOpen(false);
      },
      withdrawConsent: () => {
        storeWithdrawConsent();
        setPreferencesOpen(false);
      },
      hasConsent: (category) => category === 'essential' || decisions[category] === true,
    };
  }, [state, isPreferencesOpen, openPreferences, closePreferences]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used inside <ConsentProvider>');
  }
  return context;
}

/**
 * Convenience hook for gating a single feature:
 *   const canEmbed = useConsentFor('functional');
 */
export function useConsentFor(category: ConsentCategory): boolean {
  return useConsent().hasConsent(category);
}

/** Opens the preferences panel from anywhere, including non-React code. */
export function openCookiePreferences() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
