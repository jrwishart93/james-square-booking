import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Download,
  ExternalLink,
  ListChecks,
  MapPin,
  Mail,
  MonitorSmartphone,
} from "lucide-react";
import PreviousMeeting from "./PreviousMeeting";
import {
  COMMITTEE_EMAIL,
  formatMeetingDate,
  formatMeetingTime24,
  lastMeeting,
  upcomingMeetings,
  type CommitteeMeeting,
} from "@/lib/committeeMeetings";

const pageTitle = "James Square Committee Meeting";
const pageDescription =
  "Committee meeting dates, agendas and how owners can register to attend.";
const canonicalUrl = "https://www.james-square.com/committee-meeting";
const socialImageUrl =
  "https://www.james-square.com/images/logo/E7197D9E-8704-47EC-92E2-BC4D9C9506BC.png";

// Meeting dates come from lib/committeeMeetings. Re-render hourly so a meeting
// drops off this page once it has finished without needing a redeploy.
export const revalidate = 3600;

function registerHref(meeting: CommitteeMeeting | undefined) {
  const when = meeting ? `${formatMeetingDate(meeting)}, ${formatMeetingTime24(meeting)}` : "next meeting";
  const subject = `Committee meeting attendance – ${when}`;
  const body = [
    "I would like to attend the James Square committee meeting.",
    "",
    "Name:",
    "Flat / address at James Square:",
    "Attending: in person / online (Microsoft Teams)",
  ].join("\n");
  return `mailto:${COMMITTEE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    type: "website",
    siteName: "James Square",
    images: [
      {
        url: socialImageUrl,
        width: 1536,
        height: 1024,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: socialImageUrl, alt: pageTitle }],
  },
  robots: { index: false, follow: false },
};

export default function CommitteeMeetingPage() {
  const now = new Date();
  const [next, following] = upcomingMeetings(now);
  const previous = lastMeeting(now);
  const agendaSource = next?.agenda ? next : null;

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
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            {next ? "Next meeting" : "Committee meetings"}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
              James Square
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Committee meeting
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              James Square owners are welcome to request attendance, either in
              person at The Conservatory, James Square or online via Microsoft
              Teams.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="meeting-details-heading"
          className="jqs-glass rounded-2xl border border-white/40 bg-white/55 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6"
        >
          {next ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                  Next meeting
                </p>
                <h2
                  id="meeting-details-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white"
                >
                  <time dateTime={next.startsAt.slice(0, 10)}>{formatMeetingDate(next)}</time>
                  <span className="mx-2 text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                  <time dateTime={next.startsAt}>{formatMeetingTime24(next)}</time>
                </h2>
                <p className="mt-3 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  <span><span className="font-medium text-slate-900 dark:text-slate-100">Location:</span> {next.location}, and online via Microsoft Teams</span>
                </p>
                {following ? (
                  <p className="mt-2 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                    <span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">Following meeting:</span>{" "}
                      <time dateTime={following.startsAt}>
                        {formatMeetingDate(following)}, {formatMeetingTime24(following)}
                      </time>
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                {next.teamsUrl ? (
                  <a
                    href={next.teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Image src="/images/brands/microsoft-teams.svg" alt="" width={22} height={22} />
                    Join Meeting on Teams
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <a
                    href={registerHref(next)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    Register to attend
                  </a>
                )}
                {next.icsPath ? (
                  <a
                    href={next.icsPath}
                    download={next.icsPath.split("/").pop()}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                    Add to Calendar
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <h2
                id="meeting-details-heading"
                className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white"
              >
                No meeting currently scheduled
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                The next committee meeting date will be published here once it has been agreed.
                Questions can be sent to{" "}
                <a className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300" href={`mailto:${COMMITTEE_EMAIL}`}>
                  {COMMITTEE_EMAIL}
                </a>
                .
              </p>
            </div>
          )}

          <div className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700/80 dark:text-slate-400">
            <p className="flex items-start gap-2">
              <MonitorSmartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Owners who would like to attend, in person or online, are asked to register their
                interest in advance by emailing{" "}
                <a className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300" href={registerHref(next)}>
                  {COMMITTEE_EMAIL}
                </a>
                {next?.teamsUrl ? "." : ". Online joining details are sent privately to owners who have registered."}
              </span>
            </p>
            <p className="pl-6">
              Committee meetings are working meetings, rather than AGMs. Visiting owners are welcome
              to observe, with an opportunity for questions after committee discussions have
              concluded, subject to time available.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="agenda-heading"
          className="jqs-glass rounded-2xl border border-white/40 bg-white/55 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ListChecks className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="agenda-heading" className="text-2xl font-semibold text-slate-950 dark:text-white">
              Agenda
            </h2>
          </div>
          {agendaSource?.agenda ? (
          <ol className="mt-5 divide-y divide-slate-200/80 border-y border-slate-200/80 dark:divide-slate-700/80 dark:border-slate-700/80">
            {agendaSource.agenda.map((item, index) => (
              <li key={item.title} className="flex gap-4 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {next
                ? "The agenda for this meeting will be published here before the meeting."
                : "The agenda will be published here once the next meeting has been scheduled."}
            </p>
          )}

          {previous?.agenda && previous !== agendaSource ? (
            <details className="group mt-5 rounded-xl border border-slate-200/80 p-4 dark:border-slate-700/80">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">
                Agenda from the last meeting ({formatMeetingDate(previous)})
              </summary>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                {previous.agenda.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ol>
            </details>
          ) : null}
        </section>

        <PreviousMeeting />
      </div>
    </div>
  );
}
