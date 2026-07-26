import type { Metadata } from 'next';
import Link from 'next/link';

import {
  LEGAL_CONTACT_EMAIL,
  LegalList,
  LegalPage,
  LegalSection,
} from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | James Square',
  description:
    'What is and is not acceptable on the James Square community website, and how moderation decisions are made.',
};

const lastUpdated = '26 July 2026';

export default function AcceptableUsePage() {
  return (
    <LegalPage
      currentPath="/acceptable-use"
      lastUpdated={lastUpdated}
      summary="Be civil, keep other residents' personal details private, book facilities fairly, and do not attempt to break or probe the site. Disagreement is fine — it is a shared building and people will not always agree. Personal attacks, harassment and publishing other people's information are not."
      title="Acceptable Use Policy"
    >
      <LegalSection title="Why this exists">
        <p>
          James Square is a small community, and this website is one of the few places where all of
          it meets. This policy sets out plainly what is expected, so that moderation decisions are
          predictable rather than arbitrary. It applies to the message board, votes, feedback,
          bookings and any email sent through the site.
        </p>
      </LegalSection>

      <LegalSection title="What we expect">
        <LegalList
          items={[
            'Treat other residents with courtesy, including when you disagree strongly with them.',
            'Criticise decisions, proposals and work — not people’s character.',
            'Post accurately. If you are passing on something you heard, say so.',
            'Keep discussion relevant to the building and the community.',
            'Respect the privacy of your neighbours, including their flat numbers, contact details and personal circumstances.',
          ]}
        />
      </LegalSection>

      <LegalSection title="What is not allowed">
        <p>Do not use the site to:</p>
        <LegalList
          items={[
            'Harass, bully, threaten or intimidate anyone, or encourage others to do so.',
            'Post content that is abusive, discriminatory, defamatory, obscene or unlawful.',
            'Publish another person’s personal information — their contact details, flat number, tenancy or ownership status, financial position, health or family circumstances — without their agreement.',
            'Post photographs or recordings of identifiable people, or of the inside of anyone’s home, without their agreement.',
            'Impersonate another resident, the committee, the factor or any official body.',
            'Advertise, sell or promote a business, or send unsolicited marketing to residents.',
            'Make repeated or vexatious complaints about the same matter after it has been answered.',
            'Discuss ongoing legal proceedings or insurance claims in a way that could prejudice them.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Bookings">
        <LegalList
          items={[
            'Book only slots you intend to use, and cancel promptly if your plans change.',
            'Do not book on someone else’s behalf using your account in order to get around fair-use limits.',
            'Do not make repeated bookings across accounts, or hold the same peak slot every day, to the exclusion of others.',
            'Follow the pool, gym and sauna safety rules, including supervision requirements for children.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Voting">
        <LegalList
          items={[
            'One vote per household, cast by an eligible owner.',
            'Do not attempt to vote more than once, or to vote on behalf of another owner without authority.',
            'Do not pressure or mislead other owners about how to vote.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Security and technical use">
        <p>Do not:</p>
        <LegalList
          items={[
            'Attempt to access another resident’s account, or any area you have not been given access to.',
            'Share the Owners or Committee access codes outside those groups.',
            'Probe, scan or test the site’s security without written permission, or attempt to bypass its controls.',
            'Extract data from the site in bulk, whether by automated scraping or by hand.',
            'Upload or link to malicious files, or attempt to interfere with the site’s availability.',
          ]}
        />
        <p>
          Genuine security research is welcome if you tell us first. Report anything you find to{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          and give us a fair chance to fix it. We will not pursue anyone who reports a real problem
          in good faith and does not exploit it.
        </p>
      </LegalSection>

      <LegalSection title="Reporting something">
        <p>
          Every post, comment and reply has a &ldquo;Report&rdquo; option. Use it if you see
          something that breaches this policy. Reports go only to site administrators, and the person
          you report is not told who reported them.
        </p>
        <p>
          If a matter is urgent or concerns your safety, contact the emergency services first, then
          let the committee know.
        </p>
      </LegalSection>

      <LegalSection title="How we respond">
        <p>Depending on what has happened, we may:</p>
        <LegalList
          items={[
            'Leave the content up and take no action, if it does not actually breach this policy.',
            'Ask the author to edit or remove it themselves.',
            'Remove or hide the content, and tell the author why.',
            'Temporarily restrict an account’s ability to post or book.',
            'Suspend or close an account, in serious or repeated cases.',
            'Report the matter to the factor, the police or another authority where there is a risk to safety or a possible crime.',
          ]}
        />
        <p>
          Moderation actions are recorded in an internal audit log. If you think a decision about
          your content or account was wrong, email{' '}
          <a className="underline underline-offset-2" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          and ask for it to be reviewed by the committee.
        </p>
      </LegalSection>

      <LegalSection title="Related documents">
        <p>
          This policy sits alongside the{' '}
          <Link className="underline underline-offset-2" href="/terms">
            Terms of Use
          </Link>
          ,{' '}
          <Link className="underline underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link className="underline underline-offset-2" href="/data-retention">
            Data Retention Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
