'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useConsent } from './ConsentProvider';
import CookieIcon from './CookieIcon';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * The floating consent panel.
 *
 * Rendered only when there is genuinely no decision on file, so returning
 * visitors never see it. It is a polite `region`, not an alert dialog: it does
 * not trap focus or block the page, because forcing a choice before the site
 * can be read is exactly the pattern the ICO objects to.
 */
export default function CookieConsentBanner() {
  const { needsDecision, acceptAll, acceptEssentialOnly, openPreferences, isPreferencesOpen } =
    useConsent();
  const prefersReducedMotion = useReducedMotion();
  const acceptRef = useRef<HTMLButtonElement>(null);

  // Let keyboard users jump straight to the choice without hunting for it,
  // while leaving pointer users' focus exactly where it was.
  useEffect(() => {
    if (!needsDecision) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Escape is not consent, and it is not refusal. Open the full panel so
        // the visitor still has an explicit way to decide.
        openPreferences();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [needsDecision, openPreferences]);

  const show = needsDecision && !isPreferencesOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="consent-dock pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 sm:px-6"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: EASE_OUT }}
        >
          <section
            aria-labelledby="consent-banner-title"
            aria-describedby="consent-banner-description"
            className="consent-surface pointer-events-auto w-full max-w-2xl p-5 sm:p-6"
            role="region"
          >
            <div className="flex items-start gap-3.5 sm:gap-4">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[color:var(--text-secondary)]"
                style={{
                  borderColor: 'hsl(var(--glass-border))',
                  background: 'color-mix(in srgb, var(--glass-bg-light) 70%, transparent)',
                }}
              >
                <CookieIcon className="h-5 w-5" />
              </span>

              <div className="min-w-0 space-y-2">
                <h2
                  className="text-base font-semibold text-[color:var(--text-primary)]"
                  id="consent-banner-title"
                >
                  A note about cookies
                </h2>
                <p
                  className="text-sm leading-relaxed text-[color:var(--text-secondary)]"
                  id="consent-banner-description"
                >
                  James Square uses a small number of essential cookies to keep you signed in and
                  the site secure. With your permission we would also like to measure which pages
                  residents find useful, so we can improve them. We run no advertising and never
                  sell your information.{' '}
                  <Link
                    className="underline decoration-[color:var(--glass-border)] underline-offset-2 transition-colors hover:text-[color:var(--text-primary)]"
                    href="/cookies"
                  >
                    Read our Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="consent-btn consent-btn--ghost order-3 sm:order-1"
                onClick={openPreferences}
                type="button"
              >
                Cookie Preferences
              </button>

              {/* See the preferences panel: Accept All leads the stack on phones. */}
              <div className="flex flex-col-reverse gap-2.5 sm:order-2 sm:flex-row sm:items-center">
                <button
                  className="consent-btn consent-btn--secondary"
                  onClick={acceptEssentialOnly}
                  type="button"
                >
                  Essential Only
                </button>
                <button
                  className="consent-btn consent-btn--primary"
                  onClick={acceptAll}
                  ref={acceptRef}
                  type="button"
                >
                  Accept All
                </button>
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
