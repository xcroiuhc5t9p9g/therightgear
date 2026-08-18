import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const EXPECTED_PROJECT_ID = 'automotive-ai-platform';
const DATABASE_ID = 'ai-studio-therightgear-952d4703-659f-4be3-b072-f12d1aae0de8';
const FOUNDER_EMAIL = 'riccardo.monaco@gmail.com';
const CANONICAL_ROLE = 'super_admin';

async function bootstrap() {
  console.log(`\n==================================================`);
  console.log(`THE RIGHT GEAR: FOUNDER SUPER ADMIN BOOTSTRAP`);
  console.log(`==================================================`);

  const isApply = process.argv.includes('--apply');
  console.log(`MODE: ${isApply ? 'APPLY (Mutating Data)' : 'DRY RUN (No changes)'}\n`);

  const currentProject = process.env.GOOGLE_CLOUD_PROJECT;
  if (currentProject !== EXPECTED_PROJECT_ID) {
    console.error(`[ERROR] Project mismatch!`);
    console.error(`Active Cloud Shell Project: ${currentProject || 'UNKNOWN'}`);
    console.error(`Expected Project: ${EXPECTED_PROJECT_ID}`);
    console.error(`Please run: gcloud config set project ${EXPECTED_PROJECT_ID}`);
    process.exit(1);
  }

  console.log(`[INFO] Initializing Firebase Admin with Application Default Credentials...`);
  const app = initializeApp({
    credential: applicationDefault(),
    projectId: EXPECTED_PROJECT_ID
  });

  const auth = getAuth(app);
  const db = getFirestore(app, DATABASE_ID);

  console.log(`[INFO] Looking up user: ${FOUNDER_EMAIL}...`);
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(FOUNDER_EMAIL);
    console.log(`[SUCCESS] User found. UID: ${userRecord.uid}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`[ERROR] FOUNDER_FIREBASE_USER_NOT_FOUND`);
      console.error(`The Founder account has not been created yet in Firebase Authentication.`);
      process.exit(1);
    }
    console.error(`[ERROR] Failed to fetch user:`, error);
    process.exit(1);
  }

  if (!userRecord.emailVerified) {
    console.error(`[ERROR] FOUNDER_EMAIL_NOT_VERIFIED`);
    console.error(`Please verify the email address before running this bootstrap.`);
    process.exit(1);
  }

  const existingClaims = userRecord.customClaims || {};
  const currentAuthRole = existingClaims.role || 'NONE';
  console.log(`[INFO] Current Custom Claims Role: ${currentAuthRole}`);

  let currentProfileRole = 'NONE';
  const profileRef = db.collection('users').doc(userRecord.uid);
  try {
    const profileDoc = await profileRef.get();
    if (profileDoc.exists) {
      currentProfileRole = profileDoc.data().role || 'NONE';
      console.log(`[INFO] Current Firestore Profile Role: ${currentProfileRole}`);
    } else {
      console.log(`[INFO] Current Firestore Profile: NOT FOUND (Will be created/merged)`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to read Firestore profile:`, error.message);
    process.exit(1);
  }

  if (currentAuthRole === CANONICAL_ROLE && currentProfileRole === CANONICAL_ROLE) {
    console.log(`\n[SUCCESS] FOUNDER_ALREADY_SUPER_ADMIN`);
    console.log(`No changes needed. Exiting.\n`);
    process.exit(0);
  }

  console.log(`\n--- PROPOSED CHANGES ---`);
  console.log(`1. Custom Claims: Set 'role' = '${CANONICAL_ROLE}' (preserving existing claims)`);
  console.log(`2. Firestore Profile: Set 'role' = '${CANONICAL_ROLE}' in users/${userRecord.uid}`);

  if (!isApply) {
    console.log(`\n[DRY RUN] Run with --apply to execute these changes.`);
    process.exit(0);
  }

  console.log(`\n--- EXECUTING CHANGES ---`);
  
  // 1. Set Custom Claims
  try {
    const updatedClaims = { ...existingClaims, role: CANONICAL_ROLE };
    await auth.setCustomUserClaims(userRecord.uid, updatedClaims);
    console.log(`[SUCCESS] Custom claims updated.`);
  } catch (error) {
    console.error(`[ERROR] Failed to set custom claims:`, error);
    process.exit(1);
  }

  // 2. Set Firestore Profile
  try {
    await profileRef.set({
      role: CANONICAL_ROLE,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[SUCCESS] Firestore profile updated.`);
  } catch (error) {
    console.error(`[ERROR] Failed to update Firestore profile:`, error);
    process.exit(1);
  }

  console.log(`\n--- POST-WRITE VERIFICATION ---`);
  const verifyUser = await auth.getUser(userRecord.uid);
  const verifyProfile = await profileRef.get();
  
  const claimVerified = verifyUser.customClaims?.role === CANONICAL_ROLE;
  const profileVerified = verifyProfile.exists && verifyProfile.data().role === CANONICAL_ROLE;

  console.log(`SUPER_ADMIN_CLAIM_VERIFIED = ${claimVerified ? 'YES' : 'NO'}`);
  console.log(`SUPER_ADMIN_PROFILE_VERIFIED = ${profileVerified ? 'YES' : 'NO'}`);

  if (claimVerified && profileVerified) {
    console.log(`\n[COMPLETED] Founder bootstrap successful.`);
    console.log(`\nIMPORTANT:`);
    console.log(`If you are currently signed in, you MUST SIGN OUT AND SIGN IN AGAIN`);
    console.log(`to refresh your identity token and receive super_admin capabilities.`);
  } else {
    console.error(`\n[WARNING] Verification failed. Please check logs.`);
  }
}

bootstrap().catch(console.error);
