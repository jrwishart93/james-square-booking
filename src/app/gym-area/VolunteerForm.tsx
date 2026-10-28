'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';

import {
  GYM_AVAILABILITY_OPTIONS,
  GYM_HELP_OPTIONS,
  GYM_VOLUNTEER_LIMITS,
  validateGymVolunteer,
  type GymAvailabilityOption,
  type GymHelpOption,
  type GymVolunteerErrors,
} from '@/lib/gymVolunteer';

const field =
  'mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 aria-[invalid=true]:border-red-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white';
const labelClass = 'block text-sm font-semibold text-slate-900 dark:text-white';
const optional = <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span>;
const hintClass = 'mt-1 text-sm text-slate-500 dark:text-slate-400';
const errorClass = 'mt-1.5 text-sm font-medium text-red-700 dark:text-red-300';
const stepClass = 'flex items-center gap-3 text-base font-semibold text-slate-950 dark:text-white';
const stepNumber =
  'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white';

// Fields shown inside the "optional details" panel; an error in one opens the panel.
const OPTIONAL_FIELDS = ['phone', 'location', 'availability', 'comments'] as const;
// Order in which to move focus to the first problem.
const FIELD_ORDER = ['help', 'name', 'email', ...OPTIONAL_FIELDS, 'privacyAcknowledgement'] as const;

type State = 'idle' | 'sending' | 'sent';

function Chip({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition focus-within:ring-2 focus-within:ring-emerald-600/40 ${
        checked
          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-50'
          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
          checked
            ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500'
            : 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800'
        }`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

export default function VolunteerForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<GymVolunteerErrors>({});
  const [help, setHelp] = useState<GymHelpOption[]>([]);
  const [availability, setAvailability] = useState<GymAvailabilityOption[]>([]);
  const [showOptional, setShowOptional] = useState(false);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter(item => item !== value) : [...list, value]);
  const clearError = (name: keyof GymVolunteerErrors) =>
    setErrors(current => (current[name] ? { ...current, [name]: undefined } : current));

  function showErrors(next: GymVolunteerErrors) {
    setErrors(next);
    if (OPTIONAL_FIELDS.some(name => next[name])) setShowOptional(true);
    const first = FIELD_ORDER.find(name => next[name]);
    // Wait a frame so a newly opened panel is in the DOM before focusing.
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      location: String(form.get('location') ?? ''),
      help,
      availability,
      comments: String(form.get('comments') ?? ''),
      privacyAcknowledgement: form.get('privacyAcknowledgement') === 'on',
      website: String(form.get('website') ?? ''),
    };

    // Same rules as the server, so most mistakes are caught without a round trip.
    const checked = validateGymVolunteer(payload);
    if (!checked.success) {
      showErrors(checked.errors);
      return;
    }

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
      showErrors({
        ...(body.fields ?? {}),
        _form:
          res.status === 429
            ? 'Too many attempts. Please wait a few minutes and try again.'
            : body.fields?._form ?? body.error ?? 'Something went wrong. Please try again.',
      });
    } catch {
      showErrors({ _form: 'We could not reach the server. Please check your connection and try again.' });
    }
    setState('idle');
  }

  if (state === 'sent') {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 aria-hidden="true" className="size-12 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Thank you for offering to help</h3>
        <p className="max-w-md leading-7 text-slate-700 dark:text-slate-300">
          Your details have been passed to the committee, who will be in touch when there is something to help with.
        </p>
      </div>
    );
  }

  const describe = (name: keyof GymVolunteerErrors, hint?: string) =>
    [hint, errors[name] ? `${id}-${name}-error` : undefined].filter(Boolean).join(' ') || undefined;
  const errorText = (name: keyof GymVolunteerErrors) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className={errorClass}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      {/* 1. How to help */}
      <fieldset aria-describedby={describe('help')}>
        <legend className={stepClass}>
          <span className={stepNumber} aria-hidden="true">1</span>
          How would you like to help?
        </legend>
        <p className={`${hintClass} ml-10`}>Choose as many as you like.</p>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-2"
          tabIndex={-1}
          data-field="help"
        >
          {GYM_HELP_OPTIONS.map(option => (
            <Chip
              key={option.value}
              name="help"
              label={option.label}
              checked={help.includes(option.value)}
              onChange={() => {
                setHelp(current => toggle(current, option.value));
                clearError('help');
              }}
            />
          ))}
        </div>
        {errorText('help')}
      </fieldset>

      {/* 2. Contact details */}
      <fieldset className="space-y-4">
        <legend className={stepClass}>
          <span className={stepNumber} aria-hidden="true">2</span>
          Your details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className={labelClass}>Name</label>
            <input
              id={`${id}-name`} name="name" data-field="name" autoComplete="name" required
              maxLength={GYM_VOLUNTEER_LIMITS.name} className={field} aria-invalid={!!errors.name}
              aria-describedby={describe('name')} onChange={() => clearError('name')}
            />
            {errorText('name')}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className={labelClass}>Email address</label>
            <input
              id={`${id}-email`} name="email" data-field="email" type="email" autoComplete="email" inputMode="email"
              required maxLength={GYM_VOLUNTEER_LIMITS.email} className={field} aria-invalid={!!errors.email}
              aria-describedby={describe('email')} onChange={() => clearError('email')}
            />
            {errorText('email')}
          </div>
        </div>

        {/* Optional details */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            type="button"
            aria-expanded={showOptional}
            aria-controls={`${id}-optional`}
            onClick={() => setShowOptional(open => !open)}
            className="flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">Add optional details</span>
              <span className="block text-sm text-slate-500 dark:text-slate-400">
                Phone number, flat, availability or comments
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`size-5 shrink-0 text-slate-500 transition-transform motion-reduce:transition-none ${showOptional ? 'rotate-180' : ''}`}
            />
          </button>
          {/* Kept mounted when closed so anything typed is not lost. */}
          <div id={`${id}-optional`} hidden={!showOptional} className="space-y-4 border-t border-slate-200 px-4 pb-5 pt-4 dark:border-white/10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-phone`} className={labelClass}>Phone number {optional}</label>
                <input
                  id={`${id}-phone`} name="phone" data-field="phone" type="tel" autoComplete="tel" inputMode="tel"
                  maxLength={GYM_VOLUNTEER_LIMITS.phone} className={field} aria-invalid={!!errors.phone}
                  aria-describedby={describe('phone', `${id}-phone-hint`)} onChange={() => clearError('phone')}
                />
                <p id={`${id}-phone-hint`} className={hintClass}>If you would rather we called or texted.</p>
                {errorText('phone')}
              </div>
              <div>
                <label htmlFor={`${id}-location`} className={labelClass}>Flat or block {optional}</label>
                <input
                  id={`${id}-location`} name="location" data-field="location" autoComplete="off"
                  maxLength={GYM_VOLUNTEER_LIMITS.location} className={field} placeholder="e.g. Block 45"
                  aria-invalid={!!errors.location} aria-describedby={describe('location')}
                  onChange={() => clearError('location')}
                />
                {errorText('location')}
              </div>
            </div>

            <fieldset aria-describedby={describe('availability')}>
              <legend className={labelClass}>When are you usually free? {optional}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3" tabIndex={-1} data-field="availability">
                {GYM_AVAILABILITY_OPTIONS.map(option => (
                  <Chip
                    key={option.value}
                    name="availability"
                    label={option.label}
                    checked={availability.includes(option.value)}
                    onChange={() => {
                      setAvailability(current => toggle(current, option.value));
                      clearError('availability');
                    }}
                  />
                ))}
              </div>
              {errorText('availability')}
            </fieldset>

            <div>
              <label htmlFor={`${id}-comments`} className={labelClass}>Anything else? {optional}</label>
              <textarea
                id={`${id}-comments`} name="comments" data-field="comments" rows={3}
                maxLength={GYM_VOLUNTEER_LIMITS.comments} className={field}
                placeholder="Ideas, skills or anything you would like the committee to know"
                aria-invalid={!!errors.comments} aria-describedby={describe('comments')}
                onChange={() => clearError('comments')}
              />
              {errorText('comments')}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-300">
          <input
            type="checkbox" name="privacyAcknowledgement" data-field="privacyAcknowledgement"
            className="mt-0.5 size-5 shrink-0 accent-emerald-600" aria-invalid={!!errors.privacyAcknowledgement}
            aria-describedby={describe('privacyAcknowledgement')} onChange={() => clearError('privacyAcknowledgement')}
          />
          <span>
            <span className="font-semibold text-slate-900 dark:text-white">
              I’m happy for the committee to contact me about the gym project.
            </span>{' '}
            Your details go only to the James Square committee and are not shared or added to any mailing list. See our{' '}
            <Link href="/privacy" className="font-semibold underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errorText('privacyAcknowledgement')}

        {errors._form && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
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
      </div>
    </form>
  );
}
