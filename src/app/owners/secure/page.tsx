'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OWNERS_ACCESS_KEY = 'owners_secure_access';
const EGM_END = new Date('2026-01-21T20:30:00Z');
const VOTING_DEADLINE = new Date('2026-01-23T23:59:00Z');
const EGM_TITLE = 'James Square – Extraordinary General Meeting';
const EGM_PAGE_URL = 'https://www.james-square.com/egm';
const EGM_TEAMS_LINK =
  'https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZjI4NmMzZjYtYmI3OS00ZDk3LTg1ZDgtNGE5NDI3YmExNzA1%40thread.v2/0?context=%7b%22Tid%22%3a%22f5c44b19-1c42-4ad7-b10e-1d2fcf2b71d3%22%2c%22Oid%22%3a%2290c27962-4d1a-4d45-8e9e-ff0f7b30452b%22%7d';
const EGM_DESCRIPTION =
  'This meeting has been arranged for owners to discuss and vote on a potential change to the property factor for James Square. Join via Microsoft Teams.';
const GOOGLE_CALENDAR_URL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  EGM_TITLE,
)}&dates=20260121T180000Z/20260121T203000Z&details=${encodeURIComponent(
  `${EGM_DESCRIPTION}\n\nMicrosoft Teams: ${EGM_TEAMS_LINK}\nEGM details: ${EGM_PAGE_URL}`,
)}&location=${encodeURIComponent('Microsoft Teams')}`;
const EGM_ICS_PATH = '/calendar/james-square-egm-2026.ics';

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

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <SgmSection />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FiorFactorUpdateSection />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AgmSection />
          </motion.div>
        </div>
      </motion.div>
    </GradientBG>
  );
};

export default OwnersSecurePage;

function SgmSection() {
  const [meetingConcluded, setMeetingConcluded] = useState(false);
  const [votingClosed, setVotingClosed] = useState(false);

  useEffect(() => {
    const now = new Date();
    setMeetingConcluded(now > EGM_END);
    setVotingClosed(now > VOTING_DEADLINE);
  }, []);

  const egmCardClassName = meetingConcluded
    ? votingClosed
      ? 'bg-white/70 border-slate-200/70 shadow-[0_12px_34px_rgba(15,23,42,0.08)] dark:bg-white/5 dark:border-white/10'
      : 'bg-white/80 border-amber-200/70 shadow-[0_16px_40px_rgba(15,23,42,0.1)] dark:bg-white/5 dark:border-amber-400/20'
    : 'bg-white/85 border-cyan-200/70 shadow-[0_18px_45px_rgba(15,23,42,0.12)] dark:bg-white/10 dark:border-cyan-400/20';

  if (meetingConcluded) {
    return (
      <GlassCard
        title="Extraordinary General Meeting (EGM)"
        subtitle="Factor review and decision"
        titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
        className={egmCardClassName}
      >
        {votingClosed ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              Voting closed – outcome pending
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">Voting has now closed.</p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
              The outcome of the vote and any next steps will be shared with owners once confirmed.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              Meeting concluded
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
              The Extraordinary General Meeting held on Wednesday 21 January 2026 has now taken place.
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
              Owners are now invited to vote on which property factor they believe would be best for James Square.
            </p>
            <div className="space-y-2">
              <Link
                href="https://www.james-square.com/voting"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 active:translate-y-[1px] dark:bg-white dark:text-slate-900"
              >
                Place your vote
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-300">Voting will close on Friday 23 January 2026.</p>
            </div>
          </>
        )}
        <div className="grid gap-4 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-[140px_1fr]">
          <div className="font-semibold text-slate-900 dark:text-slate-100">Date</div>
          <div>Wednesday 21 January 2026</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">Time</div>
          <div>From 18:00 (UK time)</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">Format</div>
          <div>Online via Microsoft Teams</div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">Audience</div>
          <div>James Square owners</div>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
            Add meeting to calendar
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-150 ease-out hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Add to Google Calendar
            </a>
            <a
              href={EGM_ICS_PATH}
              download="james-square-egm-2026.ics"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-150 ease-out hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Add to Apple Calendar
            </a>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={EGM_TEAMS_LINK}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            Join Microsoft Teams meeting
          </Link>
          <Link
            href={EGM_PAGE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            View meeting details
          </Link>
          <Link
            href="/myreside"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            View Myreside Management information
          </Link>
          <Link
            href="/newton"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
          >
            View Newton Property Management information
          </Link>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Factor documentation is provided for information only. Proposals are initial and subject to clarification and
          update ahead of the meeting.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      title="Extraordinary General Meeting (EGM)"
      subtitle="Factor review and decision"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
      className={egmCardClassName}
    >
      <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
        This meeting has been arranged for owners to discuss and vote on a potential change to the property factor for
        James Square. Owners are encouraged to review the information below in advance of the meeting.
      </p>

      <div className="grid gap-4 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-[140px_1fr]">
        <div className="font-semibold text-slate-900 dark:text-slate-100">Date</div>
        <div>Wednesday 21 January 2026</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">Time</div>
        <div>From 18:00 (UK time)</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">Format</div>
        <div>Online via Microsoft Teams</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">Audience</div>
        <div>James Square owners</div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
          Add meeting to calendar
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-150 ease-out hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          >
            Add to Google Calendar
          </a>
          <a
            href={EGM_ICS_PATH}
            download="james-square-egm-2026.ics"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors duration-150 ease-out hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
          >
            Add to Apple Calendar
          </a>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={EGM_TEAMS_LINK}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
        >
          Join Microsoft Teams meeting
        </Link>
        <Link
          href={EGM_PAGE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
        >
          View meeting details
        </Link>
        <Link
          href="/myreside"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
        >
          View Myreside Management information
        </Link>
        <Link
          href="/newton"
          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-150 ease-out hover:bg-white/95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white dark:hover:bg-white/25"
        >
          View Newton Property Management information
        </Link>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-300">
        Factor documentation is provided for information only. Proposals are initial and subject to clarification and
        update ahead of the meeting.
      </p>
    </GlassCard>
  );
}

function FiorFactorUpdateSection() {
  return (
    <GlassCard title="Fior Factor Update" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
      <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">
        <p>
          Owners are advised of an update following correspondence received from Fior Asset &amp; Property Management on
          19 December 2025.
        </p>
        <p>
          In this correspondence, Fior confirmed that they intend to step down as factor for James Square. They have
          proposed a managed departure to allow outstanding matters to be addressed, including completion of financial
          reconciliation, recovery of outstanding and historic debts, resolution of ongoing utility matters, and the
          orderly handover of information to a new factor.
        </p>
        <p>
          Fior advised that updated invoices were issued to owners prior to the Christmas period and that a full
          financial report will follow. They also confirmed that several active building issues are currently being dealt
          with, including multiple water leaks across the development, and that actions agreed at the AGM, such as the
          pool window works and clarification of staff roles, are being progressed.
        </p>
        <p>
          Plans are now in place to review and appoint a new factor for James Square, and further information will be
          shared with owners as this process moves forward.
        </p>
        <p>
          To discuss the factoring arrangements and the next steps in more detail, a meeting has been arranged for owners
          on Wednesday 21 January at 6:00 pm. Further details of this meeting will be shared shortly, and owners are
          encouraged to attend.
        </p>
      </div>
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
        The 2025 Annual General Meeting has now taken place. The meeting brought owners together to review the past
        year, discuss current building and facilities matters, and agree priorities and actions for the year ahead.
      </p>

      <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
        If you were unable to attend, or would like a refresher, you can read a full summary of what was discussed
        using the tab below.
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
          If you cannot attend the AGM, you can still contribute by sharing your views or suggesting ideas.
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

function ExpandButton({
  open,
  setOpen,
  labelWhenClosed = 'Read full details',
  labelWhenOpen = 'Hide details',
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
      className="px-4 py-2 rounded-xl bg-black/80 text-white hover:bg-black transition"
    >
      {open ? labelWhenOpen : labelWhenClosed}
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
