import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const pageTitle = 'Fior Additional Payments Questionnaire | James Square';
const pageDescription =
  'Information page for James Square owners completing the Fior additional payments questionnaire.';
const formUrl = 'https://forms.office.com/r/GEk4AbGcjz';
const embeddedFormUrl = 'https://forms.office.com/r/GEk4AbGcjz?embed=true';

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
    <div className="shrink-0 rounded-2xl border border-slate-200/70 bg-white/60 p-3 shadow-sm backdrop-blur transition-transform duration-500 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10">
      <Image
        src="/images/icons/q&a-light.png"
        alt="Questionnaire icon"
        width={96}
        height={96}
        className="h-16 w-16 object-contain dark:hidden sm:h-20 sm:w-20"
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
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-xl backdrop-blur transition-opacity duration-500 dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-7 sm:space-y-8">
          <header className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 sm:text-sm">
                  Owners Information
                </p>
                <h1 className="text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
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

            <div className="flex flex-wrap gap-2.5 pt-1">
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
            <summary className="list-none cursor-pointer text-base font-semibold text-slate-900 marker:content-none dark:text-slate-100">
              Why has this questionnaire been created?
              <span className="ml-2 inline-block text-slate-400 transition group-open:rotate-180">⌄</span>
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

          <section className="mx-auto w-full max-w-4xl space-y-4 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white/90 to-slate-50/80 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:from-white/10 dark:to-white/5 sm:p-6">
            <h2 className="px-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Questionnaire form</h2>

            <div className="block space-y-3 md:hidden">
              <div className="rounded-2xl border border-sky-200/90 bg-white p-5 shadow-md dark:border-sky-300/20 dark:bg-slate-900/80">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Best experience on mobile</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  Tap below to open the Microsoft Form directly. This is the smoothest and most reliable way to
                  complete the questionnaire on phones.
                </p>
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Open Questionnaire
                </a>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  If it opens in an in-app browser, use your browser menu and choose “Open in browser” for best
                  performance.
                </p>
              </div>

              <details className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Try embedded form here instead
                </summary>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-900/80">
                  <iframe
                    title="Fior additional payments questionnaire"
                    src={embeddedFormUrl}
                    loading="lazy"
                    className="h-[70dvh] min-h-[560px] w-full"
                    frameBorder="0"
                    marginWidth={0}
                    marginHeight={0}
                    style={{ border: 'none', maxWidth: '100%' }}
                    allowFullScreen
                  />
                </div>
              </details>
            </div>

            <div className="hidden space-y-4 md:block">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-sm dark:border-white/10 dark:bg-white/5">
                <iframe
                  title="Fior additional payments questionnaire"
                  src={embeddedFormUrl}
                  loading="lazy"
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

          <section className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-5 text-sm leading-7 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:px-5 sm:py-6 lg:mx-auto lg:max-w-4xl lg:px-6">
            <div className="flex items-start gap-2.5">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
              <div className="space-y-3.5">
                <p>
                  Responses will be reviewed privately to help understand the scale of any additional payments made to
                  Fior Asset & Property following the transfer to Myreside Management.
                </p>
                <p>
                  The information gathered may be shared with the James Square committee to help determine whether
                  there is sufficient collective interest to seek independent advice or explore potential joint action
                  if appropriate.
                </p>
                <p>
                  At this stage, the questionnaire is intended purely as an information gathering exercise. It remains
                  hoped that any outstanding financial matters can be resolved voluntarily, without the need for formal
                  legal action.
                </p>
                <p>
                  Owners who believe they may have made additional payments are encouraged to contact Fior Asset &
                  Property directly as a matter of urgency to request clarification and, where appropriate,
                  reimbursement of any funds paid. This can be done by email or formal letter directly to Fior.
                </p>
                <p>
                  Information submitted will not be published publicly. You may only be contacted if further
                  clarification is required.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-4 sm:pt-8">
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
