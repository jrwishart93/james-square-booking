'use client';

import { useEffect } from 'react';

import { registerSiteConsentServices } from '@/lib/consent/services';

import CookieConsentBanner from './CookieConsentBanner';
import CookiePreferencesPanel from './CookiePreferencesPanel';

/**
 * Single mount point for the consent experience. Registering the site's
 * services here — rather than at import time — keeps the registry a
 * client-only, post-hydration concern.
 */
export default function ConsentSurface() {
  useEffect(() => registerSiteConsentServices(), []);

  return (
    <>
      <CookieConsentBanner />
      <CookiePreferencesPanel />
    </>
  );
}
