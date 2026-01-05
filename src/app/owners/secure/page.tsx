'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OWNERS_ACCESS_KEY = 'owners_secure_access';

const SGM_DESCRIPTION = `A Special General Meeting will be held at 1800 hours (6:00pm) on Wednesday 21 January 2026.
All owners are encouraged to save the date.
Further correspondence will be issued in due course, including additional details and a link to join the meeting online.`;
const SGM_START = '20260121T180000';
const SGM_END = '20260121T190000';
const SGM_ICS_FILENAME = 'james-square-sgm-2026.ics';
const SGM_GOOGLE_CALENDAR_LINK = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  'James Square – Special General Meeting',
)}&dates=${SGM_START}/${SGM_END}&details=${encodeURIComponent(SGM_DESCRIPTION)}&location=${encodeURIComponent(
  'Online meeting',
)}&ctz=Europe/London`;

const glassPanel =
  'rounded-2xl border border-white/40 bg-white/65 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5';

const OwnersSecurePage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

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

  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">Owners area</h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            This section contains meeting information and documents intended for James Square owners only.
          </p>
        </header>

        <div className="space-y-6">
          <SgmSection />

          <FiorFactorUpdateSection />

          <AgmSection />
        </div>
      </div>
    </GradientBG>
  );
};

export default OwnersSecurePage;

function SgmSection() {
  const [calendarOptionsOpen, setCalendarOptionsOpen] = useState(false);

  const downloadIcs = () => {
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const description = SGM_DESCRIPTION.replace(/\n/g, '\\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//James Square//Owners Portal//EN',
      'CALSCALE:GREGORIAN',
      'X-WR-TIMEZONE:Europe/London',
      'BEGIN:VEVENT',
      'UID:james-square-sgm-2026@jamessquare',
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=Europe/London:${SGM_START}`,
      `DTEND;TZID=Europe/London:${SGM_END}`,
      'SUMMARY:James Square – Special General Meeting',
      'LOCATION:Online meeting',
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = SGM_ICS_FILENAME;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <GlassCard
      title="Special General Meeting – Save the Date"
      subtitle="Wednesday 21 January 2026 • 6:00pm (online)"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
    >
      <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
        A Special General Meeting will be held at 1800 hours (6:00pm) on Wednesday 21 January 2026. All owners are
        encouraged to save the date. Further correspondence will be issued in due course, including additional details
        and a link to join the meeting online.
      </p>

      <div className={glassPanel}>
        <dl className="grid grid-cols-1 gap-3 text-sm text-slate-800 dark:text-slate-100 sm:grid-cols-3">
          <div>
            <dt className="font-semibold">Date</dt>
            <dd>Wednesday 21 January 2026</dd>
          </div>
          <div>
            <dt className="font-semibold">Time</dt>
            <dd>1800–1900 hours (UK time)</dd>
          </div>
          <div>
            <dt className="font-semibold">Format</dt>
            <dd>Online meeting</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setCalendarOptionsOpen((open) => !open)}
          aria-expanded={calendarOptionsOpen}
          aria-controls="sgm-calendar-options"
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 active:translate-y-[1px] dark:bg-white dark:text-slate-900"
        >
          Add to calendar
        </button>

        <AnimatePresence initial={false}>
          {calendarOptionsOpen && (
            <motion.div
              id="sgm-calendar-options"
              className="flex flex-col gap-2 overflow-hidden md:flex-row"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={downloadIcs}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 active:translate-y-[1px] dark:border-white/15 dark:bg-white/20 dark:text-white"
              >
                Add to Apple Calendar
              </button>
              <Link
                href={SGM_GOOGLE_CALENDAR_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 active:translate-y-[1px] dark:border-white/15 dark:bg-white/20 dark:text-white"
              >
                Add to Google Calendar
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
