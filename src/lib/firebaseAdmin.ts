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

let adminAppInstance: App | null = null;

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
  if (adminAppInstance) return adminAppInstance;
  if (getApps().length) {
    adminAppInstance = getApp();
    return adminAppInstance;
  }

  const serviceAccount = resolveServiceAccount();

  if (serviceAccount) {
    adminAppInstance = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    try {
      adminAppInstance = initializeApp({
        credential: applicationDefault(),
      });
    } catch (error) {
      console.warn('Falling back to default Firebase Admin initialization', error);
      adminAppInstance = initializeApp();
    }
  }

  return adminAppInstance;
};
const adminApp = initFirebaseAdmin();

export { adminApp };
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
