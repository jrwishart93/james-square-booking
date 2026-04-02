import { NextRequest, NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

type ErrorHandlingStrategy = {
  status: 401 | 500;
  reason:
    | 'invalid-admin-credentials'
    | 'project-mismatch'
    | 'token-expired'
    | 'token-revoked'
    | 'invalid-token'
    | 'user-disabled'
    | 'token-verification-failed'
    | 'auth-runtime-failure';
};

function getEnvMetadata() {
  return {
    projectConfigured: Boolean(process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT),
    credentialsConfigured: Boolean(
      process.env.FIREBASE_ADMIN_CREDENTIALS ||
        process.env.FIREBASE_ADMIN_JSON ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY),
    ),
  };
}

function getErrorHandlingStrategy(errorCode?: string, errorMessage?: string): ErrorHandlingStrategy {
  const message = errorMessage?.toLowerCase() ?? '';

  if (errorCode === 'auth/invalid-credential' || errorCode === 'app/invalid-credential') {
    return {
      status: 500,
      reason: 'invalid-admin-credentials',
    };
  }

  if (errorCode === 'auth/insufficient-permission') {
    return {
      status: 500,
      reason: 'auth-runtime-failure',
    };
  }

  if (errorCode === 'auth/argument-error') {
    if (
      message.includes('incorrect "aud"') ||
      message.includes("incorrect 'aud'") ||
      message.includes('incorrect "iss"') ||
      message.includes("incorrect 'iss'") ||
      message.includes('project')
    ) {
      return {
        status: 401,
        reason: 'project-mismatch',
      };
    }

    return {
      status: 401,
      reason: 'token-verification-failed',
    };
  }

  if (errorCode === 'auth/id-token-expired') {
    return {
      status: 401,
      reason: 'token-expired',
    };
  }

  if (errorCode === 'auth/id-token-revoked') {
    return {
      status: 401,
      reason: 'token-revoked',
    };
  }

  if (errorCode === 'auth/invalid-id-token') {
    return {
      status: 401,
      reason: 'invalid-token',
    };
  }

  if (errorCode === 'auth/user-disabled') {
    return {
      status: 401,
      reason: 'user-disabled',
    };
  }

  if (errorCode?.startsWith('auth/')) {
    return {
      status: 401,
      reason: 'token-verification-failed',
    };
  }

  return {
    status: 500,
    reason: 'auth-runtime-failure',
  };
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

    const verifiedToken = await adminAuth.verifyIdToken(idToken);
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
    const handling = getErrorHandlingStrategy(errorCode, errorMessage);
    const envMetadata = getEnvMetadata();

    console.error('[session-login] Failed to create session cookie', {
      firebaseError: {
        code: errorCode,
        message: errorMessage,
      },
      classification: handling,
      ...envMetadata,
    });

    return NextResponse.json(
      {
        error: handling.status === 401 ? 'Unauthorized' : 'Internal Server Error',
        reason: handling.reason,
      },
      { status: handling.status },
    );
  }
}
