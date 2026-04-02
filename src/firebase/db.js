import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, arrayUnion, arrayRemove, increment, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ── ARTWORKS ────────────────────────────────────────────────────────
export async function getArtworks() {
  const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addArtwork(data) {
  return await addDoc(collection(db, 'artworks'), {
    ...data,
    likes: [],
    views: 0,
    createdAt: serverTimestamp(),
  })
}

export async function updateArtwork(id, data) {
  await updateDoc(doc(db, 'artworks', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteArtwork(id) {
  await deleteDoc(doc(db, 'artworks', id))
}

export async function likeArtwork(id, userId) {
  const ref_ = doc(db, 'artworks', id)
  const snap = await getDoc(ref_)
  const likes = snap.data()?.likes || []
  if (likes.includes(userId)) {
    await updateDoc(ref_, { likes: arrayRemove(userId) })
  } else {
    await updateDoc(ref_, { likes: arrayUnion(userId) })
  }
}

export async function incrementViews(id) {
  await updateDoc(doc(db, 'artworks', id), { views: increment(1) })
}

// ── ARTISTS ─────────────────────────────────────────────────────────
export async function getArtists() {
  const q = query(collection(db, 'artists'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addArtist(data) {
  return await addDoc(collection(db, 'artists'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateArtist(id, data) {
  await updateDoc(doc(db, 'artists', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteArtist(id) {
  await deleteDoc(doc(db, 'artists', id))
}

// ── COMMUNITY ────────────────────────────────────────────────────────
export async function getCommunityPosts() {
  const q = query(collection(db, 'community'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addCommunityPost(data, userId, userName, userInitials) {
  return await addDoc(collection(db, 'community'), {
    ...data,
    userId,
    userName,
    userInitials,
    likes: [],
    comments: [],
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

export async function approvePost(id) {
  await updateDoc(doc(db, 'community', id), { status: 'approved' })
}

export async function deletePost(id) {
  await deleteDoc(doc(db, 'community', id))
}

export async function likePost(id, userId) {
  const ref_ = doc(db, 'community', id)
  const snap = await getDoc(ref_)
  const likes = snap.data()?.likes || []
  if (likes.includes(userId)) {
    await updateDoc(ref_, { likes: arrayRemove(userId) })
  } else {
    await updateDoc(ref_, { likes: arrayUnion(userId) })
  }
}

export async function addComment(postId, userId, userName, text) {
  const comment = { id: Date.now().toString(), userId, userName, text, time: Date.now() }
  await updateDoc(doc(db, 'community', postId), { comments: arrayUnion(comment) })
}

// ── USER FAVORITES ───────────────────────────────────────────────────
export async function toggleFavorite(userId, artworkId, isFav) {
  const ref_ = doc(db, 'users', userId)
  if (isFav) {
    await updateDoc(ref_, { favorites: arrayRemove(artworkId) })
  } else {
    await updateDoc(ref_, { favorites: arrayUnion(artworkId) })
  }
}

export async function getUserFavorites(userId) {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.data()?.favorites || []
}
