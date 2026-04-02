import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { onAuthChange, loginUser, registerUser, logoutUser } from '../firebase/auth'
import * as dbService from '../firebase/db'

const TRANSLATIONS = {
  en: { home:'Home', explore:'Explore', artists:'Artists', artworks:'Artworks', community:'Community', favorites:'Favorites', search:'Search artworks, artists…', featuredArtwork:'Featured Artwork', didYouKnow:'Did you know?', darkMode:'Dark Mode', language:'Language', addArtwork:'Add Artwork', addArtist:'Add Artist', save:'Save', cancel:'Cancel', delete:'Delete', edit:'Edit', login:'Login', logout:'Logout', register:'Register', admin:'Admin Dashboard', upload:'Upload Image', noFavorites:'No favorites yet', browseArtworks:'Browse Artworks', viewArtwork:'View Artwork', artistProfile:'Artist Profile', aboutArtwork:'About this Artwork', relatedArtworks:'Related Artworks', postArt:'Share Your Art', likeCount:'likes', commentCount:'comments', approve:'Approve', report:'Report', loading:'Loading…', noArtworks:'No artworks yet', noArtists:'No artists yet', noCommunity:'No community posts yet' },
  fil: { home:'Tahanan', explore:'Tuklasin', artists:'Mga Artista', artworks:'Mga Obra', community:'Komunidad', favorites:'Mga Paborito', search:'Maghanap ng obra, artista…', featuredArtwork:'Tampok na Obra', didYouKnow:'Alam mo ba?', darkMode:'Madilim na Mode', language:'Wika', addArtwork:'Magdagdag ng Obra', addArtist:'Magdagdag ng Artista', save:'I-save', cancel:'Kanselahin', delete:'Burahin', edit:'I-edit', login:'Mag-login', logout:'Mag-logout', register:'Mag-rehistro', admin:'Admin Dashboard', upload:'Mag-upload ng Larawan', noFavorites:'Wala pang paborito', browseArtworks:'I-browse ang Mga Obra', viewArtwork:'Tingnan ang Obra', artistProfile:'Profile ng Artista', aboutArtwork:'Tungkol sa Obra', relatedArtworks:'Kaugnay na Mga Obra', postArt:'Ibahagi ang Iyong Sining', likeCount:'gusto', commentCount:'komento', approve:'Aprubahan', report:'Iulat', loading:'Naglo-load…', noArtworks:'Wala pang mga obra', noArtists:'Wala pang mga artista', noCommunity:'Wala pang mga post' },
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [lang, setLang] = useState('en')
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [artists, setArtists] = useState([])
  const [artworks, setArtworks] = useState([])
  const [community, setCommunity] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((msg) => {
    const n = { id: Date.now(), msg }
    setNotifications(p => [n, ...p.slice(0, 4)])
    setTimeout(() => setNotifications(p => p.filter(x => x.id !== n.id)), 4000)
  }, [])

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      setCurrentUser(user)
      if (user) {
        const favs = await dbService.getUserFavorites(user.uid)
        setFavorites(favs)
      } else {
        setFavorites([])
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const loadData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [a, ar, c] = await Promise.all([
        dbService.getArtworks(),
        dbService.getArtists(),
        dbService.getCommunityPosts(),
      ])
      setArtworks(a)
      setArtists(ar)
      setCommunity(c)
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setDataLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const n = t === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', n)
      return n
    })
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const user = await loginUser(email, password)
      return { success: true, role: user.role }
    } catch (e) {
      return { success: false, error: 'Invalid email or password' }
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      await registerUser(name, email, password)
      return { success: true }
    } catch (e) {
      return { success: false, error: e.message.includes('already') ? 'Email already in use' : e.message }
    }
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setCurrentUser(null)
    setFavorites([])
  }, [])

  const toggleFavorite = useCallback(async (artworkId) => {
    if (!currentUser) { addNotification('Please log in to save favorites'); return }
    const isFav = favorites.includes(artworkId)
    setFavorites(f => isFav ? f.filter(x => x !== artworkId) : [...f, artworkId])
    await dbService.toggleFavorite(currentUser.uid, artworkId, isFav)
  }, [currentUser, favorites, addNotification])

  const addArtwork = useCallback(async (data) => {
    const { _imageBase64, ...rest } = data
    await dbService.addArtwork(rest, _imageBase64)
    await loadData()
  }, [loadData])

  const updateArtwork = useCallback(async (id, data) => {
    const { _imageBase64, ...rest } = data
    await dbService.updateArtwork(id, rest, _imageBase64)
    await loadData()
  }, [loadData])

  const deleteArtwork = useCallback(async (id) => {
    await dbService.deleteArtwork(id)
    setArtworks(p => p.filter(a => a.id !== id))
  }, [])

  const likeArtwork = useCallback(async (id) => {
    if (!currentUser) { addNotification('Please log in to like artworks'); return }
    await dbService.likeArtwork(id, currentUser.uid)
    setArtworks(p => p.map(a => {
      if (a.id !== id) return a
      const liked = a.likes?.includes(currentUser.uid)
      return { ...a, likes: liked ? a.likes.filter(l => l !== currentUser.uid) : [...(a.likes || []), currentUser.uid] }
    }))
  }, [currentUser, addNotification])

  const viewArtwork = useCallback(async (id) => {
    await dbService.incrementViews(id)
    setArtworks(p => p.map(a => a.id === id ? { ...a, views: (a.views || 0) + 1 } : a))
  }, [])

  const addArtist = useCallback(async (data) => {
    const { _imageBase64, ...rest } = data
    await dbService.addArtist(rest, _imageBase64)
    await loadData()
  }, [loadData])

  const updateArtist = useCallback(async (id, data) => {
    const { _imageBase64, ...rest } = data
    await dbService.updateArtist(id, rest, _imageBase64)
    await loadData()
  }, [loadData])

  const deleteArtist = useCallback(async (id) => {
    await dbService.deleteArtist(id)
    setArtists(p => p.filter(a => a.id !== id))
  }, [])

  const addPost = useCallback(async (data) => {
    if (!currentUser) return
    const { _imageBase64, ...rest } = data
    await dbService.addCommunityPost(rest, currentUser.uid, currentUser.name || currentUser.displayName, currentUser.initials || (currentUser.displayName || 'U').slice(0, 2).toUpperCase(), _imageBase64)
    await loadData()
  }, [currentUser, loadData])

  const approvePost = useCallback(async (id) => {
    await dbService.approvePost(id)
    setCommunity(p => p.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  }, [])

  const deletePost = useCallback(async (id) => {
    await dbService.deletePost(id)
    setCommunity(p => p.filter(x => x.id !== id))
  }, [])

  const likePost = useCallback(async (id) => {
    if (!currentUser) { addNotification('Please log in to like posts'); return }
    await dbService.likePost(id, currentUser.uid)
    setCommunity(p => p.map(post => {
      if (post.id !== id) return post
      const liked = post.likes?.includes(currentUser.uid)
      return { ...post, likes: liked ? post.likes.filter(l => l !== currentUser.uid) : [...(post.likes || []), currentUser.uid] }
    }))
  }, [currentUser, addNotification])

  const addComment = useCallback(async (postId, text) => {
    if (!currentUser || !text.trim()) return
    await dbService.addComment(postId, currentUser.uid, currentUser.name || currentUser.displayName, text)
    await loadData()
  }, [currentUser, loadData])

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, lang, setLang, t,
      currentUser, authLoading, login, register, logout,
      favorites, toggleFavorite,
      artists, artworks, community,
      dataLoading, loadData,
      addArtwork, updateArtwork, deleteArtwork, likeArtwork, viewArtwork,
      addArtist, updateArtist, deleteArtist,
      addPost, approvePost, deletePost, likePost, addComment,
      notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
