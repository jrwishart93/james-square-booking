import { escapeHtml, normalizeText } from '@/lib/cctvRequest';

/**
 * Volunteer interest for the proposed residents' gym (/gym-area).
 * Shared by the client form and the server route so both apply the same rules.
 */

export const GYM_HELP_OPTIONS = [
  { value: 'clearing', label: 'Clearing the room' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'painting', label: 'Painting and decorating' },
  { value: 'equipment', label: 'Cleaning and checking equipment' },
  { value: 'ideas', label: 'Sharing ideas and suggestions' },
  { value: 'other', label: 'Something else' },
] as const;

export type GymHelpOption = (typeof GYM_HELP_OPTIONS)[number]['value'];

export const GYM_AVAILABILITY_OPTIONS = [
  { value: 'weekday-daytime', label: 'Weekday daytimes' },
  { value: 'weekday-evenings', label: 'Weekday evenings' },
  { value: 'weekends', label: 'Weekends' },
] as const;

export type GymAvailabilityOption = (typeof GYM_AVAILABILITY_OPTIONS)[number]['value'];

export type GymVolunteer = {
  name: string;
  email: string;
  /** Optional. */
  phone: string;
  location: string;
  help: GymHelpOption[];
  /** Optional. */
  availability: GymAvailabilityOption[];
  comments: string;
  privacyAcknowledgement: boolean;
  /** Honeypot. Always empty for a real visitor. */
  website: string;
};

export const GYM_VOLUNTEER_LIMITS = { name: 120, email: 254, phone: 30, location: 80, comments: 2000 } as const;

export type GymVolunteerErrors = Partial<Record<keyof GymVolunteer | '_form', string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits with optional spaces, dashes, brackets and a leading +; 7 to 15 digits in total.
const phonePattern = /^\+?[\d\s()-]+$/;
const allowedKeys = new Set<string>([
  'name', 'email', 'phone', 'location', 'help', 'availability', 'comments', 'privacyAcknowledgement', 'website',
]);
const helpValues = new Set<string>(GYM_HELP_OPTIONS.map(option => option.value));
const availabilityValues = new Set<string>(GYM_AVAILABILITY_OPTIONS.map(option => option.value));

function pickOptions<T extends string>(value: unknown, allowed: Set<string>): { picked: T[]; invalid: boolean } {
  const list = Array.isArray(value) ? value : [];
  const picked = [...new Set(list.filter((item): item is T => typeof item === 'string' && allowed.has(item)))];
  return { picked, invalid: picked.length !== list.length };
}

export function validateGymVolunteer(
  input: unknown,
): { success: true; data: GymVolunteer } | { success: false; errors: GymVolunteerErrors } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { success: false, errors: { _form: 'The request must be a JSON object.' } };
  }
  const raw = input as Record<string, unknown>;
  if (Object.keys(raw).some(key => !allowedKeys.has(key))) {
    return { success: false, errors: { _form: 'The request contains an unexpected field.' } };
  }

  const help = pickOptions<GymHelpOption>(raw.help, helpValues);
  const availability = pickOptions<GymAvailabilityOption>(raw.availability, availabilityValues);
  const data: GymVolunteer = {
    name: normalizeText(raw.name),
    email: normalizeText(raw.email),
    phone: normalizeText(raw.phone),
    location: normalizeText(raw.location),
    help: help.picked,
    availability: availability.picked,
    comments: normalizeText(raw.comments),
    privacyAcknowledgement: raw.privacyAcknowledgement === true,
    website: normalizeText(raw.website),
  };

  const errors: GymVolunteerErrors = {};
  for (const key of Object.keys(GYM_VOLUNTEER_LIMITS) as (keyof typeof GYM_VOLUNTEER_LIMITS)[]) {
    if (data[key].length > GYM_VOLUNTEER_LIMITS[key]) errors[key] = `Must be ${GYM_VOLUNTEER_LIMITS[key]} characters or fewer.`;
  }
  if (!data.name) errors.name = 'Please enter your name.';
  if (!emailPattern.test(data.email)) errors.email = 'Enter a valid email address.';
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '').length;
    if (!phonePattern.test(data.phone) || digits < 7 || digits > 15) errors.phone = 'Enter a valid phone number, or leave it blank.';
  }
  if (help.invalid) errors.help = 'Select a valid option.';
  if (data.help.length === 0) errors.help = 'Choose at least one way you would like to help.';
  if (availability.invalid) errors.availability = 'Select a valid option.';
  if (!data.privacyAcknowledgement) errors.privacyAcknowledgement = 'Please confirm you have read how your details are used.';
  if (data.website) errors._form = 'Your submission could not be accepted.';

  return Object.keys(errors).length ? { success: false, errors } : { success: true, data };
}

export function renderGymVolunteer(data: GymVolunteer): { html: string; text: string } {
  const helpLabels = GYM_HELP_OPTIONS.filter(option => data.help.includes(option.value)).map(option => option.label);
  const availabilityLabels = GYM_AVAILABILITY_OPTIONS
    .filter(option => data.availability.includes(option.value))
    .map(option => option.label);
  const rows: [string, string][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || 'Not given'],
    ['Flat or block', data.location || 'Not given'],
    ['Would like to help with', helpLabels.join(', ')],
    ['Usually available', availabilityLabels.join(', ') || 'Not given'],
    ['Comments', data.comments || 'None'],
  ];
  const html = `<h2>Gym volunteer interest</h2><table cellpadding="6">${rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>`;
  const text = `Gym volunteer interest\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  return { html, text };
}
