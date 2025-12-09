import * as admin from 'firebase-admin';

type DateLike = Date | number | string | undefined;

export function monthKey(date: DateLike = new Date()): string {
  const instance = date instanceof Date ? date : new Date(date ?? Date.now());
  const year = instance.getUTCFullYear();
  const month = String(instance.getUTCMonth() + 1).padStart(2, '0');
  return `${year}${month}`;
}

export async function incrementUsage(functionName: string, at: DateLike = new Date()): Promise<void> {
  const db = admin.firestore();
  const key = monthKey(at);
  const ref = db
    .collection('metrics')
    .doc('functionUsage')
    .collection(key)
    .doc(functionName);

  await ref.set(
    {
      count: admin.firestore.FieldValue.increment(1),
      lastInvokedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
