"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  DoorOpen,
  HeartHandshake,
  ListChecks,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Users,
} from "lucide-react";
import {
  londonToday,
  meetingCalendar,
  meetingLabel,
  monthLabel,
  splitMeetings,
  type Attendance,
  type Meeting,
  type MeetingHub,
} from "@/lib/committeeMeetings";
import { minutesFor, publishedMinutes } from "@/lib/committeeMinutes";
import ResidentWhatsAppGate from "@/components/community/ResidentWhatsAppGate";
import MeetingMinutes from "./MeetingMinutes";
import RequestForm from "./RequestForm";
import { card, input, muted, primary, secondary } from "./styles";

function Agenda({ meeting }: { meeting: Meeting }) {
  return (
    <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <ListChecks
          size={19}
          aria-hidden="true"
          className="text-emerald-700 dark:text-emerald-300"
        />
        {monthLabel(meeting)} Meeting Agenda
      </h3>
      {meeting.agenda.length ? (
        <ol className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {meeting.agenda.map((a, i) => (
            <li key={`${i}-${a.title}`} className="flex gap-4 py-3.5">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="text-sm font-semibold">{a.title}</h4>
                {a.description && (
                  <p className={`mt-1 ${muted}`}>{a.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className={`mt-4 ${muted}`}>Agenda to be confirmed</p>
      )}
    </div>
  );
}
export default function MeetingCommunityHub({
  hub,
  today: initialToday,
}: {
  hub: MeetingHub;
  today: string;
}) {
  const [today, setToday] = useState(initialToday);
  const { upcoming, past } = splitMeetings(hub.meetings, today);
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id ?? "");
  const [attendance, setAttendance] = useState<Attendance>("unsure");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState<{
    teamsUrl: string;
    meeting: Meeting;
  } | null>(null);
  const [accessError, setAccessError] = useState("");
  const [copied, setCopied] = useState("");
  const [membershipOpen, setMembershipOpen] = useState(false);
  const minutes = publishedMinutes();
  const [openMinutes, setOpenMinutes] = useState<string | null>(null);
  const rsvpHeading = useRef<HTMLHeadingElement>(null),
    accessHeading = useRef<HTMLHeadingElement>(null),
    membershipHeading = useRef<HTMLHeadingElement>(null);
  const attempt = useRef(0);
  const selected = upcoming.find((m) => m.id === selectedId);
  const activeUnlocked =
    unlocked?.meeting.id === selectedId && selected ? unlocked : null;
  useEffect(() => {
    // The page is cached, so the server's date can be a few minutes old.
    setToday(londonToday());
    const interval = setInterval(() => setToday(londonToday()), 60_000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (
      !hub.meetings.some(
        (m) => m.id === selectedId && splitMeetings([m], today).upcoming.length,
      )
    ) {
      setSelectedId(splitMeetings(hub.meetings, today).upcoming[0]?.id ?? "");
      setUnlocked(null);
      setVerified(false);
    }
  }, [today, hub.meetings, selectedId]);
  // Once unlocked, move straight to the Join button so one more tap opens Teams.
  const unlockedUrl = activeUnlocked?.teamsUrl;
  useEffect(() => {
    if (unlockedUrl) document.getElementById("join-teams-link")?.focus();
  }, [unlockedUrl]);
  const focusSection = (ref: RefObject<HTMLHeadingElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    ref.current?.focus({ preventScroll: true });
  };
  const openMembership = () => {
    setMembershipOpen(true);
    focusSection(membershipHeading);
  };
  const readMinutes = (meetingId: string) => {
    setOpenMinutes(meetingId);
    document.getElementById(`minutes-${meetingId}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    document
      .getElementById(`minutes-${meetingId}-heading`)
      ?.focus({ preventScroll: true });
  };
  const rsvp = (id = selectedId, method: Attendance = "unsure") => {
    changeMeeting(id);
    setAttendance(method);
    focusSection(rsvpHeading);
  };
  const unlock = async (id = selectedId) => {
    const sequence = ++attempt.current;
    setUnlocking(true);
    setAccessError("");
    setUnlocked(null);
    try {
      const response = await fetch("/api/committee-meetings/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: id, code }),
      });
      const data = await response.json();
      if (sequence !== attempt.current) return;
      if (!response.ok)
        throw new Error(data.error ?? "Unable to unlock the meeting.");
      setUnlocked(data);
      setVerified(true);
    } catch (error) {
      if (sequence === attempt.current) {
        setAccessError(
          error instanceof Error ? error.message : "Please try again later.",
        );
        setVerified(false);
      }
    } finally {
      if (sequence === attempt.current) setUnlocking(false);
    }
  };
  const joinOnline = (id = selectedId) => {
    changeMeeting(id);
    focusSection(accessHeading);
    // Put the cursor straight into the code box when it is showing.
    window.setTimeout(
      () =>
        document.getElementById("meeting-code")?.focus({ preventScroll: true }),
      0,
    );
  };
  const changeMeeting = (id: string) => {
    if (id === selectedId) return;
    ++attempt.current;
    setSelectedId(id);
    setUnlocked(null);
    setAccessError("");
    setUnlocking(false);
    if (verified) void unlock(id);
  };
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(`${label} copied.`);
    } catch {
      setCopied(
        "Copy is unavailable in this browser. Use the join button or copy its link.",
      );
    }
  };
  const calendar = () => {
    if (!activeUnlocked) return;
    const text = meetingCalendar(
      activeUnlocked.meeting,
      activeUnlocked.teamsUrl,
    );
    if (!text) return;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeUnlocked.meeting.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div
      id="committee-community-hub"
      className="mx-auto max-w-6xl space-y-8 rounded-3xl bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10 dark:bg-slate-950 dark:text-slate-100"
    >
      <header className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[50px] border-blue-500/10"
        />
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          James Square · Owners &amp; neighbours
        </p>
        <h1 className="relative mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Committee Meetings{" "}
          <span className="text-blue-200">&amp; Community</span>
        </h1>
        <p className="relative mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          A place to stay informed, have your voice heard and help look after
          the place we call home. Explore the agenda, request a seat or get
          involved.
        </p>
        {upcoming[0] && (
          <div className="relative mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <CalendarDays size={18} aria-hidden="true" />
              Next: {meetingLabel(upcoming[0])}
              {!upcoming[0].date && " · date to be confirmed"}
              {upcoming[0].time && ` · ${upcoming[0].time}`}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} aria-hidden="true" />
              {upcoming[0].location}
            </span>
          </div>
        )}
        <div className="relative mt-8 flex flex-wrap gap-3">
          <button
            disabled={!upcoming.length}
            onClick={() => rsvp(upcoming[0]?.id)}
            className={primary}
          >
            Request to attend <ArrowUpRight size={18} aria-hidden="true" />
          </button>
          <button
            disabled={!upcoming.length}
            onClick={() => joinOnline(upcoming[0]?.id)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-60"
          >
            <MonitorSmartphone size={18} aria-hidden="true" />
            Join online
          </button>
          <a
            href="#upcoming-meetings"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore the meetings <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </header>
      <nav
        aria-label="On this page"
        className="flex flex-wrap gap-x-6 gap-y-3 border-b border-slate-200 pb-5 text-sm font-medium dark:border-slate-700"
      >
        {[
          ["#upcoming-meetings", "Upcoming meetings"],
          ...(minutes.length ? [["#meeting-minutes", "Meeting minutes"]] : []),
          ["#online-access", "Online access"],
          ["#previous-meetings", "Previous meetings"],
          ["#join-committee", "Join the committee"],
          ["#community-whatsapp", "Community WhatsApp"],
        ].map(([href, text]) => (
          <a
            key={href}
            href={href}
            className="min-h-8 text-slate-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
          >
            {text}
          </a>
        ))}
      </nav>
      <section
        id="upcoming-meetings"
        aria-labelledby="upcoming-heading"
        className="scroll-mt-24"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:text-blue-300">
              Make time for your community
            </p>
            <h2
              id="upcoming-heading"
              className="mt-2 text-2xl font-semibold tracking-tight"
            >
              Upcoming Committee Meetings
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {upcoming.length} planned
          </span>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {upcoming.map((meeting, index) => (
            <article
              key={meeting.id}
              className={`${card} ${index === 0 ? "border-t-4 border-t-blue-700 lg:row-span-2" : ""}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:text-blue-300">
                {index === 0 ? "Next meeting" : "Looking ahead"}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {meetingLabel(meeting)}
              </h3>
              <p className={`mt-2 ${muted}`}>{meeting.title}</p>
              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex gap-2">
                  <dt className="font-medium">Date:</dt>
                  <dd>
                    {meeting.date ? (
                      <time dateTime={meeting.date}>
                        {meetingLabel(meeting)}
                      </time>
                    ) : (
                      `${meetingLabel(meeting)} · date to be confirmed`
                    )}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium">Time:</dt>
                  <dd>
                    {meeting.time
                      ? `${meeting.time} (UK time)`
                      : "To be confirmed"}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue-700 dark:text-blue-300"
                  />
                  <dt className="sr-only">Location</dt>
                  <dd>{meeting.location}</dd>
                </div>
                <div className="flex gap-2">
                  <MonitorSmartphone
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue-700 dark:text-blue-300"
                  />
                  <dt className="sr-only">Online</dt>
                  <dd>Microsoft Teams · RSVP and access code required</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => rsvp(meeting.id)}
                  className={index === 0 ? primary : secondary}
                >
                  Request attendance
                </button>
                <button
                  onClick={() => joinOnline(meeting.id)}
                  className={secondary}
                >
                  <MonitorSmartphone size={16} aria-hidden="true" />
                  Join online
                </button>
              </div>
              <Agenda meeting={meeting} />
            </article>
          ))}
        </div>
        {!upcoming.length && (
          <p className={card}>
            No upcoming meeting has been confirmed. Please check back for the
            next date.
          </p>
        )}
      </section>
      {minutes.length > 0 && (
        <section
          id="meeting-minutes"
          aria-labelledby="minutes-heading"
          className="scroll-mt-24"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
            What was discussed
          </p>
          <h2
            id="minutes-heading"
            className="mt-2 text-2xl font-semibold tracking-tight"
          >
            Meeting Minutes
          </h2>
          <p className={`mb-5 mt-2 ${muted}`}>
            A summary of each meeting, with the full minutes available to read.
          </p>
          <div className="space-y-5">
            {minutes.map((m, i) => (
              <MeetingMinutes
                key={m.meetingId}
                minutes={m}
                latest={i === 0}
                expanded={openMinutes === m.meetingId}
                onToggle={() =>
                  setOpenMinutes(
                    openMinutes === m.meetingId ? null : m.meetingId,
                  )
                }
                onGetInvolved={openMembership}
              />
            ))}
          </div>
        </section>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
        <section
          id="request-attendance"
          aria-labelledby="rsvp-heading"
          className={`${card} scroll-mt-24`}
        >
          <Users
            aria-hidden="true"
            className="mb-4 h-6 w-6 text-blue-700 dark:text-blue-300"
          />
          <h2
            ref={rsvpHeading}
            tabIndex={-1}
            id="rsvp-heading"
            className="scroll-mt-24 text-2xl font-semibold"
          >
            Request to Attend a Committee Meeting
          </h2>
          <p className={`mb-6 mt-3 ${muted}`}>
            James Square owners are welcome to attend committee meetings either
            in person or remotely. To help us manage attendance, please provide
            your details below. The committee will review your request and send
            you further information, including the online meeting access code
            where applicable.
          </p>
          <RequestForm
            kind="rsvp"
            meetings={upcoming}
            selectedId={selectedId}
            onMeetingChange={changeMeeting}
            attendance={attendance}
            onAttendanceChange={setAttendance}
          />
        </section>
        <div className="space-y-6">
          <section
            id="online-access"
            aria-labelledby="access-heading"
            className={`${card} scroll-mt-24 bg-blue-50/40 dark:bg-slate-900`}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {activeUnlocked ? (
                <Check aria-hidden="true" />
              ) : (
                <LockKeyhole aria-hidden="true" />
              )}
            </div>
            <h2
              ref={accessHeading}
              tabIndex={-1}
              id="access-heading"
              className="scroll-mt-24 text-2xl font-semibold"
            >
              Join the Meeting Online
            </h2>
            <p className={`mt-3 ${muted}`}>
              Enter the meeting access code to open the Microsoft Teams link.
              Don&apos;t have the code? Request it using the RSVP form and the
              committee will email it to you.
            </p>
            <button
              onClick={() => rsvp(selectedId, "online")}
              className={`mt-5 ${secondary}`}
            >
              Request Access / RSVP
            </button>
            <label
              htmlFor="access-meeting"
              className="mt-6 block text-sm font-medium"
            >
              Select your meeting
              <select
                id="access-meeting"
                value={selectedId}
                onChange={(e) => changeMeeting(e.target.value)}
                className={input}
              >
                <option value="" disabled>
                  Select a meeting
                </option>
                {upcoming.map((m) => (
                  <option key={m.id} value={m.id}>
                    {meetingLabel(m)}
                  </option>
                ))}
              </select>
            </label>
            {!activeUnlocked ? (
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void unlock();
                }}
              >
                <label
                  htmlFor="meeting-code"
                  className="block text-sm font-medium"
                >
                  Access Code
                  <input
                    id="meeting-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9 -]*"
                    autoComplete="off"
                    required
                    maxLength={64}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    aria-describedby="code-help"
                    className={input}
                  />
                </label>
                <p id="code-help" className={muted}>
                  Numbers only; hyphens and spaces are fine. Press Enter or
                  Unlock to continue.
                </p>
                <button
                  disabled={unlocking || !selected}
                  className={`w-full ${primary}`}
                  type="submit"
                >
                  <LockKeyhole size={16} aria-hidden="true" />
                  {unlocking ? "Checking access…" : "Unlock Meeting"}
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-800 dark:bg-slate-950">
                <p
                  role="status"
                  className="text-sm font-semibold text-emerald-800 dark:text-emerald-200"
                >
                  Meeting access unlocked
                </p>
                <p className={`mt-2 ${muted}`}>
                  {meetingLabel(activeUnlocked.meeting)} ·{" "}
                  {activeUnlocked.meeting.time ?? "Time to be confirmed"}
                  {activeUnlocked.meeting.time && " (UK time)"}
                </p>
                <a
                  id="join-teams-link"
                  href={activeUnlocked.teamsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 w-full ${primary}`}
                >
                  <MonitorSmartphone size={17} aria-hidden="true" />
                  Join on Microsoft Teams
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      void copy(activeUnlocked.teamsUrl, "Meeting link")
                    }
                    className={`${secondary} !px-3`}
                  >
                    <Copy size={15} aria-hidden="true" />
                    Copy meeting link
                  </button>
                  {activeUnlocked.meeting.date && (
                    <button onClick={calendar} className={`${secondary} !px-3`}>
                      <CalendarDays size={15} aria-hidden="true" />
                      Add to Calendar
                    </button>
                  )}
                </div>
                {!activeUnlocked.meeting.time && (
                  <p className={`mt-3 ${muted}`}>
                    {activeUnlocked.meeting.date
                      ? "Calendar downloads are date reminders only. The meeting time is still to be confirmed."
                      : "A calendar reminder will be available once the meeting date is confirmed."}
                  </p>
                )}
                <button
                  className="mt-4 min-h-11 text-sm text-slate-600 underline dark:text-slate-300"
                  onClick={() => {
                    ++attempt.current;
                    setUnlocked(null);
                    setVerified(false);
                    setCode("");
                  }}
                >
                  Lock meeting details
                </button>
              </div>
            )}
            {accessError && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-700 dark:text-red-300"
              >
                {accessError}
              </p>
            )}
            <p className={`mt-5 ${muted}`}>
              Please keep meeting details private. Microsoft Teams organiser
              controls and lobby permissions continue to apply.
            </p>
          </section>
          <section aria-labelledby="in-person-heading" className={card}>
            <DoorOpen
              aria-hidden="true"
              className="mb-4 h-6 w-6 text-emerald-700 dark:text-emerald-300"
            />
            <h2 id="in-person-heading" className="text-xl font-semibold">
              Attending in Person
            </h2>
            <div className={`mt-3 space-y-3 ${muted}`}>
              <p>
                Owners are also welcome to attend committee meetings in person
                at the Conservatory, James Square.
              </p>
              <p>
                The Conservatory will be left accessible for those attending at
                the scheduled meeting time.
              </p>
              <p>
                Please be aware that seating is limited. If attendance is higher
                than anticipated, it may be necessary to relocate the meeting to
                another suitable area.
              </p>
              <p>
                We would appreciate owners completing the RSVP form in advance
                so we can plan accordingly.
              </p>
            </div>
            <button
              onClick={() => rsvp(selectedId, "in-person")}
              className={`mt-5 w-full ${secondary}`}
            >
              RSVP for In-Person Attendance
            </button>
          </section>
        </div>
      </div>
      <section aria-labelledby="guidelines-heading" className={card}>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:text-blue-300">
          A constructive conversation
        </p>
        <h2 id="guidelines-heading" className="mt-2 text-2xl font-semibold">
          Attending a Committee Meeting
        </h2>
        <div className={`mt-5 grid gap-5 md:grid-cols-2 ${muted}`}>
          <div className="space-y-3">
            <p>
              James Square owners are welcome to attend and observe committee
              meetings.
            </p>
            <p>
              Please remember that committee meetings are working meetings for
              committee members to discuss matters relating to the management
              and upkeep of James Square. They are different from Annual General
              Meetings (AGMs), and not all matters can necessarily be addressed
              during these sessions.
            </p>
            <p>
              To allow the committee to conduct its business efficiently,
              visiting owners will be asked to observe while the scheduled
              agenda is discussed.
            </p>
          </div>
          <div className="space-y-3">
            <p>
              Once the committee has completed its discussions, there will be an
              opportunity for attending owners to raise questions or provide
              comments, subject to the time available and the discretion of the
              Chair.
            </p>
            <p>
              If you have a particular issue you would like raised, please
              include it when completing your RSVP form so the committee can
              consider it in advance.
            </p>
            <p>
              Thank you for respecting the meeting arrangements and helping us
              keep discussions constructive and productive.
            </p>
          </div>
        </div>
        <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-100">
          Attendance does not automatically confer speaking or voting rights.
          All rights granted by the association’s constitution remain in place.
        </p>
      </section>
      <section
        id="previous-meetings"
        aria-labelledby="archive-heading"
        className="scroll-mt-24"
      >
        <h2 id="archive-heading" className="text-2xl font-semibold">
          Previous Meetings &amp; Agendas
        </h2>
        <p className={`mb-5 mt-2 ${muted}`}>
          The record of what was scheduled for discussion. Where minutes have
          been published, you can open them from here.
        </p>
        <div className="space-y-3">
          {past.map((m) => (
            <details
              key={m.id}
              className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                <span className="font-semibold">{meetingLabel(m)}</span>
                <span className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Past Meeting
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="px-5 pb-6 sm:px-7">
                <p className={muted}>
                  {m.location} · {m.time ?? "Time was not confirmed"}
                </p>
                <Agenda meeting={m} />
                {minutesFor(m.id) && (
                  <button
                    type="button"
                    onClick={() => readMinutes(m.id)}
                    className={`mt-5 ${secondary}`}
                  >
                    Read the meeting minutes
                  </button>
                )}
                {m.approvedMinutes && (
                  <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
                    <h3 className="font-semibold">Approved meeting minutes</h3>
                    <p className={`mt-2 whitespace-pre-wrap ${muted}`}>
                      {m.approvedMinutes}
                    </p>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      <section
        id="join-committee"
        aria-labelledby="membership-heading"
        className={`${card} scroll-mt-24`}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <HeartHandshake
              aria-hidden="true"
              className="mb-4 h-7 w-7 text-blue-700 dark:text-blue-300"
            />
            <h2
              ref={membershipHeading}
              tabIndex={-1}
              id="membership-heading"
              className="scroll-mt-24 text-2xl font-semibold"
            >
              Interested in Joining the Committee?
            </h2>
            <p className={`mt-3 ${muted}`}>
              Would you like to become more involved in helping look after James
              Square?
            </p>
            <p className={`mt-2 ${muted}`}>
              We welcome interest from owners who would like to contribute to
              the community, share ideas and support the work of the committee.
            </p>
            <p className={`mt-2 ${muted}`}>
              We are also looking for volunteers to help with the proposed
              Swimming Pool Focus Group and with communications, website updates
              and social media. You can register interest in either using this
              form.
            </p>
          </div>
          <button
            aria-expanded={membershipOpen}
            aria-controls="membership-form"
            onClick={() => {
              setMembershipOpen(!membershipOpen);
              focusSection(membershipHeading);
            }}
            className={`${secondary} self-center`}
          >
            {membershipOpen
              ? "Close membership form"
              : "Request to Join the Committee"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
        {membershipOpen && (
          <div
            id="membership-form"
            className="mt-7 border-t border-slate-200 pt-7 dark:border-slate-700"
          >
            <h3 className="mb-5 text-lg font-semibold">
              Committee Membership Enquiry
            </h3>
            <RequestForm kind="membership" meetings={[]} />
          </div>
        )}
      </section>
      <section
        id="community-whatsapp"
        aria-labelledby="whatsapp-heading"
        className="scroll-mt-24 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-9 dark:border-emerald-800 dark:bg-emerald-950/40"
      >
        <div>
          <MessageCircle
            aria-hidden="true"
            className="mb-4 h-8 w-8 text-emerald-800 dark:text-emerald-200"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-200">
            Say hello to your neighbours
          </p>
          <h2
            id="whatsapp-heading"
            className="mt-2 text-2xl font-semibold sm:text-3xl"
          >
            Join the James Square Community WhatsApp Group
          </h2>
          <div className={`mt-4 space-y-3 ${muted}`}>
            <p>
              We&apos;ve created a new James Square Community WhatsApp group
              for owners and residents who would like an easy way to keep in
              touch with their neighbours.
            </p>
            <p>
              The group is a space to communicate, share helpful information
              and discuss matters relating to day-to-day life at James Square.
            </p>
            <p>
              Whether you are an owner or a resident, you&apos;re welcome to
              join and be part of our community.
            </p>
          </div>
          <div className="mt-6 max-w-2xl">
            <ResidentWhatsAppGate
              group="community"
              ctaLabel="Join Community WhatsApp Group"
              groupName="the James Square Community WhatsApp group"
              qrSize={180}
            />
          </div>
          <p className={`mt-4 ${muted}`}>
            This community group is separate from the private Committee
            WhatsApp group. Other WhatsApp participants may be able to see
            your name and telephone number.
          </p>
        </div>
        <p className="mt-7 border-t border-emerald-200 pt-5 text-sm leading-relaxed text-emerald-950 dark:border-emerald-800 dark:text-emerald-100">
          This is an informal community communication group and is not a
          replacement for official notices, emergency reporting or contacting
          the property factor. Please be respectful of fellow residents.
        </p>
      </section>
      <p
        role="status"
        aria-live="polite"
        className="min-h-6 text-sm text-blue-800 dark:text-blue-200"
      >
        {copied}
      </p>
    </div>
  );
}
