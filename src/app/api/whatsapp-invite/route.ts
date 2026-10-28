import { residentAnswersCorrect, whatsAppInviteFor } from '@/lib/residentCheck.server';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BODY_BYTES = 2 * 1024;
const GROUPS = new Set(['community', 'residents']);
const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
const response = (body: object, status: number) => Response.json(body, { status, headers });

/**
 * Returns a WhatsApp invitation once the resident questions are answered
 * correctly. The reply never says which answer was wrong, and attempts are
 * throttled, so the questions cannot be solved one at a time.
 */
export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, 'whatsapp-invite'), { limit: 6, windowMs: 15 * 60_000 });
  if (!limited.allowed) {
    const result = tooManyRequests(limited);
    result.headers.set('Cache-Control', 'no-store');
    return result;
  }
  let text: string;
  try { text = await request.text(); } catch { return response({ error: 'Unable to read request.' }, 400); }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return response({ error: 'Request body is too large.' }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return response({ error: 'Invalid JSON request.' }, 400); }

  const { group, answers } = (body ?? {}) as { group?: unknown; answers?: unknown };
  if (typeof group !== 'string' || !GROUPS.has(group)) return response({ error: 'Unknown group.' }, 400);
  if (!residentAnswersCorrect(answers)) {
    return response({ error: 'Some of those answers aren’t right. Please check and try again.' }, 403);
  }
  return response({ url: await whatsAppInviteFor(group as 'community' | 'residents') }, 200);
}
