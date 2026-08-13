const fs = require('fs');

// 1. Update .env.example
let envContent = fs.readFileSync('.env.example', 'utf-8');
const firebaseSection = envContent.indexOf('# FIREBASE CLIENT CONFIGURATION');
if (firebaseSection !== -1) {
  fs.writeFileSync('.env.example', envContent.substring(0, firebaseSection));
}

// 2. Update tsconfig.json to support JSON imports
let tsconfigStr = fs.readFileSync('tsconfig.json', 'utf-8');
let tsconfig = JSON.parse(tsconfigStr);
tsconfig.compilerOptions.resolveJsonModule = true;
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// 3. Update src/services/firebase.ts
const firebaseTs = `import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const hasFirebaseConfig = !!firebaseConfig.apiKey;

// Initialize Firebase only once
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
const googleAuthProvider = new GoogleAuthProvider();

export { firebaseApp, firebaseAuth, db, googleAuthProvider, hasFirebaseConfig };
`;
fs.writeFileSync('src/services/firebase.ts', firebaseTs);
