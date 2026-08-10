import { randomInt } from 'node:crypto';

import { validateCctvRequest } from '@/lib/cctvRequest';
import {
  createCctvRequestRecord,
  saveDeliveredCctvRequest,
  setCctvRequestDeliveryStatus,
} from '@/lib/cctvReference';
import { renderCctvRequest } from '@/lib/email/renderCctvRequest';
import { sendWithResend } from '@/lib/email/sendWithResend';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BODY_BYTES = 32 * 1024;
const RECIPIENT = 'cctv@james-square.com';
const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
const response = (body: object, status: number) => Response.json(body, { status, headers });

/**
 * Firestore normally supplies a strictly sequential daily suffix. When it is
 * unavailable, this cryptographically generated suffix preserves the public
 * JS-YYYYMMDD-NNNN format. Random fallback suffixes are unique best-effort,
 * not sequential; the email remains the authoritative request delivery.
 */
const fallbackReference = (now = new Date()) => {
  const dateKey = now.toISOString().slice(0, 10).replaceAll('-', '');
  return `JS-${dateKey}-${String(randomInt(10_000)).padStart(4, '0')}`;
};

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, 'cctv-request'), { limit: 5, windowMs: 15 * 60_000 });
  if (!limited.allowed) {
    const result = tooManyRequests(limited);
    result.headers.set('Cache-Control', 'no-store');
    return result;
  }
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BODY_BYTES) return response({ error: 'Request body is too large.' }, 413);
  let text: string;
  try { text = await request.text(); } catch { return response({ error: 'Unable to read request.' }, 400); }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return response({ error: 'Request body is too large.' }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return response({ error: 'Invalid JSON request.' }, 400); }
  const validated = validateCctvRequest(body);
  if (!validated.success) return response({ error: 'Please correct the highlighted fields.', fields: validated.errors }, 400);
  let requestId: string;
  try {
    requestId = await createCctvRequestRecord(validated.data);
  } catch {
    requestId = fallbackReference();
  }
  const rendered = renderCctvRequest(validated.data);
  const subjectName = validated.data.requestorName.replace(/[\r\n]+/g, ' ');
  try {
    await sendWithResend({
      to: RECIPIENT,
      subject: `CCTV review request — ${validated.data.incidentDate} — ${subjectName}`,
      html: `<p><strong>James Square reference:</strong> ${requestId}</p>${rendered.html}`,
      text: `James Square reference: ${requestId}\n\n${rendered.text}`,
    });
  } catch {
    // Do not log the provider response or submission. Preserve only a searchable
    // delivery state so an administrator can safely identify requests to retry.
    await setCctvRequestDeliveryStatus(requestId, 'delivery-failed').catch(() => undefined);
    return response({ error: 'We could not submit your request. Please try again later.' }, 503);
  }
  // Delivery has already succeeded, so a bookkeeping failure must not encourage
  // the requestor to submit the same sensitive request a second time.
  await saveDeliveredCctvRequest(requestId, validated.data).catch(() => undefined);
  return response({ success: true, requestId }, 200);
}
