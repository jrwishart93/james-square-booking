import { CctvRequest, escapeHtml } from '@/lib/cctvRequest';

const labels: Partial<Record<keyof CctvRequest, string>> = {
  requestorName: 'Requestor name', email: 'Email (reply context)', telephone: 'Telephone', property: 'Property / flat', preferredContact: 'Preferred contact', incidentDate: 'Incident date', timePrecision: 'Time precision', incidentTime: 'Incident time', timeFrom: 'Time window start', timeTo: 'Time window end', incidentType: 'Incident type', location: 'Location', detailedLocation: 'Detailed location', policeStatus: 'Police reporting status', policeReportDate: 'Police report date', policeReference: 'Police reference', officerDetails: 'Officer details', narrative: 'Incident narrative', identifyingDetails: 'Identifying details', signature: 'Typed signature', submissionDate: 'Submission date', privacyAcknowledgement: 'Privacy acknowledged', policeAcknowledgement: 'Separate Police Scotland report acknowledged',
};

export function renderCctvRequest(data: CctvRequest) {
  const entries = Object.entries(labels).map(([key, label]) => {
    const value = data[key as keyof CctvRequest];
    return [label!, typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'Not provided'] as const;
  });
  const html = `<h1>CCTV review request</h1><p>Reply to the requestor at <strong>${escapeHtml(data.email)}</strong>.</p><table style="border-collapse:collapse;width:100%"><tbody>${entries.map(([label,value]) => `<tr><th style="text-align:left;vertical-align:top;border:1px solid #ccc;padding:8px">${escapeHtml(label)}</th><td style="white-space:pre-wrap;border:1px solid #ccc;padding:8px">${escapeHtml(value)}</td></tr>`).join('')}</tbody></table>`;
  const text = ['CCTV REVIEW REQUEST', `Reply to: ${data.email}`, '', ...entries.map(([label,value]) => `${label}: ${value}`)].join('\n');
  return { html, text };
}
