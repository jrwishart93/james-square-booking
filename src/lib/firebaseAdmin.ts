import {
  App,
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccount = Parameters<typeof cert>[0];

let adminApp: App | null = null;

const resolveServiceAccount = (): ServiceAccount | undefined => {
  const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;

  if (credentials) {
    try {
      return JSON.parse(credentials) as ServiceAccount;
    } catch (error) {
      console.error('Failed to parse FIREBASE_ADMIN_CREDENTIALS', error);
    }
  }

  return undefined;
};

const initFirebaseAdmin = (): App => {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApp();
    return adminApp;
  }

  const serviceAccount = resolveServiceAccount();

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    try {
      adminApp = initializeApp({
        credential: applicationDefault(),
      });
    } catch (error) {
      console.warn('Falling back to default Firebase Admin initialization', error);
      adminApp = initializeApp();
    }
  }

  return adminApp;
};

const app = initFirebaseAdmin();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
