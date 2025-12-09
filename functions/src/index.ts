/**
 * Deployment:
 *   npm --prefix functions run build
 *   firebase deploy --only functions
 */

import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { config, logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { DateTime } from 'luxon';
import { Resend } from 'resend';

import { setOwnerClaim } from './claims';
import { incrementUsage, monthKey } from './metrics';

if (!getApps().length) {
  initializeApp();
}

const resendApiKey = process.env.RESEND_API_KEY ?? config().resend?.api_key;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

export const sendBookingReminders = onSchedule(
  {
    schedule: '0 7 * * *',
    timeZone: 'Europe/London',
    region: 'europe-west1',
    timeoutSeconds: 60,
  memory: '256MiB',
  },
  async () => {
    await incrementUsage('sendBookingReminders');

    const db = getFirestore();
    const tomorrow = DateTime.now().setZone('Europe/London').plus({ days: 1 }).toISODate();

    if (!tomorrow) {
      logger.warn('Failed to resolve tomorrow\'s date.');
      return;
    }

    const snapshot = await db.collection('bookings').where('date', '==', tomorrow).get();

    if (snapshot.empty) {
      logger.info('No bookings for tomorrow.');
      return;
    }

    const grouped: Record<string, Array<{ facility: string; time: string }>> = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as { facility?: string; time?: string; user?: string };
      if (!data.user) return;
      if (!grouped[data.user]) {
        grouped[data.user] = [];
      }
      grouped[data.user].push({
        facility: data.facility ?? 'Unknown facility',
        time: data.time ?? 'Unknown time',
      });
    });

    if (!resendClient) {
      logger.warn('Resend API key is not configured; skipping reminder emails.');
      return;
    }

    for (const [email, entries] of Object.entries(grouped)) {
      const body = entries.map((entry) => `• ${entry.facility} at ${entry.time}`).join('\n');

      try {
        await resendClient.emails.send({
          from: 'James Square <noreply@james-square.com>',
          to: email,
          subject: '📅 Reminder: Your Bookings for Tomorrow',
          text: `Hi there,\n\nHere are your bookings for tomorrow (${tomorrow}):\n\n${body}\n\nSee you soon!\n\n– James Square Booking Team`,
        });
        logger.info(`Sent reminder to ${email}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to send to ${email}:`, message);
      }
    }
  },
);

export { setOwnerClaim };

export const summarizeMonthlyUsage = onSchedule(
  {
    schedule: '0 3 1 * *',
    timeZone: 'UTC',
    region: 'europe-west1',
    timeoutSeconds: 120,
    memory: '256MiB',
  },
  async () => {
    const db = getFirestore();
    const now = new Date();
    const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const key = monthKey(previousMonth);

    const snapshot = await db
      .collection('metrics')
      .doc('functionUsage')
      .collection(key)
      .get();

    let totalInvocations = 0;
    const functions: Record<string, number> = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const count = Number(data?.count ?? 0);
      functions[docSnap.id] = count;
      totalInvocations += count;
    });

    await db
      .collection('metrics')
      .doc('functionUsageSummary')
      .collection('months')
      .doc(key)
      .set(
        {
          totalInvocations,
          functions,
          summarizedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
  },
);
