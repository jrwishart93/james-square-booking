'use server';

import bcrypt from 'bcryptjs';

interface VerifyPasscodeResult {
  ok: boolean;
  error?: string;
}

export async function verifyPasscode(formData: FormData): Promise<VerifyPasscodeResult> {
  const input = String(formData.get('passcode') ?? '').trim();
  const hash = process.env.OWNERS_PASSCODE_HASH;

  if (!input) {
    return { ok: false, error: 'Please enter the passcode.' };
  }

  if (!hash) {
    return { ok: false, error: 'Server is missing the passcode hash.' };
  }

  const isValid = await bcrypt.compare(input, hash);
  if (!isValid) {
    return { ok: false, error: 'Incorrect passcode.' };
  }

  return { ok: true };
}
