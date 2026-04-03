// ── EXPLORE ──────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ExploreScreen() {
  const navigate = useNavigate()
  const { artworks, favorites, toggleFavorite, t, viewArtwork } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [era, setEra] = useState('All')

  const cats = ['All', ...new Set(artworks.map(a => a.category))]
  const eras = ['All', ...new Set(artworks.map(a => a.movement))]

  const filtered = artworks.filter(a => {
    const mQ = !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.artist.toLowerCase().includes(q.toLowerCase()) || a.movement.toLowerCase().includes(q.toLowerCase())
    const mC = cat === 'All' || a.category === cat
    const mE = era === 'All' || a.movement === era
    return mQ && mC && mE
  })

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.explore}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{filtered.length} artworks found</div>
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 16px', marginBottom: '.8rem' }}>
        <Search size={15} strokeWidth={1.5} style={{ color: 'var(--light-text)', flexShrink: 0 }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.search}
          style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Jost,sans-serif', fontSize: 13, color: 'var(--dark-text)', outline: 'none' }} />
        {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}><X size={13} /></button>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, flexWrap: 'wrap' }}>
        {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 10, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: cat === c ? 'var(--dark-text)' : 'var(--card-bg)', color: cat === c ? 'var(--cream)' : 'var(--mid-text)', borderColor: cat === c ? 'transparent' : 'var(--border)' }}>{c}</button>)}
        {eras.filter(e => e !== 'All').map(e => <button key={e} onClick={() => setEra(era === e ? 'All' : e)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 10, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: era === e ? 'var(--accent-rust)' : 'var(--card-bg)', color: era === e ? '#fff' : 'var(--mid-text)', borderColor: era === e ? 'transparent' : 'var(--border)' }}>{e}</button>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {filtered.map((art, i) => (
            <motion.div key={art.id} style={{ display: 'flex', gap: 14, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * .03 }}
              whileHover={{ borderColor: 'var(--accent-rust)', x: 2 }}>
              <div style={{ width: 90, height: 90, flexShrink: 0, overflow: 'hidden' }}>
                {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
              </div>
              <div style={{ flex: 1, padding: '12px 0', minWidth: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
                <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginBottom: 5 }}>{art.artist} · {art.year}</div>
                <div style={{ fontSize: 10, color: 'var(--light-text)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.description}</div>
              </div>
              <div style={{ padding: '12px 12px 0 0' }}>
                <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Heart size={15} fill={favorites.includes(art.id) ? 'var(--accent-rust)' : 'none'} stroke={favorites.includes(art.id) ? 'var(--accent-rust)' : 'var(--light-text)'} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--light-text)' }}>
            <Search size={36} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .4 }} />
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20 }}>No artworks found</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search term</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ARTWORKS GALLERY ─────────────────────────────────────────────────
export function ArtworksScreen() {
  const navigate = useNavigate()
  const { artworks, favorites, toggleFavorite, t, viewArtwork } = useApp()
  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.artworks}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{artworks.length} works in collection</div>
      </motion.div>
      <div className="artwork-grid">
        {artworks.map((art, i) => (
          <motion.div key={art.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
            onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }} whileHover={{ y: -4 }}>
            <div style={{ height: 150, position: 'relative', overflow: 'hidden' }}>
              {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
              <div style={{ position: 'absolute', top: 8, left: 8 }}><span className="tag">{art.category}</span></div>
              <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250,246,238,.88)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Heart size={12} fill={favorites.includes(art.id) ? 'var(--accent-rust)' : 'none'} stroke={favorites.includes(art.id) ? 'var(--accent-rust)' : 'var(--mid-text)'} />
              </button>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
              <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginBottom: 5 }}>{art.artist}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.year}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── ARTISTS ──────────────────────────────────────────────────────────
export function ArtistsScreen() {
  const { artists, artworks, t } = useApp()
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.artists}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{artists.length} artists in collection</div>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {artists.map((artist, i) => {
          const works = artworks.filter(a => a.artistId === artist.id)
          const open = expanded === artist.id
          return (
            <motion.div key={artist.id} className="card" style={{ overflow: 'hidden', borderColor: open ? 'var(--accent-rust)' : 'var(--border)' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' }} onClick={() => setExpanded(open ? null : artist.id)}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                  {artist.image ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: artist.color || artist.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontStyle: 'italic', color: 'var(--dark-text)' }}>{artist.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--light-text)', marginTop: 2 }}>{artist.era} · {artist.nationality}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--mid-text)' }}>{works.length} works</span>
                <motion.span animate={{ rotate: open ? 90 : 0 }} style={{ fontSize: 16, color: 'var(--light-text)' }}>›</motion.span>
              </div>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.8, margin: '14px 0' }}>{artist.bio}</div>
                      {works.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                          {works.map(w => (
                            <div key={w.id} style={{ flexShrink: 0, width: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <div style={{ height: 55, overflow: 'hidden' }}>
                                {w.image ? <img src={w.image} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: w.gradient }} />}
                              </div>
                              <div style={{ padding: '5px 6px', fontSize: 9, color: 'var(--mid-text)', fontStyle: 'italic', fontFamily: 'Cormorant Garamond,serif', lineHeight: 1.2 }}>{w.title}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
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
                <div style={{ fontSize: 10, color: 'var(--accent-rust)' }}>{art.artist}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
