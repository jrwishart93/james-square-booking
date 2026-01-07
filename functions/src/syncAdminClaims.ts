import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { logger } from 'firebase-functions';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

if (!getApps().length) {
  initializeApp();
}

export const syncAdminClaims = onDocumentWritten('users/{uid}', async (event) => {
  const uid = event.params.uid;
  const afterSnap = event.data?.after;
  const beforeSnap = event.data?.before;

  const wasAdmin = beforeSnap?.data()?.isAdmin === true;
  const isAdmin = afterSnap?.exists ? afterSnap.data()?.isAdmin === true : false;

  if (wasAdmin === isAdmin) return;

  try {
    const auth = getAuth();
    const user = await auth.getUser(uid);
    const existingClaims = user.customClaims ?? {};
    const updatedClaims = { ...existingClaims };

    if (isAdmin) {
      updatedClaims.admin = true;
    } else {
      delete updatedClaims.admin;
    }

    await auth.setCustomUserClaims(uid, updatedClaims);
    logger.info(`Admin claim ${isAdmin ? 'granted' : 'revoked'} for user ${uid}`);
  } catch (error) {
    logger.error('Failed to sync admin claim', {
      uid,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
