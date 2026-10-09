"use client";

import { useId, useState } from "react";
import { ClipboardList, Info } from "lucide-react";
import { Checkbox, CopyButton, ExternalLink, Notice, inputBorder, inputClass } from "./ui";
import {
  JAMES_SQUARE_COUNCIL_AREA,
  POLICE_INCIDENT_NUMBER,
  POLICE_PHONE,
  POLICE_UPDATE_FORM_URL,
  POLICE_UPDATE_LIMIT,
  buildUpdateRequest,
} from "./policeInfo";

// Prepares answers for Police Scotland's "Ask for an update" form. The form is
// on Police Scotland's own site, so it cannot be filled in from here: owners
// copy each answer across and submit the form themselves. Nothing entered here
// leaves the browser or is stored.

const EXTRA_LIMIT = 300;
const OFFICER_NOT_KNOWN = `Not known – officer dealing with incident ${POLICE_INCIDENT_NUMBER}`;

function AnswerRow({ field, value, copyLabel, children }: {
  field: string;
  value?: string;
  copyLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{field}</dt>
      <dd className="mt-1.5 space-y-2 text-[15px] leading-7 text-slate-800 dark:text-slate-200">
        {value && <p className="break-words font-medium text-slate-950 dark:text-white">{value}</p>}
        {children}
        {value && copyLabel && <CopyButton label={copyLabel} text={value} />}
      </dd>
    </div>
  );
}

export default function PoliceUpdateRequest() {
  const uid = useId();
  const [provideInformation, setProvideInformation] = useState(true);
  const [requestUpdate, setRequestUpdate] = useState(true);
  const [extra, setExtra] = useState("");
  const text = buildUpdateRequest({ provideInformation, requestUpdate, extra });

  return (
    <div className="mt-5 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white/70 p-5 dark:border-sky-400/20 dark:from-sky-400/[0.08] dark:to-white/[0.03] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 ring-1 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20">
          <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <h5 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            Ask Police Scotland for an update online
          </h5>
          <p className="mt-1 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
            Police Scotland&apos;s “Ask for an update” form lets you ask for the officer dealing with an incident to contact
            you. This helper prepares your answers so you can copy them across. James Square cannot fill in or send the
            form for you – you submit it yourself on the Police Scotland website.
          </p>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-[15px] font-semibold text-slate-900 dark:text-white">What would you like to ask?</legend>
        <div className="mt-3 grid gap-2">
          <Checkbox checked={provideInformation} onChange={setProvideInformation}>
            I believe I may be a complainer and would like to provide further information
          </Checkbox>
          <Checkbox checked={requestUpdate} onChange={setRequestUpdate}>
            I would like an update on the incident
          </Checkbox>
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor={`${uid}-extra`} className="block text-[15px] font-semibold text-slate-900 dark:text-white">
          Anything you would like to add
          <span className="ml-1.5 text-sm font-normal text-slate-500 dark:text-slate-400">(optional)</span>
        </label>
        <p id={`${uid}-extra-hint`} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Keep it brief and factual, for example: “I paid towards proposed roof works in 2025.”
        </p>
        <textarea
          id={`${uid}-extra`}
          rows={2}
          maxLength={EXTRA_LIMIT}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          aria-describedby={`${uid}-extra-hint`}
          className={`${inputClass} ${inputBorder()} mt-2 resize-y leading-7`}
        />
      </div>

      <p className="mt-6 text-[15px] font-semibold text-slate-900 dark:text-white">Your answers for the Police Scotland form</p>
      <dl className="mt-3 divide-y divide-slate-200/80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 dark:divide-white/10 dark:border-white/10 dark:bg-slate-950/40">
        <AnswerRow field="Any reference number you have" value={POLICE_INCIDENT_NUMBER} copyLabel="Copy incident number" />
        <AnswerRow field="What you want an update on" value={text} copyLabel="Copy update request">
          <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
            {text.length} of {POLICE_UPDATE_LIMIT} characters allowed by the form
          </p>
        </AnswerRow>
        <AnswerRow field="Council area" value={JAMES_SQUARE_COUNCIL_AREA} />
        <AnswerRow field="Officer's name or shoulder number">
          <p>
            Leave this blank if you can. If the form asks for something, you could enter: “{OFFICER_NOT_KNOWN}”.
          </p>
          <CopyButton label="Copy this wording" text={OFFICER_NOT_KNOWN} />
        </AnswerRow>
        <AnswerRow field="Your name, address, date of birth and contact details">
          <p>Enter these directly on the Police Scotland form. James Square does not ask for or see them.</p>
        </AnswerRow>
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ExternalLink href={POLICE_UPDATE_FORM_URL} variant="primary">
          Open the Police Scotland form
        </ExternalLink>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          Opens in a new tab, so you can switch back here to copy each answer.
        </p>
      </div>

      <Notice className="mt-5" icon={<Info className="h-4 w-4" aria-hidden="true" />} title="Before you submit">
        <p>
          Check every answer on the Police Scotland form before sending it. The form&apos;s questions are set by Police
          Scotland and may change. It is for asking about an existing incident, not for reporting something new. In an
          emergency, always call {POLICE_PHONE.emergency}.
        </p>
      </Notice>
    </div>
  );
}
