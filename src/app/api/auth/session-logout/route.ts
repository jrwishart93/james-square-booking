import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (sessionCookie) {
      try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
        await adminAuth.revokeRefreshTokens(decoded.sub);
      } catch (error) {
        console.warn('[session-logout] Session verification/revocation skipped', error);
      }
    }

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set('__session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('[session-logout] Unexpected error', error);
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
