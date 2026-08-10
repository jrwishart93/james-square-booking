import { randomUUID } from 'crypto';
import { validateCctvRequest } from '@/lib/cctvRequest';
import { renderCctvRequest } from '@/lib/email/renderCctvRequest';
import { sendWithResend } from '@/lib/email/sendWithResend';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BODY_BYTES = 32 * 1024;
const RECIPIENT = 'cctv@james-square.com';
const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
const response = (body: object, status: number) => Response.json(body, { status, headers });

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
  const requestId = randomUUID();
  const rendered = renderCctvRequest(validated.data);
  const subjectName = validated.data.requestorName.replace(/[\r\n]+/g, ' ');
  try {
    await sendWithResend({
      to: RECIPIENT,
      subject: `CCTV review request — ${validated.data.incidentDate} — ${subjectName}`,
      html: `<p><strong>Request ID:</strong> ${requestId}</p>${rendered.html}`,
      text: `Request ID: ${requestId}\n\n${rendered.text}`,
    });
  } catch {
    return response({ error: 'We could not submit your request. Please try again later.' }, 503);
  }
  return response({ success: true, requestId }, 200);
}
