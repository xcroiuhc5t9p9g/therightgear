const admin = require('firebase-admin');
const fs = require('fs');

async function test() {
  const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  admin.initializeApp({ projectId: config.projectId });
  try {
    const db = admin.firestore();
    db.settings({ databaseId: config.firestoreDatabaseId });
    await db.collection('users').limit(1).get();
    console.log("SUCCESS");
  } catch(e) {
    console.log("FAIL: " + e.message);
  }
}
test();
