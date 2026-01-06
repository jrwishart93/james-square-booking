import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, Clock, MonitorSmartphone, Users } from "lucide-react";

const meetingTitle = "James Square – Extraordinary General Meeting";
const pageUrl = "https://www.james-square.com/egm";
const teamsLink =
  "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZjI4NmMzZjYtYmI3OS00ZDk3LTg1ZDgtNGE5NDI3YmExNzA1%40thread.v2/0?context=%7b%22Tid%22%3a%22f5c44b19-1c42-4ad7-b10e-1d2fcf2b71d3%22%2c%22Oid%22%3a%2290c27962-4d1a-4d45-8e9e-ff0f7b30452b%22%7d";
const meetingDescription =
  "This Extraordinary General Meeting has been arranged for owners at James Square to discuss and vote on a potential change to the property factor. The meeting will be held online to allow as many owners as possible to attend.";

const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  meetingTitle
)}&dates=20260121T180000Z/20260121T203000Z&details=${encodeURIComponent(
  `${meetingDescription}\n\nJoin online via Microsoft Teams: ${teamsLink}\nEGM details: ${pageUrl}`
)}&location=${encodeURIComponent("Online via Microsoft Teams")}`;

const icsFilePath = "/calendar/james-square-egm-2026.ics";

export const metadata: Metadata = {
  title: "James Square – Extraordinary General Meeting",
  description:
    "Details of the James Square Extraordinary General Meeting, including joining instructions and calendar links.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "James Square – Extraordinary General Meeting",
    description:
      "Details of the James Square Extraordinary General Meeting, including joining instructions and calendar links.",
    url: pageUrl,
    siteName: "James Square",
  },
};

export default function EGMPage() {
  const logoSize = { width: 22, height: 22 };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 shadow-xl px-6 sm:px-10 py-10 max-w-5xl mx-auto">
      <GradientGlow />

      <div className="space-y-8 relative">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/80 px-4 py-2 shadow-sm backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Official meeting link for owners
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                James Square
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Extraordinary General Meeting (EGM)
              </h1>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100 shadow-sm flex items-start gap-3">
              <div className="mt-1">
                <Image
                  src="/images/brands/microsoft-teams.svg"
                  alt="Microsoft Teams"
                  {...logoSize}
                  className="drop-shadow-sm"
                />
              </div>
              <div>
                <p className="font-semibold">Online via Microsoft Teams</p>
                <p className="text-emerald-800/90 dark:text-emerald-100/90">Wednesday, 21 January 2026</p>
                <p className="text-emerald-800/90 dark:text-emerald-100/90">18:00 – 20:30 (GMT)</p>
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl">
            {meetingDescription}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/70 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" aria-hidden />
              Meeting at a glance
            </h2>

            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail icon={<Calendar className="h-4 w-4" />} label="Date" value="Wednesday, 21 January 2026" />
              <Detail icon={<Clock className="h-4 w-4" />} label="Time" value="18:00 – 20:30 (GMT)" />
              <Detail icon={<MonitorSmartphone className="h-4 w-4" />} label="Format" value="Online via Microsoft Teams" />
              <Detail icon={<Users className="h-4 w-4" />} label="Audience" value="Owners of properties at James Square" />
            </dl>

            <div className="space-y-3">
              <a
                href={teamsLink}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Image
                  src="/images/brands/microsoft-teams.svg"
                  alt="Microsoft Teams"
                  {...logoSize}
                  className="drop-shadow-sm"
                />
                Join EGM on Microsoft Teams
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The link opens in a new tab. No login is required to view this page.
              </p>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Add to your calendar
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Save the meeting with joining details in your preferred calendar.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Image
                  src="/images/brands/google-calendar.svg"
                  alt="Google Calendar"
                  {...logoSize}
                  className="drop-shadow-sm"
                />
                Add to Google Calendar
              </a>
              <a
                href={icsFilePath}
                download="james-square-egm-2026.ics"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Image
                  src="/images/brands/apple-calendar.svg"
                  alt="Apple Calendar"
                  {...logoSize}
                  className="drop-shadow-sm"
                />
                Add to Apple Calendar
              </a>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              Both options include the Teams link and a reminder of this official page for reference.
            </div>
          </div>
        </section>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please try to join a few minutes early if possible so the meeting can start on time. Also it is advised that
          users sign up or into their James-Square.com account ahead of time so that they can access the relevant
          documentation and participate in voting.
        </p>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/90 dark:bg-slate-800/70 px-4 py-3 border border-slate-200/70 dark:border-slate-700/70 shadow-sm flex items-start gap-3">
      <div className="mt-1 h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-200 inline-flex items-center justify-center">
        {icon}
      </div>
      <div>
        <dt className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</dt>
        <dd className="mt-1 text-base text-slate-900 dark:text-slate-100">{value}</dd>
      </div>
    </div>
  );
}

function GradientGlow() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 -right-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute -bottom-10 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/40 dark:border-white/5 shadow-[0_40px_120px_rgba(15,23,42,0.25)]" />
    </>
  );
}
