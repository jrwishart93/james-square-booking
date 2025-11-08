import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";

type FirebaseCredentials = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const getFirebaseCredentials = (): FirebaseCredentials => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is missing required fields (project_id, client_email, private_key)",
      );
    }

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key.replace(/\\n/g, "\n"),
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    );
  }

  return { projectId, clientEmail, privateKey };
};

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

const getAdminApp = (): App => {
  if (cachedApp) return cachedApp;
  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  const credentials = getFirebaseCredentials();
  cachedApp = initializeApp({
    credential: cert({
      projectId: credentials.projectId,
      clientEmail: credentials.clientEmail,
      privateKey: credentials.privateKey,
    }),
  });

  return cachedApp;
};

const getDb = (): Firestore => {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(getAdminApp());
  return cachedDb;
};

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const limitParam = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

    const snapshot = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(limitParam)
      .get();

    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("🔥 [message-board GET] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
