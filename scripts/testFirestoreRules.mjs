/**
 * Security-rules tests for the James Square Firestore rules.
 *
 * Run against the emulator:
 *
 *   npx firebase emulators:exec --only firestore \
 *     --project jamessquarebookings "node scripts/testFirestoreRules.mjs"
 *
 * Each case below corresponds to a finding in docs/gdpr-audit-2026.md, so a
 * regression in the rules shows up as a named failure rather than as a quiet
 * loosening of access.
 */

import assert from 'node:assert/strict';

import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

const PROJECT_ID = process.env.GCLOUD_PROJECT ?? 'jamessquarebookings';

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: error?.message ?? String(error) });
  }
}

const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: { host: '127.0.0.1', port: 8080 },
});

// Seed data with rules disabled, so the fixtures themselves are not a test.
await testEnv.withSecurityRulesDisabled(async (context) => {
  const db = context.firestore();
  await setDoc(doc(db, 'users/resident-a'), {
    email: 'a@example.com',
    fullName: 'Resident A',
    username: 'residenta',
    property: '39/1',
    residentType: 'renter',
    isAdmin: false,
  });
  await setDoc(doc(db, 'users/resident-b'), {
    email: 'b@example.com',
    fullName: 'Resident B',
    username: 'residentb',
    property: '45/2',
    isAdmin: false,
  });
  // Separate subject for the "admin can grant admin" case, so promoting it does
  // not turn another test's actor into an administrator part-way through the run.
  await setDoc(doc(db, 'users/resident-c'), {
    email: 'c@example.com',
    fullName: 'Resident C',
    isAdmin: false,
  });
  await setDoc(doc(db, 'users/admin-1'), {
    email: 'admin@example.com',
    fullName: 'Admin',
    isAdmin: true,
  });
  await setDoc(doc(db, 'bookings/b1'), {
    facility: 'pool',
    date: '2026-08-01',
    time: '10:00',
    user: 'a@example.com',
  });
  await setDoc(doc(db, 'messageBoard/p1'), {
    title: 'Hello',
    body: 'Post body',
    authorId: 'resident-a',
  });
  await setDoc(doc(db, 'voting_votes/v1'), {
    questionId: 'q1',
    optionId: 'o1',
    userName: 'Resident A',
    flat: '39/1',
    userId: 'resident-a',
    createdAt: new Date(),
  });
  await setDoc(doc(db, 'activityLogs/l1'), { action: 'test', admin: 'admin@example.com' });
  await setDoc(doc(db, 'committeeSentEmails/e1'), { subject: 'Test', renderedHtml: '<p>x</p>' });
});

const anon = testEnv.unauthenticatedContext().firestore();
const residentA = testEnv
  .authenticatedContext('resident-a', { email: 'a@example.com' })
  .firestore();
const residentB = testEnv
  .authenticatedContext('resident-b', { email: 'b@example.com' })
  .firestore();
const admin = testEnv
  .authenticatedContext('admin-1', { email: 'admin@example.com', admin: true })
  .firestore();

// ── P-01: resident profiles were world-readable ──────────────────────────────
await check('anonymous cannot read a resident profile', () =>
  assertFails(getDoc(doc(anon, 'users/resident-a'))),
);

await check('anonymous cannot list the users collection', () =>
  assertFails(getDocs(collection(anon, 'users'))),
);

await check('a resident cannot read another resident profile', () =>
  assertFails(getDoc(doc(residentB, 'users/resident-a'))),
);

await check('a resident can read their own profile', () =>
  assertSucceeds(getDoc(doc(residentA, 'users/resident-a'))),
);

await check('an admin can list resident profiles', () =>
  assertSucceeds(getDocs(collection(admin, 'users'))),
);

await check('a resident cannot query users by email', () =>
  assertFails(
    getDocs(query(collection(residentB, 'users'), where('email', '==', 'a@example.com'))),
  ),
);

// ── S-01: privilege escalation via self-update ───────────────────────────────
await check('a resident cannot make themselves an admin', () =>
  assertFails(updateDoc(doc(residentA, 'users/resident-a'), { isAdmin: true })),
);

await check('a resident cannot grant themselves the owner role', () =>
  assertFails(updateDoc(doc(residentA, 'users/resident-a'), { roles: { owner: true } })),
);

await check('a resident cannot clear their own disabled flag', () =>
  assertFails(updateDoc(doc(residentA, 'users/resident-a'), { disabled: false })),
);

await check('a resident cannot forge an admin resident-type confirmation', () =>
  assertFails(
    updateDoc(doc(residentA, 'users/resident-a'), { residentTypeConfirmedBy: 'admin@example.com' }),
  ),
);

await check('a resident can still edit their own username and property', () =>
  assertSucceeds(
    updateDoc(doc(residentA, 'users/resident-a'), { username: 'newname', property: '39/2' }),
  ),
);

await check('a resident can still self-declare their resident type', () =>
  assertSucceeds(
    updateDoc(doc(residentA, 'users/resident-a'), {
      residentType: 'owner',
      residentTypeLabel: 'Owner',
      requiresResidentTypeConfirmation: true,
    }),
  ),
);

await check('a resident cannot edit another resident profile', () =>
  assertFails(updateDoc(doc(residentB, 'users/resident-a'), { fullName: 'Hacked' })),
);

await check('an admin can set the admin flag', () =>
  assertSucceeds(updateDoc(doc(admin, 'users/resident-c'), { isAdmin: true })),
);

// ── P-03: bookings exposed resident email addresses ──────────────────────────
await check('anonymous cannot read bookings', () =>
  assertFails(getDoc(doc(anon, 'bookings/b1'))),
);

await check('a resident cannot read another resident booking', () =>
  assertFails(getDoc(doc(residentB, 'bookings/b1'))),
);

await check('a resident can read their own booking', () =>
  assertSucceeds(getDoc(doc(residentA, 'bookings/b1'))),
);

await check('a resident can query their own bookings', () =>
  assertSucceeds(
    getDocs(query(collection(residentA, 'bookings'), where('user', '==', 'a@example.com'))),
  ),
);

await check('a resident cannot query all bookings for a date', () =>
  assertFails(
    getDocs(query(collection(residentA, 'bookings'), where('date', '==', '2026-08-01'))),
  ),
);

await check('a resident cannot create a booking in someone else name', () =>
  assertFails(
    setDoc(doc(residentB, 'bookings/b2'), {
      facility: 'pool',
      date: '2026-08-02',
      time: '11:00',
      user: 'a@example.com',
    }),
  ),
);

// ── P-04: message board was world-readable ───────────────────────────────────
await check('anonymous cannot read the message board', () =>
  assertFails(getDoc(doc(anon, 'messageBoard/p1'))),
);

await check('a signed-in resident can read the message board', () =>
  assertSucceeds(getDoc(doc(residentA, 'messageBoard/p1'))),
);

await check('a resident cannot post as another author', () =>
  assertFails(
    setDoc(doc(residentB, 'messageBoard/p2'), {
      title: 'Spoof',
      body: 'x',
      authorId: 'resident-a',
    }),
  ),
);

// ── P-05: ballots were world-readable ────────────────────────────────────────
await check('anonymous cannot read individual votes', () =>
  assertFails(getDoc(doc(anon, 'voting_votes/v1'))),
);

// ── S-11: anonymous question creation ────────────────────────────────────────
await check('anonymous cannot create a voting question', () =>
  assertFails(
    setDoc(doc(anon, 'voting_questions/q2'), {
      title: 'Spam',
      status: 'open',
      createdAt: new Date(),
      options: [],
    }),
  ),
);

// ── Admin-only and server-only collections ───────────────────────────────────
await check('a resident cannot read the admin activity log', () =>
  assertFails(getDoc(doc(residentA, 'activityLogs/l1'))),
);

await check('an admin cannot rewrite the activity log', () =>
  assertFails(updateDoc(doc(admin, 'activityLogs/l1'), { action: 'tampered' })),
);

await check('nobody can read the committee email archive from a client', () =>
  assertFails(getDoc(doc(admin, 'committeeSentEmails/e1'))),
);

await check('an undeclared collection is denied by default', () =>
  assertFails(getDoc(doc(residentA, 'someFutureCollection/x'))),
);

await testEnv.cleanup();

const failures = results.filter((result) => !result.ok);

for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}`);
  if (!result.ok) console.log(`      ${result.error}`);
}

console.log(`\n${results.length - failures.length}/${results.length} passed`);

assert.equal(failures.length, 0, `${failures.length} rule test(s) failed`);
