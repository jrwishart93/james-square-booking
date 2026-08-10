import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  DoorOpen,
  ExternalLink,
  ListChecks,
  MapPin,
  MonitorSmartphone,
} from "lucide-react";

const teamsLink =
  "https://teams.live.com/meet/9392352296034?p=TlgOqGScBL4kqTLwZV";

const agendaItems = [
  "Introductions for new members",
  "Official acceptance of the constitution",
  "Discussion and election of office holders",
  "Discussion on emergency contacts and alarm responders",
  "Jimmy meeting update",
  "Agreement on wages to allow instruction to Myreside Management",
  "Discussion on access and key holders",
  "Update on Fior next steps",
  "Update on the JSPA account",
];

export const metadata: Metadata = {
  title: "Committee Meeting – 10 August 2026 | James Square",
  description:
    "Joining details and agenda for the James Square committee meeting on 10 August 2026 at 18:00.",
  alternates: {
    canonical: "/committee-meeting",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CommitteeMeetingPage() {
  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative space-y-8 px-5 py-7 sm:px-10 sm:py-10">
        <header className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Open meeting information — no sign-in required
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
              James Square
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Committee meeting
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Join us today, Monday 10 August 2026, either in person at the
              conservatory or online using Microsoft Teams.
            </p>
          </div>
        </header>

        <section aria-labelledby="meeting-details-heading">
          <h2 id="meeting-details-heading" className="sr-only">
            Meeting details
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MeetingDetail
              icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
              label="Date"
              value={<time dateTime="2026-08-10">Monday 10 August 2026</time>}
            />
            <MeetingDetail
              icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
              label="Time"
              value={<time dateTime="2026-08-10T18:00:00+01:00">18:00</time>}
            />
            <MeetingDetail
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              label="In person"
              value="The conservatory at James Square"
            />
            <MeetingDetail
              icon={<MonitorSmartphone className="h-5 w-5" aria-hidden="true" />}
              label="Online"
              value="Microsoft Teams"
            />
          </dl>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm dark:bg-slate-800">
                <Image
                  src="/images/brands/microsoft-teams.svg"
                  alt=""
                  width={28}
                  height={28}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  Join on Microsoft Teams
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Tap the button below, or copy and paste the meeting link into
                  your browser to join.
                </p>
              </div>
            </div>

            <a
              href={teamsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Join the Teams meeting
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href={teamsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all rounded-xl border border-blue-200 bg-white/80 px-4 py-3 text-sm text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900 dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-300 dark:hover:text-blue-200"
            >
              {teamsLink}
            </a>

            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              <DoorOpen className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>
                <strong>Arriving in person?</strong> The conservatory door will
                be wedged open.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <ListChecks className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Agenda
              </h2>
            </div>

            <ol className="mt-5 space-y-3">
              {agendaItems.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function MeetingDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <span className="text-blue-600 dark:text-blue-300">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-slate-900 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}
