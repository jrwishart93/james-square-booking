export const CCTV_ENUMS = {
  preferredContact: ['email', 'telephone'] as const,
  timePrecision: ['exact', 'approximate', 'window'] as const,
  incidentType: ['crime', 'antisocial-behaviour', 'vehicle', 'delivery-package', 'accident', 'other'] as const,
  policeStatus: ['reported', 'not-reported', 'not-applicable'] as const,
} as const;

export type CctvRequest = {
  requestorName: string; email: string; telephone: string; property: string;
  preferredContact: typeof CCTV_ENUMS.preferredContact[number];
  incidentDate: string; timePrecision: typeof CCTV_ENUMS.timePrecision[number];
  incidentTime: string; timeFrom: string; timeTo: string;
  incidentType: typeof CCTV_ENUMS.incidentType[number]; location: string; detailedLocation: string;
  policeStatus: typeof CCTV_ENUMS.policeStatus[number]; policeReportDate: string;
  policeReference: string; officerDetails: string; narrative: string; identifyingDetails: string;
  signature: string; submissionDate: string; privacyAcknowledgement: boolean;
  policeAcknowledgement: boolean; website: string;
};

export const CCTV_LIMITS: Record<keyof CctvRequest, number> = {
  requestorName: 120, email: 254, telephone: 40, property: 120, preferredContact: 20,
  incidentDate: 10, timePrecision: 12, incidentTime: 5, timeFrom: 5, timeTo: 5,
  incidentType: 30, location: 160, detailedLocation: 500, policeStatus: 20,
  policeReportDate: 10, policeReference: 100, officerDetails: 300, narrative: 4000,
  identifyingDetails: 2000, signature: 120, submissionDate: 10,
  privacyAcknowledgement: 1, policeAcknowledgement: 1, website: 0,
};

export type CctvErrors = Partial<Record<keyof CctvRequest | '_form', string>>;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);
}

function realDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function validateCctvRequest(input: unknown): { success: true; data: CctvRequest } | { success: false; errors: CctvErrors } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { success: false, errors: { _form: 'The request must be a JSON object.' } };
  const raw = input as Record<string, unknown>;
  const allowed = new Set(Object.keys(CCTV_LIMITS));
  if (Object.keys(raw).some(key => !allowed.has(key))) return { success: false, errors: { _form: 'The request contains an unexpected field.' } };
  const data = {} as CctvRequest;
  for (const key of Object.keys(CCTV_LIMITS) as (keyof CctvRequest)[]) {
    if (key === 'privacyAcknowledgement' || key === 'policeAcknowledgement') (data[key] as boolean) = raw[key] === true;
    else (data[key] as string) = normalizeText(raw[key]);
  }
  const errors: CctvErrors = {};
  for (const key of Object.keys(CCTV_LIMITS) as (keyof CctvRequest)[]) {
    if (typeof data[key] === 'string' && (data[key] as string).length > CCTV_LIMITS[key]) errors[key] = `Must be ${CCTV_LIMITS[key]} characters or fewer.`;
  }
  const required: (keyof CctvRequest)[] = ['requestorName','email','telephone','property','preferredContact','incidentDate','timePrecision','incidentType','location','detailedLocation','policeStatus','narrative','signature','submissionDate'];
  required.forEach(key => { if (!data[key]) errors[key] = 'This field is required.'; });
  if (!emailPattern.test(data.email)) errors.email = 'Enter a valid email address.';
  for (const key of ['preferredContact','timePrecision','incidentType','policeStatus'] as const) {
    if (!(CCTV_ENUMS[key] as readonly string[]).includes(data[key])) errors[key] = 'Select a valid option.';
  }
  if (!realDate(data.incidentDate)) errors.incidentDate = 'Enter a valid incident date.';
  if (!realDate(data.submissionDate)) errors.submissionDate = 'Enter a valid submission date.';
  if (data.timePrecision === 'window') {
    if (!timePattern.test(data.timeFrom)) errors.timeFrom = 'Enter the start time.';
    if (!timePattern.test(data.timeTo)) errors.timeTo = 'Enter the end time.';
    if (!errors.timeFrom && !errors.timeTo && data.timeFrom >= data.timeTo) errors.timeTo = 'The end time must be after the start time.';
  } else if (!timePattern.test(data.incidentTime)) errors.incidentTime = 'Enter the incident time.';
  if (data.policeStatus === 'reported') {
    if (!realDate(data.policeReportDate)) errors.policeReportDate = 'Enter the report date.';
    if (!data.policeReference) errors.policeReference = 'Enter the police reference number.';
    if (!data.officerDetails) errors.officerDetails = 'Enter the officer or station details.';
  }
  if (data.incidentType === 'vehicle' || data.incidentType === 'delivery-package') {
    if (!data.identifyingDetails) errors.identifyingDetails = 'Provide identifying details for this incident type.';
  }
  if (!data.privacyAcknowledgement) errors.privacyAcknowledgement = 'You must acknowledge the privacy information.';
  if (!data.policeAcknowledgement) errors.policeAcknowledgement = 'You must confirm this does not report a crime.';
  if (data.website) errors.website = 'Unable to submit this request.';
  return Object.keys(errors).length ? { success: false, errors } : { success: true, data };
}
