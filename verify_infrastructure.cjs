const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } = require('firebase/auth');
const fs = require('fs');

async function verify() {
  console.log("--- START VERIFICATION ---");
  
  // 1. GCP Identity
  const gcpProjectId = process.env.GOOGLE_CLOUD_PROJECT || 'UNKNOWN';
  console.log('CLOUD_RUN_PROJECT_ID=' + gcpProjectId);
  
  // 2. Load Config
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  } catch(e) {
    console.log("NO_CONFIG");
    return;
  }
  
  // 3. Init Firebase Admin
  try {
    admin.initializeApp({
      projectId: config.projectId,
    });
    console.log('ADMIN_INITIALIZED=YES');
    console.log('ADMIN_PROJECT_ID=' + config.projectId);
  } catch(e) {
    console.log('ADMIN_INITIALIZED=NO');
  }

  // 4. Test Firestore (Admin)
  try {
    const db = admin.firestore();
    db.settings({ databaseId: config.firestoreDatabaseId });
    const cols = await db.listCollections();
    console.log('FIRESTORE_COLLECTIONS=' + cols.map(c => c.id).join(','));
    console.log('FIRESTORE_DATABASE_EXISTS=YES');
  } catch(e) {
    console.log('FIRESTORE_DATABASE_EXISTS=NO');
    console.log(e.message);
  }
  
  // 5. Test Auth (Client SDK)
  try {
    const clientApp = initializeApp(config);
    const clientAuth = getAuth(clientApp);
    
    // Attempt to create a dummy user to test Email/Password
    const testEmail = 'test-auth-runtime-' + Date.now() + '@therightgear.app';
    const testPass = 'Test1234!';
    try {
      const userCred = await createUserWithEmailAndPassword(clientAuth, testEmail, testPass);
      console.log('EMAIL_PASSWORD_CREATE=PASS');
      
      // Attempt Sign In
      await clientAuth.signOut();
      await signInWithEmailAndPassword(clientAuth, testEmail, testPass);
      console.log('EMAIL_PASSWORD_SIGN_IN=PASS');
      
      // Clean up using Admin SDK
      await admin.auth().deleteUser(userCred.user.uid);
      console.log('CLEANUP=PASS');
    } catch(err) {
      console.log('EMAIL_PASSWORD_ERR=' + err.code);
      if (err.code === 'auth/operation-not-allowed') {
        console.log('EMAIL_PASSWORD_PROVIDER=DISABLED');
      }
    }
  } catch(e) {
    console.log('CLIENT_AUTH_TEST_ERR=' + e.message);
  }

  console.log("--- END VERIFICATION ---");
}

verify().catch(e => console.error(e));
