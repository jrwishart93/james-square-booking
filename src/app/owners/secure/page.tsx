'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Calendar, ChevronDown, ClipboardCheck, ExternalLink, FileText, Mail, X } from 'lucide-react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OWNERS_ACCESS_KEY = 'owners_secure_access';
const SURVEY_DOCUMENTS = [
  { label: 'Elevations inspection report', href: '/docs/survey/21049_ElevationsReport_01.pdf' },
  { label: 'Roof report: 01, 57 and 59',   href: '/docs/survey/21049_Report_01_57_59Roof.pdf' },
  { label: 'Roof report: Block 39',         href: '/docs/survey/21049_Report_39_Roof.pdf' },
  { label: 'Roof report: Blocks 45 and 51', href: '/docs/survey/21049_Report_45_51_Roof.pdf' },
  { label: 'Roof report: Block 55',         href: '/docs/survey/21049_Report_55_Roof.pdf' },
  { label: 'Roof report: Block 61',         href: '/docs/survey/21049_Report_61_Roof.pdf' },
  { label: 'Roof report: Block 65',         href: '/docs/survey/21049_Report_65_Roof.pdf' },
];

const AGM_AGENDA_PATH = '/docs/survey/James Square-  AGM  Agenda - 2026.06.04.pdf';
const AGM_FACTORS_REPORT_PATH = '/docs/survey/James Square-  AGM  - Factors Report - 2026.06.04.pdf';
const AGM_MINUTES_PATH = '/docs/survey/JSPA - AGM - 4th June 2026 - Minutes.pdf';
const AGM_AGENDA_HREF = encodeURI(AGM_AGENDA_PATH);
const AGM_FACTORS_REPORT_HREF = encodeURI(AGM_FACTORS_REPORT_PATH);
const AGM_MINUTES_HREF = encodeURI(AGM_MINUTES_PATH);
const AGM_DATE_THRESHOLD = new Date('2026-06-05T00:00:00');
const AGENDA_SUMMARY_ITEMS = [
  'Previous factor update',
  'Development finances',
  'Sinking fund balance',
  'Outstanding debts',
  'Committee members and block representatives',
  'Swimming pool repairs and refurbishment',
  'Building condition report',
  'Building repair fund restart',
  'Tree pruning',
  'Caretaker salary',
  'Council tax banding',
];
const FACTORS_REPORT_HIGHLIGHTS = [
  'Myreside Management taking over management on 1 February 2026',
  'Building insurance and claims process',
  'Myreside owner portal',
  'Electricity account transition and meter readings',
  'Roof, gutter and downpipe works',
  'Proposed updated external building condition survey',
  'Pool closure, safety review and repair options',
  'Confirmation that RAAC was not found in the pool structure',
  'Communal repairs, cleaning and grounds maintenance',
  'Fire safety inspections',
  'Development debt position',
  'Sinking fund position, including Trinity transferring £25,661.81 on 7 May 2026',
];
const glassPanel =
  'rounded-2xl border border-white/40 bg-white/65 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5';

const OwnersSecurePage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem(OWNERS_ACCESS_KEY) === 'true';
    if (!hasAccess) {
      router.replace('/owners');
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  const easeOut = [0.16, 1, 0.3, 1] as const;
  const containerTransition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: easeOut,
    staggerChildren: prefersReducedMotion ? 0 : 0.08,
  };
  const itemTransition = {
    duration: prefersReducedMotion ? 0 : 0.28,
    ease: easeOut,
  };

  const containerVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: containerTransition,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: itemTransition },
  };

  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <motion.div
        className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header variants={itemVariants} className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">Owners area</h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            This section contains meeting information, documents, and voting intended for James Square owners only.
          </p>
        </motion.header>

        <motion.div variants={itemVariants} className="mt-8">
          <div
            className="flex items-start gap-4 p-6 rounded-2xl
                  bg-white/80 border border-black/10
                  shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                  dark:bg-white/5 dark:border-white/15
                  dark:shadow-[0_16px_60px_rgba(0,0,0,0.3)]"
          >
            <div
              className="flex items-center justify-center
                    w-11 h-11 rounded-xl
                    bg-cyan-500/10 text-cyan-600
                    dark:text-cyan-300"
            >
              <ClipboardCheck size={22} />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Owners Voting</h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Vote on current owners’ matters and view live results for James Square.
              </p>

              <a
                href="/owners/secure/voting"
                className="inline-flex items-center gap-2 mt-3
                   px-4 py-2 rounded-lg
                   bg-cyan-600 text-white text-sm font-medium
                   transition-colors hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
              >
                Go to owners voting
              </a>
            </div>
          </div>
        </motion.div>

        <div className="space-y-10">
          <motion.div variants={itemVariants}>
            <OwnerSectionGroup
              id="current-agm-2026"
              eyebrow="Current owners business"
              title="Current / AGM 2026"
              description="Current AGM-related information, Fior owner questionnaire details, and funds/payment updates are grouped here for easier review before the older and general owner updates below."
            >
              <Agm2026InformationSection />
              <FiorQuestionnaireCallout />
              <FiorPaymentsFundsUpdateSection />
            </OwnerSectionGroup>
          </motion.div>

          <motion.div variants={itemVariants}>
            <OwnerSectionGroup
              id="latest-owner-updates"
              eyebrow="Recent communications"
              title="Latest owner updates"
              description="Recent committee and owner updates are grouped together so current context is easier to find."
            >
              <CommitteeUpdateSection />
              <AprilOwnersUpdateSection />
            </OwnerSectionGroup>
          </motion.div>

          <motion.div variants={itemVariants}>
            <OwnerSectionGroup
              id="documents-and-reports"
              eyebrow="Supporting documentation"
              title="Documents and reports"
              description="Reference documents and supporting reports for owners are grouped separately from meeting updates."
            >
              <SurveyDocumentsSection />
            </OwnerSectionGroup>
          </motion.div>

          <motion.div variants={itemVariants}>
            <OwnerSectionGroup
              id="archive-previous-factor-meetings"
              eyebrow="Archived context"
              title="Archive / previous factor and meetings"
              description="Previous factor updates and earlier meeting information remain available here for background and reference."
            >
              <SgmSection />
              <FiorFactorUpdateSection />
              <AgmSection />
            </OwnerSectionGroup>
          </motion.div>
        </div>
      </motion.div>
    </GradientBG>
  );
};

export default OwnersSecurePage;

function OwnerSectionGroup({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
          {eyebrow}
        </p>
        <h2 id={headingId} className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="max-w-3xl text-sm md:text-base text-slate-700 dark:text-slate-200">{description}</p>
      </header>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Agm2026InformationSection() {
  const agmHeld = new Date() >= AGM_DATE_THRESHOLD;

  return (
    <GlassCard titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <article className="rounded-xl border border-cyan-400/25 bg-cyan-500/5 p-4 space-y-5 sm:p-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">AGM 2026 Information</h2>
            <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              AGM documents available
            </span>
          </div>
          <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {agmHeld ? 'AGM Held – 4 June 2026' : 'Upcoming AGM – 4 June 2026'}
            </h3>
            {agmHeld ? (
              <>
                <p>The James Square Annual General Meeting was held on Thursday 4 June 2026.</p>
                <p>
                  The official minutes of the meeting are now available, alongside the AGM page, agenda and factors
                  report, using the links below. Owners are encouraged to review the minutes for a full record of the
                  discussions, decisions and agreed actions.
                </p>
              </>
            ) : (
              <>
                <p>
                  The James Square Annual General Meeting will take place on Thursday 4 June 2026 at 7:00pm via
                  Microsoft Teams.
                </p>
                <p>
                  Owners are encouraged to attend where possible. The AGM will include updates on the management of the
                  development, finances, sinking fund, pool repairs, building condition report, committee appointments,
                  and priorities for the year ahead.
                </p>
                <p>The AGM page, agenda and factors report are available using the links below.</p>
              </>
            )}
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={AGM_MINUTES_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            View AGM Minutes
          </a>
          <Link
            href="/agm"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Open AGM Page
          </Link>
          <a
            href={AGM_AGENDA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            View AGM Agenda
          </a>
          <a
            href={AGM_FACTORS_REPORT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            View Factors Report
          </a>
        </div>

        <a
          href="https://www.james-square.com/agm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          Public AGM link: www.james-square.com/agm
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <div className="space-y-3">
          <InfoAccordion title="Agenda Summary" controlsId="owners-agm-2026-agenda-summary">
            <p>{agmHeld ? 'Key items listed for discussion included:' : 'Key items due to be discussed include:'}</p>
            <ul className="list-disc ms-5 space-y-1">
              {AGENDA_SUMMARY_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoAccordion>
          <InfoAccordion title="Factors Report Highlights" controlsId="owners-agm-2026-factors-report-highlights">
            <p>{agmHeld ? 'The factors report included updates on:' : 'The factors report includes updates on:'}</p>
            <ul className="list-disc ms-5 space-y-1">
              {FACTORS_REPORT_HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoAccordion>
        </div>

        <p className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-3 text-sm font-medium text-slate-800 dark:text-slate-100">
          The minutes of the AGM held on 4 June 2026 are now available — use the “View AGM Minutes” button above to
          read them.
        </p>
      </article>
    </GlassCard>
  );
}

function FiorQuestionnaireCallout() {
  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-slate-800 dark:text-slate-100 md:p-5 md:text-base">
      <p>
        This questionnaire is for owners who may have made payments to Fior, paid Fior invoices covering periods after
        the transfer to Myreside, or contributed to Fior-held roof/repair funds.{' '}
        <Link
          href="/fior-questionnaire"
          className="font-semibold text-cyan-700 underline decoration-cyan-400/70 underline-offset-2 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          https://www.james-square.com/fior-questionnaire
        </Link>
        .
      </p>
    </div>
  );
}

const FIOR_PAYMENTS_FUNDS_STATS = [
  { value: '14', label: 'Questionnaire responses received' },
  { value: '£7,477+', label: 'Owner-reported payments/invoices relating to Fior' },
  { value: '£1,280+', label: 'Owner-reported roof and repair fund contributions' },
];

const FIOR_EMAIL_CORRESPONDENCE = [
  {
    title: 'Initial email to Fior – 20 May 2026',
    content: `From: Jamie Wishart
Sent: Wednesday, May 20, 2026 21:21
To: Pedrom aghabala <pedrom@fiorassetandproperty.com>
Cc: James Square Committee <committee@james-square.com>; Ania <ania@myreside-management.co.uk>; Leigh Collins <leigh@myreside-management.co.uk>
Subject: James Square Owner Funds / Request for Update

Dear Pedrom,

I just wanted to get in touch regarding a growing number of queries being raised by owners at James Square relating to outstanding balances and payments made to Fior around the transfer period to Myreside Management. These include annual factor payments paid in advance, roof repair contributions and additional payments made around January and February 2026.

A number of owners have now contacted the committee looking for updates regarding refunds, reconciliations and monies potentially still earmarked for James Square. Several owners have also advised that they have attempted to contact Fior directly but remain unclear on the current position.

I appreciate the transfer from Fior to Myreside happened fairly quickly and I understand that working through owner balances across the development may take some time. However, we are now approaching the end of May and owners are understandably beginning to ask for some indication of likely timescales.

During the previous AGM, and within the minutes issued afterwards, there was reference to approximately £19,371 being held as a saving or surplus within the budget. I just wanted to ask whether these funds, along with any additional monies collected for roof works or other James Square matters, may now be capable of being transferred across to Myreside Management where appropriate.

Ania at Myreside Management is now the property manager for James Square and I am sure she would be happy to liaise directly with yourself should any arrangements require to be made regarding transfer of funds or reconciliation information.

At this stage, I am simply looking for some form of update that can be passed onto owners ahead of the upcoming AGM in a couple of weeks time, along with any rough indication of when reconciliations or repayments are likely to be completed.

A significant number of owners have now contacted the committee regarding these concerns and I suspect there may potentially be further owners still trying to establish their positions. I am sure you have also received a number of emails directly from owners yourself and are currently working through responding to everyone.

For transparency, I have BCC’d in the owners who have contacted the committee directly regarding these matters so they are aware this email has been sent. I have not shared owners’ personal email addresses directly, however some owners may wish to follow matters up further following this email.

The information provided to the committee will also be passed onto Ania and Leigh at Myreside Management for awareness. I have not included owners’ names or payment details within this email, however should it assist with progressing matters or helping owners receive updates, further details can be discussed through Myreside Management where appropriate.

Many thanks in advance and we look forward to hearing from you.

Kind regards,
Jamie Wishart
On behalf of the James Square Committee`,
  },
  {
    title: 'Response from Fior – 21 May 2026',
    content: `From: Pedrom aghabala <pedrom@fiorassetandproperty.com>
Sent: 21 May 2026 14:54
To: Jamie Wishart
Cc: James Square Committee <committee@james-square.com>; Ania <ania@myreside-management.co.uk>; Leigh Collins <leigh@myreside-management.co.uk>
Subject: Re: James Square Owner Funds / Request for Update

Good afternoon,

I hope this finds you well, we have been discussing this with various owners who have contacted us.

We are just completing the final reconciliation, roof payments and accounts for all owners. Im afraid one of the main issues was some letting agents and new owners used the wrong reference number when making payment, therefore we have had to spend many hours manually correcting hundreds of transactions.

We will indeed handover all the roof funds with a full summary to Myreside for each block, along with various other documentation.

I am afraid I have been off dealing with an unforeseen grievance, but I am back now and we are prioritising this transition.

Kind regards,

Pedrom Aghabala
Director
Fior Asset & Property

Head Office: 0333 4440586
Mobile: 07548910618
Email: info@fiorassetandproperty.com
Web: www.fiorassetandproperty.com`,
  },
  {
    title: 'Follow-up email to Fior – 3 June 2026',
    content: `Dear Pedrom,

Thank you for your response.

I appreciate that the reconciliation process has been complicated by payments being made with incorrect references and that this has required a significant amount of manual work. I also appreciate that you have confirmed that the roof funds and other monies held on behalf of James Square will be transferred to Myreside once the reconciliation is complete.

However, I think it is important to highlight that there are now well over a dozen owners who have contacted either the Committee, Myreside, or Fior regarding monies that remain outstanding. Based on the information received to date, the total amount potentially owed to owners appears to be well into the thousands of pounds.

Whilst I appreciate there may have been genuine administrative and accounting difficulties, these issues were first brought to owners' attention in January and we are now into June. I believe it is reasonable for owners to expect a clear indication as to when these matters will finally be resolved.

The Committee's preference is that this is settled fairly, respectfully and cooperatively between all parties. We would much rather see funds returned to owners, or transferred to Myreside where appropriate, without the need for any formal action.

With that in mind, can you please provide a clear timescale for completion of the reconciliation process and the transfer of funds?

Given the length of time these matters have already been under discussion, I would suggest that 1 July 2026, approximately 28 days from now, would represent a reasonable target date for the transfer of outstanding funds and completion of the handover process.

I hope we can reach a sensible and civilised resolution without the need for owners to seek legal representation. Court action would inevitably consume considerable time and resources for everyone involved and would likely result in additional costs. I do not believe that would be in anyone's interests. However, owners are increasingly seeking certainty and it is becoming difficult to provide reassurance without a clear commitment and timescale.

I would therefore be grateful if you could confirm whether the proposed timeframe is achievable, or alternatively provide a realistic completion date for the transfer of funds and final reconciliation.

Kind regards,
Jamie`,
  },
];

function FiorPaymentsFundsUpdateSection() {
  const [fullUpdateOpen, setFullUpdateOpen] = useState(false);

  return (
    <GlassCard titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <article className="rounded-xl border border-cyan-300/25 bg-cyan-500/5 p-6 space-y-5">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Fior Payments &amp; Funds Update</h2>
            <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              Owner questionnaire
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            Myreside Management took over responsibility for James Square on <strong>1 February 2026</strong>. Since then,
            owners have been invited to share information through the{' '}
            <Link
              href="/fior-questionnaire"
              className="font-semibold text-cyan-700 underline decoration-cyan-400/70 underline-offset-2 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
            >
              Fior questionnaire
            </Link>{' '}
            about payments, invoices, and roof or repair fund contributions connected with the previous factoring
            arrangements.
          </p>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            The figures below are based only on questionnaire responses received so far. They may include payments made
            after the transfer date, invoices paid in advance which covered periods beyond 1 February 2026, and
            contributions made towards roof or repair works which owners understand have not yet been carried out.
          </p>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            The total position may change as further information is received or verified.
          </p>
          <p className="rounded-xl border border-amber-300/35 bg-amber-500/10 p-3 text-sm text-slate-800 dark:text-slate-100">
            The questionnaire figures are owner-reported and indicative only. They have not been independently verified
            and should not be treated as confirmed balances, evidenced payments, or verified liabilities.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {FIOR_PAYMENTS_FUNDS_STATS.map((stat) => (
            <div key={stat.label} className={`${glassPanel} flex min-h-28 flex-col justify-center gap-2`}>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <ExpandButton
            open={fullUpdateOpen}
            setOpen={setFullUpdateOpen}
            labelWhenClosed="Read Full Update"
            labelWhenOpen="Hide Full Update"
            controlsId="fior-payments-funds-update-details"
          />

          <AnimatePresence initial={false}>
            {fullUpdateOpen && (
              <motion.div
                id="fior-payments-funds-update-details"
                className={`${glassPanel} space-y-4 overflow-hidden`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <SectionText heading="Background">
                  <p>Myreside Management became the appointed factor for James Square on 1 February 2026.</p>
                  <p>
                    Following the change in factor, a number of owners raised concerns regarding payments made to Fior
                    Asset &amp; Property, invoices covering periods beyond the transfer date, and monies collected for roof
                    repairs and other works which have not yet been carried out.
                  </p>
                  <p>
                    In order to better understand the potential scale of these concerns, information was gathered from
                    owners through a questionnaire circulated during May 2026.
                  </p>
                </SectionText>

                <SectionText heading="Questionnaire Results">
                  <p>The questionnaire has received 14 owner responses to date.</p>
                  <p>
                    Based on the information voluntarily provided, owners have reported £7,477+ relating to payments
                    made to Fior and £1,280+ in roof and repair fund contributions.
                  </p>
                  <p>
                    These figures should be regarded as indicative only and have not been independently verified.
                  </p>
                  <p>
                    Importantly, these amounts do not solely relate to payments made after 1 February 2026. The responses
                    include a mixture of:
                  </p>
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Payments which owners believe continued to be made to Fior after the transfer to Myreside Management;</li>
                    <li>
                      Payments made against Fior invoices which covered periods extending beyond February 2026 and, in
                      some cases, through to May 2026;
                    </li>
                    <li>
                      Contributions made towards roof repairs or other works which owners understand have not
                      subsequently been carried out.
                    </li>
                  </ul>
                  <p>
                    The purpose of the questionnaire was to establish whether a wider issue existed and to provide an
                    initial indication of its potential scale. The actual amount potentially affected may be higher, as
                    not all owners completed the questionnaire and some owners may not yet be aware that payments were
                    made covering periods after Fior ceased acting as factor.
                  </p>
                </SectionText>

                <SectionText heading="Correspondence with Fior">
                  <p>
                    Correspondence has been ongoing with Fior Asset &amp; Property regarding the concerns raised by owners
                    and the reconciliation of monies understood to be held on behalf of the development.
                  </p>
                  <p>
                    On 20 May 2026, concerns raised by owners were formally presented to Pedrom Aghabala, Director of
                    Fior Asset &amp; Property, with a request for clarification regarding account reconciliation and the
                    transfer of funds.
                  </p>
                  <p>
                    On 21 May 2026, Fior confirmed that a final reconciliation process is underway and advised that roof
                    funds and other monies held on behalf of James Square would be transferred to Myreside Management
                    once that process is complete. Delays were attributed to payment reference discrepancies and the need
                    for manual reconciliation of accounts.
                  </p>
                  <p>
                    A further email was sent on 3 June 2026 requesting a clear timetable for completion of the
                    reconciliation process and transfer of funds. A suggested target date of 1 July 2026 was proposed as
                    a reasonable timeframe for conclusion of the matter.
                  </p>
                </SectionText>

                <SectionText heading="What Happens Next">
                  <p>
                    Owners who believe they may have made payments to Fior, paid invoices covering periods after the
                    transfer date, or contributed towards roof and repair funds are encouraged to retain copies of
                    invoices, bank statements and payment confirmations for their own records.
                  </p>
                  <p>
                    Further updates will be published as additional information becomes available. Clarification is still
                    being sought regarding the reconciliation process, the transfer of development funds, and the return
                    or allocation of any monies identified as belonging to James Square owners.
                  </p>
                </SectionText>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">View Email Correspondence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Email text is shown below for transparency.</p>
          </div>

          <div className="space-y-3">
            {FIOR_EMAIL_CORRESPONDENCE.map((email, index) => (
              <EmailAccordion
                key={email.title}
                title={email.title}
                content={email.content}
                controlsId={`fior-email-correspondence-${index + 1}`}
              />
            ))}
          </div>
        </div>
      </article>
    </GlassCard>
  );
}

function SurveyDocumentsSection() {
  return (
    <GlassCard
      title="Building survey reports"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
    >
      <div className="space-y-4">
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
          These PDF reports are from a building survey of James Square. They cover the condition of elevations and
          roofs across all blocks.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SURVEY_DOCUMENTS.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-300" aria-hidden="true" />
                {doc.label}
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-400">↗</span>
            </a>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function AprilOwnersUpdateSection() {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <article className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-6 space-y-4">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Owners Update – James Square</h2>
            <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              April 2026
            </span>
            <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              Latest update
            </span>
          </div>
        </header>

        <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
          <p>
            Since Myreside Management took over earlier this year, a number of issues across James Square have been
            identified and are now being actively worked through. There has been steady progress behind the scenes,
            with the committee meeting regularly with the Myreside team to move matters forward.
          </p>
          <p>
            While there is still work to be done, things are moving in the right direction. Owners are asked to
            continue supporting this process and ensure all payments and contact details are now updated with Myreside
            Management. The AGM was held on Thursday 4 June 2026; please visit the{' '}
            <Link href="/agm" className="font-semibold text-cyan-700 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
              AGM page
            </Link>
            {' '}for the meeting summary, agenda and factors report. The full minutes are now available in the AGM
            2026 Information section above.
          </p>
        </div>

        <ExpandButton
          open={open}
          setOpen={setOpen}
          labelWhenClosed="Read full April update"
          labelWhenOpen="Hide full update"
          controlsId="april-update-details"
        />

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="april-update-details"
              className="space-y-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Since Myreside Management took over responsibility for James Square on 1 February 2026, there has been
                a significant amount of work ongoing to understand, stabilise, and improve the condition of the
                development.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Ania Jennings was appointed as Property Manager and was immediately dealing with a number of urgent
                issues. From the outset, there were problems relating to the pool plant room, including a leak which
                led to electrical faults and associated damage. This required immediate action, including isolating
                power and closing the pool area to ensure safety while investigations and repairs could be carried out.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                As work progressed, it became clear that there were wider issues across the development. Multiple
                leaks have been identified in different blocks, affecting both individual flats and communal areas. In
                some cases, this has led to water ingress, damage to ceilings, and saturated flooring within shared
                spaces. Specialist contractors have been instructed to investigate and identify the source of these
                problems so that appropriate repairs can be planned.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                At the same time, Myreside has had to manage a challenging transition from the previous factor. Key
                information and documentation were not provided at handover, including proprietor contact details,
                building drawings, and records relating to contractors and maintenance. This has meant that additional
                time has been required to piece together a full understanding of the development before longer-term
                solutions can be implemented.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Despite these challenges, progress is being made. The committee has now met with the directors of
                Myreside Management and with Ania on several occasions. These meetings have been constructive, and
                there is a clear plan forming around how to address both the immediate issues and the longer-term
                maintenance of the development. Owners should be reassured that matters are moving in the right
                direction, although this is a large workload that has been inherited and will take time to fully
                resolve. Your patience and understanding during this period is appreciated.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                A review of contractors has also been carried out. Where appropriate, existing contractors have been
                retained due to their familiarity with the development, while Myreside continues to assess performance
                and ensure that services such as lift maintenance, fire safety systems, pool plant servicing, and
                general repairs are properly managed going forward.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Fire safety has been identified as an area requiring improvement. Initial inspections have highlighted
                gaps in coverage and compliance, and proposals have been obtained to introduce regular servicing and
                bring systems up to an appropriate standard. In addition, a proposal has been received to update the
                previous building survey, which will provide a clear and current picture of the condition of each
                block and allow works to be prioritised properly.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Alongside these larger items, a number of day-to-day issues have also been addressed. This includes
                lift repairs, gutter maintenance, and the management of items left in communal areas. Owners are
                reminded that leaving items in shared spaces can create both safety and access issues, and continued
                cooperation in keeping these areas clear is important.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                It was also noted that there had been ongoing issues with dog fouling within the central grass area.
                Signage has since been put in place, and this has had a positive effect. There have been no recent
                reports of further issues, and thanks are extended to residents for helping improve this situation.
                Owners and residents are asked to continue being mindful and to clean up after their dogs to maintain
                this standard.
              </p>

              <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 space-y-2 text-sm md:text-base text-slate-800 dark:text-slate-100">
                <h3 className="text-base font-semibold">Payment reminder</h3>
                <p>
                  Myreside Management is now the appointed factor for James Square. All payments should be directed to
                  Myreside. Any owner who has made payments to Fior after February 2026 should contact them as soon
                  as possible to request a refund and recover any funds sent in error.
                </p>
                <p>
                  It is also important that owners ensure their contact details are up to date with Myreside so that
                  they receive all future communications. Full contact and portal information can be found on the{' '}
                  <Link href="/myreside" className="font-semibold text-cyan-700 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
                    Myreside page
                  </Link>.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4 space-y-2 text-sm md:text-base text-slate-800 dark:text-slate-100">
                <h3 className="text-base font-semibold">AGM – held Thursday 4 June 2026</h3>
                <p>
                  The AGM was held on Thursday 4 June 2026. Visit the{' '}
                  <Link href="/agm" className="font-semibold text-cyan-700 transition-colors hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
                    AGM page
                  </Link>
                  {' '}for the meeting summary, agenda and factors report. The full minutes are now available in the
                  AGM 2026 Information section above.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Further updates will continue to be shared as progress is made.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </GlassCard>
  );
}

function CommitteeUpdateSection() {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <article className="rounded-xl border border-white/15 bg-white/5 p-6 space-y-4">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Committee Update – James Square</h2>
            <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              Committee Update
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">12 March 2026</p>
        </header>

        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
          The committee met with representatives from Myreside Property Management on Wednesday 11 March 2026 to
          discuss ongoing matters at James Square, including active leaks, pool plant faults, and maintenance priorities.
          A full update is available below with next steps and contact details.
        </p>

        <ExpandButton
          open={open}
          setOpen={setOpen}
          labelWhenClosed="Read full committee update"
          labelWhenOpen="Hide full update"
          controlsId="committee-update-details"
        />

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="committee-update-details"
              className="space-y-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                A new property manager has now been appointed for the development. It is hoped this will help ensure that
                issues are addressed more consistently going forward and that communication between the factor and owners
                improves as matters progress.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Myreside have been liaising with owners, plumbers and the building’s insurance company in relation to the
                water leaks affecting parts of the building. Unfortunately it has been difficult to identify the precise
                source of the leaks and it may be the case that there is more than one issue contributing. Investigations are
                ongoing and work is continuing to arrange dehumidifiers where required while the matter is being addressed.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Following the recent fire alarm activation, an electrician is currently working to resolve the electrical
                fault within the swimming pool pump and plant room. Once the fault has been rectified and the system has been
                checked, a further update will be shared regarding the reopening of the pool facilities.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                It has also been highlighted that a number of bulky items have been left within communal areas. Residents are
                asked to remove any personal belongings from these areas as soon as possible. Items left in communal areas can
                invalidate the terms of the building’s insurance policy. Myreside are arranging for some items to be removed
                and any associated costs may be billed to the individuals responsible.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                There are a number of ongoing matters around the development which are gradually being addressed. On a
                positive note, the gardening contractors and cleaning staff have recently been carrying out additional work
                around the development and improvements in the general standard of the grounds and communal areas have already
                been noticed.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                A cherry picker has also been arranged to clear the drainage guttering around James Square which may help
                reduce water ingress in certain areas of the building.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Myreside will also be contacting owners in the near future regarding arrangements for the roof repair fund.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                The committee also discussed plans for the next Annual General Meeting. The intention is to circulate a short
                survey beforehand so owners can submit questions and topics for discussion in advance. This should help ensure
                that key matters such as roof repairs and potential renovation works can be discussed effectively at the AGM.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
                Owners who have not yet been in contact with Myreside are encouraged to reach out to ensure their contact
                details and payment arrangements are up to date.
              </p>

              <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4 space-y-2 text-sm md:text-base text-slate-800 dark:text-slate-100">
                <p className="font-semibold">Myreside Management Limited</p>
                <p>
                  3 Dalkeith Road Mews
                  <br />
                  Edinburgh
                  <br />
                  EH16 5GA
                </p>
                <p>
                  <span className="font-semibold">Telephone:</span> 0131 466 3001
                  <br />
                  <span className="font-semibold">24 Hour Emergencies:</span> 0131 466 3001 (Press 1)
                </p>
              </div>

              <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 space-y-2 text-sm md:text-base text-slate-800 dark:text-slate-100">
                <h3 className="text-base font-semibold">Factor Update Reminder</h3>
                <p>
                  Myreside took over from Fior Asset &amp; Property on 1 February 2026. Any owners who may have made
                  payments to Fior after this date should contact them as soon as possible to request a refund.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </GlassCard>
  );
}

function SgmSection() {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard
      title={
        <span className="inline-flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-300" aria-hidden="true" />
          <span>Extraordinary General Meeting (EGM) – Outcome</span>
        </span>
      }
      subtitle="Factor decision update"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
      className="bg-white/70 border-slate-200/70 shadow-[0_12px_34px_rgba(15,23,42,0.08)] dark:bg-white/5 dark:border-white/10"
    >
      <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
        <p>
          The Extraordinary General Meeting took place on Wednesday 21 January 2026, followed by an owner vote that
          selected Myreside Management as James Square’s new factor.
        </p>
        <p>
          Open the full update for transition details, formal notice information, and direct contact options.
        </p>
      </div>

      <ExpandButton
        open={open}
        setOpen={setOpen}
        labelWhenClosed="Read full EGM outcome"
        labelWhenOpen="Hide EGM outcome"
        controlsId="sgm-details"
      />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="sgm-details"
            className="space-y-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <p>
                Following the meeting, owners were invited to vote on the preferred property factor for James Square.
                Voting remained open until Friday 23 January 2026.
              </p>
              <p>
                Owners may view Myreside Management information, including the tender document, via the Myreside section
                of the website.
              </p>
              <Link
                href="/myreside"
                className="inline-flex items-center gap-2 font-semibold text-slate-900 transition hover:text-slate-700 dark:text-slate-100 dark:hover:text-white"
              >
                <span>View Myreside Management information</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className={`${glassPanel} space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-200`}>
              <p>
                The committee will now follow up with Myreside Management to discuss transition arrangements and next
                steps. Further updates will be shared with owners once details have been confirmed.
              </p>
              <p>
                In the meantime, Fior Asset &amp; Property remains the managing factor, and a formal transfer date will
                be confirmed in due course.
              </p>
            </div>
            <div className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-200">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Formal notice issued to Fior</h3>
                <p>
                  Following the vote, the committee has now issued formal written notice to Fior Asset &amp; Property
                  confirming termination of their appointment as factor for James Square and advising that Myreside
                  Management has been appointed as the replacement factor.
                </p>
                <p>For transparency, a copy of the termination notice letter can be viewed below.</p>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Documents</p>
                  <a
                    href="/images/venues/fior-termination-letter.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium transition-colors hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                  >
                    View termination notice letter (PDF)
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact Myreside Management</h3>
                <p>
                  Owners are encouraged to contact Myreside Management as soon as possible to ensure their details are
                  up to date and to arrange any new payment plans or standing orders.
                </p>
                <p>
                  Early contact will help support a smooth transition and avoid delays once the handover date is
                  confirmed.
                </p>
                <a
                  href="https://myreside-management.co.uk/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
                >
                  Contact Myreside via online form
                </a>
                <div className="space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-200">
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Telephone:</span> 0131 466 3001
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Address:</span>
                    <br />
                    Myreside Management Limited
                    <br />
                    3 Dalkeith Road Mews
                    <br />
                    Edinburgh EH16 5GA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function FiorFactorUpdateSection() {
  const [showEmail, setShowEmail] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!showEmail) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowEmail(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEmail]);

  return (
    <GlassCard title="Fior Factor Update" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
        <p>
          Fior Asset &amp; Property confirmed in correspondence dated 19 December 2025 that they intended to step down
          as factor for James Square and proposed a managed departure period.
        </p>
        <p>
          Expand this section to view the full summary and the original email shared with the committee.
        </p>
      </div>

      <ExpandButton
        open={open}
        setOpen={setOpen}
        labelWhenClosed="Read full Fior update"
        labelWhenOpen="Hide Fior update"
        controlsId="fior-update-details"
      />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="fior-update-details"
            className="space-y-3 overflow-hidden text-sm md:text-base text-slate-700 dark:text-slate-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <p>
              In this correspondence, Fior confirmed that they intend to step down as factor for James Square. They have
              proposed a managed departure to allow outstanding matters to be addressed, including completion of financial
              reconciliation, recovery of outstanding and historic debts, resolution of ongoing utility matters, and the
              orderly handover of information to a new factor.
            </p>
            <p>
              Fior advised that updated invoices were issued to owners prior to the Christmas period and that a full
              financial report will follow. They also confirmed that several active building issues are currently being
              dealt with, including multiple water leaks across the development, and that actions agreed at the AGM, such
              as the pool window works and clarification of staff roles, are being progressed.
            </p>
            <p>
              Plans are now in place to review and appoint a new factor for James Square, and further information will be
              shared with owners as this process moves forward.
            </p>
            <p>
              To discuss the factoring arrangements and the next steps in more detail, a meeting has been arranged for
              owners on Wednesday 21 January at 6:00 pm. Further details of this meeting will be shared shortly, and
              owners are encouraged to attend.
            </p>
            <p>For transparency, owners can view the previous email sent by Fior Asset &amp; Property to the committee.</p>
            <button
              type="button"
              onClick={() => setShowEmail(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
            >
              <FileText className="h-4 w-4 text-slate-500 dark:text-slate-300" aria-hidden="true" />
              <span>View email from Fior</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmail && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 sm:px-0"
            onClick={() => setShowEmail(false)}
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <motion.div
              className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">Original email</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  aria-label="Close email"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-transform duration-200 hover:rotate-90 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:text-slate-300 dark:hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  The following is the original email received from Fior Asset &amp; Property Management on 19 December 2025.
                </p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-900 shadow-inner dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">From:</span> Pedrom Aghabala, Director – Fior Asset &amp; Property
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> 19 December 2025
                    </p>
                    <p>
                      <span className="font-semibold">Subject:</span> Correspondence regarding James Square
                    </p>
                  </div>
                  <div className="mt-4 space-y-4 whitespace-pre-line">
                    <p>Good afternoon,</p>
                    <p>
                      I hope this finds you well, thank you for your letter to our office, I only read it a few days ago
                      as I was catching up on my post.
                    </p>
                    <p>
                      To be honest, I fully understand your frustration, this site has not been easy for us either. One
                      of the major issues we faced here was that many properties are rented out at James Square, upon
                      doing a reconciliation of accounts, we noticed that many letting agents were paying money into the
                      James Square account for not only James Square rentals they manage, but also for other rental
                      properties that we are the factor for. We presume that they feel this is a main business bank
                      account for Fior Asset , but in reality, James square has its own account as do all developments,
                      therefore we have had to go through hundreds of transactions to establish what was actually James
                      square and what was for other sites, and remove this.
                    </p>
                    <p>
                      All of this being said, we are today and tomorrow, sending all owners their up to date invoices for
                      payment, given that we only have 2 days left in the office before we break up for Christmas, I do
                      not feel we would be able to get you the financial report in such time. We need to get the invoices
                      out first, then send you and all the owners the financial report, which we will do asap.
                    </p>
                    <p>
                      Once this is done, I feel it would be a good idea for the committee and Fior Asset to meet up in
                      early January, we can then discuss our departure from James Square. The reason I do not feel it
                      would be beneficial to notify all of the owners just yet of a change of factor is that there are
                      debts at the site , including historic ones, which we are very close to recovering back. I think it
                      would be sensible to work towards a departure date in mid-end March 2026, to allow us to recoup back
                      debts, to recoup back historic debts, to complete our dispute with the utility provider and Ofgem,
                      and to issue our payment plan for roof payments so this is set up for the new factor and residents.
                    </p>
                    <p>
                      I will in the meantime get a set date for the pool windows to be cleared as agreed at the AGM, and
                      send out details of Jimmys role (in detail) as requested by owners at the AGM.
                    </p>
                    <p>
                      We also have an active leak in 3 flats in block 45 that we are dealing with currently, as well as
                      11 active leaks elsewhere, so Im sure you can apprecaite, we have to prioritise these as well.
                    </p>
                    <p>I will be in contact shortly, in the meantime have a very pleasant Christmas and New Year.</p>
                    <p>Kind regards,</p>
                    <p>Pedrom Aghabala</p>
                    <p>Director</p>
                    <p>Fior Asset &amp; Property</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function AgmSection() {
  const [agm2025RecapOpen, setAgm2025RecapOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  return (
    <GlassCard
      title="Annual General Meeting (AGM)"
      subtitle="James Square Proprietors Association AGM 2025"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">Held at 8:00 pm on Monday 8 September 2025 (via Zoom)</p>

      <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
        The 2025 AGM brought owners together to review the past year, discuss building matters, and agree priorities
        for the year ahead. Use the buttons below to read a summary of what was discussed.
      </p>

      <div className="space-y-4">
        <div>
          <ExpandButton
            open={agm2025RecapOpen}
            setOpen={setAgm2025RecapOpen}
            labelWhenClosed="Read what was discussed at the 2025 AGM"
            labelWhenOpen="Hide 2025 AGM recap"
            controlsId="owners-agm-2025-recap"
          />
          <AnimatePresence initial={false}>
            {agm2025RecapOpen && (
              <motion.div
                id="owners-agm-2025-recap"
                className={`${glassPanel} mt-3 space-y-4`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <SectionText heading="Overview">
                  <p>
                    The 2025 AGM provided owners with an update on management, operations, finances, and plans for the
                    year ahead. The meeting was chaired by Chris M with Pedrom Aghabala (Fior Asset &amp; Property) in
                    attendance. This AGM was significant due to changes in factoring arrangements, major plant and
                    leisure repairs, and renewed decisions around long-term roof funding.
                  </p>
                </SectionText>

                <SectionText heading="Attendance and apologies">
                  <p>
                    A wide cross-section of owners joined from multiple blocks. Apologies were received from several
                    owners who could not attend. Ground rules for respectful discussion were outlined at the start of
                    the meeting.
                  </p>
                </SectionText>

                <SectionText heading="Committee and factor update">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Chris Magowan advised he would step down as Chair due to frustration with factoring arrangements.</li>
                    <li>Trinity Factors were removed after widespread dissatisfaction; Fior Asset &amp; Property were appointed.</li>
                    <li>
                      Trinity resigned abruptly with little notice. Fior secured alternative insurance and stabilised the
                      transition despite minimal handover support.
                    </li>
                    <li>
                      An attempted automatic insurance renewal of nearly £70,000 by Trinity was challenged and voided by
                      Fior, preventing owners from being charged.
                    </li>
                    <li>
                      Owners highlighted unanswered correspondence, delayed documentation, roof fund administration
                      issues, and late circulation of the AGM notice. Pedrom apologised for communication delays,
                      explaining a serious health issue had taken him out of work for several months.
                    </li>
                  </ul>
                </SectionText>

                <SectionText heading="Leisure facilities and major repairs">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>
                      Sauna: misuse damaged the previous unit. A new infrared sauna has been installed and is proving
                      more durable and efficient.
                    </li>
                    <li>
                      Swimming pool pump: the main pump failed, forcing reliance on an expensive electric backup. A new
                      pump was installed for £9,800, including substantial installation work.
                    </li>
                  </ul>
                </SectionText>

                <SectionText heading="Pool booking system">
                  <p>
                    The previous booking system was corrupted and non-functional. A resident presented a new booking
                    website (James-Square.com), which owners welcomed for its flexibility. Fior will circulate the link
                    and guidance to all owners.
                  </p>
                </SectionText>

                <SectionText heading="Roof fund and long-term repairs">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>
                      Roof fund collections were paused after Trinity refunded much of the money previously collected
                      and delayed providing accurate figures.
                    </li>
                    <li>
                      At transfer only £15,462.85 remained; a £2,000 contribution from a selling owner brought the total
                      to £17,462.85.
                    </li>
                    <li>
                      Owners agreed that roof repairs have been voted on previously and reaffirmed the commitment to the
                      project despite the impact of uncertainty on property sales.
                    </li>
                    <li>Decision: roof fund collections will restart with the new budget invoices at the original contribution levels.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Financial review">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Annual accounts showed savings across most categories, particularly payroll.</li>
                    <li>
                      Savings were partly due to the sad passing of the second caretaker/cleaner, leaving Jimmy as the
                      sole employee. Owners praised his work and requested clearer communication about his duties.
                    </li>
                    <li>
                      Fior will issue a detailed follow-up letter covering annual expenditure, income per category,
                      debtors and historic debt, current balances, and roof fund balances.
                    </li>
                  </ul>
                </SectionText>

                <SectionText heading="Communication improvements">
                  <p>Owners unanimously agreed that communication must improve. Fior will issue quarterly written updates.</p>
                </SectionText>

                <SectionText heading="Pool safety and windows">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>
                      Sun-blocking coverings on pool windows reduced algae but raised safety concerns. Owners voted to
                      uncover the bottom half of four windows as a compromise.
                    </li>
                    <li>A faulty pool door lock was replaced with a safer mechanism.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Planned works">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Landscaping beside the main entrance steps.</li>
                    <li>New carpets and decoration in Block 57 and the terrace.</li>
                    <li>AOV (smoke vent) systems in Blocks 45 and 51.</li>
                    <li>Smaller works will proceed; larger projects will be discussed with relevant blocks.</li>
                    <li>New fire servicing contractor resolved several historic issues but flagged wiring concerns; quotes will follow.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Budget and owner credits">
                  <p>
                    The proposed budget was reviewed line by line and agreed, with invoices to be issued shortly after the
                    minutes. A £19,371 budget saving was identified, and owners voted on how it should be treated.
                  </p>
                </SectionText>

                <SectionText heading="Closing">
                  <p>
                    Pedrom confirmed that all agreed actions would be implemented, with minutes, accounts, and invoices to
                    follow promptly. The meeting closed at 10:50 pm.
                  </p>
                </SectionText>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <ExpandButton
            open={recapOpen}
            setOpen={setRecapOpen}
            labelWhenClosed="Read what was discussed at the 2023 AGM"
            labelWhenOpen="Hide 2023 AGM recap"
            controlsId="owners-agm-2023-recap"
          />
          <AnimatePresence initial={false}>
            {recapOpen && (
              <motion.div
                id="owners-agm-2023-recap"
                className={`${glassPanel} mt-3 space-y-4`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <SectionText heading="Headline outcomes">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Roof &amp; render confirmed as top capital priority; collections ongoing.</li>
                    <li>Outstanding debt across ~10 owners estimated £17–20k; 4 NOPLs registered.</li>
                    <li>
                      Pool policy adjusted: free use 10:00–17:00; bookings required outside those hours.
                    </li>
                    <li>Staff pay increased by 5%, backdated to May 2023.</li>
                    <li>Insurance premiums escalated sharply (£29k in 2021 → £69k in 2023).</li>
                    <li>Safety/maintenance items highlighted: pool ceiling, smoke vents, statutory servicing.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Finance & arrears">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Live balance at AGM ~£89,928 (inflated by roof/render collections).</li>
                    <li>Funds transferred quarterly into ring-fenced block accounts.</li>
                    <li>Arrears: ~10 owners in debt; shortfalls risk cuts or higher costs for others.</li>
                    <li>Quarterly arrears/balance reporting requested.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Forward plan">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Build reserves to ~90% before tendering roof/render works.</li>
                    <li>Investigate pool window seals and ceiling repairs.</li>
                    <li>Install smoke vents for Blocks 45 &amp; 51.</li>
                    <li>Maintain statutory testing: lifts, pool water, dry risers, gates, pest control.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Decisions made">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Pool timetable change implemented.</li>
                    <li>Staff pay rise confirmed.</li>
                    <li>Safety works on pool ceiling instructed.</li>
                    <li>AOV installations scheduled.</li>
                    <li>Trinity to provide more transparent reporting.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Risks highlighted">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Arrears remain the main financial risk.</li>
                    <li>Insurance inflation and claim handling quality.</li>
                    <li>Pool structural/water ingress concerns.</li>
                    <li>Roof/render project at risk from cost volatility.</li>
                  </ul>
                </SectionText>

                <SectionText heading="Suggested follow-ups for 2024/25">
                  <ul className="list-disc ms-5 space-y-1">
                    <li>Publish arrears dashboard quarterly.</li>
                    <li>Maintain roof/render tracker.</li>
                    <li>Keep insurance claims log.</li>
                    <li>Monitor pool bookings post-policy change.</li>
                    <li>Share maintenance calendar with residents.</li>
                    <li>Switch to WhatsApp Community for owner comms.</li>
                    <li>Track AOV installation progress.</li>
                  </ul>
                </SectionText>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`${glassPanel} mt-2 space-y-2`}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Share Your Views</h3>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Owners are welcome to continue sharing feedback and suggesting ideas for future consultation topics.
        </p>

        <Link
          href="/message-board"
          aria-label="Give Feedback or Share Your Opinion on the Message Board"
          className="mt-1 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 active:translate-y-[1px] dark:border-white/15 dark:bg-white/15"
        >
          <span>Give Feedback / Share Your Opinion</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </GlassCard>
  );
}

function EmailAccordion({
  title,
  content,
  controlsId,
}: {
  title: string;
  content: string;
  controlsId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${glassPanel} p-0`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={controlsId}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:text-slate-100 dark:hover:bg-white/10"
      >
        <span className="break-words">{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={controlsId}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <pre className="whitespace-pre-wrap break-words border-t border-white/30 px-4 py-4 font-mono text-xs leading-relaxed text-slate-700 dark:border-white/10 dark:text-slate-200 sm:text-sm">{content}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoAccordion({
  title,
  controlsId,
  children,
}: {
  title: string;
  controlsId: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${glassPanel} p-0`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={controlsId}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:text-slate-100 dark:hover:bg-white/10"
      >
        <span>{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={controlsId}
            className="overflow-hidden border-t border-white/30 px-4 py-4 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:text-slate-200 md:text-base"
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandButton({
  open,
  setOpen,
  labelWhenClosed = 'Show more',
  labelWhenOpen = 'Show less',
  controlsId = 'expander',
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  labelWhenClosed?: string;
  labelWhenOpen?: string;
  controlsId?: string;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls={controlsId}
      className="group inline-flex items-center gap-2 rounded-full border border-white/45 bg-gradient-to-b from-white/80 to-white/55 px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:from-white/90 hover:to-white/70 hover:shadow-[0_12px_28px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 dark:border-white/20 dark:from-white/20 dark:to-white/10 dark:text-slate-100 dark:hover:from-white/25 dark:hover:to-white/15"
    >
      {open ? labelWhenOpen : labelWhenClosed}
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/8 text-slate-600 transition-colors group-hover:bg-slate-900/12 dark:bg-white/15 dark:text-slate-200 dark:group-hover:bg-white/20">
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

function SectionText({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1 text-slate-800 dark:text-slate-100">
      <h3 className="text-lg font-semibold md:text-xl">{heading}</h3>
      <div className="text-sm md:text-base leading-relaxed">{children}</div>
    </div>
  );
}
