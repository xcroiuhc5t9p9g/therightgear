const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function test() {
  const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  const app = admin.initializeApp({ projectId: config.projectId });
  try {
    const db = getFirestore(app, config.firestoreDatabaseId);
    await db.collection('users').limit(1).get();
    console.log("SUCCESS");
  } catch(e) {
    console.log("FAIL: " + e.message);
  }
}
test();
