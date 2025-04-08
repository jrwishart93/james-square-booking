// migration.js
const admin = require('firebase-admin');

// Replace './serviceAccountKey.json' with the path to your downloaded JSON file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateUsers() {
  // Get all documents from the 'users' collection.
  const usersSnapshot = await db.collection('users').get();

  console.log(`Found ${usersSnapshot.size} users to migrate.`);

  // Create a batch to update documents
  const batch = db.batch();

  // Loop through each user document.
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    const updates = {};

    // If 'username' does not exist, create one using the email (the part before '@').
    if (!('username' in data)) {
      if (data.email) {
        updates.username = data.email.split('@')[0];
      } else {
        updates.username = 'user'; // fallback if no email exists
      }
    }

    // If 'property' does not exist, set it to an empty string (or a default value)
    if (!('property' in data)) {
      updates.property = ''; // You can change this to a default like 'Unknown' if needed.
    }

    // If there are any new fields, update the document.
    if (Object.keys(updates).length > 0) {
      console.log(`Updating user ${doc.id} with:`, updates);
      batch.update(doc.ref, updates);
    }
  });

  // Commit all updates at once.
  await batch.commit();
  console.log('Migration complete.');
}

migrateUsers().catch((error) => {
  console.error('Migration failed:', error);
});
