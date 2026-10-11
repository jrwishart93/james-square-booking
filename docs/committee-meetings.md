# Committee meetings & community hub

The existing `/committee-meeting` page uses the site's Next.js, Firebase Admin,
Firebase Authentication and Resend infrastructure. Management lives within the
existing `/committee` area. Public visitors need no login to enter the meeting code.

## Starting configuration

- Monday 12 October 2026, 18:15 Europe/London; seven-item October agenda.
- Tuesday 17 November 2026, 18:15 Europe/London; agenda unconfirmed.
- December 2026: date, time, agenda and online link unconfirmed.
- August and September agendas retained verbatim, with historic Teams links removed.
- The supplied shared code and October/November links live only in the server-only
  module. The initial defaults are used when no configuration document exists.
  Save settings from the Committee Area to persist them, then rotate the shared code
  whenever appropriate. A configured database outage fails closed for code validation;
  it never falls back to a previous code. Public page fallback is clearly labelled.

## Deployment requirements

1. Retain the site's existing Firebase client variables. The server uses the existing
   `src/lib/firebaseAdmin.ts` integration: `FIREBASE_PROJECT_ID` and either
   `FIREBASE_ADMIN_CREDENTIALS` (service-account JSON supplied through secure hosting
   settings) or application-default credentials. Do not use proxy placeholder values
   for locally parsed service-account JSON. Never paste credentials into chat or source.
2. Retain `RESEND_API_KEY` and the verified `james-square.com` sender domain. Notifications
   go to `committee@james-square.com`; acknowledgements use the same service. No new
   email provider is introduced. These features must be exercised with real secure
   hosting configuration before claiming inbox delivery is verified.
3. Deploy `firestore.rules` before enabling management. `committeeMeetingConfig` and
   `committeeRequests` deny all browser SDK access, including authenticated admins.
   Server endpoints use Firebase Admin and `requireCommittee`. Review existing
   `users.isCommittee` flags and keep only legitimate committee assignments: the
   previous rules did not protect that flag. It is now protected on creation and
   updates. Admin and committee custom claims remain supported.
4. Configure a Firestore TTL policy on `committeeRequests.deleteAfter` and on
   `rateLimits.expiresAt`. Request deletion is due 180 days after submission. TTL
   deletion is asynchronous; expired requests are immediately hidden and cannot be
   approved. The workspace also supports deleting individual requests and purging
   100 expired requests per click. Without TTL, regularly use that purge control;
   expired records are not physically removed merely by hiding them. Notification
   copies in the committee mailbox follow the separate communications retention policy.
5. Allow the existing Firebase/Google APIs and `api.resend.com` in hosting/network
   settings for live operations. Cloud build dependencies also need
   `fonts.googleapis.com`, `fonts.gstatic.com`, and (for local rules QA)
   `storage.googleapis.com`. The onboarding draft includes these three build/QA additions.
6. Deploy the application and updated service worker together. Committee API GETs
   use NetworkOnly in the PWA; all meeting API responses specify no-store. Invalidate
   any cached September calendar asset when deploying its corrected content. Previously
   published links cannot be recalled from copies people have already downloaded;
   Teams organisers retain lobby controls and can retire historical meetings.

## Data and management

`committeeMeetingConfig/hub` stores private meeting configuration, the shared code
and its bcrypt hash. The plaintext code is retained in this server-only document
because the explicit approval email must contain it; direct client reads are denied.
Only authenticated committee/admin endpoints can change it. Public data is an explicit
projection that excludes codes, hashes, private URLs and configuration metadata.
Code validation uses bcrypt, ignores hyphens and returns only the selected future
meeting's link. Code and revealed links remain in React memory only; refreshing locks
the section again. No cookies, localStorage or permanent browser storage are used.

The management panel edits meeting month/date/time/location/private Teams URL,
agendas (add/edit/reorder/remove), public approved minutes, access code and the
Community WhatsApp invite. Existing meetings cannot be dropped from configuration;
past meetings automatically move into the public archive the day after their date,
using Europe/London. Month-only entries move after that month ends. The public page
refreshes this classification every minute. Agendas are never labelled as minutes.
Only add minutes explicitly approved for public release, without residents' personal
information. Configuration writes use revisions to reject concurrent overwrites.

`committeeRequests` stores RSVPs and membership enquiries with distinct `kind`
values, pending/approved/declined status, delivery state and expiry. The workspace
shows the latest 100 requests and never grants roles or group membership. Marking an
RSVP approved does not send mail. A separate **Send approval email with access code**
button performs that operation. Membership requests cannot use that action.
Failed notification delivery is recorded for manual retry; public success copy makes
delayed delivery clear. Approval mail has a transaction claim and Resend idempotency
key to limit duplicate sends.

Requests use a honeypot, capped JSON bodies, same-origin browser checks, field
validation, escaped email content and throttling. Meeting access is limited to eight
attempts per 15 minutes per client; forms to five. Local development uses the site's
in-process limiter, and configured deployments additionally use transactional shared
Firestore counters. The trusted hosting proxy must set/overwrite forwarded client-IP
headers. Counter keys are hashed; raw addresses and entered access codes are not logged.

Calendars are generated in the browser only after successful access verification.
Confirmed times are converted from UK time to UTC (October 17:15Z, November 18:15Z).
No start time or duration is invented. A date-only reminder is offered if a date is
confirmed without a time; unconfirmed dates have no export. QR generation is local
with `qrcode`; the image, join button and copy action use exactly the configured
Community invite URL. No QR service receives the URL.

## Validation

From `/workspace/james-square-booking`, using Node 20:

```sh
npm ci
npm test
npx --no-install tsc --noEmit --incremental false
npm run lint
npm run build
```

Firestore rules (Java 21 is present in the cloud environment):

```sh
export XDG_CONFIG_HOME=/workspace/.cloud-tools/config
export FIREBASE_EMULATORS_PATH=/workspace/.cloud-tools/firebase-emulators
mkdir -p "$XDG_CONFIG_HOME" "$FIREBASE_EMULATORS_PATH"
CI=true npm run test:rules
```

Local development without Firebase credentials can render the default public hub and
validate the initial meeting code. Submission endpoints return a useful unavailable
message; they never fake successful storage or email delivery. Production private
access and form operations require configured Firebase. Unit tests isolate storage,
authentication and email so no real residents receive test mail.
