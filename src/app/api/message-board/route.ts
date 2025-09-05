// /src/app/api/message-board/route.ts
import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Ensure this route runs on Node (firebase-admin is not Edge-compatible)
export const runtime = 'nodejs';
// Avoid static optimization so env is read at request time, not at build time
export const dynamic = 'force-dynamic';

let db: FirebaseFirestore.Firestore | null = null;

/** Lazily initialize firebase-admin using the service account from env. */
function getDb(): FirebaseFirestore.Firestore {
  if (db) return db;

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawServiceAccount) {
    // Don't throw at import time; fail the request instead
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
  }

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(rawServiceAccount) as Record<string, string>;
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON');
  }

  // Replace escaped newlines in the private key if present
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }

  const serviceAccount = parsed as admin.ServiceAccount;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  return db!;
}

export async function GET(req: NextRequest) {
  try {
    const database = getDb();
    const limitParam = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);

    const snapshot = await database
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(Number.isFinite(limitParam) ? limitParam : 10)
      .get();

    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ posts });
  } catch (err: unknown) {
    const message =
      process.env.NODE_ENV !== 'production' && err instanceof Error
        ? err.message
        : 'Internal Server Error';

    console.error('🔥 [message-board GET] error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}