import Link from 'next/link';

export default function HowToAppPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-6 text-[color:var(--text-primary)]">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">Helpful guide</p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Use James Square as an app on your phone</h1>
          <p className="text-[color:var(--text-secondary)]">
            If you regularly use James Square on your phone, you can add it to your home screen and open it like an app.
          </p>
          <p className="text-[color:var(--text-secondary)]">
            This does not install anything from an app store. It simply creates an app-style shortcut that opens James
            Square full screen for quicker access.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">On iPhone (Safari)</h2>
          <ol className="list-decimal space-y-2 pl-5 text-[color:var(--text-secondary)]">
            <li>Open James Square in Safari.</li>
            <li>Tap the Share icon at the bottom of the screen.</li>
            <li>Scroll down and tap Add to Home Screen.</li>
            <li>Confirm by tapping Add.</li>
          </ol>
          <p className="text-sm text-[color:var(--text-secondary)]">
            The James Square icon will appear on your home screen and open full screen like an app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">On Android (Chrome)</h2>
          <ol className="list-decimal space-y-2 pl-5 text-[color:var(--text-secondary)]">
            <li>Open James Square in Chrome.</li>
            <li>Tap the menu (three dots) in the top-right corner.</li>
            <li>Tap Add to Home screen or Install app.</li>
            <li>Confirm when prompted.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">A quick reassurance</h2>
          <p className="text-[color:var(--text-secondary)]">
            This does not enable notifications, tracking, or background activity.
          </p>
          <p className="text-[color:var(--text-secondary)]">
            It simply provides quicker access to the James Square website in an app-style view.
          </p>
        </section>

        <div>
          <Link href="/dashboard" className="text-sm font-semibold text-[color:var(--text-primary)] underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
