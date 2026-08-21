import { CataloguePersistenceError, CatalogueConfigurationError } from '../types.js';

let adminAppInstance: any = null;
let firestoreInstance: any = null;
let customFirestoreOverride: any = null;

interface FirebaseAppletConfig {
  projectId?: string;
  firestoreDatabaseId?: string;
}

async function loadFsModule() {
  const mod = 'fs';
  return await import(/* @vite-ignore */ mod);
}

async function loadPathModule() {
  const mod = 'path';
  return await import(/* @vite-ignore */ mod);
}

async function loadAdminAppModule() {
  const mod = 'firebase-admin/app';
  return await import(/* @vite-ignore */ mod);
}

async function loadFirestoreModule() {
  const mod = 'firebase-admin/firestore';
  return await import(/* @vite-ignore */ mod);
}

async function loadFirebaseConfig(): Promise<FirebaseAppletConfig> {
  if (typeof window !== 'undefined') {
    return {};
  }
  try {
    const fs = await loadFsModule();
    const path = await loadPathModule();
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err: any) {
    console.warn('[TheRightGear FirebaseAdmin] Unable to read firebase-applet-config.json:', err?.message);
  }
  return {};
}

/**
 * Returns the single server-side Firebase Admin App instance.
 * Safe for server runtime only.
 */
export async function getAdminApp(): Promise<any> {
  if (adminAppInstance) {
    return adminAppInstance;
  }

  if (typeof window !== 'undefined') {
    throw new CatalogueConfigurationError('Firebase Admin SDK cannot run on client browser.');
  }

  const { initializeApp, getApps, applicationDefault } = await loadAdminAppModule();

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminAppInstance = existingApps[0];
    return adminAppInstance;
  }

  const config = await loadFirebaseConfig();
  const projectId = 
    process.env.GOOGLE_CLOUD_PROJECT || 
    process.env.FIREBASE_PROJECT_ID || 
    config.projectId || 
    'automotive-ai-platform';

  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminAppInstance = initializeApp({
        credential: applicationDefault(),
        projectId
      });
    } else {
      adminAppInstance = initializeApp({
        projectId
      });
    }
    return adminAppInstance;
  } catch (err: any) {
    throw new CatalogueConfigurationError(
      `Failed to initialize server-side Firebase Admin app: ${err?.message || 'Unknown error'}`
    );
  }
}

/**
 * Returns the server-side Firestore instance configured with the canonical catalogue database ID.
 */
export async function getAdminFirestore(): Promise<any> {
  if (customFirestoreOverride) {
    return customFirestoreOverride;
  }

  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (typeof window !== 'undefined') {
    throw new CataloguePersistenceError('Firestore Admin client cannot run on client browser.');
  }

  const app = await getAdminApp();
  const { getFirestore } = await loadFirestoreModule();
  const config = await loadFirebaseConfig();
  const databaseId = 
    process.env.FIRESTORE_DATABASE_ID || 
    config.firestoreDatabaseId || 
    'ai-studio-therightgear-952d4703-659f-4be3-b072-f12d1aae0de8';

  try {
    firestoreInstance = getFirestore(app, databaseId);
    return firestoreInstance;
  } catch (err: any) {
    throw new CataloguePersistenceError(
      `Failed to obtain server-side Firestore instance for database "${databaseId}": ${err?.message || 'Unknown error'}`
    );
  }
}

/**
 * Allows injecting a custom Firestore instance (e.g. for mock or test suites).
 */
export function setAdminFirestoreOverride(override: any): void {
  customFirestoreOverride = override;
}

/**
 * Performs a lightweight readiness check against the canonical Firestore datastore.
 * Distinguishes reachable empty database from unreachable or unconfigured database.
 */
export async function checkFirestoreConnection(collectionName = 'catalogue_makers'): Promise<{ reachable: boolean; empty: boolean }> {
  try {
    const db = await getAdminFirestore();
    const snapshot = await db.collection(collectionName).limit(1).get();
    return {
      reachable: true,
      empty: snapshot.empty
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('PERMISSION_DENIED') || msg.includes('UNAUTHENTICATED') || msg.includes('NOT_FOUND') || msg.includes('UNAVAILABLE')) {
      throw new CataloguePersistenceError(`Firestore connection check failed (${err?.code || 'COMMUNICATION_ERROR'}): ${msg}`);
    }
    throw new CataloguePersistenceError(`Firestore datastore unavailable: ${msg}`);
  }
}
