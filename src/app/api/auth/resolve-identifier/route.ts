import { NextResponse, type NextRequest } from 'next/server';

import { adminDb } from '@/lib/firebaseAdmin';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Resolves a username to the email address used for sign-in.
 *
 * This exists so that login-by-username and password reset keep working while
 * the /users collection is closed to client reads — previously every visitor
 * could query the collection and walk out with every resident's name, email
 * address and flat number.
 *
 * Two anti-abuse measures matter here:
 *
 *  1. Rate limiting, because this endpoint is an oracle: it necessarily reveals
 *     whether a username exists.
 *  2. It returns *only* the email address, never the profile. Nothing about the
 *     resident's name, flat or role leaves the server.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(clientKey(req, 'resolve-identifier'), {
    limit: 12,
    windowMs: 10 * 60_000,
  });
  if (!limit.allowed) {
    return tooManyRequests(limit, 'Too many lookups. Please wait a moment and try again.');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { username } = (body ?? {}) as { username?: unknown };

  if (typeof username !== 'string') {
    return NextResponse.json({ error: 'A username is required.' }, { status: 400 });
  }

  const normalised = username.trim().toLowerCase();

  // Reject anything that is not plausibly a username before touching the database.
  if (!normalised || normalised.length > 64 || normalised.includes('@')) {
    return NextResponse.json({ error: 'A username is required.' }, { status: 400 });
  }

  try {
    const snapshot = await adminDb
      .collection('users')
      .where('username', '==', normalised)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ email: null });
    }

    const email = snapshot.docs[0]?.get('email');
    return NextResponse.json(
      { email: typeof email === 'string' ? email : null },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (error) {
    console.error('[resolve-identifier] Lookup failed', error);
    return NextResponse.json({ error: 'Lookup failed. Please try again.' }, { status: 500 });
  }
}
