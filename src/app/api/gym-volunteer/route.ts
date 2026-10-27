import { renderGymVolunteer, validateGymVolunteer } from '@/lib/gymVolunteer';
import { saveGymVolunteer, setGymVolunteerDeliveryStatus } from '@/lib/gymVolunteerStore';
import { sendWithResend } from '@/lib/email/sendWithResend';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BODY_BYTES = 8 * 1024;
const RECIPIENT = 'committee@james-square.com';
const SENDER = 'JSPA Committee <committee@james-square.com>';
const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
const response = (body: object, status: number) => Response.json(body, { status, headers });

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, 'gym-volunteer'), { limit: 5, windowMs: 15 * 60_000 });
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
  const validated = validateGymVolunteer(body);
  if (!validated.success) return response({ error: 'Please correct the highlighted fields.', fields: validated.errors }, 400);

  const { website: _honeypot, ...volunteer } = validated.data;
  void _honeypot;
  let id: string | null = null;
  try { id = await saveGymVolunteer(volunteer); } catch { id = null; }

  const rendered = renderGymVolunteer(validated.data);
  const subjectName = volunteer.name.replace(/[\r\n]+/g, ' ');
  try {
    await sendWithResend({
      from: SENDER,
      to: RECIPIENT,
      replyTo: volunteer.email,
      subject: `Gym volunteer — ${subjectName}`,
      html: rendered.html,
      text: rendered.text,
    });
  } catch {
    // Never log the submission. If it was stored, the committee can still find it.
    if (!id) return response({ error: 'We could not send your details. Please try again later.' }, 503);
    await setGymVolunteerDeliveryStatus(id, 'delivery-failed').catch(() => undefined);
    return response({ success: true }, 200);
  }
  if (id) await setGymVolunteerDeliveryStatus(id, 'delivered').catch(() => undefined);
  return response({ success: true }, 200);
}
