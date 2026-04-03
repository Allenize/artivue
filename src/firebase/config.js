import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDORK9LchHn8K9XN2KEZX1gShMTah8b4mM',
  authDomain: 'artivue-8ffc4.firebaseapp.com',
  projectId: 'artivue-8ffc4',
  storageBucket: 'artivue-8ffc4.firebasestorage.app',
  messagingSenderId: '354209634626',
  appId: '1:354209634626:web:afe5478f0b466fcce610db',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
