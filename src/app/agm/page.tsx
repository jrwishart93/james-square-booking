'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { CalendarDays, ChevronDown, Clock3, Copy, ExternalLink, FileText, Mail } from 'lucide-react';

import AGMComments from '@/components/AGMComments';

const meetingLink =
  'https://teams.live.com/meet/9324822330074?p=1OEuybKPe9fZKrF27P';
const AGM_AGENDA_PATH = '/docs/survey/James Square-  AGM  Agenda - 2026.06.04.pdf';
const AGM_FACTORS_REPORT_PATH = '/docs/survey/James Square-  AGM  - Factors Report - 2026.06.04.pdf';
const AGM_AGENDA_HREF = encodeURI(AGM_AGENDA_PATH);
const AGM_FACTORS_REPORT_HREF = encodeURI(AGM_FACTORS_REPORT_PATH);
const AGM_DATE_THRESHOLD = new Date('2026-06-05T00:00:00');
const documentLinks = [
  { label: 'AGM Agenda', href: AGM_AGENDA_HREF },
  { label: 'Factors Report', href: AGM_FACTORS_REPORT_HREF },
];
const agendaSummaryItems = [
  'Previous factor update',
  'Development finances',
  'Sinking fund balance',
  'Outstanding debts',
  'Committee members and block representatives',
  'Swimming pool repairs and refurbishment',
  'Building condition report',
  'Building repair fund restart',
  'Tree pruning',
  'Caretaker salary',
  'Council tax banding',
];
const factorsReportHighlights = [
  'Myreside Management taking over management on 1 February 2026',
  'Building insurance and claims process',
  'Myreside owner portal',
  'Electricity account transition and meter readings',
  'Roof, gutter and downpipe works',
  'Proposed updated external building condition survey',
  'Pool closure, safety review and repair options',
  'Confirmation that RAAC was not found in the pool structure',
  'Communal repairs, cleaning and grounds maintenance',
  'Fire safety inspections',
  'Development debt position',
  'Sinking fund position, including Trinity transferring £25,661.81 on 7 May 2026',
];

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

export default function AGMPage() {
  const [copied, setCopied] = useState(false);
  const agmHeld = new Date() >= AGM_DATE_THRESHOLD;

  const agendaMailtoHref = useMemo(() => {
    const cc = encodeURIComponent('committee@james-square.com');
    const subject = encodeURIComponent('James Square AGM 2026 – Agenda Request');
    const body = encodeMailBody(emailBody);

    return `mailto:ania@myreside-management.co.uk?cc=${cc}&subject=${subject}&body=${body}`;
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
      <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-7 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            James Square AGM 2026
          </h1>
          <span className="rounded-full border border-cyan-300/50 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-950/30 dark:text-cyan-200">
            Documents available
          </span>
        </div>
        <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-200">
          {agmHeld ? (
            <>
              <p>The James Square Annual General Meeting was held on Thursday 4 June 2026.</p>
              <p>
                This page provides access to the agenda and factors report circulated ahead of the meeting. A further
                update, including the official minutes, will be added once available.
              </p>
            </>
          ) : (
            <>
              <p>
                The James Square Annual General Meeting will take place on Thursday 4 June 2026 at 7:00pm via Microsoft
                Teams.
              </p>
              <p>
                This page provides quick access to the meeting documents, agenda summary and factors report highlights.
              </p>
            </>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {documentLinks.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {doc.label}
            </a>
          ))}
        </div>
        <a
          href="https://www.james-square.com/agm"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          https://www.james-square.com/agm
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {agmHeld ? 'AGM Held – 4 June 2026' : 'Upcoming AGM – 4 June 2026'}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <CalendarDays className="h-4 w-4 text-cyan-300" />
              Date
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Thursday 4 June 2026</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              Time
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">7:00pm via Microsoft Teams</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-200">
          {agmHeld ? (
            <>
              <p>The James Square Annual General Meeting was held on Thursday 4 June 2026.</p>
              <p>
                Owners can review the AGM page, agenda and factors report using the links below. A further update
                summarising the discussions, decisions and any agreed actions will be published once the official
                minutes have been prepared and circulated.
              </p>
            </>
          ) : (
            <>
              <p>
                Owners are encouraged to attend where possible. The AGM will include updates on the management of the
                development, finances, sinking fund, pool repairs, building condition report, committee appointments,
                and priorities for the year ahead.
              </p>
              <p>The AGM page, agenda and factors report are available using the links below.</p>
            </>
          )}
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
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Documents</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
          Download or open the AGM agenda and factors report in a new tab.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {documentLinks.map((doc) => (
            <a
              key={`card-${doc.href}`}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:hover:bg-slate-800"
            >
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-500" aria-hidden="true" />
                {doc.label}
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <AgmAccordion title="Agenda Summary">
          <p>{agmHeld ? 'Key items listed for discussion included:' : 'Key items due to be discussed include:'}</p>
          <ul className="list-disc ms-5 space-y-1">
            {agendaSummaryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AgmAccordion>

        <AgmAccordion title="Factors Report Highlights">
          <p>{agmHeld ? 'The factors report included updates on:' : 'The factors report includes updates on:'}</p>
          <ul className="list-disc ms-5 space-y-1">
            {factorsReportHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AgmAccordion>

        <AgmAccordion title="Documents">
          <div className="grid gap-3 sm:grid-cols-2">
            {documentLinks.map((doc) => (
              <a
                key={`accordion-${doc.href}`}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {doc.label}
              </a>
            ))}
          </div>
        </AgmAccordion>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-50 px-4 py-4 text-sm font-medium text-slate-800 shadow-sm sm:px-6 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-slate-100">
        Meeting minutes will be published once available.
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

function AgmAccordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-left text-base font-semibold text-slate-900 marker:hidden sm:px-6 dark:text-white">
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="space-y-3 border-t border-slate-200 px-4 py-4 text-sm leading-relaxed text-slate-700 sm:px-6 sm:text-base dark:border-slate-800 dark:text-slate-200">
        {children}
      </div>
    </details>
  );
}
