import { FirebaseOptions, initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

type FirebaseEnvKey =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID";

const firebaseConfig: FirebaseOptions = {
  apiKey: getFirebaseEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getFirebaseEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getFirebaseEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getFirebaseEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getFirebaseEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getFirebaseEnv("VITE_FIREBASE_APP_ID"),
};

/**
 * Returns Firebase Web environment variables ensuring they exist at build time.
 */
function getFirebaseEnv(key: FirebaseEnvKey): string {
  const value = import.meta.env[key];

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  throw new Error(`Missing Firebase environment variable: ${key}`);
}

const firebaseApp: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);

export { firebaseApp, firebaseConfig, firebaseAuth, firebaseDb };
