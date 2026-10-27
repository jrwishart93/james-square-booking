import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { GymVolunteer } from '@/lib/gymVolunteer';

/**
 * Stores a volunteer offer. Server-only: Firestore rules deny all client access
 * to `gymVolunteers`, so only the committee (via the Admin SDK or the Firebase
 * console) can read it.
 */
export async function saveGymVolunteer(volunteer: Omit<GymVolunteer, 'website'>): Promise<string> {
  const ref = await adminDb.collection('gymVolunteers').add({
    ...volunteer,
    status: 'pending-delivery',
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function setGymVolunteerDeliveryStatus(id: string, status: 'delivered' | 'delivery-failed') {
  await adminDb.collection('gymVolunteers').doc(id).update({
    status,
    deliveryUpdatedAt: FieldValue.serverTimestamp(),
  });
}
