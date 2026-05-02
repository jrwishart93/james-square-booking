import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const pageTitle = 'Fior Additional Payments Questionnaire | James Square';
const pageDescription =
  'Information page for James Square owners completing the Fior additional payments questionnaire.';
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

function DualModeIcon() {
  return (
    <div className="shrink-0 rounded-2xl border border-slate-200/70 bg-white/60 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10">
      <Image
        src="/images/icons/q&a-light.png"
        alt="Questionnaire icon"
        width={96}
        height={96}
        className="dark:hidden h-16 w-16 object-contain sm:h-20 sm:w-20"
        priority
      />
      <Image
        src="/images/icons/q&a-dark.png"
        alt="Questionnaire icon"
        width={96}
        height={96}
        className="hidden h-16 w-16 object-contain dark:block sm:h-20 sm:w-20"
        priority
      />
    </div>
  );
}

export default function FiorQuestionnairePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8">
          <header className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Owners Information
                </p>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Fior Additional Payments Questionnaire
                </h1>
              </div>
              <DualModeIcon />
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-200">
              This questionnaire has been created to better understand whether owners at James Square may have made
              additional payments during the previous factoring period, or continued making payments after February
              2026.
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-200">
              The information collected is intended to help gauge how widespread the issue may be and whether further
              collective discussion or advice may be worthwhile.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {['Owners Information', 'Takes around 2 minutes', 'Questionnaire currently open'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-100/70 px-3.5 py-1.5 text-xs font-medium text-sky-800 shadow-sm dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </header>

          <section className="rounded-2xl border border-slate-200/80 bg-white/75 p-4 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:p-5">
            This questionnaire is informal and for information gathering purposes only. Submitting a response does not
            create legal action, representation, or financial claims.
          </section>

          <details className="group mt-3 rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none dark:text-slate-100">
              Why has this questionnaire been created?
              <span className="ml-2 text-slate-400 transition group-open:rotate-180 inline-block">⌄</span>
            </summary>
            <div className="pt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              <p>
                Following the transition from Fior Asset &amp; Property to Myreside Management in February 2026, some
                owners have reported continuing payments or making additional contributions towards maintenance or
                roof-related works.
              </p>
              <p className="mt-3">
                This questionnaire has been created simply to understand how many owners may have been affected and
                whether there is enough shared interest to explore the matter further collectively.
              </p>
            </div>
          </details>

          <section className="mx-auto w-full max-w-4xl space-y-4 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white/80 to-slate-50/70 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:from-white/10 dark:to-white/5 sm:p-6">
            <h2 className="px-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Questionnaire form</h2>

            <div className="block md:hidden">
              <div className="rounded-2xl border border-sky-200/90 bg-white p-5 shadow-md dark:border-sky-300/20 dark:bg-slate-900/80">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Open the questionnaire</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  Microsoft Forms may not load properly inside the website on some mobile devices. For the best
                  experience, please open the questionnaire in a new window.
                </p>
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Open Questionnaire
                </a>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  If the form still does not open, please copy the link and open it directly in your browser.
                </p>
              </div>
            </div>

            <div className="hidden space-y-4 md:block">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-sm dark:border-white/10 dark:bg-white/5">
                <iframe
                  title="Fior additional payments questionnaire"
                  src="https://forms.office.com/r/GEk4AbGcjz?embed=true"
                  className="h-[820px] w-full lg:h-[900px]"
                  frameBorder="0"
                  marginWidth={0}
                  marginHeight={0}
                  style={{ border: 'none', maxWidth: '100%' }}
                  allowFullScreen
                />
              </div>
              <div className="px-1">
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-white/20 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/10"
                >
                  Open questionnaire in new window
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Responses are intended to be reviewed by the James Square committee/admin team for the purpose of
            understanding owner concerns. Information will not be published publicly. You may only be contacted if
            further clarification is needed.
          </section>

          <div className="pt-6 sm:pt-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-300"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
