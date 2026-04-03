'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, CalendarPlus, Clock3, Copy, ExternalLink, Mail } from 'lucide-react';

import AGMComments from '@/components/AGMComments';

const meetingLink =
  'https://teams.live.com/meet/9324822330074?p=1OEuybKPe9fZKrF27P';
const meetingTitle = 'James Square AGM 2026';
const meetingDateLabel = '04 June 2026';
const meetingTimeLabel = '19:00 – 21:00 (GMT)';
const meetingLocation = 'Microsoft Teams';
const meetingNotes = `Annual General Meeting for James Square owners.

Join link: ${meetingLink}`;

const meetingStart = '20260604T190000';
const meetingEnd = '20260604T210000';
const meetingTimezone = 'Europe/London';

const emailBody = `I would like to acknowledge receipt of the information about the AGM in June 2026.

Could I request the following is discussed ahead of or during the meeting:

[Please enter your request here]

My details are:
Name:
Email:
Contact Number:
Property / Flat:`;

function encodeMailBody(body: string) {
  return encodeURIComponent(body).replace(/%0A/g, '%0D%0A');
}

function buildICSContent() {
  const createdAtUtc = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//James Square//AGM Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:james-square-agm-2026@james-square.com`,
    `DTSTAMP:${createdAtUtc}`,
    `DTSTART;TZID=${meetingTimezone}:${meetingStart}`,
    `DTEND;TZID=${meetingTimezone}:${meetingEnd}`,
    `SUMMARY:${meetingTitle}`,
    `LOCATION:${meetingLocation}`,
    `DESCRIPTION:${meetingNotes.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function AGMPage() {
  const [copied, setCopied] = useState(false);

  const agendaMailtoHref = useMemo(() => {
    const cc = encodeURIComponent('committee@james-square.com');
    const subject = encodeURIComponent('James Square AGM 2026 – Agenda Request');
    const body = encodeMailBody(emailBody);

    return `mailto:ania@myreside-management.co.uk?cc=${cc}&subject=${subject}&body=${body}`;
  }, []);

  const googleCalendarHref = useMemo(() => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: meetingTitle,
      dates: `${meetingStart}/${meetingEnd}`,
      details: meetingNotes,
      location: meetingLocation,
      ctz: meetingTimezone,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  const appleCalendarHref = useMemo(() => {
    const ics = buildICSContent();
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }, []);

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error('Copy meeting link failed', error);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6 dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">AGM 2026</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-200">
          This page is for Owners at James Square ahead of the AGM. Please review the details below and submit any
          items you would like raised in advance.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">James Square – AGM 2026</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <CalendarDays className="h-4 w-4 text-cyan-300" />
              Date
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{meetingDateLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              Time
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{meetingTimeLabel}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-cyan-300/50 bg-cyan-50 p-4 dark:bg-cyan-950/20">
          <p className="text-xs uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Meeting link</p>
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow sm:w-auto"
          >
            Join AGM on Teams
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-3 break-all text-xs text-slate-700 dark:text-slate-200">{meetingLink}</p>
          <button
            type="button"
            onClick={copyMeetingLink}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Meeting link copied' : 'Copy meeting link'}
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
          <p className="text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">Save to calendar</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href={googleCalendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <CalendarPlus className="h-4 w-4" />
              Save to Google Calendar
            </a>
            <a
              href={appleCalendarHref}
              download="james-square-agm-2026.ics"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <CalendarPlus className="h-4 w-4" />
              Save to Apple Calendar (.ics)
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
            Pick your calendar app and the AGM details plus Teams link will be pre-filled.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Submit an agenda item</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          Owners are encouraged to submit any topics, questions, or concerns in advance of the AGM.
        </p>

        <a
          href={agendaMailtoHref}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <Mail className="h-4 w-4" />
          Email your agenda request
        </a>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
          This opens your default mail app with the recipient, CC, subject, and message pre-filled.
        </p>
      </section>

      <div className="mt-6">
        <AGMComments />
      </div>
    </main>
  );
}
