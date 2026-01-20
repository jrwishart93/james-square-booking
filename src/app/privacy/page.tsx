import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | James Square',
  description:
    'Privacy Policy for the James Square community website, outlining how personal information is handled.',
};

const lastUpdated = '20 January 2026';

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-8 text-base leading-relaxed text-slate-700 dark:text-slate-200">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">About this policy</h2>
        <p>
          This Privacy Policy explains how personal information is handled on the James Square community website. The
          site is community-run by a resident volunteer and is provided on a non-commercial basis for residents and
          owners.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who runs the site</h2>
        <p>
          The website is managed by a resident volunteer who acts as the data controller for information collected
          through the site. This is not a commercial service and does not represent a professional management company
          or factor.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Information we collect</h2>
        <p>
          When you create an account we collect your name, email address, username, property information, resident type,
          and login credentials. We also collect information you submit through bookings, voting, message board posts, or
          direct communications. We may record basic technical information such as device, browser, IP address, and time
          of access for security and audit purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How we use your information</h2>
        <p>
          We use personal information to manage accounts, verify resident access, operate bookings and voting, maintain
          community communications, and keep the website secure. We do not use personal information for advertising or
          marketing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Lawful bases for processing</h2>
        <p>
          We process personal information based on legitimate interests in running a community service, and on consent
          where you choose to provide optional information or communications. Some processing is necessary to provide
          access to the site features you request.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sharing and disclosures</h2>
        <p>
          Personal information is not sold or shared with third parties for marketing. It may be shared with service
          providers that host or secure the website, and with authorities if required by law or to protect the safety of
          residents.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Storage and retention</h2>
        <p>
          Information is stored using secure systems and is retained only as long as needed for the community purposes
          described or while your account remains active. You can request deletion of your account, subject to any legal
          or safety obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your rights</h2>
        <p>
          You have rights under UK GDPR, including access, correction, deletion, restriction, objection, and data
          portability. You can exercise these rights by contacting the site administrator through the website. You also
          have the right to complain to the Information Commissioner&apos;s Office (ICO).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Cookies and similar technologies</h2>
        <p>
          The site uses cookies or similar storage that are necessary to keep you signed in and to protect the security of
          the service. You can control cookies through your browser settings, but some features may not function without
          them.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Changes to this policy</h2>
        <p>
          We may update this policy to reflect changes to the site or legal requirements. Updates will be posted on this
          page with a new &quot;Last updated&quot; date.
        </p>
      </section>
    </article>
  );
}
