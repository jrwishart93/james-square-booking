import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Download,
  ExternalLink,
  ListChecks,
  MapPin,
  MonitorSmartphone,
} from "lucide-react";
import PreviousMeeting from "./PreviousMeeting";

const teamsLink =
  "https://teams.live.com/meet/9379620383354?p=GEqjTA0LIPWYyshEWv";

const pageTitle = "James Square Committee Meeting";
const pageDescription =
  "Committee meeting information, agenda and joining details for the James Square community.";
const canonicalUrl = "https://www.james-square.com/committee-meeting";
const socialImageUrl =
  "https://www.james-square.com/images/logo/E7197D9E-8704-47EC-92E2-BC4D9C9506BC.png";

const agendaItems = [
  {
    title: "Swimming Pool – Lothian House Visit",
    description:
      "Update following the recent visit to the swimming pool facilities at Lothian House.",
  },
  {
    title: "Swimming Pool Risk Assessment",
    description:
      "Update following the recent risk assessment visit and any actions arising from it.",
  },
  {
    title: "Caretaker",
    description:
      "Update and discussion regarding the caretaker arrangements at James Square.",
  },
  {
    title: "Fire Alarm",
    description:
      "Update on recent fire alarm discussions, volunteer arrangements and training.",
  },
  {
    title: "Cleaning",
    description:
      "Update on recent discussions regarding cleaning arrangements at James Square.",
  },
  { title: "FIOR", description: "Update on matters relating to FIOR." },
  {
    title: "Myreside",
    description:
      "Update on recent discussions and matters raised with Myreside Management.",
  },
  { title: "Any Other Business" },
];

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
            Current meeting
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
              James Square
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Committee meeting
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Attend in person at The Conservatory, James Square or join remotely
              using Microsoft Teams.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="meeting-details-heading"
          className="jqs-glass rounded-2xl border border-white/40 bg-white/55 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                Next meeting
              </p>
              <h2
                id="meeting-details-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white"
              >
                <time dateTime="2026-09-15">Tuesday 15 September 2026</time>
                <span className="mx-2 text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <time dateTime="2026-09-15T18:15:00+01:00">18:15</time>
              </h2>
              <p className="mt-3 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                <span><span className="font-medium text-slate-900 dark:text-slate-100">Location:</span> The Conservatory, James Square</span>
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <a
                href={teamsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Image src="/images/brands/microsoft-teams.svg" alt="" width={22} height={22} />
                Join Meeting on Teams
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/calendar/james-square-committee-meeting-september-2026.ics"
                download="james-square-committee-meeting-september-2026.ics"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Add to Calendar
                <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-slate-700/80 dark:text-slate-400">
            <MonitorSmartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
            Microsoft Teams is available for remote attendance.
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
          <ol className="mt-5 divide-y divide-slate-200/80 border-y border-slate-200/80 dark:divide-slate-700/80 dark:border-slate-700/80">
            {agendaItems.map((item, index) => (
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
        </section>

        <PreviousMeeting />
      </div>
    </div>
  );
}
