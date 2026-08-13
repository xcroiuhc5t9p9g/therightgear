const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function verify() {
  let config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  
  const app = admin.initializeApp({ projectId: config.projectId });
  try {
    const db = getFirestore(app, config.firestoreDatabaseId);
    const cols = await db.listCollections();
    console.log('FIRESTORE_COLLECTIONS=' + cols.map(c => c.id).join(','));
    console.log('FIRESTORE_DATABASE_EXISTS=YES');
  } catch(e) {
    console.log('FIRESTORE_DATABASE_EXISTS=NO');
    console.log('DB_ERR:', e.message);
  }
}
verify().catch(e => console.error(e));
