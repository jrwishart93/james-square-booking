# Owners QA Checklist

## Emulator setup

1. Start the emulators from the project root:

   ```bash
   firebase emulators:start --only auth,firestore
   ```

   (or run the existing npm script if you have one configured).

2. Seed a test owner by creating a user in the Auth emulator UI (or via `firebase auth:import`). Make a note of the UID.

   With the emulators running, you can open the Admin SDK shell to set the custom claim:

   ```bash
   firebase emulators:exec "npx ts-node scripts/set-owner-claim.ts"
   ```

   The script should call `adminAuth.setCustomUserClaims(fakeUid, { owner: true })` so the user matches production behaviour.

## Rules Playground setup

When testing Firestore rules, include the custom claim in the simulated request JSON:

```json
{
  "request": {
    "auth": {
      "uid": "fake-owner-uid",
      "token": {
        "owner": true,
        "admin": false
      }
    }
  }
}
```

Flip `owner` to `false` to confirm non-owner behaviour. Set `admin: true` for admin-only paths.

## Manual QA checks

1. **Read guard** – Non-owner user is blocked from `/owners_discussions` and `/owner_votes` (UI or REST). Expect `permission-denied`.
2. **Discussions** – Owner can create a thread, see it listed, open `/owners/discussions/<id>`, and post a message. Confirm writes reach Firestore and respect the rule shape `{ title, createdBy, createdAt }` / `{ text, authorUid, createdAt }`.
3. **Voting** – Owner can cast or update a ballot when `status: "open"` (writes `{ optionId, castAt }`). When status is `"closed"`, the call is rejected and the UI shows the read-only state.

## Admin controls

Admin users can grant or revoke owner access from the Admin dashboard Owners panel. Use this to switch test accounts between owner/non-owner states during QA.
