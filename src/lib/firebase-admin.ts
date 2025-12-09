import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_ADMIN_JSON
  ? JSON.parse(process.env.FIREBASE_ADMIN_JSON)
  : undefined;

const app = getApps().length
  ? getApps()[0]
  : initializeApp(serviceAccount ? { credential: cert(serviceAccount) } : {});

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
