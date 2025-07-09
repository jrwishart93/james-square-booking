// /src/app/api/message-board/route.ts

import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import serviceAccount from '../../../../serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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
    return NextResponse.json(
      { error: 'Internal Server Error – check server logs.' },
      { status: 500 }
    );
  }
}