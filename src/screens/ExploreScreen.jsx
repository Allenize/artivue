import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Heart, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ExploreScreen() {
  const navigate = useNavigate()
  const { artworks, artists, favorites, toggleFavorite, t, viewArtwork } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [era, setEra] = useState('All')
  const [focused, setFocused] = useState(true)
  const [activeTab, setActiveTab] = useState('artworks')

  const cats = ['All', ...new Set(artworks.map(a => a.category).filter(Boolean))]
  const eras = ['All', ...new Set(artworks.map(a => a.movement).filter(Boolean))]

  const filteredArtworks = artworks.filter(a => {
    const mQ = !q || a.title?.toLowerCase().includes(q.toLowerCase()) || a.artist?.toLowerCase().includes(q.toLowerCase()) || a.movement?.toLowerCase().includes(q.toLowerCase())
    const mC = cat === 'All' || a.category === cat
    const mE = era === 'All' || a.movement === era
    return mQ && mC && mE
  })

  const filteredArtists = q ? artists.filter(a =>
    a.name?.toLowerCase().includes(q.toLowerCase()) ||
    a.nationality?.toLowerCase().includes(q.toLowerCase()) ||
    a.era?.toLowerCase().includes(q.toLowerCase())
  ) : []

  const showArtists = q && filteredArtists.length > 0

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.explore}</div>
      </motion.div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--card-bg)',
        border: `1px solid ${focused ? 'var(--accent-rust)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)', padding: '11px 16px', marginBottom: '1rem',
        boxShadow: focused ? '0 0 0 3px rgba(196,98,45,.1)' : 'none',
        transition: 'all .2s',
      }}>
        <Search size={15} strokeWidth={1.5} style={{ color: 'var(--light-text)', flexShrink: 0 }} />
        <input
          autoFocus
          value={q} onChange={e => setQ(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={t.search}
          style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'Jost,sans-serif', fontSize: 13, color: 'var(--dark-text)', outline: 'none' }}
        />
        {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}><X size={13} /></button>}
      </div>

      {/* Artists results - only show when searching */}
      <AnimatePresence>
        {showArtists && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: '1rem' }}>
            <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--light-text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Users size={11} />{t.artists} ({filteredArtists.length})
            </div>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {filteredArtists.map(artist => (
                <motion.div key={artist.id}
                  style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', width: 60 }}
                  onClick={() => navigate('/artist/' + artist.id)}
                  whileHover={{ y: -2 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)' }}>
                    {artist.image
                      ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 16, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--mid-text)', textAlign: 'center', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{artist.short || artist.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--light-text)', textAlign: 'center' }}>{artist.nationality}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '.6rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 10, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: cat === c ? 'var(--dark-text)' : 'var(--card-bg)', color: cat === c ? 'var(--cream)' : 'var(--mid-text)', borderColor: cat === c ? 'transparent' : 'var(--border)' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, flexWrap: 'wrap' }}>
        {eras.filter(e => e !== 'All').map(e => (
          <button key={e} onClick={() => setEra(era === e ? 'All' : e)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 10, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: era === e ? 'var(--accent-rust)' : 'var(--card-bg)', color: era === e ? '#fff' : 'var(--mid-text)', borderColor: era === e ? 'transparent' : 'var(--border)' }}>{e}</button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 11, color: 'var(--light-text)', marginBottom: '1rem' }}>{filteredArtworks.length} artworks found</div>

      {/* Artwork results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {filteredArtworks.map((art, i) => (
            <motion.div key={art.id}
              style={{ display: 'flex', gap: 14, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * .03 }}
              whileHover={{ borderColor: 'var(--accent-rust)', x: 2 }}>
              <div style={{ width: 90, height: 90, flexShrink: 0, overflow: 'hidden' }}>
                {art.image
                  ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: art.gradient || '#ccc' }} />}
              </div>
              <div style={{ flex: 1, padding: '10px 0', minWidth: 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
                <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginBottom: 4, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); if(art.artistId) navigate('/artist/' + art.artistId) }}>{art.artist} · {art.year}</div>
                <div style={{ fontSize: 10, color: 'var(--light-text)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.description}</div>
              </div>
              <div style={{ padding: '10px 12px 0 0' }}>
                <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Heart size={15} fill={favorites.includes(art.id) ? 'var(--accent-rust)' : 'none'} stroke={favorites.includes(art.id) ? 'var(--accent-rust)' : 'var(--light-text)'} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredArtworks.length === 0 && (
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
