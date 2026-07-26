'use client';

import { registerConsentService, scriptService } from './registry';

/**
 * The site's consent-gated services, in one place.
 *
 * James Square currently runs **no** analytics, tagging or advertising scripts,
 * so this list is intentionally empty. It exists so that adding one later is a
 * self-contained change: append a registration below and the banner, the
 * preferences panel and the withdrawal path all pick it up with no other edits.
 *
 * Worked examples for the services most likely to be added are kept as comments
 * rather than dead code, so nothing ships that nobody has consented to.
 *
 * ── Google Analytics 4 ───────────────────────────────────────────────────────
 *   const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
 *   if (GA_ID) {
 *     unregister.push(
 *       registerConsentService(
 *         scriptService({
 *           id: 'google-analytics',
 *           name: 'Google Analytics 4',
 *           category: 'analytics',
 *           src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
 *           clearsStorage: ['_ga', `_ga_${GA_ID.replace('G-', '')}`, '_gid'],
 *           onLoad: () => {
 *             window.dataLayer = window.dataLayer || [];
 *             const gtag = (...args: unknown[]) => window.dataLayer.push(args);
 *             gtag('js', new Date());
 *             // Keep IPs truncated and drop ad signals: analytics, not tracking.
 *             gtag('config', GA_ID, {
 *               anonymize_ip: true,
 *               allow_google_signals: false,
 *               allow_ad_personalization_signals: false,
 *             });
 *           },
 *         }),
 *       ),
 *     );
 *   }
 *
 * ── Microsoft Clarity ────────────────────────────────────────────────────────
 *   Clarity records session replays, which can capture form contents. If it is
 *   ever added it belongs in 'performance', must have masking set to "strict",
 *   and the Cookie Policy and Privacy Policy both need updating first.
 *
 * ── Embedded maps / social / Vimeo ───────────────────────────────────────────
 *   Do not register these here. Wrap the embed in <ConsentGate category="functional">
 *   so the iframe is never inserted — and therefore never contacted — until the
 *   visitor allows it.
 */
export function registerSiteConsentServices(): () => void {
  const unregister: Array<() => void> = [];

  // Nothing registered yet — see the worked examples above.
  // Referencing the helpers keeps them in the module graph and type-checked,
  // so the first real registration is a one-line change.
  void registerConsentService;
  void scriptService;

  return () => {
    for (const cleanup of unregister) cleanup();
  };
}
