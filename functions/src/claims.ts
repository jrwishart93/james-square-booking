import { timingSafeEqual } from 'crypto';

import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { type CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';

import { incrementUsage } from './metrics';

interface SetOwnerClaimPayload {
  uid: string;
  owner: boolean;
}

type SetOwnerClaimRequest = CallableRequest<SetOwnerClaimPayload>;

type SetOwnerClaimResponse = { ok: true };

// Server-to-server calls must include this header plus the UID header to bypass admin checks.
const SERVER_KEY_HEADER = 'x-owner-claim-server-key';
const VERIFIED_UID_HEADER = 'x-owner-claim-verified-uid';

const safeCompare = (a: string, b: string) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  try {
    return timingSafeEqual(aBuffer, bBuffer);
  } catch (error) {
    console.error('Failed to compare secrets securely', error);
    return false;
  }
};

const canBypassAdminCheck = (requestUid: string, rawRequest: SetOwnerClaimRequest['rawRequest']) => {
  const serverKey = process.env.OWNER_CLAIM_SERVER_KEY;
  if (!serverKey) {
    return false;
  }

  const headerCandidate = rawRequest.headers[SERVER_KEY_HEADER] ?? rawRequest.headers[SERVER_KEY_HEADER.toUpperCase()];
  const verifiedCandidate = rawRequest.headers[VERIFIED_UID_HEADER] ?? rawRequest.headers[VERIFIED_UID_HEADER.toUpperCase()];

  const headerValue = Array.isArray(headerCandidate) ? headerCandidate[0] : headerCandidate;
  const verifiedValue = Array.isArray(verifiedCandidate) ? verifiedCandidate[0] : verifiedCandidate;

  if (typeof headerValue !== 'string' || typeof verifiedValue !== 'string') {
    return false;
  }

  if (verifiedValue !== requestUid) {
    return false;
  }

  return safeCompare(headerValue, serverKey);
};

export const setOwnerClaim = onCall<SetOwnerClaimPayload>(
  async (request): Promise<SetOwnerClaimResponse> => {
    await incrementUsage('setOwnerClaim');

    const { data, auth, rawRequest } = request;

    if (!data || typeof data !== 'object') {
      throw new HttpsError('invalid-argument', 'Request data is required.');
    }

    const { uid, owner } = data;

    if (typeof uid !== 'string' || uid.trim().length === 0) {
      throw new HttpsError('invalid-argument', 'A target uid is required.');
    }

    if (typeof owner !== 'boolean') {
      throw new HttpsError('invalid-argument', 'The owner flag must be a boolean.');
    }

    const isAdmin = auth?.token?.admin === true;
    const hasServerBypass = canBypassAdminCheck(uid, rawRequest);

    if (!isAdmin && !hasServerBypass) {
      throw new HttpsError('permission-denied', 'Only administrators may modify owner claims.');
    }

    const authClient = getAuth();
    const firestore = getFirestore();

    const userRecord = await authClient.getUser(uid);
    const existingClaims = userRecord.customClaims ?? {};
    const nextClaims = { ...existingClaims, owner };

    await authClient.setCustomUserClaims(uid, nextClaims);

    await firestore
      .collection('users')
      .doc(uid)
      .set(
        {
          roles: { owner },
          claimsSyncedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return { ok: true };
  },
);
