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
  if (imageBase64) {
    try {
      // Keep compressing until under 700KB (Firestore doc limit is 1MB, leave room for other fields)
      let compressed = await compressImage(imageBase64, 800, 0.7)
      if (compressed.length > 700000) compressed = await compressImage(compressed, 600, 0.6)
      if (compressed.length > 700000) compressed = await compressImage(compressed, 400, 0.5)
      if (compressed.length > 700000) compressed = await compressImage(compressed, 300, 0.4)
      console.log('[addCommunityPost] image size after compression:', Math.round(compressed.length / 1024), 'KB')
      payload.image = compressed
    } catch(e) {
      console.warn('Image compression failed, saving post without image:', e)
    }
  }
  const result = await addDoc(collection(db, 'community'), payload)
  console.log('[addCommunityPost] saved with id:', result.id)
  return result
}

// Compress a base64 image to a max width and quality using canvas
function compressImage(base64, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = base64
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
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    return snap.data()?.favorites || []
  } catch(e) { return [] }
}

// ── SETTINGS (categories, movements) ─────────────────────────────────
export async function getSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'taxonomy'))
    return snap.exists() ? snap.data() : {}
  } catch(e) { return {} }
}

export async function saveSettings(data) {
  await updateDoc(doc(db, 'settings', 'taxonomy'), data).catch(async () => {
    // Create if doesn't exist
    const { setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, 'settings', 'taxonomy'), data)
  })
}

// ── ARTWORK COMMENTS ─────────────────────────────────────────────────
export async function addArtworkComment(artworkId, userId, userName, text) {
  const comment = { id: Date.now().toString(), userId, userName, text, time: Date.now() }
  await updateDoc(doc(db, 'artworks', artworkId), { comments: arrayUnion(comment) })
}
