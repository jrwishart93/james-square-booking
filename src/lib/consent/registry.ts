'use client';

import { hasConsent, subscribeToConsent } from './store';
import type { ConsentCategory } from './types';

/**
 * The registry is how anything optional gets onto the page.
 *
 * A service declares which category it belongs to and how to switch itself on
 * and off. The registry then guarantees:
 *
 *   - `activate` never runs before consent for its category exists;
 *   - it runs exactly once, even if consent is re-confirmed;
 *   - `deactivate` runs the moment consent is withdrawn.
 *
 * Adding Google Analytics, Clarity, a map embed or an AI assistant later is
 * therefore a single `registerConsentService` call — no changes to the banner,
 * the panel, or this file.
 */
export type ConsentService = {
  /** Stable id, also used to de-duplicate registrations across renders. */
  id: string;
  /** Human-readable name, surfaced in the Cookie Policy service table. */
  name: string;
  category: ConsentCategory;
  /**
   * Turn the service on. Called on the client only, after consent.
   * May return a cleanup function, which is used if consent is later withdrawn.
   */
  activate: () => void | (() => void) | Promise<void | (() => void)>;
  /**
   * Optional explicit teardown. Runs alongside any cleanup returned by
   * `activate`. Use it to remove cookies the service set.
   */
  deactivate?: () => void;
  /** Cookies/storage keys to clear on withdrawal, as a convenience. */
  clearsStorage?: string[];
};

type RegisteredService = ConsentService & {
  active: boolean;
  cleanup?: () => void;
};

const services = new Map<string, RegisteredService>();
let subscribed = false;

function clearStorageKeys(keys: readonly string[] | undefined) {
  if (!keys?.length || typeof document === 'undefined') return;

  const host = window.location.hostname;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';

  for (const key of keys) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      // Storage may be unavailable; cookie removal below still applies.
    }

    // Expire on the exact host and on the registrable domain, since analytics
    // vendors commonly set cookies on a leading-dot domain.
    document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    document.cookie = `${key}=; Path=/; Domain=${host}; Max-Age=0; SameSite=Lax${secure}`;
    const parts = host.split('.');
    if (parts.length > 2) {
      const registrable = parts.slice(-2).join('.');
      document.cookie = `${key}=; Path=/; Domain=.${registrable}; Max-Age=0; SameSite=Lax${secure}`;
    }
  }
}

async function activate(service: RegisteredService) {
  if (service.active) return;
  service.active = true;

  try {
    const cleanup = await service.activate();
    if (typeof cleanup === 'function') {
      service.cleanup = cleanup;
    }
  } catch (error) {
    service.active = false;
    // A failing optional service must never break the page.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[consent] Failed to activate "${service.id}"`, error);
    }
  }
}

function deactivate(service: RegisteredService) {
  if (!service.active) return;
  service.active = false;

  try {
    service.cleanup?.();
    service.deactivate?.();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[consent] Failed to deactivate "${service.id}"`, error);
    }
  } finally {
    service.cleanup = undefined;
    clearStorageKeys(service.clearsStorage);
  }
}

/** Brings every registered service in line with the current decisions. */
export function reconcileConsentServices() {
  for (const service of services.values()) {
    if (hasConsent(service.category)) {
      void activate(service);
    } else {
      deactivate(service);
    }
  }
}

function ensureSubscription() {
  if (subscribed || typeof window === 'undefined') return;
  subscribed = true;
  subscribeToConsent(() => reconcileConsentServices());
}

/**
 * Registers a service and immediately activates it if consent already exists.
 * Returns an unregister function for component-scoped services.
 */
export function registerConsentService(service: ConsentService): () => void {
  if (typeof window === 'undefined') return () => {};

  const existing = services.get(service.id);
  if (existing) {
    // Re-registration (e.g. a remount) should not double-load the script.
    return () => unregisterConsentService(service.id);
  }

  const registered: RegisteredService = { ...service, active: false };
  services.set(service.id, registered);

  ensureSubscription();

  if (hasConsent(registered.category)) {
    void activate(registered);
  }

  return () => unregisterConsentService(service.id);
}

export function unregisterConsentService(id: string) {
  const service = services.get(id);
  if (!service) return;
  deactivate(service);
  services.delete(id);
}

export function getRegisteredServices(): ReadonlyArray<Pick<ConsentService, 'id' | 'name' | 'category'>> {
  return Array.from(services.values(), ({ id, name, category }) => ({ id, name, category }));
}

/**
 * Helper for the most common case: injecting a third-party `<script>` only
 * after consent, and removing it again on withdrawal.
 *
 *   registerConsentService(
 *     scriptService({
 *       id: 'google-analytics',
 *       name: 'Google Analytics 4',
 *       category: 'analytics',
 *       src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXX',
 *       clearsStorage: ['_ga', '_ga_XXXX', '_gid'],
 *     }),
 *   );
 */
export function scriptService(options: {
  id: string;
  name: string;
  category: ConsentCategory;
  src: string;
  /** Runs after the script has loaded, for any bootstrap the vendor needs. */
  onLoad?: () => void;
  attributes?: Record<string, string>;
  clearsStorage?: string[];
}): ConsentService {
  return {
    id: options.id,
    name: options.name,
    category: options.category,
    clearsStorage: options.clearsStorage,
    activate: () => {
      const script = document.createElement('script');
      script.src = options.src;
      script.async = true;
      script.dataset.consentService = options.id;
      for (const [key, value] of Object.entries(options.attributes ?? {})) {
        script.setAttribute(key, value);
      }
      if (options.onLoad) {
        script.addEventListener('load', options.onLoad, { once: true });
      }
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    },
  };
}
