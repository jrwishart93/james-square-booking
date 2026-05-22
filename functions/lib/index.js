"use strict";
/**
 * Deployment:
 *   npm --prefix functions run build
 *   firebase deploy --only functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVotingTotals = exports.summarizeMonthlyUsage = exports.syncAdminClaims = exports.setOwnerClaim = exports.sendBookingReminders = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
const firestore_2 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const luxon_1 = require("luxon");
const resend_1 = require("resend");
const claims_1 = require("./claims");
Object.defineProperty(exports, "setOwnerClaim", { enumerable: true, get: function () { return claims_1.setOwnerClaim; } });
const metrics_1 = require("./metrics");
const syncAdminClaims_1 = require("./syncAdminClaims");
Object.defineProperty(exports, "syncAdminClaims", { enumerable: true, get: function () { return syncAdminClaims_1.syncAdminClaims; } });
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not set');
}
const resendClient = new resend_1.Resend(resendApiKey);
exports.sendBookingReminders = (0, scheduler_1.onSchedule)({
    schedule: '0 7 * * *',
    timeZone: 'Europe/London',
    region: 'europe-west1',
    timeoutSeconds: 60,
    memory: '256MiB',
}, async () => {
    await (0, metrics_1.incrementUsage)('sendBookingReminders');
    const db = (0, firestore_1.getFirestore)();
    const tomorrow = luxon_1.DateTime.now().setZone('Europe/London').plus({ days: 1 }).toISODate();
    if (!tomorrow) {
        firebase_functions_1.logger.warn('Failed to resolve tomorrow\'s date.');
        return;
    }
    const snapshot = await db.collection('bookings').where('date', '==', tomorrow).get();
    if (snapshot.empty) {
        firebase_functions_1.logger.info('No bookings for tomorrow.');
        return;
    }
    const grouped = {};
    snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.user)
            return;
        if (!grouped[data.user]) {
            grouped[data.user] = [];
        }
        grouped[data.user].push({
            facility: data.facility ?? 'Unknown facility',
            time: data.time ?? 'Unknown time',
        });
    });
    for (const [email, entries] of Object.entries(grouped)) {
        const body = entries.map((entry) => `• ${entry.facility} at ${entry.time}`).join('\n');
        try {
            await resendClient.emails.send({
                from: 'James Square <noreply@james-square.com>',
                to: email,
                subject: '📅 Reminder: Your Bookings for Tomorrow',
                text: `Hi there,\n\nHere are your bookings for tomorrow (${tomorrow}):\n\n${body}\n\nSee you soon!\n\n– James Square Booking Team`,
            });
            firebase_functions_1.logger.info(`Sent reminder to ${email}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            firebase_functions_1.logger.error(`Failed to send to ${email}:`, message);
        }
    }
});
exports.summarizeMonthlyUsage = (0, scheduler_1.onSchedule)({
    schedule: '0 3 1 * *',
    timeZone: 'UTC',
    region: 'europe-west1',
    timeoutSeconds: 120,
    memory: '256MiB',
}, async () => {
    const db = (0, firestore_1.getFirestore)();
    const now = new Date();
    const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const key = (0, metrics_1.monthKey)(previousMonth);
    const snapshot = await db
        .collection('metrics')
        .doc('functionUsage')
        .collection(key)
        .get();
    let totalInvocations = 0;
    const functions = {};
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
        .set({
        totalInvocations,
        functions,
        summarizedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
});
exports.updateVotingTotals = (0, firestore_2.onDocumentCreated)('voting_votes/{voteId}', async (event) => {
    const vote = event.data?.data();
    if (!vote?.questionId || !vote?.optionId) {
        firebase_functions_1.logger.warn('Skipping vote totals update due to missing fields', vote);
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    const questionRef = db.collection('voting_questions').doc(vote.questionId);
    await db.runTransaction(async (tx) => {
        const questionSnap = await tx.get(questionRef);
        if (!questionSnap.exists) {
            firebase_functions_1.logger.warn(`Question ${vote.questionId} missing when attempting to increment totals`);
            return;
        }
        tx.update(questionRef, {
            [`voteTotals.${vote.optionId}`]: firestore_1.FieldValue.increment(1),
            lastVoteAt: firestore_1.FieldValue.serverTimestamp(),
        });
    });
});
