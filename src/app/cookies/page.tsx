import type { Metadata } from 'next';
import Link from 'next/link';

import { CookieSettingsLink } from '@/components/consent';
import {
  LEGAL_CONTACT_EMAIL,
  LegalList,
  LegalPage,
  LegalSection,
  LegalTable,
} from '@/components/legal/LegalPage';
import { CONSENT_CATEGORY_INFO } from '@/lib/consent/categories';
import { CONSENT_MAX_AGE_DAYS } from '@/lib/consent/types';

export const metadata: Metadata = {
  title: 'Cookie Policy | James Square',
  description:
    'How James Square uses cookies and similar storage, what each category does, and how to change your choices at any time.',
};

const lastUpdated = '26 July 2026';

export default function CookiePolicyPage() {
  return (
    <LegalPage
      currentPath="/cookies"
      lastUpdated={lastUpdated}
      summary="James Square sets a small number of essential cookies so you can sign in and so we remember your cookie choices. Everything else is optional, switched off until you allow it, and can be withdrawn at any time from the Cookie Settings link in the footer. We run no advertising and no cross-site tracking."
      title="Cookie Policy"
    >
      <LegalSection title="What cookies are">
        <p>
          A cookie is a small file a website asks your browser to keep. Similar technologies —
          local storage and session storage — do much the same job. This policy covers all of
          them, and uses &ldquo;cookies&rdquo; throughout for readability.
        </p>
        <p>
          Under the Privacy and Electronic Communications Regulations (PECR) we may only place
          cookies on your device without asking when they are strictly necessary to provide the
          service you asked for. Everything else requires your consent first, which is why nothing
          optional runs on this site until you allow it.
        </p>
      </LegalSection>

      <LegalSection title="What we currently use">
        <p>
          James Square runs <strong>no analytics, advertising or tracking scripts at all</strong>.
          At the time of writing, the only cookies and storage in use are the strictly necessary
          ones listed below. The optional categories exist so that if useful measurement is added
          later, your choice is already recorded and respected from the first page load.
        </p>

        <LegalTable
          caption="Cookies and storage currently set by James Square"
          headers={['Name', 'Type', 'Purpose', 'Expires']}
          rows={[
            [
              <code key="a">js-consent</code>,
              'Essential',
              'Records your cookie choices so you are not asked again. Stored both in local storage and as a first-party cookie.',
              `${CONSENT_MAX_AGE_DAYS} days`,
            ],
            [
              <code key="b">firebase:authUser:*</code>,
              'Essential',
              'Keeps you signed in to your resident account. Set by Firebase Authentication, our sign-in provider.',
              'Until you sign out',
            ],
            [
              <code key="c">owners_secure_access</code>,
              'Essential',
              'Records that you entered the Owners area access code, for the length of your browsing session.',
              'End of session',
            ],
            [
              <code key="d">js_committee_access</code>,
              'Essential',
              'Records that you entered the Committee area access code, for the length of your browsing session.',
              'End of session',
            ],
            [
              <code key="e">useful-info-tab</code>,
              'Functional',
              'Remembers which information tab you last had open.',
              '12 months',
            ],
            [
              <code key="f">ovh_username, ovh_flat</code>,
              'Functional',
              'Pre-fills your name and flat on the voting form so you do not retype them.',
              'End of session',
            ],
          ]}
        />

        <p className="text-sm">
          Service workers used for offline access to the site are also strictly necessary, and
          store only page assets — never personal information.
        </p>
      </LegalSection>

      <LegalSection title="The categories explained">
        <p>
          These are the same categories, in the same words, that you see in the Cookie Preferences
          panel.
        </p>

        <div className="space-y-5">
          {CONSENT_CATEGORY_INFO.map((category) => (
            <div key={category.id} className="space-y-2">
              <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
                {category.label}{' '}
                <span className="text-sm font-normal text-[color:var(--text-secondary)]">
                  ({category.required ? 'always on' : 'optional'})
                </span>
              </h3>
              <p>{category.summary}</p>
              <LegalList items={category.examples} />
              <p className="text-sm">
                <strong className="font-medium text-[color:var(--text-primary)]">
                  Personal information:
                </strong>{' '}
                {category.personalData}
              </p>
              <p className="text-sm">
                <strong className="font-medium text-[color:var(--text-primary)]">
                  How long it lasts:
                </strong>{' '}
                {category.storageDuration}
              </p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Changing or withdrawing your choices">
        <p>
          Use the <strong>Cookie Settings</strong> link in the footer of any page — or the button
          below — to reopen the preferences panel. You can turn individual categories on or off,
          reject everything optional, or withdraw consent entirely so that you are asked afresh.
        </p>
        <p>
          <CookieSettingsLink
            className="consent-btn consent-btn--secondary"
            showIcon={false}
          />
        </p>
        <p>
          Withdrawing consent is as easy as giving it, takes effect immediately, and never costs
          you access to any part of the site. Any storage belonging to a category you switch off is
          cleared at the same time.
        </p>
        <p>
          We ask again after {CONSENT_MAX_AGE_DAYS} days so that a decision you made long ago is
          not treated as consent forever.
        </p>
      </LegalSection>

      <LegalSection title="Browser controls">
        <p>
          You can also block or delete cookies in your browser settings. Blocking strictly
          necessary cookies will stop you being able to sign in, and may break bookings and the
          message board. Guidance for each major browser is published by the{' '}
          <a
            className="underline underline-offset-2"
            href="https://ico.org.uk/for-the-public/online/cookies/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Information Commissioner&rsquo;s Office
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Third parties">
        <p>
          Some pages embed content from other organisations — Vimeo for video, Google Maps for
          location, Microsoft Forms for questionnaires. These are loaded only when you allow
          functional cookies, so no request reaches them until then. Where an embed is switched
          off you will see a placeholder offering to enable it.
        </p>
        <p>
          Our hosting provider (Vercel) and sign-in and database provider (Google Firebase) process
          data on our behalf as part of delivering the site. They are covered in the{' '}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          If anything here is unclear, or you think a cookie is being set that this policy does not
          describe, please contact us at{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
