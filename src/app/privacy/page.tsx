import type { Metadata } from 'next';
import Link from 'next/link';

import {
  LEGAL_CONTACT_EMAIL,
  LegalList,
  LegalPage,
  LegalSection,
  LegalTable,
} from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | James Square',
  description:
    'How the James Square community website collects, uses, stores and protects residents’ personal information, and the rights you have under UK GDPR.',
};

const lastUpdated = '26 July 2026';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      currentPath="/privacy"
      lastUpdated={lastUpdated}
      summary="We collect the minimum needed to run a residents' portal: your name, email address, flat and whether you are an owner, renter or short-stay guest. It is used to give you access, take facility bookings, run community votes and send building updates. It is never sold, never used for advertising, and never shared outside the building except where the law requires it."
      title="Privacy Policy"
    >
      <LegalSection title="Who we are and who is responsible">
        <p>
          James-Square.com is a community website for residents and owners of James Square,
          Caledonian Crescent, Edinburgh. It is run on a voluntary, non-commercial basis by a
          resident on behalf of the James Square Proprietors&rsquo; Association, and is not a
          property management company or factor.
        </p>
        <p>
          For the purposes of UK GDPR the data controller is the James Square Proprietors&rsquo;
          Association, contactable at{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          . We are not required to appoint a Data Protection Officer, and have not done so; privacy
          enquiries are handled by the site administrator with the committee.
        </p>
      </LegalSection>

      <LegalSection title="What we collect, and why">
        <LegalTable
          caption="Personal information collected by James Square, with the purpose and lawful basis for each"
          headers={['What we collect', 'Why we need it', 'Lawful basis']}
          rows={[
            [
              'Your name, email address, chosen username and flat number, and whether you are an owner, renter or short-stay guest',
              'To create your account, confirm you are connected to the building, and show your name on bookings, posts and votes',
              'Contract — we cannot give you an account without it',
            ],
            [
              'Your password',
              'To sign you in. Stored and checked by Firebase Authentication; we never see it and cannot recover it',
              'Contract',
            ],
            [
              'Facility bookings: which facility, date, time and the account that booked',
              'To operate the pool, gym and sauna booking system and apply fair-use limits',
              'Contract',
            ],
            [
              'Message board posts, comments, replies and reactions',
              'To run the residents’ message board',
              'Legitimate interests — running a community noticeboard',
            ],
            [
              'Votes in community and owners’ polls, including your name and flat',
              'So each household votes once and the result can be verified',
              'Legitimate interests — fair and auditable community decisions',
            ],
            [
              'Feedback and moderation reports you submit',
              'To respond to problems and moderate the message board',
              'Legitimate interests',
            ],
            [
              'Emails you send to the committee, and records of emails the committee sends through the site',
              'To answer you and keep a record of what was communicated to residents',
              'Legitimate interests',
            ],
            [
              'Sign-in timestamps, and an audit log of administrative actions',
              'To keep accounts secure and to show who changed what',
              'Legal obligation (UK GDPR security duty) and legitimate interests',
            ],
            [
              'Your cookie choices',
              'So we honour your preferences and stop asking',
              'Legal obligation (PECR)',
            ],
          ]}
        />

        <p>
          We do not ask for, and do not want, information such as your date of birth, telephone
          number, financial details, or any special category data (health, ethnicity, beliefs and
          so on). Please do not include such information in message board posts or emails.
        </p>
        <p>
          Where a form asks for something, the reason is stated next to the field. If you think we
          are collecting more than we need, tell us — data minimisation is something we actively
          check.
        </p>
      </LegalSection>

      <LegalSection title="Technical information">
        <p>
          Like any website, ours receives technical information as a by-product of serving pages:
          your IP address, browser and device type, and the pages requested. This is used only to
          deliver the site and to protect it against abuse — for example, temporarily counting
          requests from an address to stop repeated guessing of an access code.
        </p>
        <p>
          We do not store IP addresses in our own database, and do not use them to build any profile
          of you. Our hosting provider keeps short-term operational logs on our behalf.
        </p>
      </LegalSection>

      <LegalSection title="Who can see your information">
        <LegalList
          items={[
            'Only you can see your own account profile. Other residents cannot look up your email address, flat or account details.',
            'Your name is shown alongside anything you choose to post publicly on the message board, and alongside your vote in owners’ polls, so results can be verified.',
            'Bookings show as “booked” to other residents. Your email address is not revealed to them.',
            'Site administrators can see resident accounts, bookings and audit logs in order to run the site. Administrative actions are logged.',
            'The committee can see emails sent to committee addresses, and the archive of emails sent through the site.',
          ]}
        />
        <p>
          We do not sell personal information, and we do not share it for marketing. It is not
          passed to the factor, to Myreside Management, or to any other organisation except where
          you have asked us to, or where we are legally required to.
        </p>
      </LegalSection>

      <LegalSection title="Service providers">
        <p>
          A small number of companies process data on our behalf, under contract, and only on our
          instructions:
        </p>
        <LegalTable
          caption="Processors used by James Square"
          headers={['Provider', 'What they do', 'Where data is processed']}
          rows={[
            [
              'Google (Firebase Authentication, Cloud Firestore, Cloud Functions)',
              'Sign-in, database and server-side functions',
              'European Union and United States, under Google’s standard contractual clauses',
            ],
            [
              'Vercel',
              'Website hosting and delivery',
              'European Union and United States, under standard contractual clauses',
            ],
            [
              'Resend',
              'Sending emails from the site (building updates, committee mail)',
              'European Union and United States, under standard contractual clauses',
            ],
          ]}
        />
        <p>
          Where data reaches the United States it is protected by the safeguards named above. If you
          would like more detail on any transfer, please ask.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          Retention periods for each type of information are set out in full in our{' '}
          <Link className="underline underline-offset-2" href="/data-retention">
            Data Retention Policy
          </Link>
          . In summary: account details are kept while your account is active, bookings for two
          years, audit logs for two years, and communications for as long as they are relevant to
          the running of the building.
        </p>
      </LegalSection>

      <LegalSection title="How we protect it">
        <LegalList
          items={[
            'All traffic is encrypted in transit (HTTPS), and the site is served only over HTTPS.',
            'Passwords are handled by Firebase Authentication and are never visible to us.',
            'Database rules restrict every collection so residents can read their own information and administrators can read what they need to run the site — not everything by default.',
            'Administrative functions verify the caller’s identity and role on the server. Being able to reach a page is never treated as permission to use it.',
            'Emails sent through the site use blind copy so recipients cannot see each other’s addresses.',
            'Sensitive settings and keys are held as server-side environment variables and are never sent to your browser.',
          ]}
        />
        <p>
          No system is perfect. If you believe you have found a security or privacy problem, please
          report it to{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          and give us a reasonable opportunity to fix it before disclosing it more widely. We will
          not pursue anyone who reports a genuine issue in good faith.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>Under UK GDPR you have the right to:</p>
        <LegalList
          items={[
            'Be told what we hold about you, and get a copy of it (access).',
            'Have inaccurate information corrected (rectification).',
            'Have your information deleted, including closing your account (erasure).',
            'Ask us to stop or limit how we use it (restriction and objection).',
            'Receive your information in a portable format (portability).',
            'Withdraw consent where we rely on it — for example, your cookie choices.',
          ]}
        />
        <p>
          To exercise any of these, email{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          . We will respond within one month. There is no charge. We may ask you to confirm your
          identity — usually by replying from the email address on the account — so that we do not
          disclose your information to someone else.
        </p>
        <p>
          Some things cannot simply be erased on request. Where a vote has been counted or a
          decision minuted, removing your record would undermine the integrity of a community
          decision, so we may keep the minimum needed and explain why. Content that relates to a
          safety or legal matter may also be retained.
        </p>
        <p>
          If you are unhappy with how we have handled your information you can complain to the{' '}
          <a
            className="underline underline-offset-2"
            href="https://ico.org.uk/make-a-complaint/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Information Commissioner&rsquo;s Office
          </a>
          , the UK data protection regulator. We would appreciate the chance to put things right
          first.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Accounts are intended for adult residents and owners. We do not knowingly collect
          information from children. Where a facility booking is made for a family, it is made by
          and recorded against the adult account holder.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Cookies and similar storage are covered separately in our{' '}
          <Link className="underline underline-offset-2" href="/cookies">
            Cookie Policy
          </Link>
          , which lists every cookie we set and lets you change your choices at any time.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We will update this policy when the site changes or the law requires it. The
          &ldquo;last updated&rdquo; date at the top always reflects the current version. If a
          change materially affects how your information is used, we will say so on the site rather
          than change it quietly.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
