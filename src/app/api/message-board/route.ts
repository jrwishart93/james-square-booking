// /src/app/api/message-board/route.ts

import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
// Prefer credentials from FIREBASE_SERVICE_ACCOUNT_KEY env var so we don't need
// to commit the serviceAccountKey.json file. Fallback to the local JSON file
// located three directories up from this route for local development.
import fileCredentials from '../../../serviceAccountKey.json';

// Determine credentials from env or the local JSON file.
const credentials: admin.ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? (JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as admin.ServiceAccount)
  : (fileCredentials as admin.ServiceAccount);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    const limitParam = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);

    const snapshot = await db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limitParam)
      .get();

    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('🔥 [message-board GET] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }}
