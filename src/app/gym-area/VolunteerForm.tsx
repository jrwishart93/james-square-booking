'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { GYM_HELP_OPTIONS, GYM_VOLUNTEER_LIMITS, type GymHelpOption, type GymVolunteerErrors } from '@/lib/gymVolunteer';

const field =
  'mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white';
const labelClass = 'block text-sm font-semibold text-slate-900 dark:text-white';
const errorClass = 'mt-1.5 text-sm font-medium text-red-700 dark:text-red-300';

type State = 'idle' | 'sending' | 'sent';

export default function VolunteerForm() {
  const id = useId();
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<GymVolunteerErrors>({});
  const [help, setHelp] = useState<GymHelpOption[]>([]);

  const toggle = (value: GymHelpOption) =>
    setHelp(current => (current.includes(value) ? current.filter(item => item !== value) : [...current, value]));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      location: String(form.get('location') ?? ''),
      help,
      comments: String(form.get('comments') ?? ''),
      privacyAcknowledgement: form.get('privacyAcknowledgement') === 'on',
      website: String(form.get('website') ?? ''),
    };
    setState('sending');
    setErrors({});
    try {
      const res = await fetch('/api/gym-volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: GymVolunteerErrors };
      setErrors({
        ...(body.fields ?? {}),
        _form:
          res.status === 429
            ? 'Too many attempts. Please wait a few minutes and try again.'
            : body.fields?._form ?? body.error ?? 'Something went wrong. Please try again.',
      });
    } catch {
      setErrors({ _form: 'We could not reach the server. Please check your connection and try again.' });
    }
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 aria-hidden="true" className="size-12 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Thank you for offering to help</h3>
        <p className="max-w-md leading-7 text-slate-700 dark:text-slate-300">
          Your details have been passed to the committee, who will be in touch by email when there is something to help
          with.
        </p>
      </div>
    );
  }

  const describe = (name: keyof GymVolunteerErrors) => (errors[name] ? `${id}-${name}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>Name</label>
          <input
            id={`${id}-name`} name="name" autoComplete="name" required maxLength={GYM_VOLUNTEER_LIMITS.name}
            className={field} aria-invalid={!!errors.name} aria-describedby={describe('name')}
          />
          {errors.name && <p id={`${id}-name-error`} className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>Email address</label>
          <input
            id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" required
            maxLength={GYM_VOLUNTEER_LIMITS.email} className={field} aria-invalid={!!errors.email}
            aria-describedby={describe('email')}
          />
          {errors.email && <p id={`${id}-email-error`} className={errorClass}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-location`} className={labelClass}>
          Flat or block <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span>
        </label>
        <input
          id={`${id}-location`} name="location" maxLength={GYM_VOLUNTEER_LIMITS.location} className={field}
          placeholder="e.g. Block 45" aria-invalid={!!errors.location} aria-describedby={describe('location')}
        />
        {errors.location && <p id={`${id}-location-error`} className={errorClass}>{errors.location}</p>}
      </div>

      <fieldset aria-describedby={describe('help')}>
        <legend className={labelClass}>How would you like to help?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {GYM_HELP_OPTIONS.map(option => {
            const checked = help.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${
                  checked
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-50'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                <input
                  type="checkbox" checked={checked} onChange={() => toggle(option.value)}
                  className="size-5 accent-emerald-600"
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors.help && <p id={`${id}-help-error`} className={errorClass}>{errors.help}</p>}
      </fieldset>

      <div>
        <label htmlFor={`${id}-comments`} className={labelClass}>
          Additional comments <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span>
        </label>
        <textarea
          id={`${id}-comments`} name="comments" rows={4} maxLength={GYM_VOLUNTEER_LIMITS.comments}
          className={field} placeholder="For example, when you are usually available"
          aria-invalid={!!errors.comments} aria-describedby={describe('comments')}
        />
        {errors.comments && <p id={`${id}-comments-error`} className={errorClass}>{errors.comments}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-300">
        <p>
          Your details are sent to the James Square committee and used only to contact you about helping with the gym
          project. They are not shared with anyone else or added to any mailing list. See our{' '}
          <Link href="/privacy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>.
        </p>
        <label className="mt-3 flex items-start gap-3 font-medium text-slate-900 dark:text-white">
          <input
            type="checkbox" name="privacyAcknowledgement" className="mt-0.5 size-5 shrink-0 accent-emerald-600"
            aria-invalid={!!errors.privacyAcknowledgement} aria-describedby={describe('privacyAcknowledgement')}
          />
          I understand how my details will be used.
        </label>
        {errors.privacyAcknowledgement && (
          <p id={`${id}-privacyAcknowledgement-error`} className={errorClass}>{errors.privacyAcknowledgement}</p>
        )}
      </div>

      {errors._form && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {errors._form}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-70 sm:w-auto"
      >
        {state === 'sending' && <Loader2 aria-hidden="true" className="size-5 animate-spin" />}
        {state === 'sending' ? 'Sending…' : 'Volunteer to Help'}
      </button>
    </form>
  );
}
