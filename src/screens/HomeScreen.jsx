import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ChevronRight, ChevronLeft, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FACTS = [
  "The Mona Lisa has no visible eyebrows — it was fashionable to shave them in Renaissance Florence.",
  "Van Gogh only sold one painting during his lifetime: The Red Vineyard, for 400 francs.",
  "Picasso could draw before he could walk, and his first word was 'piz' — short for lápiz (pencil in Spanish).",
  "Monet had cataracts while painting the later Water Lilies — his blurry vision may have enhanced their dreamy quality.",
  "Frida Kahlo survived a near-fatal bus accident and spent her recovery painting her first self-portraits.",
]

function ArtCard({ art, onFav, isFav, onClick }) {
  return (
    <motion.div className="card" style={{ cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}
      onClick={onClick} whileHover={{ y: -4 }}>
      <div style={{ height: 130, position: 'relative', overflow: 'hidden' }}>
        {art.image
          ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
        <button onClick={e => { e.stopPropagation(); onFav(art.id) }}
          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250,246,238,.88)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Heart size={12} fill={isFav ? 'var(--accent-rust)' : 'none'} stroke={isFav ? 'var(--accent-rust)' : 'var(--mid-text)'} />
        </button>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2 }}>{art.title}</div>
        <div style={{ fontSize: 10, color: 'var(--accent-rust)', margin: '3px 0' }}>{art.artist}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="tag">{art.category}</span>
          <span style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { artworks, artists, favorites, toggleFavorite, t, viewArtwork } = useApp()
  const [slide, setSlide] = useState(0)
  const [factIdx] = useState(Math.floor(Math.random() * FACTS.length))
  const [catFilter, setCatFilter] = useState('All')

  const featured = artworks.filter(a => a.featured).slice(0, 5)
  const cats = ['All', ...new Set(artworks.map(a => a.category))]
  const filtered = catFilter === 'All' ? artworks.slice(0, 8) : artworks.filter(a => a.category === catFilter).slice(0, 8)

  const nextSlide = useCallback(() => setSlide(s => (s + 1) % (featured.length || 1)), [featured.length])
  const prevSlide = useCallback(() => setSlide(s => (s - 1 + (featured.length || 1)) % (featured.length || 1)), [featured.length])

  useEffect(() => {
    if (!featured.length) return
    const t = setInterval(nextSlide, 4500)
    return () => clearInterval(t)
  }, [nextSlide, featured.length])

  const currentArt = featured[slide]

  return (
    <div className="page">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)' }}>Discover Art</div>
          <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 2 }}>{artworks.length} masterpieces in our collection</div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .08 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 16px', marginBottom: '1.2rem', cursor: 'text' }}
        onClick={() => navigate('/explore')} whileHover={{ borderColor: 'var(--accent-rust)' }}>
        <Search size={15} strokeWidth={1.5} style={{ color: 'var(--light-text)' }} />
        <span style={{ fontSize: 13, color: 'var(--light-text)' }}>{t.search}</span>
      </motion.div>

      {/* ── CAROUSEL ── */}
      {featured.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}
          style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 280, marginBottom: '1.8rem', cursor: 'pointer', background: currentArt?.gradient }}
          onClick={() => { viewArtwork(currentArt.id); navigate(`/artwork/${currentArt.id}`) }}>

          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}
              style={{ position: 'absolute', inset: 0 }}>
              {currentArt?.image
                ? <img src={currentArt.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: currentArt?.gradient }} />}
            </motion.div>
          </AnimatePresence>

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.1) 100%)' }} />

          {/* Text overlay */}
          <AnimatePresence mode="wait">
            <motion.div key={`txt-${slide}`} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}
              style={{ position: 'absolute', bottom: 24, left: 24, right: 80 }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,.7)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 6 }}>{t.featuredArtwork}</div>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#FAF0DC', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 4 }}>{currentArt?.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,224,200,.8)' }}>{currentArt?.artist} · {currentArt?.year}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)', borderRadius: 20, padding: '5px 14px', marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,.9)' }}>
                {t.viewArtwork} <ChevronRight size={11} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev/Next */}
          <button onClick={e => { e.stopPropagation(); prevSlide() }}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); nextSlide() }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5 }}>
            {featured.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setSlide(i) }}
                style={{ width: i === slide ? 18 : 6, height: 6, borderRadius: 3, background: i === slide ? '#FAF0DC' : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── ARTISTS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>{t.artists}</div>
        <button onClick={() => navigate('/artists')} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-rust)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>See all <ChevronRight size={11} /></button>
      </div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: '1.8rem' }}>
        {artists.map((artist, i) => (
          <motion.div key={artist.id} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            onClick={() => navigate('/artists')}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 + i * .04 }}
            whileHover={{ y: -3 }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', position: 'relative' }}>
              {artist.image
                ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: artist.color || artist.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--mid-text)', textAlign: 'center', maxWidth: 60, lineHeight: 1.3 }}>{artist.short}</div>
          </motion.div>
        ))}
      </div>

      {/* ── DID YOU KNOW ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
        style={{ background: 'linear-gradient(135deg,rgba(184,150,12,.08),rgba(196,98,45,.08))', border: '1px solid rgba(184,150,12,.25)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: '1.8rem', display: 'flex', gap: 12 }}>
        <Star size={18} strokeWidth={1.5} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 4 }}>{t.didYouKnow}</div>
          <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.65 }}>{FACTS[factIdx]}</div>
        </div>
      </motion.div>

      {/* ── ARTWORKS ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>{t.artworks}</div>
        <button onClick={() => navigate('/artworks')} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-rust)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>See all <ChevronRight size={11} /></button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 11, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: catFilter === cat ? 'var(--dark-text)' : 'var(--card-bg)', color: catFilter === cat ? 'var(--cream)' : 'var(--mid-text)', borderColor: catFilter === cat ? 'transparent' : 'var(--border)' }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="artwork-grid" style={{ marginBottom: '2rem' }}>
        {filtered.map((art, i) => (
          <motion.div key={art.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 + i * .04 }}>
            <ArtCard art={art} isFav={favorites.includes(art.id)} onFav={toggleFavorite} onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
