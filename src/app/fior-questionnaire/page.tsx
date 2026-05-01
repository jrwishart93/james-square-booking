import type { Metadata } from 'next';

const pageTitle = 'Fior Payment Questionnaire | James Square';
const pageDescription =
  'Neutral information page for James Square owners completing the Fior payment questionnaire.';
const formUrl = 'https://forms.office.com/r/GEk4AbGcjz';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: 'https://www.james-square.com/fior-questionnaire',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: 'https://www.james-square.com/fior-questionnaire',
    type: 'website',
  },
};

export default function FiorQuestionnairePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <header className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              James Square Owner Information
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Fior Payment Questionnaire
            </h1>
          </header>

          <div className="space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
            <p>
              Following concerns raised by other owners, this questionnaire has been set up to assist with gathering
              initial information to understand how many owners made payments to Fior Asset &amp; Property following
              the transfer of factor responsibilities to Myreside Management in February 2026.
            </p>
            <p>
              This is an information gathering exercise only. Owners are encouraged to retain any relevant invoices,
              payment confirmations, bank statements or correspondence, but are not being asked to submit evidence at
              this stage.
            </p>
            <p>
              Depending on the responses received, affected owners may later wish to discuss whether independent legal
              guidance should be sought.
            </p>
          </div>

          <div>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-md shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Complete questionnaire
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
            <iframe
              title="Fior payment questionnaire"
              src="https://forms.office.com/r/GEk4AbGcjz?embed=true"
              className="h-[720px] w-full rounded-xl sm:h-[780px]"
              frameBorder="0"
              marginWidth={0}
              marginHeight={0}
              style={{ border: 'none', maxWidth: '100%', maxHeight: '100vh' }}
              allowFullScreen
            />
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            If the form does not load, please use the button above to open it in a new window.
          </p>
        </div>
      </section>
    </main>
  );
}
