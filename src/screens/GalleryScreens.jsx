import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Heart, ChevronDown, ChevronRight, Eye, ThumbsUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ── COLOR DETECTION ──────────────────────────────────────────────────
function extractColors(imageUrl, count = 5) {
  return new Promise((resolve) => {
    if (!imageUrl) { resolve([]); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 60; canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data
      const colorMap = {}
      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 32) * 32
        const g = Math.round(data[i+1] / 32) * 32
        const b = Math.round(data[i+2] / 32) * 32
        if (data[i+3] < 128) continue
        const key = `${r},${g},${b}`
        colorMap[key] = (colorMap[key] || 0) + 1
      }
      const sorted = Object.entries(colorMap).sort((a,b) => b[1]-a[1]).slice(0, count).map(([k]) => {
        const [r,g,b] = k.split(','); return `rgb(${r},${g},${b})`
      })
      resolve(sorted)
    }
    img.onerror = () => resolve([])
    img.src = imageUrl
  })
}

function ColorDots({ imageUrl }) {
  const [colors, setColors] = useState([])
  useEffect(() => {
    if (imageUrl) extractColors(imageUrl, 5).then(setColors)
    else setColors([])
  }, [imageUrl])
  if (!colors.length) return null
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
      {colors.map((color, i) => (
        <div key={i} title={color} style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '1.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
      ))}
    </div>
  )
}

// ── ARTWORKS GALLERY ─────────────────────────────────────────────────
export function ArtworksScreen() {
  const navigate = useNavigate()
  const { artworks, favorites, toggleFavorite, t, viewArtwork } = useApp()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('newest')

  const filtered = artworks
    .filter(a => !q || a.title?.toLowerCase().includes(q.toLowerCase()) || a.artist?.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      if (sort === 'popular') return (b.likes?.length || 0) - (a.likes?.length || 0)
      if (sort === 'views') return (b.views || 0) - (a.views || 0)
      if (sort === 'oldest') return (a.year || 0) - (b.year || 0)
      return 0
    })

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.artworks}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{filtered.length} works in collection</div>
      </motion.div>

      {/* Search + Sort row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px' }}>
          <Search size={14} strokeWidth={1.5} style={{ color: 'var(--light-text)', flexShrink: 0 }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search artworks…"
            style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Jost,sans-serif', fontSize: 13, color: 'var(--dark-text)', outline: 'none' }} />
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}><X size={13} /></button>}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 12px', fontFamily: 'Jost,sans-serif', fontSize: 11, color: 'var(--mid-text)', outline: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <option value="newest">Newest</option>
          <option value="popular">Most Liked</option>
          <option value="views">Most Viewed</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="artwork-grid">
        {filtered.map((art, i) => (
          <motion.div key={art.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
            onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }} whileHover={{ y: -4 }}>
            <div style={{ height: 150, position: 'relative', overflow: 'hidden' }}>
              {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient || '#ccc' }} />}
              <div style={{ position: 'absolute', top: 8, left: 8 }}><span className="tag">{art.category}</span></div>
              <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250,246,238,.88)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Heart size={12} fill={favorites.includes(art.id) ? 'var(--accent-rust)' : 'none'} stroke={favorites.includes(art.id) ? 'var(--accent-rust)' : 'var(--mid-text)'} />
              </button>
              {/* Stats overlay */}
              <div style={{ position: 'absolute', bottom: 6, right: 8, display: 'flex', gap: 8 }}>
                {art.views > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(0,0,0,.45)', borderRadius: 10, padding: '2px 7px', fontSize: 9, color: '#fff' }}><Eye size={9} />{art.views}</div>}
                {art.likes?.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(0,0,0,.45)', borderRadius: 10, padding: '2px 7px', fontSize: 9, color: '#fff' }}><ThumbsUp size={9} />{art.likes.length}</div>}
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
              <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginBottom: 4, cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); if(art.artistId) navigate('/artist/' + art.artistId) }}>
                {art.artist}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag">{art.movement}</span>
                <span style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.year}</span>
              </div>
              {art.image && <ColorDots imageUrl={art.image} />}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--light-text)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20 }}>No artworks found</div>
        </div>
      )}
    </div>
  )
}

// ── ARTISTS ──────────────────────────────────────────────────────────
export function ArtistsScreen() {
  const navigate = useNavigate()
  const { artists, artworks, t } = useApp()
  const [q, setQ] = useState('')
  const [view, setView] = useState('grid') // grid | list

  const filtered = artists.filter(a =>
    !q ||
    a.name?.toLowerCase().includes(q.toLowerCase()) ||
    a.nationality?.toLowerCase().includes(q.toLowerCase()) ||
    a.era?.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.artists}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{filtered.length} artists in collection</div>
      </motion.div>

      {/* Search + View toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px' }}>
          <Search size={14} strokeWidth={1.5} style={{ color: 'var(--light-text)', flexShrink: 0 }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search artists, nationality, era…"
            style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Jost,sans-serif', fontSize: 13, color: 'var(--dark-text)', outline: 'none' }} />
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}><X size={13} /></button>}
        </div>
        {/* Grid / List toggle */}
        <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0 }}>
          {['grid','list'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '10px 14px', border: 'none', cursor: 'pointer', fontSize: 10, fontFamily: 'Jost,sans-serif', letterSpacing: '.06em', textTransform: 'uppercase', background: view === v ? 'var(--dark-text)' : 'transparent', color: view === v ? 'var(--cream)' : 'var(--mid-text)', transition: 'all .2s' }}>
              {v === 'grid' ? '⊞' : '≡'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
          {filtered.map((artist, i) => {
            const works = artworks.filter(a => a.artistId === artist.id)
            return (
              <motion.div key={artist.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden', textAlign: 'center' }}
                initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .04 }}
                onClick={() => navigate('/artist/' + artist.id)} whileHover={{ y: -4 }}>
                <div style={{ height: 120, overflow: 'hidden', position: 'relative', background: artist.color || '#8B5E3C' }}>
                  {artist.image
                    ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 40, color: 'rgba(255,255,255,.8)', fontStyle: 'italic' }}>{artist.initials}</div>}
                  <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,.5)', borderRadius: 10, padding: '2px 8px', fontSize: 9, color: '#fff' }}>{works.length} works</div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{artist.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--light-text)' }}>{artist.nationality} · {artist.era?.split('·')[0]?.trim()}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((artist, i) => {
            const works = artworks.filter(a => a.artistId === artist.id)
            return (
              <motion.div key={artist.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                onClick={() => navigate('/artist/' + artist.id)} whileHover={{ x: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                    {artist.image
                      ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2 }}>{artist.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--light-text)', marginTop: 2 }}>{artist.era} · {artist.nationality}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--mid-text)' }}>{works.length} works</div>
                    <ChevronRight size={14} style={{ color: 'var(--accent-rust)' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--light-text)' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, marginBottom: 6 }}>No artists found</div>
          <div style={{ fontSize: 12 }}>Try a different search term</div>
        </div>
      )}
    </div>
  )
}

// ── FAVORITES ────────────────────────────────────────────────────────
export function FavoritesScreen() {
  const navigate = useNavigate()
  const { artworks, favorites, toggleFavorite, t, viewArtwork } = useApp()
  const favs = artworks.filter(a => favorites.includes(a.id))
  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.favorites}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{favs.length} saved artworks</div>
      </motion.div>
      {favs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <Heart size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', color: 'var(--warm-tan)' }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: 'var(--mid-text)', marginBottom: 8 }}>{t.noFavorites}</div>
          <button onClick={() => navigate('/artworks')} className="btn btn-outline">{t.browseArtworks}</button>
        </div>
      ) : (
        <div className="artwork-grid">
          {favs.map((art, i) => (
            <motion.div key={art.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}
              initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .05 }}
              onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }} whileHover={{ y: -4 }}>
              <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
                <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250,246,238,.88)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Heart size={12} fill="var(--accent-rust)" stroke="var(--accent-rust)" />
                </button>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
                <div style={{ fontSize: 10, color: 'var(--accent-rust)', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); if(art.artistId) navigate('/artist/' + art.artistId) }}>
                  {art.artist}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
