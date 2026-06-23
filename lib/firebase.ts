import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

export const DEFAULT_FIREBASE_APP_NAME = "[DEFAULT]";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

/** Default Firebase app singleton — `app.name` is `"[DEFAULT]"`. */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

let storage: FirebaseStorage | null | undefined;
let firestore: Firestore | null | undefined;

/** Option 1: Storage via the default app instance. */
export function getFirebaseStorage(): FirebaseStorage | null {
  if (storage !== undefined) {
    return storage;
  }

  const app = getFirebaseApp();
  storage = app ? getStorage(app) : null;
  return storage;
}

/** Option 1: Firestore via the default app instance. */
export function getFirebaseFirestore(): Firestore | null {
  if (firestore !== undefined) {
    return firestore;
  }

  const app = getFirebaseApp();
  firestore = app ? getFirestore(app) : null;
  return firestore;
}

/** Option 2: Storage shorthand — uses the default app after initialization. */
export function getDefaultStorage(): FirebaseStorage | null {
  if (!getFirebaseApp()) {
    return null;
  }

  return getStorage();
}

/** Option 2: Firestore shorthand — uses the default app after initialization. */
export function getDefaultFirestore(): Firestore | null {
  if (!getFirebaseApp()) {
    return null;
  }

  return getFirestore();
}
