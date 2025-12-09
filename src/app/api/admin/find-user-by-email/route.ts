import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

      if (decoded.admin !== true) {
        return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
      }
    } catch (error) {
      console.error('[find-user-by-email] Failed to verify session cookie', error);
      return NextResponse.json({ error: 'Session invalid or expired.' }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { email } = (body ?? {}) as { email?: unknown };

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const userRecord = await adminAuth.getUserByEmail(normalizedEmail);
      return NextResponse.json({ uid: userRecord.uid });
    } catch (error) {
      console.error('[find-user-by-email] Failed to find user', error);
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('[find-user-by-email] Unexpected error', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
