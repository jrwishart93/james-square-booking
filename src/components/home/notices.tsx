'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CalendarDays, ArrowRight, Building2, ChevronDown, MapPinned } from 'lucide-react';

const telferSubwayNoticeEndsAt = new Date('2026-06-20T00:00:00+01:00');
const telferDiversionMapHref = '/docs/survey/Caledonian%20Crescent%20Footpath%20Closure.pdf';

export function isTelferSubwayNoticeActive(now = new Date()) {
  return now.getTime() < telferSubwayNoticeEndsAt.getTime();
}

/** ------------------------------------------------
 *  Notice summaries (compact homepage cards)
 *  ------------------------------------------------ */
export type NoticeSummary = {
  id: string;
  badge: string;
  title: string;
  summary: string;
  date: string;
  /** urgent = safety/closure, action = resident action needed, info = general news */
  tone: 'urgent' | 'action' | 'info';
  isActive?: () => boolean;
};

/** Ordered newest/most important first — homepage shows the first three active. */
export const noticeSummaries: NoticeSummary[] = [
  {
    id: 'agm-voting',
    badge: "Owners' notice",
    title: 'AGM 2026 Owner Voting',
    summary:
      'Myreside has emailed proprietors the AGM voting documentation. Read the official documents and return completed forms to Myreside Management.',
    date: 'Voting closes 13 July 2026',
    tone: 'action',
  },
  {
    id: 'pool-facilities',
    badge: 'Resident notice',
    title: 'Pool & Facilities Update',
    summary:
      'The swimming pool, gym and sauna remain closed for safety following the plant room incident. Repair and refurbishment options were discussed at the AGM.',
    date: 'Updated June 2026',
    tone: 'urgent',
  },
  {
    id: 'telfer-subway',
    badge: 'Footpath closure',
    title: 'Telfer Subway / Caledonian Crescent Closure',
    summary:
      'The Telfer Subway is closed to pedestrians and cyclists from Monday 15 to Friday 19 June 2026, with a signed diversion in place.',
    date: '15 – 19 June 2026',
    tone: 'urgent',
    isActive: isTelferSubwayNoticeActive,
  },
  {
    id: 'agm-summary',
    badge: 'AGM summary',
    title: 'AGM Summary – 4 June 2026',
    summary:
      'The AGM reviewed the Fior handover, recovery of Trinity sinking fund balances, and the ongoing pool, gym and sauna closure.',
    date: '4 June 2026',
    tone: 'info',
  },
  {
    id: 'roadworks',
    badge: 'Residents update',
    title: 'Orwell Terrace Roadworks',
    summary:
      'Roadworks at the end of Orwell Terrace are underway for around 4 to 6 weeks. The junction with Dalry Road is closed, with a diversion in place.',
    date: 'In progress',
    tone: 'info',
  },
  {
    id: 'myreside',
    badge: 'Property management',
    title: 'Myreside Management',
    summary:
      'Myreside Management are the active property factor for James Square. All owner payments, maintenance requests and queries should go to Myreside.',
    date: 'Since 1 February 2026',
    tone: 'info',
  },
];

export function activeNoticeSummaries() {
  return noticeSummaries.filter((notice) => !notice.isActive || notice.isActive());
}

/** ------------------------------------------------
 *  Pool & Facilities Notice
 *  ------------------------------------------------ */
export function PoolNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-sky-400/30 border-l-sky-400 bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-emerald-500/10 p-6 shadow-lg shadow-sky-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
          Resident notice
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Pool &amp; Facilities Update
      </h2>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-800/80 dark:text-sky-200/80">
        Last Updated: June 2026
      </p>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          The swimming pool, gym and sauna facilities remain closed due to safety concerns following
          the pool plant room incident and deterioration identified within the pool area. The AGM was
          held on Thursday 4 June 2026, where owners discussed the immediate repair needs and the
          longer-term future of the facilities.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="full-update"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-sky-400/30 pt-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Full Update – Pool &amp; Facilities
                </h3>
                <p>
                  As previously reported, a leak within the pool plant room resulted in water coming
                  into contact with electrical equipment, causing an electrical fault and failure of
                  the dehumidifier system.
                </p>
                <p>
                  Although the dehumidifier has now been repaired and returned to service, the
                  prolonged period of elevated humidity within the pool area caused damage to a
                  number of internal finishes. This included sections of ceiling and decorative
                  cornicing becoming unstable, with some areas partially detaching.
                </p>
                <p>
                  Following these concerns, Myreside instructed F3 Building Surveyors to inspect the
                  pool area and advise whether the facilities remained safe to use. Their
                  recommendation was that the facilities should remain closed until further
                  investigations and remedial works have been completed.
                </p>
                <p>
                  During the inspection, concerns were also raised regarding the possibility of
                  Reinforced Autoclaved Aerated Concrete (RAAC) being present within the structure
                  due to the age of the building. Further investigations were carried out on 28 May
                  2026, and RAAC has now been ruled out.
                </p>
                <p>
                  The surveyor&apos;s report identified a number of items requiring attention before the
                  pool can safely reopen. These include further inspection of the ceiling structure,
                  repairs to damaged or sagging ceiling sections, replacement or repair of loose
                  cornicing, replacement of deteriorated timber boxing around the pool perimeter,
                  inspection of lighting, repairs to flooring around poolside vents, maintenance
                  checks to pool mechanical and electrical systems, and repairs to balcony and tiled
                  areas.
                </p>
                <p>
                  Whilst some of these items could potentially be addressed through targeted repair
                  works, the report has also highlighted wider concerns regarding the overall
                  condition of parts of the pool area. This has prompted discussion about whether
                  owners should simply undertake the minimum repairs required to reopen the facility,
                  or whether a more comprehensive refurbishment project should be considered.
                </p>
                <p>
                  The matter was discussed with owners at the AGM held on Thursday 4 June 2026. No
                  decision has been taken yet. The committee had explored obtaining quotations for
                  immediate make-safe works which could potentially allow the facilities to reopen
                  sooner, but any major expenditure will be subject to further owner consultation
                  before it proceeds.
                </p>
                <p>
                  Options discussed range from temporary repairs of approximately £2,000–£3,000
                  through to a full refurbishment of the pool, sauna and gym facilities. At this
                  stage, owners are encouraged to keep an open mind until all information, reports and
                  potential costs have been fully considered.
                </p>
                <p>
                  The pool and associated facilities will remain closed until the necessary works have
                  been completed and the area has been confirmed safe for use. Full minutes from the
                  AGM will be made available and shared soon, with further updates provided as
                  additional information becomes available.
                </p>
                <div className="rounded-xl border border-sky-400/30 bg-white/35 p-4 text-sm font-medium text-neutral-800 shadow-sm dark:bg-white/10 dark:text-neutral-100">
                  Owners will be consulted before any major expenditure is progressed, and no final
                  decision has been taken on the future scope of pool, gym and sauna works.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read Full Update'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Telfer Subway Footpath Closure Notice
 *  ------------------------------------------------ */
export function TelferSubwayClosureNotice() {
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const refreshActiveState = () => setActive(isTelferSubwayNoticeActive());
    refreshActiveState();

    const millisecondsUntilExpiry = telferSubwayNoticeEndsAt.getTime() - Date.now();
    const expiryTimer =
      millisecondsUntilExpiry > 0 && millisecondsUntilExpiry <= 2_147_483_647
        ? window.setTimeout(refreshActiveState, millisecondsUntilExpiry)
        : undefined;

    return () => {
      if (expiryTimer) window.clearTimeout(expiryTimer);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-amber-400/30 border-l-amber-400 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-6 shadow-lg shadow-amber-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          <MapPinned className="h-3.5 w-3.5" />
          Temporary footpath closure
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Telfer Subway / Caledonian Crescent Closure
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          The Telfer Subway will be closed to pedestrians and cyclists from Monday 15 June to
          Friday 19 June 2026 while works are carried out near the Caledonian Crescent entrance.
          A signed diversion route will be in place during the closure.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="telfer-subway-map"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-amber-400/30 pt-4">
                <p>
                  Edinburgh Council have advised that the Telfer Subway will be fully closed from
                  Monday 15 June to Friday 19 June 2026. The closure is required due to safety and
                  space constraints while contractors carry out works to construct a new raised
                  table and footway close to the subway entrance at Caledonian Crescent.
                </p>
                <p>
                  Pedestrian and cyclist access through the subway will not be available during
                  this period. A fully signed diversion route will be in place, and residents
                  should allow extra time for journeys while the works are ongoing.
                </p>

                <div className="overflow-hidden rounded-xl border border-amber-400/25 bg-white/60 dark:bg-neutral-950/25">
                  <iframe
                    src={`${telferDiversionMapHref}#toolbar=1&navpanes=0`}
                    title="Telfer Subway diversion map for Caledonian Crescent footpath closure"
                    className="h-[420px] w-full sm:h-[560px]"
                  />
                </div>

                <a
                  href={telferDiversionMapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
                >
                  Open diversion map PDF
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Hide diversion map' : 'View diversion map'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  AGM Owner Voting Notice
 *  ------------------------------------------------ */
export function AGMOwnerVotingNotice() {
  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-cyan-400/30 border-l-cyan-400 bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-amber-500/10 p-6 shadow-lg shadow-cyan-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-900 dark:text-cyan-200">
          <CalendarDays className="h-3.5 w-3.5" />
          Owners&apos; notice
        </span>
        <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          Voting closes Monday 13 July 2026
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        AGM 2026 Owner Voting Now Open
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          Myreside Management has emailed proprietors the AGM voting documentation following the
          2026 AGM. Owners should read the official documents before voting and return completed
          forms directly to Ania Jennings at Myreside Management according to the email
          instructions.
        </p>
        <p>
          The AGM page now includes a plain-English summary of the Committee Constitution,
          Building Survey &amp; Planned Preventative Maintenance, and Swimming Pool &amp; Gym items.
        </p>
      </div>

      <Link
        href="/agm"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
      >
        View AGM voting summary
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** ------------------------------------------------
 *  AGM Summary
 *  ------------------------------------------------ */
export function AGMNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-violet-400/30 border-l-violet-400 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 p-6 shadow-lg shadow-violet-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-900 dark:text-violet-200">
          <CalendarDays className="h-3.5 w-3.5" />
          AGM summary
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        AGM Summary – 4 June 2026
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          The AGM reviewed recent estate matters, including the Fior handover and reconciliation,
          recovery of Trinity sinking fund balances, and the ongoing pool, gym and sauna closure.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="agm-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-violet-400/30 pt-4">
                <p>
                  Discussion covered options for the leisure facilities, the proposed update to
                  the building survey, and the need to plan future repair funds carefully. Owners
                  also considered committee growth, caretaker support and estate management
                  arrangements.
                </p>
                <p>
                  Further consultation will follow before key decisions are taken. Full minutes of
                  the AGM will be made available and shared soon.
                </p>
                <Link
                  href="/agm"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 transition-colors"
                >
                  <CalendarDays className="h-4 w-4" />
                  View AGM summary
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Orwell Terrace Roadworks Notice
 *  ------------------------------------------------ */
export function RoadworksNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-amber-400/30 border-l-amber-400 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-6 shadow-lg shadow-amber-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
          Residents update
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Orwell Terrace Roadworks (In Progress)
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          Roadworks at the end of Orwell Terrace are now underway and are expected to last around
          4 to 6 weeks. The junction with Dalry Road is currently closed, with a diversion in
          place. Access is being maintained where possible, although some disruption and parking
          restrictions should be expected.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="roadworks-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-amber-400/30 pt-4">
                <p>
                  Works are now in progress as part of the wider Dalry Side Streets improvement
                  project led by Edinburgh Council. This first phase focuses on upgrading the
                  footway at the junction of Orwell Terrace and Dalry Road, with construction
                  taking place on weekdays between 8am and 5pm.
                </p>
                <p>
                  Orwell Terrace is currently closed at its junction with Dalry Road. A signed
                  diversion route is in place, and access to homes and businesses is being
                  maintained wherever practical. Some parking spaces have been temporarily removed
                  to allow for construction activity, and residents are asked not to park in coned
                  off areas.
                </p>
                <p>
                  Communal bins have been temporarily relocated to the junction with Caledonian
                  Crescent. Emergency vehicle access and pedestrian routes remain available
                  throughout the works.
                </p>
                <p>
                  Further phases are planned, including additional footway improvements and
                  resurfacing works in the surrounding area. Dates for these will be confirmed
                  separately. While some disruption is expected, the overall aim is to improve the
                  condition, safety and appearance of the local streets.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  Myreside Management Notice
 *  ------------------------------------------------ */
export function MyresideNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jqs-glass rounded-2xl border border-l-[3px] border-emerald-400/30 border-l-emerald-400 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-6 shadow-lg shadow-emerald-900/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
          <Building2 className="h-3.5 w-3.5" />
          Property management
        </span>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Myreside Management
      </h2>

      <div className="mt-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <p>
          Myreside Management are the active property factor for James Square, taking over from
          Fior Asset &amp; Property on 1 February 2026. All owner payments, maintenance requests,
          and management queries should be directed to Myreside.
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="myreside-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-emerald-400/30 pt-4">
                <p>
                  Myreside handle day-to-day operations including owner communications, payments,
                  contractor coordination, and routine site oversight.
                </p>
                <p>
                  Owners should no longer make any payments to Fior Asset &amp; Property. If any
                  payments have been made to Fior after 1 February 2026, contact Fior directly to
                  request a refund. If you have not yet set up payment with Myreside, please
                  contact them as soon as possible.
                </p>

                <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-4 space-y-1 text-sm">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">Myreside Management Limited</p>
                  <p>3 Dalkeith Road Mews, Edinburgh EH16 5GA</p>
                  <p>
                    Tel:{' '}
                    <a href="tel:01314663001" className="font-medium hover:underline">
                      0131 466 3001
                    </a>
                  </p>
                  <p>
                    24hr Emergencies:{' '}
                    <span className="font-medium">0131 466 3001 – press 1</span>
                  </p>
                  <p>
                    Email:{' '}
                    <a
                      href="mailto:info@myreside-management.co.uk"
                      className="underline underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      info@myreside-management.co.uk
                    </a>
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs pt-1">
                    Monday – Friday, 9am – 5:30pm
                  </p>
                </div>

                <Link
                  href="/myreside"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  Myreside information page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'View more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}
