import type { Metadata } from "next";

const meetingTitle = "James Square – Special General Meeting";
const pageUrl = "https://www.james-square.com/egm";
const teamsLink =
  "https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZjI4NmMzZjYtYmI3OS00ZDk3LTg1ZDgtNGE5NDI3YmExNzA1%40thread.v2/0?context=%7b%22Tid%22%3a%22f5c44b19-1c42-4ad7-b10e-1d2fcf2b71d3%22%2c%22Oid%22%3a%2290c27962-4d1a-4d45-8e9e-ff0f7b30452b%22%7d";
const meetingDescription =
  "This Special General Meeting has been arranged for owners at James Square to discuss and vote on a potential change to the property factor. The meeting will be held online to allow as many owners as possible to attend.";

const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  meetingTitle
)}&dates=20260121T180000Z/20260121T203000Z&details=${encodeURIComponent(
  `${meetingDescription}\n\nJoin online via Microsoft Teams: ${teamsLink}\nEGM details: ${pageUrl}`
)}&location=${encodeURIComponent("Online via Microsoft Teams")}`;

const icsFilePath = "/calendar/james-square-egm-2026.ics";

export const metadata: Metadata = {
  title: "James Square – Special General Meeting",
  description:
    "Details of the James Square Special General Meeting, including joining instructions and calendar links.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "James Square – Special General Meeting",
    description:
      "Details of the James Square Special General Meeting, including joining instructions and calendar links.",
    url: pageUrl,
    siteName: "James Square",
  },
};

export default function EGMPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
          James Square
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
          Special General Meeting (EGM)
        </h1>
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {meetingDescription}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-sm p-6 space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail label="Date" value="Wednesday, 21 January 2026" />
          <Detail label="Time" value="18:00 – 20:30 (GMT)" />
          <Detail label="Format" value="Online via Microsoft Teams" />
          <Detail label="Audience" value="Owners of properties at James Square" />
        </dl>

        <div className="pt-2">
          <a
            href={teamsLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
          >
            Join EGM on Microsoft Teams
          </a>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The link opens in a new tab. No login is required to view this page.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Add to your calendar
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Save the meeting with joining details in your preferred calendar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-colors"
          >
            Add to Google Calendar
          </a>
          <a
            href={icsFilePath}
            download="james-square-egm-2026.ics"
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 transition-colors"
          >
            Add to Apple Calendar
          </a>
        </div>
      </section>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Please try to join a few minutes early if possible so the meeting can start on time. Also
        it is advised that users sign up or into their James-Square.com account ahead of time so
        that they can access the relevant documentation and participate in voting.
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50/80 dark:bg-slate-800/70 px-4 py-3 border border-slate-200/70 dark:border-slate-700/70">
      <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</dt>
      <dd className="mt-1 text-base text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
