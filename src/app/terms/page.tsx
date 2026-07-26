import type { Metadata } from 'next';
import Link from 'next/link';

import {
  LEGAL_CONTACT_EMAIL,
  LegalList,
  LegalPage,
  LegalSection,
} from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Use | James Square',
  description:
    'The terms on which residents and owners may use the James Square community website.',
};

const lastUpdated = '26 July 2026';

export default function TermsOfUsePage() {
  return (
    <LegalPage
      currentPath="/terms"
      lastUpdated={lastUpdated}
      summary="This is a volunteer-run community website for James Square residents and owners. Use it respectfully, keep your login to yourself, and remember that it supports the running of the building rather than replacing the factor or any official process."
      title="Terms of Use"
    >
      <LegalSection title="About these terms">
        <p>
          These Terms of Use govern your use of James-Square.com. The site is run on a voluntary,
          non-commercial basis by a resident on behalf of the James Square Proprietors&rsquo;
          Association. It does not provide professional property management services.
        </p>
        <p>
          By creating an account or using the site you accept these terms, our{' '}
          <Link className="underline underline-offset-2" href="/acceptable-use">
            Acceptable Use Policy
          </Link>{' '}
          and our{' '}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Eligibility and accounts">
        <p>
          Accounts are for residents, owners and short-term let guests connected with James Square.
          When you register you must give accurate information and keep it up to date, so that
          bookings and votes can be attributed properly.
        </p>
        <LegalList
          items={[
            'Keep your password to yourself. Do not share your account, and do not use anyone else’s.',
            'You are responsible for activity carried out under your account.',
            'Shared access codes for the Owners and Committee areas are for members of those groups only. Do not pass them on.',
            'Tell us promptly if you think your account has been accessed by someone else.',
          ]}
        />
        <p>
          You can close your account at any time by emailing{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Community conduct">
        <p>
          Use the website respectfully and lawfully. Harassment, abusive language, or misuse of the
          voting, booking or messaging features is not permitted. What counts as acceptable is set
          out in detail in the{' '}
          <Link className="underline underline-offset-2" href="/acceptable-use">
            Acceptable Use Policy
          </Link>
          . Administrators may remove content or restrict access to protect the community.
        </p>
      </LegalSection>

      <LegalSection title="Content you post">
        <p>
          Anything you post remains your responsibility. You keep ownership of it, and by posting
          you allow us to display it on the site to other residents for as long as it remains
          relevant. Content that is abusive, misleading or unlawful may be removed.
        </p>
        <p>
          Posts, comments and votes carry your name so that community discussion and decisions are
          accountable. Please treat other residents&rsquo; names and flat numbers as private — do
          not copy them elsewhere.
        </p>
        <p>
          Material relating to safety or legal matters may be retained and, where appropriate,
          shared with the factor, insurers or the authorities.
        </p>
      </LegalSection>

      <LegalSection title="Bookings and community features">
        <p>
          Bookings, voting and information tools support community coordination. They do not replace
          official building rules, factor communications, title deeds or any legal obligation. Fair
          use limits apply to facility bookings so that everyone gets a turn; repeatedly working
          around them may result in bookings being cancelled.
        </p>
        <p>
          Information about the building — surveys, minutes, financial summaries — is published for
          residents&rsquo; convenience. It is not a substitute for the official records held by the
          factor or the Association.
        </p>
      </LegalSection>

      <LegalSection title="Availability and changes">
        <p>
          The site is provided on an &ldquo;as is&rdquo; basis and may be changed, paused or
          withdrawn at any time. We aim to keep information accurate but cannot guarantee
          completeness or continuous availability. It is run by volunteers in their own time.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          To the fullest extent permitted by law, the Association and the site administrator are not
          liable for any loss, damage or inconvenience arising from use of the website, reliance on
          its content, or temporary unavailability. Nothing in these terms limits liability for
          death or personal injury caused by negligence, for fraud, or for anything else that cannot
          lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection title="Links to other sites">
        <p>
          The website links to and embeds content from other organisations for convenience. We are
          not responsible for their content or their privacy practices. Embedded content loads only
          if you have allowed functional cookies.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          Access may be suspended or removed if these terms or the Acceptable Use Policy are
          breached, or if continued access could harm the community. Where practical we will explain
          why, and you may ask for the decision to be reviewed by the committee.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the law of Scotland, and any disputes are subject to the
          exclusive jurisdiction of the Scottish courts.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms from time to time. Updates are posted on this page with a new
          &ldquo;last updated&rdquo; date. Continuing to use the site after a change means you
          accept the revised terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
