import { NextRequest, NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { idToken } = (body ?? {}) as { idToken?: unknown };

    if (typeof idToken !== 'string' || !idToken.trim()) {
      return NextResponse.json({ error: 'idToken is required.' }, { status: 400 });
    }

    const verifiedToken = await adminAuth.verifyIdToken(idToken, true);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true, uid: verifiedToken.uid }, { status: 200 });
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
    });

    return response;
  } catch (error) {
    console.error('[session-login] Failed to create session cookie', error);
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
}
