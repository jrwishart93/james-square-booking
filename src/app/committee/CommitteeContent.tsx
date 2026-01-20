import InboundEmailFeed from './InboundEmailFeed';

const glassCard =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]';

export default function CommitteeContent() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 text-[color:var(--text-primary)]">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Committee Area</h1>
          <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] jqs-glass">
            Private
          </span>
        </div>
        <p className="text-base text-[color:var(--text-muted)]">
          Private workspace for James Square committee members.
        </p>
      </header>

      <section className={`${glassCard} space-y-3 p-6`}>
        <h2 className="text-xl font-semibold">Under construction</h2>
        <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
          This space is under construction and will be developed in stages. It will be
          used for internal committee discussions, communications, and reference
          material. This page confirms access and intent while the workspace is being
          prepared.
        </p>
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Committee Communications (Coming Soon)</h2>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            This section will be used to manage communications between residents and
            the committee in a clear and transparent way.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            The aim is to allow messages sent to the committee to be tracked, marked as
            actioned or unactioned, and responded to without relying on individual
            inboxes. This helps ensure continuity, visibility, and accountability across
            the committee.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            This functionality is still being developed and is not yet active.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            Planned features
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--text-muted)]">
            <li>Shared committee inbox (instead of personal emails).</li>
            <li>Clear visibility of incoming messages.</li>
            <li>Status markers (e.g. unactioned / replied).</li>
            <li>Full reply history visible to committee members.</li>
            <li>Ability for multiple committee members to manage communications.</li>
          </ul>
        </div>
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Inbound messages (email)</h2>
          <p className="text-xs text-[color:var(--text-muted)]">
            Emails sent to the committee address. Internal visibility only.
          </p>
        </div>
        <InboundEmailFeed />
      </section>

      <section className={`${glassCard} p-4 text-xs text-[color:var(--text-muted)]`}>
        This page and its features are under active development. Functionality will be
        introduced gradually once agreed by the committee.
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Committee email</h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            The committee email exists to centralise communication, reduce reliance on
            individual inboxes, and keep continuity over time.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            Email address
          </span>
          <a
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold jqs-glass w-fit"
            href="mailto:committee@james-square.com"
          >
            committee@james-square.com
          </a>
        </div>
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <h2 className="text-lg font-semibold">What will live here</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--text-muted)]">
          <li>Internal committee discussions.</li>
          <li>Draft communications before sending to residents.</li>
          <li>Reference documents and records.</li>
          <li>Continuity for future committee members.</li>
        </ul>
      </section>

      <p className="text-xs text-[color:var(--text-muted)]">
        Access is currently via passcode. This will move to named committee access in
        due course.
      </p>
    </main>
  );
}
