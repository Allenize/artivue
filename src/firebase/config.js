// ─────────────────────────────────────────────────────────────────────────────
// src/firebase/config.js
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "artivue"
// 3. Go to Project Settings → General → Your apps → Add app → Web (</>)
// 4. Copy your firebaseConfig values below
// 5. Enable Authentication → Email/Password
// 6. Enable Firestore Database (start in test mode)
// 7. Enable Storage (start in test mode)
// 8. In Firestore, create these collections manually:
//    - artworks
//    - artists
//    - community
//    - users
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// ⚠️  REPLACE THESE WITH YOUR FIREBASE PROJECT VALUES
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
