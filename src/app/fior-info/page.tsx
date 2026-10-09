import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  HandCoins,
  Hammer,
  Info,
  MessagesSquare,
  RefreshCw,
  Repeat,
  Scale,
  ShieldCheck,
  Undo2,
  UserRound,
  Users,
} from "lucide-react";
import CompanyStatusNotice from "./CompanyStatusNotice";
import FiorFaq from "./FiorFaq";
import PoliceScotland from "./PoliceScotland";
import RepaymentRequest from "./RepaymentRequest";
import Reveal from "./Reveal";
import { Parallax, ScrollLine, ScrollProgress } from "./ScrollMotion";
import SectionNav from "./SectionNav";

const pageTitle = "FIOR Property Assets | Owner Information | James Square";
const pageDescription =
  "An independent information resource for James Square owners about the change of factor from FIOR Property Assets and the options owners may wish to consider.";

// Link-preview image shown when the page is shared (WhatsApp, email, social).
// Kept under 300 KB so WhatsApp displays it.
const shareImage = "https://www.james-square.com/images/og/fior-info.jpg";
const shareImageAlt = "FIOR Property Update – information for James Square owners";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "https://www.james-square.com/fior-info" },
  // Shared with owners by direct link. Kept out of search engines; next.config
  // also sends a matching X-Robots-Tag header.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://www.james-square.com/fior-info",
    siteName: "James Square",
    type: "article",
    images: [{ url: shareImage, width: 1200, height: 628, alt: shareImageAlt, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: shareImage, alt: shareImageAlt }],
  },
};

const stickyTop = "lg:top-[calc(var(--nav-height)+4.5rem)]";
const anchorMargin = "!scroll-mt-[calc(var(--safe-top,0px)+var(--nav-height,4rem)+4.5rem)]";

const SIMPLE_PROCEDURE_URL = "https://www.scotcourts.gov.uk/taking-action/simple-procedure/";

const glassPanel =
  "rounded-3xl border border-white/70 bg-white/65 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]";
const h2Class = "text-[1.75rem] font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl";
const copyClass = "space-y-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-[1.8]";
const hoverLift =
  "transition duration-300 motion-safe:md:hover:-translate-y-0.5 md:hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] dark:md:hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]";

const statusMarkers = [
  { label: "Factor changed", value: "1 February 2026" },
  { label: "Owner reports", value: "Gathered by the committee" },
  { label: "This page", value: "General information only" },
];

const timeline = [
  {
    when: "Late 2025 / Early 2026",
    title: "Discussions about change of factor",
    body: "Discussions took place about FIOR’s intention to leave James Square, alongside concerns raised by some owners about aspects of the factoring service.",
    icon: MessagesSquare,
  },
  {
    when: "1 February 2026",
    title: "Myreside takes over",
    body: "Myreside Management became the new factor for James Square.",
    icon: RefreshCw,
    milestone: true,
  },
  {
    when: "Following the change",
    title: "Outstanding funds pursued",
    body: "Correspondence took place requesting the transfer of James Square funds to Myreside.",
    icon: HandCoins,
  },
  {
    when: "Owner concerns emerge",
    title: "Individual payments reported",
    body: "Owners contacted the committee regarding Direct Debits, payments and money paid towards proposed works.",
    icon: UserRound,
  },
  {
    when: "Committee questionnaire",
    title: "Information gathered",
    body: "The committee gathered information from affected owners to understand whether similar circumstances were being experienced across the development.",
    icon: ClipboardList,
  },
  {
    when: "Following the questionnaire",
    title: "Concerns reported to Police Scotland",
    body: "The committee passed the information it had gathered to Police Scotland. Any assessment of that information is a matter for Police Scotland.",
    icon: ShieldCheck,
  },
];

const concerns: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Direct Debit payments",
    body: "Direct Debit payments continuing after FIOR ceased acting as factor.",
    icon: Repeat,
  },
  {
    title: "Other payments",
    body: "Owners making payments which they believe were no longer due to FIOR.",
    icon: HandCoins,
  },
  {
    title: "Roof & repair funds",
    body: "Money requested from some owners towards proposed roof or repair works. Some owners reported that, as far as they were aware, the works associated with those payments had not been carried out.",
    icon: Hammer,
  },
  {
    title: "Repayment difficulties",
    body: "Owners reporting difficulties or delays when they later requested repayment.",
    icon: Undo2,
  },
];

const legalOptions = [
  {
    title: "Collective solicitor action",
    kicker: "Owners acting together",
    icon: Users,
    points: [
      "Owners would need to be individually onboarded and formally instruct the solicitor.",
      "Identification and documentation may be required.",
      "Legal costs may be incurred.",
      "Responsibility for costs may need to be shared between participating owners.",
    ],
  },
  {
    title: "Individual Simple Procedure",
    kicker: "Each owner acting for themselves",
    icon: Scale,
    points: [
      "An individual owner makes their own claim.",
      "The Scottish Courts and Tribunals Service states it can be used for claims seeking payment of £5,000 or less.",
      "A solicitor is not required, although an owner can choose to use one.",
      "Court fees apply, although some people may qualify for fee exemption.",
      "Official guidance is published by the Scottish Courts and Tribunals Service.",
    ],
  },
];

const journey = [
  {
    number: "01",
    href: "#part-1",
    kicker: "Understand the background",
    title: "Background & current position",
    description: "Why this page exists, what owners have reported and what has happened so far.",
  },
  {
    number: "02",
    href: "#part-2",
    kicker: "Recovering your money",
    title: "Repayment request & Simple Procedure",
    description: "This contains the repayment request and Simple Procedure preparation guide.",
  },
  {
    number: "03",
    href: "#part-3",
    kicker: "Further information",
    title: "Police Scotland & FAQs",
    description:
      "How to contact Police Scotland if you wish to, how to request reference details, and answers to common questions.",
  },
];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
      <span className="font-mono tracking-normal text-slate-400 dark:text-slate-500">{number}</span>
      <span className="h-px w-6 bg-sky-600/40 dark:bg-sky-300/40" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function FiorInfoPage() {
  return (
    <div className="relative isolate -mx-4 -my-8 overflow-x-clip px-4 pb-16 sm:-mx-6 sm:px-6 sm:pb-24">
      <ScrollProgress />
      <article className="mx-auto max-w-5xl">
        {/* ── Hero ─────────────────────────────────────────── */}
        <header id="part-1" className={`relative pb-10 pt-14 sm:pb-14 sm:pt-24 lg:pt-28 ${anchorMargin}`}>
          <Parallax distance={160} className="absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-10 h-[26rem] w-[26rem] rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/15 sm:h-[34rem] sm:w-[34rem]" />
          </Parallax>
          <Parallax distance={-90} className="absolute inset-0 -z-10">
            <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/15 sm:h-96 sm:w-96" />
          </Parallax>

          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 backdrop-blur dark:border-sky-400/20 dark:bg-white/5 dark:text-sky-300">
              Owner information
              <span className="h-1 w-1 rounded-full bg-sky-500/70" aria-hidden="true" />
              <span className="text-slate-500 dark:text-slate-400">Part 1</span>
            </p>
            <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              FIOR Property
              <br className="hidden sm:block" /> Assets
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl sm:leading-9">
              An independent information resource for James Square owners about outstanding funds, individual payments
              and the options owners may wish to consider.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 dark:border-white/10 dark:bg-white/10 sm:mt-12 sm:grid-cols-3">
              {statusMarkers.map(({ label, value }) => (
                <div key={label} className="bg-white/80 px-5 py-4 backdrop-blur dark:bg-slate-900/80">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {label}
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium text-slate-900 dark:text-slate-100">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </header>

        <SectionNav />

        {/* ── Introduction ─────────────────────────────────── */}
        <Reveal className="mt-10 border-t border-slate-200/80 pt-10 dark:border-white/10 sm:mt-14 sm:pt-14">
          <p className="max-w-3xl text-xl leading-9 tracking-[-0.01em] text-slate-800 dark:text-slate-100 sm:text-2xl sm:leading-[1.6]">
            This page has been created to bring together information for James Square owners following the departure of
            FIOR Property Assets as factor and concerns raised by owners regarding money they believe remains
            outstanding.
          </p>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            It describes what the committee understands to have happened, what owners have reported and where to find
            official guidance. Reports from owners are described as reports: they have not been tested or verified by a
            court or any other body. This page is general information, not legal advice.
          </p>
        </Reveal>

        <Reveal className="mt-8 max-w-3xl">
          <CompanyStatusNotice />
        </Reveal>

        <div className="mt-20 space-y-24 sm:mt-28 sm:space-y-32">
          {/* ── 1.1 Background + timeline ──────────────────── */}
          <section aria-labelledby="background-heading" className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div className={`lg:sticky ${stickyTop} lg:self-start`}>
              <Reveal>
                <SectionLabel number="1.1">Background</SectionLabel>
                <h2 id="background-heading" className={`${h2Class} mt-4`}>
                  What has happened so far
                </h2>
                <div className={`${copyClass} mt-6`}>
                  <p>
                    FIOR Property Assets ceased acting as factor for James Square at the end of January 2026, with
                    Myreside Management taking over from 1 February 2026.
                  </p>
                  <p>
                    The change followed discussions during the preceding months regarding FIOR&apos;s intention to leave
                    James Square and concerns from owners about aspects of the factoring service and work which owners
                    understood FIOR was responsible for arranging or completing.
                  </p>
                  <p>
                    Following the change of factor, correspondence took place requesting that money and communal funds
                    held in connection with James Square be transferred to Myreside Management. At the time this page
                    was prepared, the committee&apos;s understanding was that some funds remained outstanding and that
                    Myreside was pursuing this separately.
                  </p>
                </div>
                <p className="mt-6 border-l-2 border-sky-500 pl-4 text-[15px] font-medium leading-7 text-slate-900 dark:border-sky-400 dark:text-white">
                  Communal James Square funds are separate from any money that may be owed directly to individual owners.
                </p>
              </Reveal>
            </div>

            <ol className="relative" aria-label="Timeline of events">
              <ScrollLine
                className="bottom-6 left-[1.1875rem] top-6"
                trackClassName="bg-gradient-to-b from-slate-300/80 to-slate-300/0 dark:from-white/15 dark:to-white/0"
                fillClassName="bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300/40 dark:from-sky-400 dark:via-sky-400/70 dark:to-sky-400/20"
              />
              {timeline.map(({ when, title, body, icon: Icon, milestone }, i) => (
                <Reveal as="li" key={title} delay={i} className="relative pb-8 pl-16 last:pb-0">
                  <span
                    className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${
                      milestone
                        ? "border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950"
                        : "border-slate-200 bg-white text-sky-700 dark:border-white/15 dark:bg-slate-900 dark:text-sky-300"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  <div className={`${glassPanel} ${hoverLift} rounded-2xl px-5 py-4 sm:px-6 sm:py-5`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                      {when}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                    <p className="mt-1.5 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </section>

          {/* ── 1.2 Concerns raised by owners (full width) ─── */}
          <section aria-labelledby="concerns-heading" className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 border-y border-slate-200/70 bg-white/45 dark:border-white/[0.06] dark:bg-white/[0.025]"
              aria-hidden="true"
            />
            <div className="py-16 sm:py-20">
              <Reveal className="max-w-3xl">
                <SectionLabel number="1.2">Owner reports</SectionLabel>
                <h2 id="concerns-heading" className={`${h2Class} mt-4`}>
                  Concerns raised by owners
                </h2>
                <div className={`${copyClass} mt-6`}>
                  <p>
                    After Myreside Management took over, the James Square Owners Committee began receiving reports from
                    individual owners who believed they had personally paid money to FIOR which should be returned. The
                    committee has not verified each report and cannot say whether any money is legally owed.
                  </p>
                  <p>Examples reported to the committee included:</p>
                </div>
              </Reveal>

              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
                {concerns.map(({ title, body, icon: Icon }, i) => (
                  <Reveal as="li" key={title} delay={i} className="h-full">
                    <div className={`${glassPanel} ${hoverLift} flex h-full flex-col rounded-2xl p-5 sm:p-6`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 text-base font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal className="mt-6">
                <p className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  <span>
                    These are circumstances reported by individual owners. They are not findings of fact. Their inclusion
                    here does not mean that FIOR, or any director or employee of FIOR, has acted unlawfully or committed
                    any wrongdoing.
                  </span>
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── 1.3 Information gathered ──────────────────── */}
          <section aria-labelledby="information-heading" className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <Reveal>
              <SectionLabel number="1.3">Committee questionnaire</SectionLabel>
              <h2 id="information-heading" className={`${h2Class} mt-4`}>
                Information gathered by the committee
              </h2>
              <div className={`${copyClass} mt-6`}>
                <p>
                  As similar concerns were being raised by more than one owner, the James Square Owners Committee
                  prepared a questionnaire to better understand the scale and nature of the issue. A number of owners
                  responded and described circumstances in which they believed money remained due back to them.
                </p>
                <p>
                  The purpose of gathering this information was to establish whether individual reports appeared to form
                  part of a wider issue and to allow the committee to determine what appropriate steps could be taken.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1} className="lg:pt-16">
              <div className={`${glassPanel} p-6 sm:p-7`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Owner privacy
                </p>
                <p className="mt-2 text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                  No owners&apos; names, property numbers, amounts, bank information, questionnaire responses or other
                  personally identifiable information are published on this page.
                </p>
              </div>
            </Reveal>
          </section>

          {/* ── 1.4 Police Scotland (feature) ─────────────── */}
          <Reveal>
            <section
              aria-labelledby="police-heading"
              className="relative overflow-hidden rounded-[2rem] border border-slate-300/60 bg-gradient-to-br from-slate-100/90 via-white/80 to-sky-50/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-sky-950/50 dark:shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-10 lg:p-12"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10"
                aria-hidden="true"
              />
              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
                <div>
                  <SectionLabel number="1.4">Police Scotland</SectionLabel>
                  <h2 id="police-heading" className={`${h2Class} mt-4`}>
                    Information provided to Police Scotland
                  </h2>
                  <div className={`${copyClass} mt-6`}>
                    <p>
                      Following the information received from owners, the committee contacted Police Scotland and
                      passed on information about the concerns which had been reported.
                    </p>
                    <p>
                      The purpose was to make Police Scotland aware that a number of owners had reported difficulty
                      recovering money, so that Police Scotland could decide whether any action was appropriate. That
                      decision is for Police Scotland alone. The committee does not act on behalf of Police Scotland and
                      cannot comment on any police enquiry.
                    </p>
                    <p>
                      Reporting a concern to the police does not mean that an offence has been committed. This page does
                      not state or imply that FIOR, or any director or employee of FIOR, has committed an offence or is
                      guilty of any wrongdoing.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:pt-12">
                  <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.05]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      What the committee has done
                    </p>
                    <p className="mt-2 flex items-center gap-2.5 text-lg font-semibold text-slate-950 dark:text-white">
                      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/15 dark:bg-sky-400 dark:ring-sky-400/15" />
                      </span>
                      Concerns reported
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-300/90 p-5 dark:border-white/15">
                    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">
                      Wish to contact Police Scotland?
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Part 3 explains how to contact Police Scotland and how to request the reference details, if you
                      decide that you wish to. You do not need to take any action through this page.
                    </p>
                    <a
                      href="#part-3"
                      className="mt-3 inline-flex items-center gap-1 rounded text-sm font-semibold text-sky-700 underline decoration-sky-400/50 underline-offset-4 hover:decoration-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300"
                    >
                      Go to Part 3
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          {/* ── 1.5 Legal options comparison ──────────────── */}
          <section aria-labelledby="recovering-heading">
            <Reveal className="max-w-3xl">
              <SectionLabel number="1.5">Legal guidance</SectionLabel>
              <h2 id="recovering-heading" className={`${h2Class} mt-4`}>
                Recovering money owed to individual owners
              </h2>
              <div className={`${copyClass} mt-6`}>
                <p>
                  The committee also sought general legal guidance about the practical options available to owners who
                  believe FIOR owes money directly to them. Below is the committee&apos;s summary of that general
                  guidance. It was not advice about any individual owner&apos;s circumstances and should not be relied
                  on as legal advice.
                </p>
              </div>
            </Reveal>

            <div className="relative mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
              {legalOptions.map(({ title, kicker, icon: Icon, points }, i) => (
                <Reveal key={title} delay={i} className="h-full">
                  <div className={`${glassPanel} ${hoverLift} flex h-full flex-col p-6 sm:p-8`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-200 dark:ring-white/10">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {kicker}
                      </p>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                      {title}
                    </h3>
                    <ul className="mt-5 space-y-3" role="list">
                      {points.map((point) => (
                        <li key={point} className="flex gap-3 text-[15px] leading-6 text-slate-700 dark:text-slate-300">
                          <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500/80" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8">
              <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white/60 p-6 dark:border-sky-400/20 dark:from-sky-400/[0.08] dark:to-white/[0.03] sm:p-8">
                <div className={`${copyClass} max-w-3xl`}>
                  <p>
                    The committee&apos;s understanding of the guidance was that, while collective legal action could
                    potentially be considered, affected owners might need to be individually onboarded by a solicitor,
                    provide identification and documentation, formally instruct the firm and potentially share
                    responsibility for legal costs. For relatively modest individual amounts, this may not be the most
                    proportionate way for owners to attempt to recover their money.
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Owners may therefore wish to consider whether the Scottish Simple Procedure is appropriate for their
                    individual circumstances, or to take their own independent legal advice. Whether to request
                    repayment or take any legal action is a decision for each individual owner.
                  </p>
                </div>
                <a
                  href={SIMPLE_PROCEDURE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  View official Simple Procedure guidance
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          </section>

          {/* ── 1.6 What happens next ─────────────────────── */}
          <section aria-labelledby="next-heading">
            <Reveal className="max-w-3xl">
              <SectionLabel number="1.6">This owner resource</SectionLabel>
              <h2 id="next-heading" className={`${h2Class} mt-4`}>
                What happens next?
              </h2>
              <p className={`${copyClass} mt-5`}>
                This page is a guided resource for James Square owners in three parts. Each part is available now – go
                straight to the one you need. Using any part of it is optional.
              </p>
            </Reveal>

            <ol className="relative mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6" aria-label="FIOR owner resource parts">
              {/* connector: vertical on mobile, horizontal on desktop */}
              <ScrollLine
                className="bottom-10 left-[1.4375rem] top-10 lg:hidden"
                trackClassName="bg-slate-300/60 dark:bg-white/10"
                fillClassName="bg-gradient-to-b from-sky-400 via-sky-300/80 to-sky-300/50 dark:via-sky-400/60 dark:to-sky-400/30"
              />
              <span
                className="absolute left-[16.66%] right-[16.66%] top-[1.4375rem] hidden h-px bg-gradient-to-r from-sky-400 via-sky-300/70 to-slate-300/60 dark:via-sky-400/40 dark:to-white/10 lg:block"
                aria-hidden="true"
              />
              {journey.map(({ number, href, kicker, title, description }, i) => (
                <Reveal as="li" key={number} delay={i} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0">
                  <span
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-400 bg-white text-sm font-semibold text-sky-700 ring-4 ring-sky-400/15 dark:border-sky-400/70 dark:bg-slate-900 dark:text-sky-300"
                    aria-hidden="true"
                  >
                    <span className="font-mono">{number}</span>
                  </span>

                  <a
                    href={href}
                    className="group flex w-full flex-1 flex-col rounded-3xl border border-sky-200/80 bg-white/80 p-5 backdrop-blur-xl transition hover:border-sky-300 hover:shadow-[0_18px_50px_rgba(14,165,233,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-sky-400/20 dark:bg-slate-900/60 dark:hover:border-sky-400/40 dark:focus-visible:ring-offset-slate-950 sm:p-6 lg:mt-6"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500">Part {number}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-sky-800 dark:bg-sky-400/15 dark:text-sky-200">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                        Available
                      </span>
                    </span>
                    <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                      {kicker}
                    </span>
                    <span className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</span>
                    <span className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</span>
                    <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-sky-700 dark:text-sky-300">
                      Go to Part {Number(number)}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </ol>
          </section>

          {/* ── Part 2: Step 1 – Request your money back ──── */}
          <RepaymentRequest />

          {/* ── Part 3: Police Scotland, FAQs and resources ── */}
          <PoliceScotland />
          <FiorFaq />
        </div>

        {/* ── Important information (separate, understated) ── */}
        <Reveal className="mt-24 border-t border-slate-200/80 pt-10 dark:border-white/10 sm:mt-32">
          <aside
            aria-labelledby="important-heading"
            className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5 backdrop-blur dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-7"
          >
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <div>
                <h2 id="important-heading" className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  Important information
                </h2>
                <div className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  <p>
                    This page is an independent information resource for James Square owners. It has been prepared to
                    help owners understand the background to concerns involving FIOR Property Assets and the options
                    which may be available to them.
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    It is provided for general information only and is not legal advice.
                  </p>
                  <p>
                    James-Square.com and the James Square Owners Committee are not acting on behalf of Police Scotland,
                    Companies House, the Scottish Courts and Tribunals Service or any legal adviser. The committee and its
                    members are not legal representatives and cannot determine whether an individual owner has a valid
                    legal claim.
                  </p>
                  <p>
                    Statements on this page about what owners have reported are reports, not findings of fact. Any
                    information provided to Police Scotland is for Police Scotland to assess. Reporting a concern does not
                    establish that FIOR Property Assets, its directors, employees or any other person has committed an
                    offence or acted unlawfully.
                  </p>
                  <p>
                    Company information comes from the Companies House register and may change. Check the live record
                    before relying on it.
                  </p>
                  <p>
                    Each owner is responsible for deciding whether to request repayment, commence court proceedings,
                    obtain legal advice or provide information to Police Scotland. If you are unsure about your own
                    position, consider obtaining independent legal advice.
                  </p>
                  <p>
                    Court procedures, fees, forms and deadlines may change. Owners should always check the current
                    Scottish Courts and Tribunals Service guidance and follow instructions issued by the court in their
                    individual case.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </Reveal>
      </article>
    </div>
  );
}
