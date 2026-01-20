import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | James Square',
  description: 'Terms of Use for the James Square community website.',
};

const lastUpdated = '20 January 2026';

export default function TermsOfUsePage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-8 text-base leading-relaxed text-slate-700 dark:text-slate-200">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Terms of Use</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">About these terms</h2>
        <p>
          These Terms of Use govern the James Square community website. The site is community-run by a resident volunteer
          for residents and owners. It is non-commercial and does not provide professional property management services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Eligibility and accounts</h2>
        <p>
          Accounts are intended for residents, owners, or short-term let guests associated with James Square. You must
          provide accurate information and keep it up to date. You are responsible for keeping your login details secure
          and for activity under your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Community conduct</h2>
        <p>
          Use the website respectfully and lawfully. Harassment, abusive language, or misuse of voting, booking, or
          messaging features is not permitted. The site administrator may remove content or restrict access to protect the
          community.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Content and communications</h2>
        <p>
          Any content you post is your responsibility. Content that is abusive, misleading, or unlawful may be removed.
          Messages or records related to safety or legal issues may be retained and, where appropriate, shared with
          relevant authorities.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Availability and changes</h2>
        <p>
          The site is provided on an &quot;as is&quot; basis and may be changed, paused, or withdrawn at any time. We aim to keep
          information accurate but do not guarantee completeness or availability.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bookings and community features</h2>
        <p>
          Bookings, voting, and information tools are provided to support community coordination. They do not replace
          official building rules, factor communications, or legal obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Liability</h2>
        <p>
          To the fullest extent permitted by law, the site administrator is not liable for any loss, damage, or
          inconvenience arising from use of the website, reliance on its content, or temporary unavailability. Nothing in
          these terms limits liability for death or personal injury caused by negligence or for fraud.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Links to other sites</h2>
        <p>
          The website may contain links to external sites for convenience. We are not responsible for their content or
          policies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Termination</h2>
        <p>
          Access may be suspended or removed if these terms are breached or if continued access could harm the
          community.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Governing law</h2>
        <p>
          These terms are governed by the law of Scotland, and any disputes will be subject to the exclusive
          jurisdiction of the Scottish courts.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Updates will be posted on this page with a new &quot;Last updated&quot;
          date.
        </p>
      </section>
    </article>
  );
}
