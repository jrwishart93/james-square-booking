'use server';

import { timingSafeEqual } from 'node:crypto';
import { headers } from 'next/headers';

import bcrypt from 'bcryptjs';

import { rateLimit } from '@/lib/security/rateLimit';

/**
 * Verification of the shared access codes for the Owners and Committee areas.
 *
 * These codes used to be plain string constants inside client components
 * (`const OWNERS_ACCESS_CODE = '3579'`), which meant they were compiled into the
 * JavaScript served to every anonymous visitor — anyone who opened the browser
 * console could read them. Comparison now happens on the server only.
 *
 * Preferred configuration is a bcrypt hash in the environment:
 *
 *   OWNERS_ACCESS_CODE_HASH=$2a$...
 *   COMMITTEE_ACCESS_CODE_HASH=$2a$...
 *
 * (generate with: node -e "console.log(require('bcryptjs').hashSync('CODE', 12))")
 *
 * If no hash is configured we fall back to the existing codes, held as
 * server-side constants so the site keeps working after deploy. The fallback
 * still removes the codes from the browser bundle, but the codes themselves
 * should be rotated and moved into environment variables — see finding S-04 in
 * docs/gdpr-audit-2026.md.
 */

const LEGACY_CODES = {
  owners: '3579',
  committee: '9753',
} as const;

const HASH_ENV_VARS = {
  owners: 'OWNERS_ACCESS_CODE_HASH',
  committee: 'COMMITTEE_ACCESS_CODE_HASH',
} as const;

export type AccessArea = keyof typeof LEGACY_CODES;

export type VerifyAccessCodeResult = {
  ok: boolean;
  error?: string;
};

const constantTimeEquals = (a: string, b: string) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  try {
    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
};

/** Rate-limit key from the request IP, so a shared code cannot be brute-forced. */
async function throttleKey(area: AccessArea): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for') ?? '';
  const ip = forwarded.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown';
  return `access-code:${area}:${ip}`;
}

export async function verifyAccessCode(
  area: AccessArea,
  code: string,
): Promise<VerifyAccessCodeResult> {
  if (area !== 'owners' && area !== 'committee') {
    return { ok: false, error: 'Unknown area.' };
  }

  // A four-digit code has only 10,000 possibilities, so throttling is the main
  // thing standing between it and an exhaustive search.
  const limit = rateLimit(await throttleKey(area), { limit: 8, windowMs: 10 * 60_000 });
  if (!limit.allowed) {
    return {
      ok: false,
      error: 'Too many attempts. Please wait a few minutes and try again.',
    };
  }

  const input = String(code ?? '').trim();
  if (!input) {
    return { ok: false, error: 'Please enter the access code.' };
  }

  if (input.length > 128) {
    return { ok: false, error: 'Incorrect access code.' };
  }

  const hash = process.env[HASH_ENV_VARS[area]];

  if (hash) {
    const isValid = await bcrypt.compare(input, hash);
    return isValid ? { ok: true } : { ok: false, error: 'Incorrect access code.' };
  }

  const isValid = constantTimeEquals(input, LEGACY_CODES[area]);
  if (!isValid) {
    return { ok: false, error: 'Incorrect access code.' };
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      `[access-code] ${HASH_ENV_VARS[area]} is not set; using the built-in fallback code. ` +
        'Set a bcrypt hash and rotate the code.',
    );
  }

  return { ok: true };
}
