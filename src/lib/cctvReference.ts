import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { CctvRequest } from '@/lib/cctvRequest';

const MAX_DAILY_REQUESTS = 9_999;

/**
 * Reserves the next human-readable reference and records the normalized request.
 * The transaction makes the sequence safe when multiple requests arrive together.
 */
export async function createCctvRequestRecord(
  request: CctvRequest,
  now = new Date(),
): Promise<string> {
  const dateKey = now.toISOString().slice(0, 10).replaceAll('-', '');
  const counterRef = adminDb.collection('cctvRequestCounters').doc(dateKey);

  return adminDb.runTransaction(async transaction => {
    const counter = await transaction.get(counterRef);
    const previous = counter.exists ? counter.data()?.count : 0;
    if (!Number.isSafeInteger(previous) || previous < 0 || previous >= MAX_DAILY_REQUESTS) {
      throw new Error('CCTV request reference sequence unavailable');
    }

    const sequence = previous + 1;
    const reference = `JS-${dateKey}-${String(sequence).padStart(4, '0')}`;
    const requestRef = adminDb.collection('cctvRequests').doc(reference);

    transaction.set(counterRef, {
      count: sequence,
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.create(requestRef, {
      reference,
      status: 'pending-delivery',
      createdAt: FieldValue.serverTimestamp(),
      request,
    });

    return reference;
  });
}

export async function setCctvRequestDeliveryStatus(
  reference: string,
  status: 'delivered' | 'delivery-failed',
) {
  await adminDb.collection('cctvRequests').doc(reference).update({
    status,
    deliveryUpdatedAt: FieldValue.serverTimestamp(),
  });
}
