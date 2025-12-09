```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow only administrators to read metrics; writes are server-only.
    match /metrics/{document=**} {
      allow read: if isAdmin();
      allow write: if false;
    }
  }
}
```

> Note: `isAdmin()` refers to the helper already defined in your main Firestore ruleset that returns true when the caller has the admin claim/role.
