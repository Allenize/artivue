import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, arrayUnion, arrayRemove, increment, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ── ARTWORKS ────────────────────────────────────────────────────────
export async function getArtworks() {
  try {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch(e) { console.error('getArtworks:', e); return [] }
}

export async function addArtwork(data, imageBase64) {
  const payload = { ...data, likes: [], views: 0, createdAt: serverTimestamp() }
  if (imageBase64) payload.image = imageBase64
  return await addDoc(collection(db, 'artworks'), payload)
}

export async function updateArtwork(id, data, imageBase64) {
  const payload = { ...data, updatedAt: serverTimestamp() }
  if (imageBase64) payload.image = imageBase64
  // Remove undefined fields
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])
  await updateDoc(doc(db, 'artworks', id), payload)
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
  try {
    await updateDoc(doc(db, 'artworks', id), { views: increment(1) })
  } catch(e) { console.error('incrementViews:', e) }
}

// ── ARTISTS ─────────────────────────────────────────────────────────
export async function getArtists() {
  try {
    const q = query(collection(db, 'artists'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch(e) { console.error('getArtists:', e); return [] }
}

export async function addArtist(data, imageBase64) {
  const payload = { ...data, createdAt: serverTimestamp() }
  if (imageBase64) payload.image = imageBase64
  return await addDoc(collection(db, 'artists'), payload)
}

export async function updateArtist(id, data, imageBase64) {
  const payload = { ...data, updatedAt: serverTimestamp() }
  if (imageBase64) payload.image = imageBase64
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])
  await updateDoc(doc(db, 'artists', id), payload)
}

export async function deleteArtist(id) {
  await deleteDoc(doc(db, 'artists', id))
}

// ── COMMUNITY ────────────────────────────────────────────────────────
export async function getCommunityPosts() {
  try {
    const q = query(collection(db, 'community'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch(e) { console.error('getCommunityPosts:', e); return [] }
}

export async function addCommunityPost(data, userId, userName, userInitials, imageBase64) {
  const payload = { ...data, userId, userName, userInitials, likes: [], comments: [], status: 'pending', createdAt: serverTimestamp() }
  if (imageBase64) payload.image = imageBase64
  return await addDoc(collection(db, 'community'), payload)
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
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    return snap.data()?.favorites || []
  } catch(e) { return [] }
}
