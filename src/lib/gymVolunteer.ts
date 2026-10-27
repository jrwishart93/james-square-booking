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
  { value: 'other', label: 'Something else' },
] as const;

export type GymHelpOption = (typeof GYM_HELP_OPTIONS)[number]['value'];

export type GymVolunteer = {
  name: string;
  email: string;
  location: string;
  help: GymHelpOption[];
  comments: string;
  privacyAcknowledgement: boolean;
  /** Honeypot. Always empty for a real visitor. */
  website: string;
};

export const GYM_VOLUNTEER_LIMITS = { name: 120, email: 254, location: 80, comments: 2000 } as const;

export type GymVolunteerErrors = Partial<Record<keyof GymVolunteer | '_form', string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedKeys = new Set<string>(['name', 'email', 'location', 'help', 'comments', 'privacyAcknowledgement', 'website']);
const helpValues = new Set<string>(GYM_HELP_OPTIONS.map(option => option.value));

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

  const help = Array.isArray(raw.help) ? raw.help : [];
  const data: GymVolunteer = {
    name: normalizeText(raw.name),
    email: normalizeText(raw.email),
    location: normalizeText(raw.location),
    help: [...new Set(help.filter((value): value is GymHelpOption => typeof value === 'string' && helpValues.has(value)))],
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
  if (help.length !== data.help.length) errors.help = 'Select a valid option.';
  if (data.help.length === 0) errors.help = 'Choose at least one way you would like to help.';
  if (!data.privacyAcknowledgement) errors.privacyAcknowledgement = 'Please confirm you have read how your details are used.';
  if (data.website) errors._form = 'Your submission could not be accepted.';

  return Object.keys(errors).length ? { success: false, errors } : { success: true, data };
}

export function renderGymVolunteer(data: GymVolunteer): { html: string; text: string } {
  const helpLabels = GYM_HELP_OPTIONS.filter(option => data.help.includes(option.value)).map(option => option.label);
  const rows: [string, string][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Flat or block', data.location || 'Not given'],
    ['Would like to help with', helpLabels.join(', ')],
    ['Comments', data.comments || 'None'],
  ];
  const html = `<h2>Gym volunteer interest</h2><table cellpadding="6">${rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>`;
  const text = `Gym volunteer interest\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  return { html, text };
}
