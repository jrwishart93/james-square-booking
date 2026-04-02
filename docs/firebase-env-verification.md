# Firebase/Vercel environment verification

This repo includes a helper script to verify the Firebase variables in a single environment file:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID` (optional but checked when present)
- `FIREBASE_ADMIN_CREDENTIALS` or `FIREBASE_ADMIN_JSON`

## 1) Pull Production variables and validate

```bash
vercel env pull .env.production --environment=production
npm run check:firebase-env -- .env.production
```

## 2) Pull Preview variables and validate

```bash
vercel env pull .env.preview --environment=preview
npm run check:firebase-env -- .env.preview
```

## What the script validates

1. Admin JSON parses correctly.
2. `project_id` in admin JSON equals `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
3. If set, `FIREBASE_PROJECT_ID` equals `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
4. `private_key` appears to use JSON-escaped `\\n` line breaks.
5. Basic shape checks for auth domain and API key.

## Redeploy after corrections

```bash
vercel --prod
```

Then test login in the deployed environment.
