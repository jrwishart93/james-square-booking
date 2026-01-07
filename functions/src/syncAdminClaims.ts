import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

if (!getApps().length) {
  initializeApp();
}

export const syncAdminClaims = onDocumentWritten('users/{uid}', async (event) => {
  const uid = event.params.uid;
  const after = event.data?.after?.data();
  const before = event.data?.before?.data();

  if (!after) return;

  const wasAdmin = before?.isAdmin === true;
  const isAdmin = after.isAdmin === true;

  if (wasAdmin === isAdmin) return;

  await getAuth().setCustomUserClaims(uid, {
    admin: isAdmin,
  });

  console.log(`Admin claim ${isAdmin ? 'granted' : 'revoked'} for user ${uid}`);
});
