// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

let app: admin.app.App | null = null;

export function getAdminApp() {
  if (app) return app;
  if (admin.apps.length) {
    app = admin.app();
    return app;
  }
  // Use GOOGLE_APPLICATION_CREDENTIALS (recommended) or env vars
  app = admin.initializeApp();
  return app;
}

export function getAdminDb() {
  return getAdminApp().firestore();
}
