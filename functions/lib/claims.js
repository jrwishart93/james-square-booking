"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOwnerClaim = void 0;
const crypto_1 = require("crypto");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const metrics_1 = require("./metrics");
// Server-to-server calls must include this header plus the UID header to bypass admin checks.
const SERVER_KEY_HEADER = 'x-owner-claim-server-key';
const VERIFIED_UID_HEADER = 'x-owner-claim-verified-uid';
const safeCompare = (a, b) => {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);
    if (aBuffer.length !== bBuffer.length) {
        return false;
    }
    try {
        return (0, crypto_1.timingSafeEqual)(aBuffer, bBuffer);
    }
    catch (error) {
        console.error('Failed to compare secrets securely', error);
        return false;
    }
};
const canBypassAdminCheck = (requestUid, rawRequest) => {
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
exports.setOwnerClaim = (0, https_1.onCall)(async (request) => {
    await (0, metrics_1.incrementUsage)('setOwnerClaim');
    const { data, auth, rawRequest } = request;
    if (!data || typeof data !== 'object') {
        throw new https_1.HttpsError('invalid-argument', 'Request data is required.');
    }
    const { uid, owner } = data;
    if (typeof uid !== 'string' || uid.trim().length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'A target uid is required.');
    }
    if (typeof owner !== 'boolean') {
        throw new https_1.HttpsError('invalid-argument', 'The owner flag must be a boolean.');
    }
    const isAdmin = auth?.token?.admin === true;
    const hasServerBypass = canBypassAdminCheck(uid, rawRequest);
    if (!isAdmin && !hasServerBypass) {
        throw new https_1.HttpsError('permission-denied', 'Only administrators may modify owner claims.');
    }
    const authClient = (0, auth_1.getAuth)();
    const firestore = (0, firestore_1.getFirestore)();
    const userRecord = await authClient.getUser(uid);
    const existingClaims = userRecord.customClaims ?? {};
    const nextClaims = { ...existingClaims, owner };
    await authClient.setCustomUserClaims(uid, nextClaims);
    await firestore
        .collection('users')
        .doc(uid)
        .set({
        roles: { owner },
        claimsSyncedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { ok: true };
});
