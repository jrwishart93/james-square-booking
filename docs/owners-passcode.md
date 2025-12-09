# Owners Passcode

Hash the passcode locally and paste the result into `.env.local` as `OWNERS_PASSCODE_HASH`.

Example command (replace the code if you rotate it):

```
node -e "console.log(require('bcryptjs').hashSync('968819', 10))"
```

Rotation steps:

1. Generate a new hash with the command above (update the plain-text code as needed).
2. Replace the value of `OWNERS_PASSCODE_HASH` in `.env.local` (and the matching environment variable in your hosting provider).
3. Redeploy the application so the new hash is loaded by the server.

Existing owners keep access; only new verifications use the new code.
