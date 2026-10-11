'use client';

/**
 * The October 2026 community announcements, shared by the homepage and /updates
 * so the wording only lives in one place. Their order, dates and visibility come
 * from `noticeSummaries` in ./notices.tsx; this file holds the content.
 */

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Info,
  Landmark,
  MessageCircle,
  QrCode,
  Users,
  Waves,
} from 'lucide-react';
import {
  COMMITTEE_MEETING_PATH,
  formatMeetingDate,
  formatMeetingTime12,
  formatMeetingTime24,
  relativeMeetingDay,
  upcomingMeetings,
} from '@/lib/committeeMeetingDates';
import { noticeSummaries, type NoticeSummary } from './notices';

/**
 * The community group's invitation link. To replace the invitation (for example
 * after resetting the link in WhatsApp), change it here: the button and the QR
 * code both follow.
 */
export const COMMUNITY_WHATSAPP_URL =
  'https://chat.whatsapp.com/EyIsRJB2nLGCKR5AADHXjO?s=cl&p=i&ilr=4&iam=2';

const glass =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';

const primaryButton = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 ${focusRing}`;

type CardProps = { className?: string; anchor?: boolean };

function notice(id: string): NoticeSummary {
  const found = noticeSummaries.find((n) => n.id === id);
  if (!found) throw new Error(`Unknown notice ${id}`);
  return found;
}

const toneStyles: Record<NoticeSummary['tone'], { border: string; icon: string; badge: string }> = {
  urgent: {
    border: 'border-l-rose-400',
    icon: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    badge: 'text-rose-800 dark:text-rose-300',
  },
  action: {
    border: 'border-l-sky-400',
    icon: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    badge: 'text-sky-800 dark:text-sky-300',
  },
  info: {
    border: 'border-l-amber-400',
    icon: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
    badge: 'text-amber-900 dark:text-amber-300',
  },
};

/** Shared shell: category, date, headline, body, actions. */
function AnnouncementCard({
  notice: n,
  icon: Icon,
  children,
  className = '',
  anchor = true,
}: {
  notice: NoticeSummary;
  icon: typeof Users;
  children: React.ReactNode;
  className?: string;
  /** False where the page already wraps the card in an element carrying the id. */
  anchor?: boolean;
}) {
  const tone = toneStyles[n.tone];
  const headingId = `${n.id}-heading`;
  return (
    <article
      id={anchor ? n.id : undefined}
      aria-labelledby={headingId}
      className={`${glass} scroll-mt-24 border-l-[3px] ${tone.border} p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.badge}`}>
          {n.badge}
        </p>
        <p className="ml-auto shrink-0 text-xs text-neutral-500 dark:text-neutral-400">{n.date}</p>
      </div>
      <h3
        id={headingId}
        className="mt-3 text-lg font-semibold leading-snug tracking-tight text-neutral-950 dark:text-white"
      >
        {n.title}
      </h3>
      <div className="mt-2 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </article>
  );
}

/** Keyboard-operable disclosure: a real button with aria-expanded and aria-controls. */
function Disclosure({
  label,
  openLabel = 'Show less',
  children,
}: {
  label: string;
  openLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-neutral-100 dark:hover:bg-white/10 ${focusRing}`}
      >
        {open ? openLabel : label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div id={regionId} hidden={!open} className="mt-4">
        {children}
      </div>
    </div>
  );
}

/** ------------------------------------------------
 *  WhatsApp QR code
 *  ------------------------------------------------ */
export function WhatsAppQrCode({ size = 148 }: { size?: number }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then((QR) =>
        QR.toString(COMMUNITY_WHATSAPP_URL, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
      )
      .then((markup) => {
        if (!cancelled) setSvg(markup);
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="QR code that opens the invitation to the James Square Community WhatsApp group"
      className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5"
      style={{ width: size + 16, height: size + 16 }}
    >
      {svg ? (
        // Generated locally from the constant above, never from user input.
        <div
          aria-hidden="true"
          className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div aria-hidden="true" className="h-full w-full animate-pulse rounded bg-neutral-100" />
      )}
    </div>
  );
}

/** ------------------------------------------------
 *  1. Community WhatsApp group (feature card)
 *  ------------------------------------------------ */
export function CommunityWhatsAppCard({ anchor = true }: CardProps) {
  const n = notice('community-whatsapp');
  return (
    <article
      id={anchor ? n.id : undefined}
      aria-labelledby="community-whatsapp-heading"
      className="jqs-glass scroll-mt-24 overflow-hidden rounded-2xl border border-emerald-600/20 bg-gradient-to-br from-emerald-500/10 via-white/55 to-teal-500/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-emerald-400/20 dark:from-emerald-400/10 dark:via-white/5 dark:to-teal-400/5"
    >
      <div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-start md:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
            >
              <MessageCircle className="h-4 w-4" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-300">
              New &middot; {n.badge}
            </p>
            <p className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">{n.date}</p>
          </div>

          <h2
            id="community-whatsapp-heading"
            className="mt-3 text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl"
          >
            {n.title}
          </h2>

          <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-[15px]">
            <p>We&apos;ve created a new WhatsApp group for everyone living at James Square.</p>
            <p>
              Whether you&apos;re an owner or a resident, the group provides an easy way to get to know
              your neighbours, share helpful information, ask questions and stay connected with the
              wider James Square community.
            </p>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              Everyone living at James Square is welcome to join.
            </p>
          </div>

          <div className="mt-5">
            <a
              href={COMMUNITY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 sm:w-auto sm:text-base ${focusRing}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {n.ctaLabel}
              <span className="sr-only"> (opens WhatsApp)</span>
            </a>
          </div>

          {/* On phones the QR code is secondary: tap the button instead. */}
          <details className="group mt-3 md:hidden">
            <summary
              className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full px-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 [&::-webkit-details-marker]:hidden ${focusRing}`}
            >
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Show QR code to scan from another device
              <ChevronDown
                className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-3 flex flex-col items-start gap-2">
              <WhatsAppQrCode size={160} />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Scan with your phone to join.
              </p>
            </div>
          </details>

          <div className="mt-5 space-y-2.5 border-t border-black/5 pt-4 text-sm leading-relaxed text-neutral-700 dark:border-white/10 dark:text-neutral-300">
            <p>
              This community group is open to James Square owners and residents. It is separate from
              the Committee WhatsApp group, which is used by committee members for committee
              business.
            </p>
            <p>
              Owners interested in becoming involved with the committee can find further information
              on the{' '}
              <Link
                href={COMMITTEE_MEETING_PATH}
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-sky-700 dark:text-neutral-100 dark:hover:text-sky-300"
              >
                Committee Meetings page
              </Link>
              .
            </p>
            <p className="flex gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                Joining is your choice: nobody is added to either group automatically. Members of a
                WhatsApp group may be able to see one another&apos;s phone numbers. The group is not an
                official channel for reporting urgent maintenance or emergencies: contact Myreside
                Management or the emergency services as usual.
              </span>
            </p>
          </div>
        </div>

        {/* Desktop and tablet: QR beside the announcement. */}
        <div className="hidden shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-black/5 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/5 md:flex">
          <WhatsAppQrCode size={156} />
          <p className="max-w-[11rem] text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Scan with your phone to join.
          </p>
        </div>
      </div>
    </article>
  );
}

/** ------------------------------------------------
 *  2. Committee meetings (dates from lib/committeeMeetings)
 *  ------------------------------------------------ */
function useMountedNow() {
  // Resolved after mount: the homepage is prerendered, so the build time is not "now".
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export function CommitteeMeetingsCard({ className, anchor }: CardProps) {
  const n = notice('committee-meetings');
  const now = useMountedNow();
  const upcoming = now ? upcomingMeetings(now) : [];
  const [next, following] = upcoming;
  const relative = next && now ? relativeMeetingDay(next, now) : null;

  return (
    <AnnouncementCard notice={n} icon={Users} className={className} anchor={anchor}>
      {now === null ? (
        <p className="text-neutral-500 dark:text-neutral-400">Loading meeting dates&hellip;</p>
      ) : next ? (
        <>
          <p>
            Our next committee meeting takes place {relative ? `${relative}, ` : 'on '}
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
              {formatMeetingDate(next)}
            </strong>
            , at {formatMeetingTime12(next)}.
            {following ? (
              <>
                {' '}
                The following meeting is scheduled for {formatMeetingDate(following)}
                {formatMeetingTime24(following) === formatMeetingTime24(next) ? ', also' : ','} at{' '}
                {formatMeetingTime12(following)}.
              </>
            ) : null}
          </p>
          <p>
            James Square owners are welcome to request attendance, either online via Microsoft Teams
            or in person at the Conservatory.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2" aria-label="Upcoming meeting dates">
            {upcoming.slice(0, 2).map((meeting, index) => (
              <li
                key={meeting.id}
                className="rounded-xl border border-black/5 bg-white/55 px-3.5 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                  {index === 0 ? 'Next meeting' : 'Following meeting'}
                </p>
                <p className="mt-1 flex items-start gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
                  <time dateTime={meeting.startsAt}>{formatMeetingDate(meeting)}</time>
                </p>
                <p className="mt-0.5 pl-[22px] text-xs text-neutral-600 dark:text-neutral-400">
                  {formatMeetingTime24(meeting)} &middot; Conservatory and Microsoft Teams
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          No upcoming committee meetings have been scheduled yet. New dates will be published on the
          Committee Meetings page as soon as they are agreed.
        </p>
      )}

      <Disclosure label="Attending as an owner">
        <div className="space-y-3">
          <p>
            Owners who would like to attend are asked to register their interest in advance using the
            Committee Meetings page.
          </p>
          <p>
            Please be aware that committee meetings are working meetings, rather than AGMs. Visiting
            owners are welcome to observe, with an opportunity for questions after committee
            discussions have concluded, subject to time available.
          </p>
        </div>
      </Disclosure>

      <div className="pt-1">
        <Link href={n.href ?? COMMITTEE_MEETING_PATH} className={primaryButton}>
          {n.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </AnnouncementCard>
  );
}

/** ------------------------------------------------
 *  3. Swimming pool: October 2026 update
 *  Source: Myreside Management, "James Square – Swimming Pool update – Oct 2026".
 *  ------------------------------------------------ */
function DetailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{children}</h4>
  );
}

export function PoolSafetyUpdateCard({ className, anchor }: CardProps) {
  const n = notice('pool-safety-review');
  return (
    <AnnouncementCard notice={n} icon={Waves} className={className} anchor={anchor}>
      <p>
        Myreside Management has issued an important update following an independent swimming pool
        safety review by the Royal Life Saving Society (RLSS UK).
      </p>
      <p>
        The review identified significant safety concerns with the existing pool design, particularly
        the steeply sloping sides and deep end.
      </p>
      <p>
        The pool will remain closed and is to be drained while repairs and further assessments take
        place. At this stage, the process of assessing and completing the necessary works is expected
        to take at least 12 months, potentially longer.
      </p>
      <p className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3.5 py-2.5 font-semibold text-neutral-900 dark:text-neutral-100">
        Owners are encouraged to check their emails from Myreside Management for the full update.
      </p>

      <Disclosure label="Read More About the Swimming Pool Update" openLabel="Show less">
        <div className="space-y-5 border-t border-black/5 pt-4 dark:border-white/10">
          <section className="space-y-2">
            <DetailHeading>What did the safety review identify?</DetailHeading>
            <p>
              The RLSS UK safety review examined the pool environment, access, emergency
              arrangements, rescue equipment, signage and management procedures.
            </p>
            <p>
              Its principal concern was the existing pool design, which features steeply sloping sides
              leading to a deep end of approximately 1.7 metres. This presents an increased risk of
              drowning or near-drowning, particularly where a person in difficulty may struggle to
              reach the edge.
            </p>
            <p>RLSS UK does not recommend reopening until suitable measures are implemented.</p>
            <p>
              One possible solution is to reduce the water depth to below 1.35 metres, with 1.2
              metres recommended. Alternative measures may also need consideration. No scheme has
              been approved.
            </p>
          </section>

          <section className="space-y-2">
            <DetailHeading>What happens to the pool now?</DetailHeading>
            <p>Myreside has decided to drain the pool.</p>
            <p>
              This will allow previously identified ceiling, cornice and other repairs to be carried
              out safely while reducing the ongoing costs of maintaining water quality and operating
              the pool plant.
            </p>
            <p>
              The pool will remain drained while the necessary repairs and further assessments are
              undertaken.
            </p>
          </section>

          <section className="space-y-2">
            <DetailHeading>What other safety measures are required?</DetailHeading>
            <p>The review identified additional matters requiring attention, including:</p>
            <ul className="list-disc space-y-1 pl-5 marker:text-neutral-400">
              <li>Formal pool risk assessments and safety operating procedures.</li>
              <li>Emergency and first-aid arrangements.</li>
              <li>Updated signage and pool rules.</li>
              <li>Access and booking arrangements.</li>
              <li>Pool inlet and outlet safety checks.</li>
              <li>Electrical, fire and plant-room safety.</li>
              <li>Emergency and contamination procedures.</li>
            </ul>
            <p>
              RLSS UK also recommended independent legal and insurance advice about the implications
              of short-term and Airbnb-type lets for pool classification, supervision and management
              requirements.
            </p>
          </section>

          <section className="space-y-2">
            <DetailHeading>What are the next steps?</DetailHeading>
            <p>Myreside will coordinate:</p>
            <ol className="list-decimal space-y-1 pl-5 marker:font-semibold marker:text-neutral-500">
              <li>Specialist advice and cost estimates for possible changes to the pool depth and design.</li>
              <li>Independent legal and insurance advice.</li>
              <li>Identification and costing of other required safety measures.</li>
              <li>Estimates of the scope, costs and timescales of the necessary work.</li>
              <li>Owner engagement and any approvals required before major works proceed.</li>
            </ol>
            <p>
              An Extraordinary General Meeting or another appropriate approval process may be
              necessary, depending on the proposals.
            </p>
          </section>

          <section className="space-y-2">
            <DetailHeading>When might the pool reopen?</DetailHeading>
            <p>
              Myreside has advised that the process is likely to take at least 12 months and may take
              longer. There is currently no confirmed reopening date.
            </p>
            <p>
              No final decision has been made regarding the future of the swimming pool. The next
              stage involves obtaining professional advice, identifying options and establishing costs
              so that owners can make informed decisions.
            </p>
          </section>

          <div className="space-y-1.5 rounded-xl border border-black/5 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Please check your emails from Myreside Management for the full October 2026 swimming
              pool update.
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              This summary is provided for convenience and does not replace the original
              correspondence from Myreside Management.
            </p>
          </div>
        </div>
      </Disclosure>
    </AnnouncementCard>
  );
}

/** ------------------------------------------------
 *  4. FIOR Property Assets information
 *  ------------------------------------------------ */
export function FiorInfoCard({ className, anchor }: CardProps) {
  const n = notice('fior-info');
  return (
    <AnnouncementCard notice={n} icon={Landmark} className={className} anchor={anchor}>
      <p>
        Following the change of property factor earlier this year, the James Square Owners Committee
        has published a dedicated information resource for owners who may have questions about
        payments made to FIOR Property Assets.
      </p>
      <p>
        The information covers the changeover to Myreside Management, concerns reported by individual
        owners, outstanding communal funds and guidance on options that owners may wish to consider
        where they believe money remains due to them.
      </p>
      <p>
        It also provides information about concerns reported to Police Scotland and explains how
        owners can seek further information if they wish.
      </p>
      <p className="flex gap-2 rounded-xl border border-black/5 bg-white/55 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          This is an independent information resource prepared for James Square owners. It provides
          general information and does not constitute legal advice. Reported concerns should not be
          treated as findings of wrongdoing.
        </span>
      </p>
      <div className="pt-1">
        <Link href={n.href ?? '/fior-info'} className={primaryButton}>
          {n.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </AnnouncementCard>
  );
}
