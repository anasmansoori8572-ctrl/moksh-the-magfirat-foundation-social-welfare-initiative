import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCHU0gAqfn9H4j9AKiVtABPUOTw70RDO3w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "moksh-4750d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "moksh-4750d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "moksh-4750d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "529183550011",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:529183550011:web:dd61625d656d112e6c4a1e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8JH75Q0BEY"
};

// Log if we are using fallbacks (only in development)
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn("Firebase: Using hardcoded fallback API key. Ensure VITE_FIREBASE_API_KEY is set in your environment.");
  } else {
    console.log("Firebase: Using API key from environment variables.");
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Increase retry time for uploads to handle unstable connections (30 minutes)
storage.maxUploadRetryTime = 1800000; 
storage.maxOperationRetryTime = 1800000; 

console.log("Firebase initialized successfully");

export { auth, db, storage };
export default app;
