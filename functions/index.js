const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { Resend } = require("resend");
const { DateTime } = require("luxon");

admin.initializeApp();
const db = admin.firestore();
const resend = new Resend(
  process.env.RESEND_API_KEY || require("firebase-functions").config().resend.api_key
);

exports.sendBookingReminders = onSchedule(
  {
    schedule: "0 7 * * *",
    timeZone: "Europe/London",
    region: "europe-west1",  // Keep this consistent
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async () => {
    const tomorrow = DateTime.now().setZone("Europe/London").plus({ days: 1 }).toISODate();
    const snapshot = await db.collection("bookings").where("date", "==", tomorrow).get();

    if (snapshot.empty) {
      logger.info("No bookings for tomorrow.");
      return;
    }

    const grouped = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!grouped[data.user]) grouped[data.user] = [];
      grouped[data.user].push({ facility: data.facility, time: data.time });
    });

    for (const [email, entries] of Object.entries(grouped)) {
      const body = entries.map(entry => `• ${entry.facility} at ${entry.time}`).join("\n");

      try {
        await resend.emails.send({
          from: "James Square <noreply@james-square.com>",
          to: email,
          subject: "📅 Reminder: Your Bookings for Tomorrow",
          text: `Hi there,\n\nHere are your bookings for tomorrow (${tomorrow}):\n\n${body}\n\nSee you soon!\n\n– James Square Booking Team`,
        });
        logger.info(`Sent reminder to ${email}`);
      } catch (err) {
        logger.error(`Failed to send to ${email}:`, err.message);
      }
    }
  }
);