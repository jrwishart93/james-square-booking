import type { ConsentCategory } from './types';

/**
 * Plain-English descriptions of each category, written to be read by a resident
 * rather than a lawyer. These strings are the single source of truth for the
 * preferences panel and the Cookie Policy page, so the two can never drift.
 */
export type ConsentCategoryInfo = {
  id: ConsentCategory;
  label: string;
  /** One-line summary shown as the row subtitle. */
  summary: string;
  /** Concrete examples of what the category actually does on this site. */
  examples: string[];
  /** Honest answer to "does this identify me?". */
  personalData: string;
  required: boolean;
  /** Retention shown in the panel so visitors can see how long things last. */
  storageDuration: string;
};

export const CONSENT_CATEGORY_INFO: readonly ConsentCategoryInfo[] = [
  {
    id: 'essential',
    label: 'Essential',
    summary: 'Needed for the site to work at all. These are always on.',
    examples: [
      'Keeping you signed in as you move between pages',
      'Remembering your cookie choices so we stop asking',
      'Protecting forms and logins against abuse',
    ],
    personalData:
      'Your account session is linked to you while you are signed in. Nothing here is used to profile you or shared for advertising.',
    required: true,
    storageDuration: 'Session, or up to 6 months for your cookie choices',
  },
  {
    id: 'functional',
    label: 'Functional',
    summary: 'Remembers small preferences so the site behaves the way you left it.',
    examples: [
      'The facility or information tab you last had open',
      'Remembering that you dismissed a notice',
      'Your preferred booking view',
    ],
    personalData:
      'No. These are stored on your device only and hold preferences, not identity.',
    required: false,
    storageDuration: 'Up to 12 months on your device',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    summary: 'Anonymous counts of which pages residents find useful.',
    examples: [
      'How many people viewed the pool safety page',
      'Which building updates are actually being read',
      'Whether a new page is helping or being ignored',
    ],
    personalData:
      'Measurement is aggregated and IP addresses are truncated where the provider supports it. We do not build profiles or track you across other websites.',
    required: false,
    storageDuration: 'Up to 14 months',
  },
  {
    id: 'performance',
    label: 'Performance',
    summary: 'Helps us find slow pages and errors so they can be fixed.',
    examples: [
      'Page load timings and Core Web Vitals',
      'Reports when something on the site breaks',
      'Spotting a facility page that is slow on mobile',
    ],
    personalData:
      'Technical only — device type, browser and timings. An error report can include the page you were on, so we keep these for a short time.',
    required: false,
    storageDuration: 'Up to 90 days',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    summary: 'Not used. James Square runs no advertising or tracking.',
    examples: [
      'No advertising cookies are set',
      'No data is sold or shared with advertisers',
      'Kept here only so this control exists if it were ever needed',
    ],
    personalData:
      'Nothing is collected. This category is switched off and empty by design.',
    required: false,
    storageDuration: 'Not applicable',
  },
];

export function getCategoryInfo(id: ConsentCategory): ConsentCategoryInfo {
  const found = CONSENT_CATEGORY_INFO.find((category) => category.id === id);
  if (!found) throw new Error(`Unknown consent category: ${id}`);
  return found;
}
