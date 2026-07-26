import { NextResponse, type NextRequest } from 'next/server';

import { EMAIL_GROUPS, emailGroupCounts, EMAIL_GROUP_KEYS } from '@/lib/emailGroups';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';
import { requireAdmin } from '@/lib/security/requireAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Returns the addresses behind each named mailing group, for the admin email
 * composer. Administrators only — this is the one path by which committee
 * members' personal addresses reach a browser.
 */
export async function GET(req: NextRequest) {
  const limit = rateLimit(clientKey(req, 'email-groups'), { limit: 30, windowMs: 60_000 });
  if (!limit.allowed) return tooManyRequests(limit);

  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  return NextResponse.json(
    {
      groups: EMAIL_GROUP_KEYS.reduce<Record<string, string[]>>((acc, key) => {
        acc[key] = [...EMAIL_GROUPS[key]];
        return acc;
      }, {}),
      counts: emailGroupCounts(),
    },
    // Recipient lists must never be cached by a CDN or shared proxy.
    { headers: { 'Cache-Control': 'no-store, private' } },
  );
}
