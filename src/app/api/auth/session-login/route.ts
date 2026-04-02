import { NextRequest, NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

const FIREBASE_AUTH_ERROR_CODES = new Set([
  'auth/argument-error',
  'auth/id-token-expired',
  'auth/id-token-revoked',
  'auth/insufficient-permission',
  'auth/invalid-id-token',
  'auth/user-disabled',
]);

function getEnvMetadata() {
  return {
    projectConfigured: Boolean(process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT),
    credentialsConfigured: Boolean(
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
    ),
  };
}

function getAuthFailureReason(errorCode?: string, errorMessage?: string) {
  if (errorCode === 'auth/argument-error') {
    const message = errorMessage?.toLowerCase() ?? '';

    if (
      message.includes('incorrect "aud"') ||
      message.includes("incorrect 'aud'") ||
      message.includes('incorrect "iss"') ||
      message.includes("incorrect 'iss'") ||
      message.includes('project')
    ) {
      return 'token-project-mismatch';
    }
  }

  if (errorCode === 'auth/id-token-expired') {
    return 'token-expired';
  }

  if (errorCode === 'auth/id-token-revoked') {
    return 'token-revoked';
  }

  if (errorCode === 'auth/invalid-id-token') {
    return 'invalid-token';
  }

  if (errorCode === 'auth/user-disabled') {
    return 'user-disabled';
  }

  return 'authentication-failed';
}

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
    const authError = error as { code?: string; message?: string };
    const errorCode = authError.code;
    const errorMessage = authError.message;
    const envMetadata = getEnvMetadata();

    console.error('[session-login] Failed to create session cookie', {
      code: errorCode,
      message: errorMessage,
      ...envMetadata,
    });

    if (errorCode && FIREBASE_AUTH_ERROR_CODES.has(errorCode)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          reason: getAuthFailureReason(errorCode, errorMessage),
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        reason: 'auth-infra-error',
      },
      { status: 500 },
    );
  }
}
