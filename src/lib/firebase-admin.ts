import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;

function parseServiceAccount(): Record<string, string> | null {
  const raw = process.env.FIREBASE_ADMIN_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (error) {
    console.warn('⚠️ FIREBASE_ADMIN_JSON is not valid JSON; falling back to default credentials.', error);
    return null;
  }
}

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length) {
    cachedApp = existing[0]!;
    return cachedApp;
  }

  const creds = parseServiceAccount();
  try {
    cachedApp = creds ? initializeApp({ credential: cert(creds) }) : initializeApp();
  } catch (error) {
    console.warn('⚠️ Failed to initialize Firebase Admin with provided credentials; retrying without credentials.', error);
    cachedApp = initializeApp();
  }

  return cachedApp;
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());
