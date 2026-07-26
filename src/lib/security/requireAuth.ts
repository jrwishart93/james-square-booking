import 'server-only';

import type { DecodedIdToken } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

/**
 * Shared authentication and authorisation for API routes.
 *
 * Every privileged endpoint funnels through here so that "verified the token"
 * and "checked they are actually an admin" cannot drift apart again — the two
 * mail endpoints previously did the first without the second.
 */

export type AuthFailure = { ok: false; response: NextResponse };
export type AuthSuccess = { ok: true; token: DecodedIdToken };
export type AuthResult = AuthSuccess | AuthFailure;

function fail(status: number, error: string): AuthFailure {
  return { ok: false, response: NextResponse.json({ error }, { status }) };
}

function bearerToken(request: Request): string | undefined {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || undefined;
}

/** Verifies the caller is signed in. Revoked tokens are rejected. */
export async function requireUser(request: Request): Promise<AuthResult> {
  const token = bearerToken(request);
  if (!token) {
    return fail(401, 'Not authenticated.');
  }

  try {
    // checkRevoked: a disabled or signed-out account must lose access at once.
    const decoded = await adminAuth.verifyIdToken(token, true);
    return { ok: true, token: decoded };
  } catch {
    // Deliberately vague: distinguishing "expired" from "forged" helps attackers.
    return fail(401, 'Session invalid or expired.');
  }
}

/**
 * True if the account is an administrator.
 *
 * The custom claim is authoritative, with a fallback to the `isAdmin` flag on the
 * user's Firestore document for admins whose claims have not been synced yet.
 * The fallback is read with the Admin SDK, so a client cannot influence it.
 */
export async function isAdminToken(token: DecodedIdToken): Promise<boolean> {
  if (token.admin === true) return true;

  try {
    const snapshot = await adminDb.collection('users').doc(token.uid).get();
    return snapshot.exists && snapshot.get('isAdmin') === true;
  } catch (error) {
    console.error('[auth] Failed to read admin flag', error);
    return false;
  }
}

/** Verifies the caller is signed in **and** an administrator. */
export async function requireAdmin(request: Request): Promise<AuthResult> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth;

  if (!(await isAdminToken(auth.token))) {
    console.warn('[auth] Non-admin attempted a privileged action', { uid: auth.token.uid });
    return fail(403, 'You do not have permission to perform this action.');
  }

  return auth;
}

/**
 * Verifies the caller may send committee mail: an administrator, or an account
 * explicitly flagged as a committee member.
 */
export async function requireCommittee(request: Request): Promise<AuthResult> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth;

  if (auth.token.admin === true || auth.token.committee === true) {
    return auth;
  }

  try {
    const snapshot = await adminDb.collection('users').doc(auth.token.uid).get();
    if (
      snapshot.exists &&
      (snapshot.get('isAdmin') === true || snapshot.get('isCommittee') === true)
    ) {
      return auth;
    }
  } catch (error) {
    console.error('[auth] Failed to read committee flag', error);
  }

  console.warn('[auth] Non-committee account attempted to send committee mail', {
    uid: auth.token.uid,
  });
  return fail(403, 'Committee members only.');
}
