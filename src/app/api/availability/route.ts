import { NextResponse, type NextRequest } from 'next/server';

import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { clientKey, rateLimit, tooManyRequests } from '@/lib/security/rateLimit';
import { isAdminToken } from '@/lib/security/requireAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Placeholder returned instead of another resident's email address. */
const BOOKED_SENTINEL = '__booked__';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type AvailabilityEntry = {
  facility: string;
  date: string;
  time: string;
  /**
   * The caller's own email when the booking is theirs (so "Your booking" still
   * works), the booker's email when the caller is an admin, and an opaque
   * sentinel for everyone else.
   */
  user: string;
};

/**
 * Public facility availability.
 *
 * The bookings collection stores the booker's email address. It used to be
 * world-readable so that the schedule could be shown to visitors who were not
 * signed in — which meant every resident's email address, plus a timestamped
 * record of when they use the pool, could be downloaded by anyone.
 *
 * This endpoint keeps the schedule public while resolving identities server-side:
 * an anonymous caller learns only that a slot is taken.
 */
export async function GET(req: NextRequest) {
  const limit = rateLimit(clientKey(req, 'availability'), { limit: 120, windowMs: 60_000 });
  if (!limit.allowed) return tooManyRequests(limit);

  const date = req.nextUrl.searchParams.get('date');

  if (!date || !DATE_PATTERN.test(date)) {
    return NextResponse.json(
      { error: 'A date in YYYY-MM-DD format is required.' },
      { status: 400 },
    );
  }

  // Identify the caller if they supplied a token, but do not require one.
  let callerEmail: string | null = null;
  let callerIsAdmin = false;

  const authHeader = req.headers.get('authorization') ?? '';
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);

  if (tokenMatch?.[1]) {
    try {
      const decoded = await adminAuth.verifyIdToken(tokenMatch[1], true);
      callerEmail = decoded.email ?? null;
      callerIsAdmin = await isAdminToken(decoded);
    } catch {
      // An invalid token is treated as anonymous rather than as an error: the
      // schedule is public, so there is nothing to fail closed on.
    }
  }

  try {
    const snapshot = await adminDb.collection('bookings').where('date', '==', date).get();

    const bookings: AvailabilityEntry[] = snapshot.docs.flatMap((doc) => {
      const data = doc.data() as {
        facility?: unknown;
        date?: unknown;
        time?: unknown;
        user?: unknown;
      };

      if (
        typeof data.facility !== 'string' ||
        typeof data.date !== 'string' ||
        typeof data.time !== 'string'
      ) {
        return [];
      }

      const bookedBy = typeof data.user === 'string' ? data.user : '';
      const isOwn = Boolean(callerEmail) && bookedBy === callerEmail;

      return [
        {
          facility: data.facility,
          date: data.date,
          time: data.time,
          user: isOwn || callerIsAdmin ? bookedBy : BOOKED_SENTINEL,
        },
      ];
    });

    return NextResponse.json(
      { date, bookings },
      // Per-caller output, so it must never be cached in a shared layer.
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (error) {
    console.error('[availability] Failed to load bookings', error);
    return NextResponse.json({ error: 'Failed to load availability.' }, { status: 500 });
  }
}
