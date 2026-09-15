"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  DoorOpen,
  ExternalLink,
  ListChecks,
  MapPin,
  MonitorSmartphone,
} from "lucide-react";

const previousTeamsLink =
  "https://teams.live.com/meet/9392352296034?p=TlgOqGScBL4kqTLwZV";

const previousAgendaItems = [
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

export default function PreviousMeeting() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/30">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="previous-meeting-content"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600 dark:text-slate-100 dark:hover:bg-white/5 sm:px-6"
      >
        <span>Previous Meeting &amp; Agenda</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id="previous-meeting-content"
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-in-out ${isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 border-t border-slate-200/80 px-5 py-6 dark:border-slate-800 sm:px-6">
            <p className="text-slate-600 dark:text-slate-300">
              Join us today, Monday 10 August 2026, either in person at the conservatory or online using Microsoft Teams.
            </p>

            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MeetingDetail icon={<CalendarDays className="h-5 w-5" />} label="Date" value={<time dateTime="2026-08-10">Monday 10 August 2026</time>} />
              <MeetingDetail icon={<Clock3 className="h-5 w-5" />} label="Time" value={<time dateTime="2026-08-10T18:00:00+01:00">18:00</time>} />
              <MeetingDetail icon={<MapPin className="h-5 w-5" />} label="In person" value="The conservatory at James Square" />
              <MeetingDetail icon={<MonitorSmartphone className="h-5 w-5" />} label="Online" value="Microsoft Teams" />
            </dl>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 shadow-sm dark:bg-slate-800">
                    <Image src="/images/brands/microsoft-teams.svg" alt="" width={28} height={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Join on Microsoft Teams</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Tap the button below, or copy and paste the meeting link into your browser to join.</p>
                  </div>
                </div>
                <a href={previousTeamsLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500">
                  Join the Teams meeting <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={previousTeamsLink} target="_blank" rel="noopener noreferrer" className="block break-all rounded-xl border border-blue-200 bg-white/80 px-4 py-3 text-sm text-blue-700 underline dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-300">
                  {previousTeamsLink}
                </a>
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                  <DoorOpen className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p><strong>Arriving in person?</strong> The conservatory door will be wedged open.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Agenda</h3>
                </div>
                <ol className="mt-4 space-y-3">
                  {previousAgendaItems.map((item, index) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{index + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MeetingDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <span className="text-blue-600 dark:text-blue-300" aria-hidden="true">{icon}</span>{label}
      </dt>
      <dd className="mt-2 font-semibold leading-snug text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
