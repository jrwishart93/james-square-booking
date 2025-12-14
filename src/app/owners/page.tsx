'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OwnersPage = () => {
  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
            Owners Area
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            A private space for James Square owners to view AGM information, vote on community matters,
            and keep up with building updates.
          </p>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
            The secure owners login and voting experience are currently being built. Early access will be shared
            with owners first.
          </p>
        </header>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard
              title="Secure owners access"
              subtitle="A private password-protected area for owners is on the way."
              titleClassName="text-slate-800/80 dark:text-slate-100/90"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow dark:bg-white/80 dark:text-slate-900">
                <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden />
                Coming soon
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                This will include AGM packs, meeting minutes, factor updates, and other owners-only documents.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You’ll be notified once secure access is available.
              </p>
            </GlassCard>

          <GlassCard
            title="Community voting hub"
            subtitle="Ask questions, vote, and review results."
            footer="Open to all owners."
            titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            className="before:inset-x-0 before:h-[3px] before:bg-[linear-gradient(90deg,rgba(15,23,42,0.08),rgba(15,23,42,0))]"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow dark:bg-white/80 dark:text-slate-900">
              <span className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden />
              Coming soon
            </div>
            <Link
              href="/owners/voting"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white/90 backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/5 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:bg-white/85 dark:text-slate-900 dark:border-white/20"
            >
                Go to voting hub
              </Link>
            </GlassCard>
          </div>

          <AgmSection />
        </div>
      </div>
    </GradientBG>
  );
};

export default OwnersPage;

const glassPanel =
  'rounded-2xl border border-white/40 bg-white/65 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5';

function AgmSection() {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  return (
    <GlassCard
      title="Annual General Meeting (AGM)"
      subtitle="James Square Proprietors Association AGM 2025"
      titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100"
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">8pm Monday 8 September 2025 (via Zoom)</p>

      <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
        The AGM is the annual meeting for owners and proprietors. Zoom links are emailed directly by Fior Asset &amp;
        Property Management. If you did not receive a link, please contact Fior to request assistance. The meeting
        covers financial updates, building maintenance, facilities management, and sets objectives for the next year.
      </p>

      <div className={glassPanel}>
        <ul className="list-disc space-y-1 text-sm text-slate-800 dark:text-slate-100 ms-5">
          <li>
            The 2025 AGM will cover finances, elections, pool and building issues, and objectives for the next year.
          </li>
          <li>Roof and render works remain the top long-term priority.</li>
          <li>The pool booking system and privacy will be reviewed.</li>
          <li>Owners will elect new committee members and block representatives.</li>
          <li>
            Major maintenance projects such as ceiling repairs, lift flooring and communal redecorations are on the agenda.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <ExpandButton
            open={agendaOpen}
            setOpen={setAgendaOpen}
            labelWhenClosed="View full 2025 AGM agenda"
            labelWhenOpen="Hide 2025 AGM agenda"
            controlsId="owners-agm-2025-agenda"
          />
          <AnimatePresence initial={false}>
            {agendaOpen && (
              <motion.div
                id="owners-agm-2025-agenda"
                className={`${glassPanel} mt-3 text-sm text-slate-800 dark:text-slate-100`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <ul className="list-disc space-y-1 ms-5">
                  <li>Introductions &amp; Apologies</li>
                  <li>Ground Rules</li>
                  <li>Chairperson’s report on 2024–25 activities</li>
                  <li>
                    Financial report
                    <ul className="list-disc space-y-1 ms-5 mt-1">
                      <li>Budget vs actual spend</li>
                      <li>Current account balance</li>
                      <li>Roof/render fund balance</li>
                      <li>Debts</li>
                    </ul>
                  </li>
                  <li>Election of Committee Members and Block Representatives</li>
                  <li>Pool booking system</li>
                  <li>Pool window privacy</li>
                  <li>
                    JSPA objectives for 2025–26
                    <ul className="list-disc space-y-1 ms-5 mt-1">
                      <li>Air source heat pump</li>
                      <li>Pool ceiling repair</li>
                      <li>Fire alarm system repair</li>
                      <li>Block 57 carpet and redecoration</li>
                      <li>Block 55 entrance</li>
                      <li>Block 45 entrance</li>
                      <li>Block 45/51 lift floor</li>
                      <li>Conservatory carpet replacement</li>
                      <li>Roof/render fund restart</li>
                      <li>Block 45/51 AOVs (automatic opening vents)</li>
                      <li>Repainting of solar reflective paint on roof</li>
                      <li>Broken pool windows</li>
                      <li>Caledonian Crescent entrance steps and fascia</li>
                      <li>Bushes beside front entrance</li>
                      <li>Painting of the walls around the car park</li>
                    </ul>
                  </li>
                  <li>Any other business</li>
                  <li>Meeting closure</li>
                </ul>
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
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 text-slate-800 dark:text-slate-100">
      <h3 className="text-lg font-semibold md:text-xl">{heading}</h3>
      <div className="text-sm md:text-base leading-relaxed">{children}</div>
    </div>
  );
}
