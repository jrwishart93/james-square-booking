import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock3, FileText, Info } from "lucide-react";

const pageTitle = "FIOR Property Assets | Owner Information | James Square";
const pageDescription =
  "Information for James Square owners about outstanding funds, individual payments and the options available to owners.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "https://www.james-square.com/fior-info" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://www.james-square.com/fior-info",
    type: "article",
  },
};

const sectionClass =
  "jqs-glass relative overflow-hidden p-6 sm:p-8 lg:p-10 bg-white/65 dark:bg-slate-900/55";
const headingClass = "text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl";
const copyClass = "space-y-4 text-[15px] leading-7 text-slate-700 dark:text-slate-200 sm:text-base";

const concerns = [
  "Direct Debit payments continuing after FIOR ceased acting as factor.",
  "Owners making payments which they believe were no longer due to FIOR.",
  "Money being requested from some owners towards proposed roof or repair works.",
  "Owners reporting that planned works associated with some of those payments had not been carried out.",
  "Owners experiencing difficulties or delays when subsequently requesting repayment.",
];

const nextSteps = [
  {
    number: "01",
    title: "Understand the background",
    eyebrow: "You are here",
    description: "Why this information page has been created and what has happened so far.",
    state: "Current section",
    icon: Check,
    current: true,
  },
  {
    number: "02",
    title: "Recovering money through Simple Procedure",
    eyebrow: "Step-by-step guide",
    description:
      "A practical guide explaining how an individual owner can prepare and submit a Simple Procedure claim, what information they will need and links to the official Scottish Courts Civil Online service.",
    state: "Guide coming next",
    icon: FileText,
  },
  {
    number: "03",
    title: "Police Scotland & FAQs",
    eyebrow: "Further information",
    description:
      "Information for owners who believe their circumstances may be relevant to the ongoing Police Scotland enquiry, together with frequently asked questions.",
    state: "To be added",
    icon: Clock3,
  },
];

export default function FiorInfoPage() {
  return (
    <div className="relative isolate -mx-4 -my-8 overflow-hidden px-4 py-10 sm:-mx-6 sm:px-6 sm:py-14 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_4%,rgba(56,189,248,0.13),transparent_31%),radial-gradient(circle_at_88%_24%,rgba(99,102,241,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_12%_4%,rgba(56,189,248,0.10),transparent_31%),radial-gradient(circle_at_88%_24%,rgba(99,102,241,0.12),transparent_30%)]"
        aria-hidden="true"
      />

      <article className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-500" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
              OWNER INFORMATION
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              FIOR Property Assets
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl">
              Information for James Square owners about outstanding funds, individual payments and the options available
              to owners.
            </p>
            <div className="mt-8 max-w-3xl border-t border-slate-200/80 pt-6 text-[15px] leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300 sm:text-base">
              This page has been created to bring together information for James Square owners following the departure
              of FIOR Property Assets as factor and concerns raised by owners regarding money they believe remains
              outstanding.
            </div>
          </div>
        </header>

        <section className={sectionClass} aria-labelledby="background-heading">
          <h2 id="background-heading" className={headingClass}>Background</h2>
          <div className={`${copyClass} mt-5`}>
            <p>
              FIOR Property Assets ceased acting as factor for James Square at the end of January 2026, with Myreside
              Management taking over from 1 February 2026.
            </p>
            <p>
              The change followed discussions during the preceding months regarding FIOR&apos;s intention to leave James
              Square and concerns from owners about aspects of the factoring service and work which owners understood
              FIOR was responsible for arranging or completing.
            </p>
            <p>
              Following the change of factor, correspondence took place requesting that money and communal funds held
              in connection with James Square be transferred to Myreside Management. At the time this page was prepared,
              the committee understands that some funds remain outstanding and Myreside continues to pursue this
              separately.
            </p>
            <p className="rounded-2xl border border-sky-200/70 bg-sky-50/70 px-5 py-4 font-medium text-slate-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-slate-100">
              Communal James Square funds are separate from any money that may be owed directly to individual owners.
            </p>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="concerns-heading">
          <h2 id="concerns-heading" className={headingClass}>Concerns raised by owners</h2>
          <div className={`${copyClass} mt-5`}>
            <p>
              After Myreside Management took over, the James Square Owners Committee began receiving reports from
              individual owners who believed they had personally paid money to FIOR which should be returned.
            </p>
            <p>Examples reported to the committee included:</p>
            <ul className="grid gap-3" role="list">
              {concerns.map((concern) => (
                <li key={concern} className="flex gap-3 rounded-xl border border-slate-200/80 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" aria-hidden="true" />
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              These are concerns reported by individual owners. They are not presented as findings about FIOR or any
              individual.
            </p>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="information-heading">
          <h2 id="information-heading" className={headingClass}>Information gathered by the committee</h2>
          <div className={`${copyClass} mt-5`}>
            <p>
              As similar concerns were being raised by more than one owner, the James Square Owners Committee prepared a
              questionnaire to better understand the scale and nature of the issue. A number of owners responded and
              confirmed circumstances in which they believed money remained due back to them.
            </p>
            <p>
              The purpose of gathering this information was to establish whether individual reports appeared to form
              part of a wider issue and to allow the committee to determine what appropriate steps could be taken.
            </p>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/75 p-5 dark:border-white/10 dark:bg-white/5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-300" aria-hidden="true" />
              <p className="text-sm leading-6">
                No owners&apos; names, property numbers, amounts, bank information, questionnaire responses or other
                personally identifiable information are published on this page.
              </p>
            </div>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="police-heading">
          <h2 id="police-heading" className={headingClass}>Information provided to Police Scotland</h2>
          <div className={`${copyClass} mt-5`}>
            <p>
              Following the information received from owners, the committee contacted Police Scotland and provided
              information about the concerns which had been reported.
            </p>
            <p>
              The purpose was to make Police Scotland aware that a number of owners reported difficulty recovering money
              and to allow Police Scotland to determine whether any circumstances required investigation. The matter
              remains the subject of an ongoing enquiry. Police Scotland has not reached a conclusion, and this page
              does not state or imply that FIOR, or any director or employee of FIOR, has committed an offence or is
              guilty of wrongdoing.
            </p>
            <p className="border-l-2 border-sky-400 pl-4 text-sm italic text-slate-600 dark:text-slate-300">
              If you believe your circumstances may be relevant to the ongoing Police Scotland enquiry, further
              information on contacting the enquiry officer will be added in Part 3 of this guide.
            </p>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="recovering-heading">
          <h2 id="recovering-heading" className={headingClass}>Recovering money owed to individual owners</h2>
          <div className={`${copyClass} mt-5`}>
            <p>
              The committee also sought legal guidance about the practical options available to owners who believe FIOR
              owes money directly to them.
            </p>
            <p>
              The guidance received was that, while collective legal action could potentially be considered, affected
              owners could need to be individually onboarded by a solicitor, provide identification and documentation,
              formally instruct the firm and potentially share responsibility for legal costs. For relatively modest
              individual amounts, this may not be the most proportionate way for owners to attempt to recover their
              money.
            </p>
            <p>
              Owners were therefore advised to consider whether the Scottish Simple Procedure may be appropriate for
              their individual circumstances. This is ultimately a decision for each individual owner.
            </p>
            <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white/60 p-5 dark:border-sky-400/20 dark:from-sky-400/10 dark:to-white/5 sm:p-6">
              <p className="font-medium text-slate-900 dark:text-white">
                The Scottish Courts and Tribunals Service states that Simple Procedure can be used for claims seeking
                payment of £5,000 or less. A solicitor is not required, although an owner can choose to use one.
              </p>
              <p className="mt-3 text-sm">
                Court fees apply when submitting a claim, although some people may qualify for fee exemption.
              </p>
              <a
                href="https://www.scotcourts.gov.uk/taking-action/simple-procedure/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Read the official Simple Procedure guidance
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-8 lg:p-10" aria-labelledby="next-heading">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">This owner resource</p>
            <h2 id="next-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">What happens next?</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {nextSteps.map(({ number, title, eyebrow, description, state, icon: Icon, current }) => (
                <article
                  key={number}
                  className={`flex min-h-full flex-col rounded-2xl border p-5 sm:p-6 ${
                    current
                      ? "border-sky-300/50 bg-sky-400/15"
                      : "border-white/10 bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-sky-300">{number}</span>
                    <Icon className="h-5 w-5 text-slate-300" aria-hidden="true" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">{eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{description}</p>
                  <span className={`mt-6 inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${current ? "bg-sky-300 text-slate-950" : "bg-white/10 text-slate-200"}`}>
                    {state}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-amber-200/80 bg-amber-50/75 p-6 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/[0.07] sm:p-8" aria-labelledby="important-heading">
          <div className="flex items-start gap-4">
            <Info className="mt-1 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            <div>
              <h2 id="important-heading" className="text-xl font-semibold text-slate-950 dark:text-white">Important information</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:text-[15px]">
                <p>This page has been prepared to help James Square owners understand the information currently available and the options they may wish to consider.</p>
                <p className="font-semibold text-slate-900 dark:text-white">It does not constitute legal advice.</p>
                <p>The James Square Owners Committee and its members are not acting as legal representatives and cannot determine whether an individual owner has a valid legal claim.</p>
                <p>Any decision to raise a Simple Procedure claim, seek legal advice or contact Police Scotland remains a matter for the individual owner.</p>
                <p>Information relating to court procedures should always be checked against the current guidance published by the Scottish Courts and Tribunals Service.</p>
              </div>
            </div>
          </div>
        </aside>
      </article>
    </div>
  );
}
