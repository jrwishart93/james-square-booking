/**
 * One-time helper to seed the 2026 factor vote for owners.
 *
 * Usage:
 *   FIREBASE_ADMIN_JSON='{"project_id":...,"private_key":"-----BEGIN..."}' npm run seed:factor-vote
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

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

async function seedFactorVote() {
  const db = getFirestore(getAdminApp());
  const questionRef = db.collection("voting_questions").doc("factor_vote_2026");

  const options = [
    { id: "myreside", label: "Myreside Property Management" },
    { id: "newton", label: "Newton Property Management" },
  ];

  const payload = {
    title: "Appointment of a New Property Factor for James Square",
    description:
      "Following presentations from the shortlisted factor companies, owners are invited to vote on the appointment of a new property factor to replace Fior Asset & Property. Please review the supporting documents before submitting your vote.",
    options,
    status: "scheduled",
    startsAt: Timestamp.fromDate(new Date("2026-01-21T20:00:00Z")),
    expiresAt: Timestamp.fromDate(new Date("2026-01-23T17:00:00Z")),
    createdAt: Timestamp.fromDate(new Date()),
    showLiveResults: true,
    specialType: "factor_vote_2026",
    documents: {
      myreside: [
        {
          label: "View proposal (PDF)",
          href: "/documents/factor-vote-2026/myreside-proposal.pdf",
        },
        {
          label: "View cost summary (PDF)",
          href: "/documents/factor-vote-2026/myreside-costs.pdf",
        },
      ],
      newton: [
        {
          label: "View proposal (PDF)",
          href: "/documents/factor-vote-2026/newton-proposal.pdf",
        },
        {
          label: "View cost summary (PDF)",
          href: "/documents/factor-vote-2026/newton-costs.pdf",
        },
      ],
    },
    voteTotals: options.reduce((totals, option) => {
      totals[option.id] = 0;
      return totals;
    }, {}),
  };

  await questionRef.set(payload, { merge: true });

  console.log("✅ Factor vote seeded at voting_questions/factor_vote_2026.");
}

seedFactorVote()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed the factor vote:", err);
    process.exit(1);
  });
