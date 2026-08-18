import { initializeApp, getApps, getApp } from "firebase/app";
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
