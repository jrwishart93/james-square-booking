/**
 * One-time helper to reset the public voting collections.
 * Deletes all docs in `voting_questions` and `voting_votes`, then seeds a single question.
 *
 * Usage:
 *   FIREBASE_ADMIN_JSON='{"project_id":...,"private_key":"-----BEGIN..."}' npm run reset:voting
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_ADMIN_JSON;
  if (!raw) {
    throw new Error("FIREBASE_ADMIN_JSON is not set");
  }
  const parsed = JSON.parse(raw);
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return initializeApp({ credential: cert(parsed) });
}

async function resetVoting() {
  const db = getFirestore(getAdminApp());

  // Wipe votes
  const votesSnap = await db.collection("voting_votes").get();
  const batch1 = db.batch();
  votesSnap.forEach((doc) => batch1.delete(doc.ref));
  await batch1.commit();

  // Wipe questions
  const qSnap = await db.collection("voting_questions").get();
  const batch2 = db.batch();
  qSnap.forEach((doc) => batch2.delete(doc.ref));
  await batch2.commit();

  // Seed single question
  const options = [
    { id: "o1", label: "Upgraded shower heads in the pool area" },
    { id: "o2", label: "Fresh paint job in the pool area" },
    { id: "o3", label: "New flooring in the gym" },
  ];

  await db.collection("voting_questions").add({
    title: "What improvement should be made to the pool and gym facilities?",
    description: "",
    status: "open",
    createdAt: new Date(),
    options,
    voteTotals: options.reduce((totals, option) => {
      totals[option.id] = 0;
      return totals;
    }, {}),
  });

  console.log("✅ Voting collections reset and seeded with the single question.");
}

resetVoting().then(() => process.exit(0)).catch((err) => {
  console.error("❌ Failed to reset voting collections:", err);
  process.exit(1);
});
