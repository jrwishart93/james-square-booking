# Storage & repository audit — September 2026

Branch: `claude/keen-ritchie-ihju8d`. Method: every file in `public/` was checked for its
full path (raw and URL-encoded), basename and filename stem across all tracked source,
config, CSS, manifest, email templates, Firebase functions and docs, plus the full git
history (`git log -S`) and every absolute `james-square.com/images|docs` URL ever used in
email templates. No asset path in the codebase is built dynamically from a variable.

## Sizes

| | Before | After |
|---|---|---|
| `public/` | 518 MB (251 files) | 366 MB (190 files) |
| Working tree excl. `.git` / `node_modules` | 522 MB | 370 MB |
| `.git` (full history) | 484 MB | 484 MB (history unchanged) |
| `.next` build output excl. cache | — | 22 MB |

## Removed (definitely unused — no reference anywhere in the current code)

Duplicates / obsolete 3D media (previously referenced, since replaced):
`docs/survey/pool-area-scan-polycam.glb` (byte-identical to the next one),
`images/pool/pool-area-scan.glb`, `images/pool/02-edit-floor-plan-pool.glb`,
`docs/survey/pool-3D-model-website.glb`, `docs/survey/pool-3D-modelglb.glb`,
`docs/survey/pool-walkthrough-website.mp4`.

HEIC camera originals (not displayable in most browsers, never referenced):
`images/pool/pool-exterior.HEIC`, `pool-facing-north-photo.HEIC`, `gymandshower-photo.HEIC`,
`entrance-facing east.HEIC`.

Unreferenced photos: `images/side-entrance.jpeg`, `images/pool-entrance-door.jpeg`,
`images/side-view-facility.png` (duplicate of `buildingimages/pool_from_outside.png`),
`images/pool/pool-3D-facing-south.jpg` (duplicate of the `buildingimages/` copy that is used),
`images/pool/` 02-exterior-entrance-door, 02-front-door-opening-times-cctv-warning-sign,
04-initial-hallway, 06-male-changing-room, 06-qr-booking-link-sign, 07-female-changing-room,
08-internal-door, 12-fob-cctc-sign, 13-exit-door-release-button, 21-fire-door-lock,
25-no-running-sign (`.jpeg`), birdseye-view-pool-exterior.png,
pool-floorplan-with-icon-placement-v3.png;
`images/venues/` hot-world-inside.png, hot-world-outside-night.png, map-venues.jpeg;
`images/buildingimages/` pool-3D-facing-north.PNG, bin-location.png, dashboardimage.png,
messageboardimage.png, area-map.png;
`images/area/` background-pentland-hills.PNG, foreground-edinburgh-scott.PNG,
midground-edinburgh-castle.PNG (added and removed from code on 2026-09-02).

Superseded icon sets (references removed in commit 8a88d02 and earlier):
`images/icons/` {pool,message,dashboard,info}-icon-{light,dark}.png,
Owner-icon-{light,dark}.PNG, new-{pool,vote,dashboard,message}-icon-{light,dark}.png,
new-info-icon-dark.png, new-Owner-icon-dark.png, IMG_0015/16/17.png.

Repository root: `package-lock 2.json`, `package-lock 3.json` (Finder/iCloud copies).

Dependencies: `@sendgrid/mail`, `ics` — never imported anywhere in the project's history.

Every removed file remains recoverable from git history.

## Kept — uncertain (not referenced in code, but may be linked externally)

- `docs/survey/JSPA AGM Minutes -2026.docx` — owner document, may be shared by direct link.
- `docs/survey/accommodation_invoice_david_harant.pdf` — superseded by `_final.pdf`, but may
  have been sent by link. **Contains a named individual's invoice in a publicly fetchable
  folder — review under the GDPR audit.**
- `images/venues/myreside-tender-doc.pdf` — previously linked from the site.
- `images/logo/fior-logo.png` (1.7 MB), `images/logo/JS-favicon.PNG`,
  `images/logo/JS-favicon-2.ico` (byte-identical pair) — branding.
- `images/icons/globe-x.png`, `link-white.png`, `lock-open-white.png`,
  `message-square-warning-white.png` — email-style icons; could appear in admin-authored
  broadcast HTML stored in Firestore, which cannot be checked from the repo.
- `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — create-next-app
  defaults, a few KB in total.

## Possible content bugs (not changed)

Byte-identical images under different names, where the *used* name may show the wrong photo:
- `images/pool/05-remove-outer-footwear-sign.jpeg` is identical to the hallway photo
  `04-initial-hallway.jpeg`.
- `images/pool/24-no-diving-signage.jpeg` is identical to `25-no-running-sign.jpeg`.

## Recommendations (not applied)

1. **Service worker precaches all of `public/`.** `next-pwa` adds every public file to the
   precache manifest (190 files, ~365 MB after this cleanup, including the 16 MB GLB and
   16 MB MP4). Every visitor whose browser installs the service worker downloads all of it in the
   background. Suggested fix in `next.config.ts`:
   `withPWA({ dest: "public", disable: ..., publicExcludes: ["!noprecache/**/*", "!images/**/*", "!docs/**/*"] })`.
   Behaviour change: images and PDFs stop being available offline unless visited first.
2. **Image optimisation.** 99 raster files over 1 MB total ~286 MB. The pool photos are
   24 MP camera originals (5712×4284, 3–5 MB each); several venue "photos" are PNGs. Resizing
   to ≤2400 px on the long edge at JPEG q≈82 (same file names, so no path changes) would
   typically cut these by 80–90 % (~230–250 MB). Next/Image already resizes on delivery, so
   this reduces deployment size, not page quality.
3. **Large 3D/video media** (~47 MB in use) could move to Firebase Storage or Vercel Blob so
   they are not duplicated into every deployment.
