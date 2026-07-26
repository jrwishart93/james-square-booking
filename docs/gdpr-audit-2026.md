# James Square — UK GDPR, PECR, Privacy & Security Audit

**Date:** 26 July 2026
**Scope:** the whole of james-square.com — Next.js application, Firebase Authentication, Cloud Firestore security rules, Cloud Functions, API routes, Server Actions, forms, email systems, admin tooling, client bundles and legal documents.
**Verification:** 29 automated Firestore security-rules tests, 22 automated consent and accessibility checks, client-bundle secret scanning, XSS payload tests against the sanitiser, and manual review of every API route and form.

---

## 1. Executive summary

The site was **not** compliant, and the problems were not cosmetic. Four issues were exploitable by any anonymous visitor with a browser console, and one allowed complete privilege escalation to administrator.

Specifically, before this work:

- Every resident's **name, email address, flat number and resident type** could be downloaded by anyone, signed in or not.
- Any resident could make themselves a **site administrator** by editing their own profile document.
- Any signed-in resident could send **email from a james-square.com address** to any recipient list they chose.
- **Anyone at all**, with no account, could send email as `committee@james-square.com`.
- The Owners and Committee area **access codes were plain text in the JavaScript** served to every visitor.
- Committee members' **personal email addresses** were compiled into the public client bundle.
- There was **no cookie consent mechanism of any kind**, and no Cookie Policy.

All of the above are fixed. 15 of the 29 rules tests fail against the previous rules and pass against the new ones, so the fixes are demonstrated rather than asserted.

The one piece of good news from the audit: the site runs **no analytics, advertising or tracking scripts whatsoever**. There was no unlawful tracking to unwind, and a browser loading the site now makes **zero third-party requests** before consent (verified).

Two significant items remain and require decisions that are not ours to make — see §6.

---

## 2. Findings

Risk ratings combine likelihood and impact in the context of a residential community website holding ~150 households' contact details.

### Critical

| ID | Finding | Detail | Status |
|----|---------|--------|--------|
| **S-01** | **Privilege escalation to administrator** | `firestore.rules` contained `allow update ... if request.auth.uid == userId` with no field restrictions, while `isAdmin()` fell back to reading `isAdmin` from that same document. Any resident could run one line in the browser console to set `isAdmin: true` on their own profile and gain full administrative access — reading all resident data, deleting bookings, sending mail as the site. | **Fixed** |
| **P-01** | **All resident personal data world-readable** | `match /users/{userId} { allow read: if true; }` — with a comment acknowledging it (*"adjust if you want privacy"*). Full name, email address, username, flat number, resident type, admin status and login timestamps for every resident, retrievable by any anonymous visitor. A UK GDPR Article 32 failure and a reportable personal-data breach risk. | **Fixed** |
| **S-02** | **Admin email endpoint had no admin check** | `/api/admin/send-email` verified the caller's Firebase ID token but never checked whether they were an administrator. Any signed-in resident could send email from `no-reply@`, `committee@` or `support@james-square.com` to arbitrary recipients — a ready-made phishing capability against their own neighbours, with the Association's domain reputation attached. | **Fixed** |
| **S-03** | **Committee email endpoint had optional authentication** | `/api/committee/send-email` wrapped its token check in `if (token) { ... }`. A request with **no** `Authorization` header skipped verification entirely and proceeded to send. Anyone on the internet could send mail as `committee@james-square.com` to any address list, subject only to a 100-recipient daily cap. | **Fixed** |

### High

| ID | Finding | Detail | Status |
|----|---------|--------|--------|
| **S-04** | **Shared access codes hard-coded in client components** | `const OWNERS_ACCESS_CODE = '3579'` in `src/app/owners/page.tsx` and `const PASSCODE = '9753'` in `CommitteeGate.tsx`. Both were compiled into the JavaScript bundle downloaded by every visitor, so the "private" Owners and Committee areas were effectively public. Gating was also client-side only: setting one `sessionStorage` key bypassed it. | **Partly fixed** — codes moved server-side; see §6.1 |
| **P-02** | **Confidential building documents publicly fetchable** | `public/docs/survey/` contains the elevations and roof condition reports, the 2026 AGM agenda and minutes, and the Factor's Report — the latter covering development debt, sinking fund balances and named financial transfers. Anything under `public/` is served with no authentication, so all of it is retrievable by direct URL and indexable by search engines. | **Mitigated only** — see §6.2 |
| **P-03** | **Booking records exposed every resident's email address** | `match /bookings/... { allow read: if true; }`, and each booking document stores the booker's email in `user`. The UI masked this ("Booked by another user"), but the raw address was in the payload. Anyone could harvest the full resident address book plus a timestamped record of when individuals use the pool, gym and sauna. | **Fixed** |
| **P-04** | **Message board publicly readable** | `allow read: if true` on `messageBoard` and its comments and replies. Residents' names and the content of internal community discussion were readable by anyone and indexable by search engines. | **Fixed** |
| **P-05** | **Ballot secrecy broken** | `voting_votes` was world-readable and each document contains `userName`, `voterName`, `flat`, `userId` and `optionId`. Anyone could reconstruct exactly how each named household voted on every question. | **Partly fixed** — see §6.3 |
| **S-05** | **Committee members' personal emails in the public bundle** | `src/lib/emailGroups.ts` held six committee members' personal addresses (Gmail, AOL, iCloud, BT, Outlook) and two Myreside business addresses, and was imported by the client component `AdminEmailPanel.tsx` — publishing all eight to every visitor. Unnecessary disclosure of personal data and a spear-phishing target list. | **Fixed** |
| **S-06** | **Anonymous creation of community votes** | `voting_questions` allowed `create` with no authentication at all. Any internet user could inject arbitrary voting questions into the community voting system. | **Fixed** |
| **S-07** | **Exploitable HTML sanitiser** | `sanitizeHtml()` used an unanchored allow-list regex, so `iframe` passed by matching the `i` of the italic tag; stripped event handlers only when quoted, so `<div onerror=alert(1)>` survived; and never validated URL schemes, so `javascript:` hrefs passed through. Output is rendered into committee emails and re-rendered in the committee archive via `dangerouslySetInnerHTML`. | **Fixed** |
| **S-08** | **No security headers** | No CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or framing protection on any response. The site could be framed for clickjacking, and there was no defence-in-depth against script injection. | **Fixed** |

### Medium

| ID | Finding | Detail | Status |
|----|---------|--------|--------|
| **L-01** | **No cookie consent mechanism and no Cookie Policy** | Nothing asked, nothing recorded, nothing to withdraw, and no document listing what was stored. A PECR Regulation 6 failure. Mitigating factor: no non-essential cookies were actually being set, so nothing unlawful was *stored* — but the mechanism, the record and the disclosure were all absent. | **Fixed** |
| **L-02** | **Privacy Policy did not match the site** | Generic, named no data controller, listed no processors (Google, Vercel, Resend), gave no retention periods, gave no contact address for privacy enquiries, cited "legitimate interests" for processing that is plainly contractual, and stated cookies were used without a Cookie Policy. Insufficient under Articles 13–14. | **Fixed** |
| **L-03** | **No Acceptable Use or Data Retention policy** | Both were requested and neither existed. Retention in particular was unstated, so there was no defensible answer to "how long do you keep this?". | **Fixed** |
| **S-09** | **No rate limiting anywhere** | Login, password reset, the 4-digit access codes, and both mail endpoints were unthrottled. A 4-digit code is 10,000 guesses — minutes of scripted effort. | **Fixed** |
| **S-10** | **Unauthenticated Admin-SDK read endpoint** | `/api/message-board` read the `posts` collection with the Admin SDK, which bypasses security rules, with no authentication and an attacker-controlled unbounded `limit` parameter (`?limit=999999`). | **Fixed** |
| **S-11** | **Owner authorisation depends on an inconsistent signal** | `isOwner()` requires the `owner` custom claim or `roles.owner`, but owners actually reach the Owners area via the shared access code, so many owners have neither. Owner-gated collections are therefore inaccessible to genuine owners, while the access code admits anyone who has it. Vote creation could only be tightened to "signed in", not "is an owner", as a result. | **Documented** — see §6.1 |
| **S-12** | **Audit log and feedback collections had no rules** | `activityLogs`, `feedback`, `committeeSentEmails` and `rateLimits` were absent from `firestore.rules`. They defaulted to deny, so the admin panel's writes to `activityLogs` were silently failing — meaning **the administrative audit trail was not being written**. This also indicates the deployed rules may differ from the rules in the repository. | **Fixed** — but verify, §6.4 |
| **S-13** | **Content Security Policy not enforced** | A CSP is now shipped, but in `Report-Only` mode: a wrong CSP breaks pages silently, and this one cannot be verified against every route from a development environment. | **Deliberate** — see §6.5 |

### Low

| ID | Finding | Detail | Status |
|----|---------|--------|--------|
| **S-14** | **Three divergent Firebase Admin initialisers** | `firebaseAdmin.ts`, `firebase-admin.ts` and an inline initialiser in `api/message-board/route.ts`, reading three different environment variables (`FIREBASE_ADMIN_CREDENTIALS`, `FIREBASE_ADMIN_JSON`, `FIREBASE_SERVICE_ACCOUNT_KEY`). Credential handling should have exactly one path. | **Documented** |
| **S-15** | **Dead admin endpoint** | `/api/admin/find-user-by-email` authenticates via a `__session` cookie that nothing in the codebase ever creates, so it always returns 401. It fails closed, but it is misleading dead code. | **Documented** |
| **S-16** | **Firestore rules not wired into deployment config** | `firebase.json` had no `firestore` section, so `firebase deploy` never deployed the rules — they had to be applied by hand, which is how a repository and a live project drift apart. | **Fixed** |
| **S-17** | **`owner_votes` could not be deleted** | The rule required `request.resource.data.keys().hasAll([...])` for `create, update, delete`. `request.resource` does not exist on a delete, so deletion always failed. | **Fixed** |
| **P-06** | **Factor's business emails in a client bundle** | `owners/secure/page.tsx` embeds quoted email correspondence including Myreside staff addresses, compiled into the client bundle for that route. Business rather than personal addresses, and a genuine correspondence record — flagged for awareness rather than as a defect. | **Documented** |
| **A-01** | **No skip link, and consent choice 63 tab stops away** | The site had no skip-to-content link. On first implementation, the consent banner sat last in the DOM, requiring 63 tab presses to reach. | **Fixed** — now 5 |

---

## 3. What was implemented

### 3.1 Consent management platform

A real CMP, not a banner.

- **`src/lib/consent/types.ts`** — five categories (essential, functional, analytics, performance, marketing), a versioned consent record, and strict normalisation of anything read back from storage. Consent expires after **182 days** so an old decision is never treated as permanent.
- **`src/lib/consent/store.ts`** — the decision store. Written to `localStorage` and mirrored to a `SameSite=Lax` first-party cookie so server-rendered pages and future edge logic can read it without JavaScript. Nothing is sent to our servers.
- **`src/lib/consent/registry.ts`** — the future-proofing mechanism. A service declares its category and how to switch itself on and off; the registry guarantees it never activates before consent, activates exactly once, and tears down the moment consent is withdrawn — clearing the service's own cookies and storage on the exact host, the host domain and the registrable domain. A `scriptService()` helper covers the common "inject a vendor `<script>`" case.
- **`src/lib/consent/services.ts`** — the registration point, currently **empty**, with worked examples for Google Analytics 4 (IP anonymisation and ad signals off) and notes on Clarity's session-replay risk. Adding GA4 later is a single registration; the banner, the panel, the policy and the withdrawal path all pick it up with no further changes.
- **`ConsentGate`** — wraps embeds (maps, Vimeo, social, a future AI assistant) so the iframe is **never inserted**, and therefore the third party is never contacted, until consent exists. Shows a glass placeholder offering to enable it.
- **Default-deny** — `DEFAULT_DECISIONS` is essential-only, and it is what both server rendering and pre-hydration client code read, so there is no window in which an optional script could run.

### 3.2 Consent interface

Built from the site's existing Liquid Glass tokens (`--glass-bg-light`, `--glass-border`, `--glass-shadow-lift`, `--glass-highlight`), with the same `cubic-bezier(0.16, 1, 0.3, 1)` easing and `useReducedMotion()` pattern already used across the site.

- **Floating banner** — a `.consent-surface` card with 26px backdrop blur, the specular top edge the site's other cards share, a soft fade-and-rise entrance, and a hand-drawn cookie mark whose crumbs drift on a 6-second cycle. Appears only when there is no valid decision on file.
- **Not a modal.** It is a labelled `role="region"`, does not trap focus and does not block the page. Forcing a choice before the site can be read is the pattern the ICO objects to.
- **No dark patterns.** *Accept All* leads through depth and gradient, not through misleading wording or a hidden reject. *Essential Only* is an equally prominent single click — not buried behind the preferences panel. Withdrawal is one click from any page footer.
- **Preferences panel** — a proper `aria-modal` dialog: focus moved in on open and restored on close, Tab contained, Escape closes, background scroll locked without the scrollbar-width layout shift. Each category states in plain English what it does, three concrete examples, whether it stores personal information, whether it is required, and how long it lasts. Bottom sheet on phones, centred card from `sm` up.
- **Footer** — a permanent *Cookie Settings* control alongside all five legal documents and a privacy enquiries address.

### 3.3 Security hardening

**Firestore rules** — rewritten with a **default-deny catch-all**, so any future collection fails closed unless a rule is written for it. Field-level `diff().affectedKeys()` checks stop privilege escalation while deliberately still permitting the self-service the dashboard relies on (residents self-declare resident type; only an admin can set `isAdmin`, `roles`, `disabled`, `isFlagged` or the admin confirmation fields). Ballots are readable only by the owner who cast them and by admins. The audit log is append-only, so it cannot be quietly rewritten.

**Authorisation** — one shared module, `src/lib/security/requireAuth.ts`, with `requireUser`, `requireAdmin` and `requireCommittee`. Every privileged route funnels through it, so "verified the token" and "checked they are an admin" cannot drift apart again. Tokens are verified with `checkRevoked: true`, so a disabled account loses access immediately.

**Two new server routes** replace what used to require dangerous client permissions:
- `/api/availability` — serves the public schedule while resolving identities server-side. An anonymous caller learns only that a slot is taken; the caller sees their own bookings; admins see all. This keeps the schedule public *and* closes P-03.
- `/api/auth/resolve-identifier` — resolves a username to a sign-in email for login and password reset, so `/users` can stay locked down. Rate-limited, and returns only the email address, never the profile.

**Access codes** moved to a Server Action (`src/app/actions/accessCodes.ts`) with bcrypt comparison against `OWNERS_ACCESS_CODE_HASH` / `COMMITTEE_ACCESS_CODE_HASH`, constant-time fallback, and IP-based throttling at 8 attempts per 10 minutes.

**Also:** rate limiting on every sensitive endpoint; the sanitiser rewritten as a strict allow-list with URL-scheme validation (verified against 12 XSS payloads, all neutralised); re-sanitisation at render time in the committee archive, because archives outlive the code that wrote them; recipient caps on mail sends; `emailGroups.ts` marked `server-only` so the build fails if it is ever imported client-side again; security headers on every response; and `robots.ts` keeping private areas out of search indexes.

### 3.4 Legal documents

Five documents, all linked from the footer, sharing one glass shell, each opening with a plain-English "In short" summary:

**Privacy Policy** (rewritten) — names the controller and a contact address, tabulates every category of data against its purpose *and* lawful basis, names all three processors with transfer safeguards, states who can see what, and sets out rights including the honest limits on erasure where a counted vote is involved.

**Cookie Policy** (new) — generated from the same category definitions the preferences panel renders, so the two can never contradict each other. Tabulates every cookie actually set, with an in-page control to reopen preferences.

**Terms of Use** (updated), **Acceptable Use Policy** (new — including a good-faith security research clause), **Data Retention Policy** (new — a period and a justification for all fourteen data types, and exactly what happens when an account is closed).

### 3.5 Accessibility and performance

WCAG 2.2 AA: semantic landmarks, real `<input type="checkbox">` controls behind the toggle skins (so they are announced and keyboard-operable), 2px focus outlines, `prefers-reduced-motion` honoured throughout, and a skip link added to the whole site.

Performance: **zero** new JavaScript before hydration, **zero** third-party requests before consent, **CLS of 0** (measured), no render-blocking anything. The panel is portalled and only mounts when opened. Legal pages are static, 176 B each.

---

## 4. Verification

```
npm run test:rules      # 29/29 pass (15 of these fail against the previous rules)
npm run build           # clean
```

| Check | Result |
|-------|--------|
| Firestore rules tests | **29/29 pass**; 15 fail on the previous rules |
| Consent & accessibility checks | **22/22 pass** |
| XSS payloads against the sanitiser | 12/12 neutralised |
| Access codes `3579` / `9753` in client bundle | **0 occurrences** |
| Committee personal addresses in client bundle | **0 occurrences** |
| Third-party requests before consent | **0** |
| Cumulative Layout Shift | **0** |
| Tab stops to reach the consent choice | **5** (was 63) |
| Security headers present | verified on live responses |

---

## 5. Behaviour changes to be aware of

These are intentional, and two of them change what anonymous visitors can see. Flagging them explicitly because they are product decisions as much as security ones — say the word and any can be revisited.

1. **The message board now requires a login.** It carries residents' names and was previously readable by anyone and indexable by Google.
2. **Community voting results now require a login.** Individual ballots were world-readable; requiring a login was the change that could be made without rebuilding the tally system (see §6.3).
3. **The facility schedule is still public**, deliberately — it is served through `/api/availability` instead of a direct database read, so guests keep the schedule and residents keep their email addresses.
4. **Login by username** now makes a round trip to a server route rather than querying the database from the browser.

---

## 6. Remaining recommendations

### 6.1 Replace the shared access codes with role-based access — **High**

The codes are no longer in the browser bundle and are throttled, but a shared 4-digit code passed between neighbours is not authentication, and the gate behind it is still client-side `sessionStorage` — anyone can set that key by hand.

The fix is to use what already exists: sign-in with `roles.owner`, granted by the admin panel, plus a server-rendered check. This also resolves **S-11**, where `isOwner()` and the actual route to the Owners area disagree.

**In the meantime:** set `OWNERS_ACCESS_CODE_HASH` and `COMMITTEE_ACCESS_CODE_HASH` and **rotate both codes** — they have been public in the JavaScript bundle for as long as those files have been deployed, so they should be treated as compromised.

```bash
node -e "console.log(require('bcryptjs').hashSync('NEW-CODE', 12))"
```

### 6.2 Move the private documents behind authentication — **High**

The building surveys, AGM minutes and Factor's Report in `public/docs/survey/` are still fetchable by direct URL. `X-Robots-Tag: noindex` and `robots.txt` now discourage indexing, but that is discouragement, not access control, and the Factor's Report contains the development's financial position.

The fix: move them out of `public/` to private storage (Firebase Storage with rules, or outside the web root) and serve them through an authenticated route that checks owner status. Until then, assume they are public — and note that search engines may already have cached them.

### 6.3 Make ballots properly secret — **Medium**

`voting_votes` documents pair a choice with a name and a flat, and the results page tallies them by reading every vote in the browser. Requiring a login narrows exposure from "the internet" to "any signed-in resident", but a resident can still see how their neighbours voted.

The fix: maintain `voteTotals` on the question document from a Cloud Function triggered on ballot write, have the results page read only those totals, and restrict ballot reads to the voter and admins. The `voteTotals` field already exists and is initialised to zeros — the increment side was never built.

### 6.4 Confirm the deployed rules match the repository — **Medium**

The admin panel writes to `activityLogs`, which had no rule and therefore defaulted to deny. Either those writes were failing silently — meaning **the audit trail has gaps** — or the live project is running rules that differ from this repository. Both are worth knowing.

```bash
firebase deploy --only firestore:rules   # firebase.json now wires this up
```

Please confirm the admin panel still works end-to-end after deploying, and check whether `activityLogs` contains recent entries.

### 6.5 Promote the CSP from Report-Only to enforced — **Medium**

Watch the browser console (or add a `report-uri`) across the pool 3D viewer, the voting pages and any page with an embed, then set `CSP_ENFORCED = true` in `next.config.ts`. A nonce-based policy would let `'unsafe-inline'` be dropped from `script-src`, which is where most of the remaining value is.

### 6.6 Smaller items

- **Consolidate the three Firebase Admin initialisers** (S-14) into one, with a single documented environment variable.
- **Delete `/api/admin/find-user-by-email`** (S-15) or implement the session cookie it expects.
- **Automate retention.** The Data Retention Policy states periods that are currently enforced by hand. A scheduled Cloud Function pruning expired bookings, votes and logs would make the policy true rather than aspirational.
- **Build a self-service data export and account deletion flow**, so subject access and erasure requests are not manual work.
- **Enable Firebase App Check**, so the Firebase config in the client bundle can only be used by your own site.
- **Turn on Firebase Auth email enumeration protection** and consider requiring email verification at registration.

---

## 7. Items requiring legal or committee review

The engineering is done; these are decisions and factual confirmations only a human can make. **Nothing here has been signed off by a lawyer, and this report is not legal advice.**

1. **Who is the data controller?** The documents now name the James Square Proprietors' Association, replacing the previous "a resident volunteer". This matters: an unincorporated association's members can carry personal liability. Please confirm this is right, and consider ICO registration (most likely exempt, but worth confirming — there is a screening tool on ico.org.uk).

2. **`privacy@james-square.com` must exist.** The address is now published in the footer and all five documents. If it does not yet route to someone who will action requests within the one-month statutory deadline, that is a compliance gap created by publishing it.

3. **Confirm the processor list.** Google, Vercel and Resend are named from the codebase. If anything else touches personal data — a mailing list, a form service, a backup — it belongs in the Privacy Policy.

4. **Confirm the retention periods.** Every period in the Data Retention Policy is a reasoned proposal, not an established practice. The 6-year figure for committee correspondence and the 2-year booking history in particular should reflect what the Association actually wants.

5. **Ratify the Acceptable Use Policy.** It describes moderation powers — restricting accounts, removing content, reporting to authorities. The committee should agree those powers before they are relied upon.

6. **Decide whether to notify residents.** Findings P-01, P-03 and P-04 mean resident contact details were accessible to anyone for an unknown period. Whether this is a reportable breach under Article 33 depends on evidence of actual access, which we cannot determine from the code alone. **We recommend the committee take a view on this, with advice, rather than treating it as closed** — ICO guidance is at ico.org.uk/for-organisations/report-a-breach/. Reviewing Firebase usage logs for anomalous read volumes would inform that decision.

7. **Consider a DPIA.** Not strictly required at this scale, but the site processes contact details, occupancy patterns and voting records for an entire residential development. A short one would be proportionate.

---

## 8. Compliance statement

As far as is technically achievable within this codebase, james-square.com now follows UK GDPR and PECR best practice:

- **PECR Regulation 6** — no non-essential storage before consent; consent freely given, specific, informed and granular; withdrawal as easy as giving it; a durable record with a timestamp and the method used; re-asked every 182 days. Verified: zero third-party requests before consent.
- **GDPR Articles 5, 13, 14** — data minimisation reviewed form by form; purposes, lawful bases, processors, transfers, retention periods and rights all disclosed in accessible language.
- **GDPR Article 25** — privacy by design and by default: default-deny security rules, essential-only consent defaults, identities resolved server-side rather than filtered in the browser, a registry that makes it structurally difficult to add a tracker without gating it.
- **GDPR Article 32** — authentication and authorisation enforced server-side, field-level protection against privilege escalation, rate limiting, input validation, output sanitisation, security headers, an append-only audit trail, and secrets held server-side.
- **WCAG 2.2 AA** — for the consent interface, verified by automated checks.

Two caveats, stated plainly: the residual risks in §6.1 and §6.2 are real, and they are architectural rather than code-level — the shared access codes and the publicly-fetchable documents both need a decision about how owner access should work before they can be properly closed. Compliance is a state that has to be maintained, not a box that has been ticked; §6 is the list that keeps it true.

---

*Prepared as part of the GDPR, privacy and security review of james-square.com, 26 July 2026.*
