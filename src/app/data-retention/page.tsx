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
  title: 'Data Retention Policy | James Square',
  description:
    'How long James Square keeps each type of information, what happens when an account is closed, and how deletion is carried out.',
};

const lastUpdated = '26 July 2026';

export default function DataRetentionPage() {
  return (
    <LegalPage
      currentPath="/data-retention"
      lastUpdated={lastUpdated}
      summary="We keep account details while your account is active, bookings for two years, audit logs for two years, and community discussion for as long as it is useful. Closing your account removes your profile and anonymises what has to stay for the record."
      title="Data Retention Policy"
    >
      <LegalSection title="The principle">
        <p>
          UK GDPR requires that personal information is kept no longer than necessary. For a
          community website that means being honest about two competing needs: residents should not
          have a permanent record following them around, but the building needs a reliable account
          of decisions, bookings and safety matters.
        </p>
        <p>
          The periods below are our working answer to that. Where something is kept for longer than
          you might expect, the reason is given.
        </p>
      </LegalSection>

      <LegalSection title="Retention periods">
        <LegalTable
          caption="How long each type of information is kept"
          headers={['Information', 'Kept for', 'Why']}
          rows={[
            [
              'Account profile — name, email, username, flat, resident type',
              'While the account is active, then deleted within 30 days of closure',
              'Needed to give you access; no reason to keep it afterwards',
            ],
            [
              'Sign-in credentials',
              'Deleted with the account',
              'Held by Firebase Authentication, not by us',
            ],
            [
              'Last sign-in timestamp',
              '12 months',
              'Helps spot dormant and compromised accounts',
            ],
            [
              'Facility bookings',
              '24 months from the booking date',
              'Fair-use checks look back several days; longer history supports facility planning and disputes',
            ],
            [
              'Message board posts, comments and replies',
              'Indefinitely while relevant; author name removed if the account is closed',
              'Community discussion loses its meaning if threads are gutted; the personal link is severed instead',
            ],
            [
              'Reactions on posts',
              'Deleted with the account',
              'No value once the person has left',
            ],
            [
              'Moderation reports',
              '24 months',
              'Needed to see patterns of behaviour; then no longer relevant',
            ],
            [
              'Community and owners’ votes, including voter name and flat',
              'Until 12 months after the vote closes, then reduced to anonymous totals',
              'Results must be verifiable at the time; the totals are what matters afterwards',
            ],
            [
              'Feedback submitted through the site',
              '12 months',
              'Long enough to act on and follow up',
            ],
            [
              'Emails sent through the site, and the committee archive',
              '6 years',
              'Communications with owners about building matters may be needed for Association records and any dispute',
            ],
            [
              'Administrative audit log',
              '24 months',
              'Accountability for changes to accounts and roles',
            ],
            [
              'Cookie consent record',
              '6 months, then you are asked again',
              'Evidence that consent was given, without treating an old decision as permanent',
            ],
            [
              'Web server and security logs',
              'Held by our hosting provider on short operational cycles (typically 30 days)',
              'Diagnosing faults and investigating abuse',
            ],
            [
              'Rate-limiting counters',
              'Minutes',
              'Held in memory only, to slow down automated guessing; never written to the database',
            ],
          ]}
        />
      </LegalSection>

      <LegalSection title="Closing your account">
        <p>
          Email{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          from the address on the account. Within 30 days we will:
        </p>
        <LegalList
          items={[
            'Delete your sign-in credentials and your profile — name, email address, username, flat and resident type.',
            'Delete your future bookings and cancel any slots you were holding.',
            'Remove your name from message board posts, comments and replies, leaving the content in place attributed to a former resident.',
            'Reduce any votes you cast to anonymous totals, so results remain correct without naming you.',
            'Delete your reactions and any feedback you submitted.',
          ]}
        />
        <p>
          A small amount of information may be kept beyond this where we are required to, or where
          erasing it would undermine something the community relies on:
        </p>
        <LegalList
          items={[
            'Records relating to a safety incident, insurance claim or legal matter, for as long as that matter is live.',
            'Emails already sent to residents — these have left our systems and cannot be recalled.',
            'Entries in the administrative audit log showing actions taken on the account, so the log stays complete.',
          ]}
        />
        <p>
          We will tell you if any of these apply to you, and explain what is being kept and why.
        </p>
      </LegalSection>

      <LegalSection title="How deletion is carried out">
        <p>
          Deletion is performed by a site administrator against the live database, so the record is
          genuinely removed rather than hidden from the interface. Backups held by our providers roll
          forward on their own cycles, so a deleted record may persist in a backup for a short period
          before ageing out. Backups are not used to restore individual records.
        </p>
        <p>
          Retention periods are reviewed alongside this policy at least once a year, and pruning of
          expired bookings, votes and logs is currently carried out manually as part of that review.
        </p>
      </LegalSection>

      <LegalSection title="Related documents">
        <p>
          See the{' '}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>{' '}
          for what we collect and why, and the{' '}
          <Link className="underline underline-offset-2" href="/cookies">
            Cookie Policy
          </Link>{' '}
          for storage kept on your own device.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
