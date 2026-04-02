import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export async function registerUser(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    role: 'user',
    initials,
    createdAt: serverTimestamp(),
  })
  return cred.user
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const snap = await getDoc(doc(db, 'users', cred.user.uid))
  const profile = snap.exists() ? snap.data() : {}
  return { uid: cred.user.uid, email: cred.user.email, ...profile }
}

export async function logoutUser() {
  await signOut(auth)
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { uid, ...snap.data() } : { uid, role: 'user' }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid)
        callback({ uid: user.uid, email: user.email, displayName: user.displayName, ...profile })
      } catch (e) {
        callback({ uid: user.uid, email: user.email, role: 'user' })
      }
    } else {
      callback(null)
    }
    
  })
}
