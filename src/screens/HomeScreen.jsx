import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ChevronRight, ChevronLeft, Star, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FACTS = [
  "The Mona Lisa has no visible eyebrows — it was fashionable to shave them in Renaissance Florence.",
  "Van Gogh only sold one painting during his lifetime: The Red Vineyard, for 400 francs.",
  "Picasso could draw before he could walk, and his first word was 'piz' (pencil in Spanish).",
  "Monet had cataracts while painting the later Water Lilies series.",
  "Frida Kahlo made 55 self-portraits during her lifetime.",
  "Rembrandt created over 80 self-portraits — more than any other artist in history.",
  "The Sistine Chapel ceiling took Michelangelo 4 years to paint.",
]

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
        <div key={i} title={color} style={{ width: 13, height: 13, borderRadius: '50%', background: color, border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
      ))}
    </div>
  )
}

function ArtCard({ art, onFav, isFav, onClick }) {
  return (
    <motion.div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={onClick} whileHover={{ y: -4 }}>
      <div style={{ height: 130, position: 'relative', overflow: 'hidden' }}>
        {art.image
          ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: art.gradient || '#ccc' }} />}
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
        {art.image && <ColorDots imageUrl={art.image} />}
      </div>
    </motion.div>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { artworks, artists, favorites, toggleFavorite, t, viewArtwork, loadData, dataLoading } = useApp()
  const [slide, setSlide] = useState(0)
  const [factIdx, setFactIdx] = useState(Math.floor(Math.random() * FACTS.length))
  const [catFilter, setCatFilter] = useState('All')
  const [refreshing, setRefreshing] = useState(false)
  const artistScrollRef = useRef(null)
  const pageRef = useRef(null)

  const featured = artworks.filter(a => a.featured).slice(0, 5)
  const cats = ['All', ...new Set(artworks.map(a => a.category).filter(Boolean))]
  const filtered = catFilter === 'All' ? artworks.slice(0, 8) : artworks.filter(a => a.category === catFilter).slice(0, 8)

  const nextSlide = useCallback(() => setSlide(s => (s + 1) % (featured.length || 1)), [featured.length])
  const prevSlide = useCallback(() => setSlide(s => (s - 1 + (featured.length || 1)) % (featured.length || 1)), [featured.length])

  useEffect(() => {
    if (!featured.length) return
    const timer = setInterval(nextSlide, 4500)
    return () => clearInterval(timer)
  }, [nextSlide, featured.length])

  // ── OVERSCROLL UP REFRESH ──────────────────────────────────────────
  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    let startY = 0
    let pulling = false

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY
      pulling = el.scrollTop === 0
    }
    const onTouchEnd = async (e) => {
      if (!pulling) return
      const diff = e.changedTouches[0].clientY - startY
      if (diff > 80 && !refreshing && !dataLoading) {
        setRefreshing(true)
        setFactIdx(Math.floor(Math.random() * FACTS.length))
        await loadData()
        setRefreshing(false)
      }
    }

    // Desktop: detect overscroll at top with wheel
    const onWheel = async (e) => {
      if (el.scrollTop === 0 && e.deltaY < -60 && !refreshing && !dataLoading) {
        setRefreshing(true)
        setFactIdx(Math.floor(Math.random() * FACTS.length))
        await loadData()
        setRefreshing(false)
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [loadData, refreshing, dataLoading])

  // ── ARTIST SCROLL BUTTONS ─────────────────────────────────────────
  const scrollArtists = (dir) => {
    if (!artistScrollRef.current) return
    const el = artistScrollRef.current
    const scrollAmount = el.clientWidth * 0.8
    el.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' })
  }

  const currentArt = featured[slide]

  return (
    <div ref={pageRef} className="page" style={{ overflowY: 'auto', height: '100%' }}>

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {refreshing && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '8px 0', marginBottom: 8, fontSize: 11, color: 'var(--accent-rust)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={13} strokeWidth={1.5} />
            </motion.div>
            Refreshing…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)' }}>Discover Art</div>
          <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 2 }}>{artworks.length} masterpieces in our collection</div>
        </div>
        <motion.button onClick={async () => { setRefreshing(true); await loadData(); setRefreshing(false) }}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--mid-text)', fontFamily: 'Jost,sans-serif' }}
          whileTap={{ scale: 0.95 }}>
          <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw size={13} strokeWidth={1.5} />
          </motion.div>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </motion.button>
      </motion.div>

      {/* Search bar → goes to explore */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .08 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 16px', marginBottom: '1.2rem', cursor: 'text' }}
        onClick={() => navigate('/explore')} whileHover={{ borderColor: 'var(--accent-rust)' }}>
        <Search size={15} strokeWidth={1.5} style={{ color: 'var(--light-text)' }} />
        <span style={{ fontSize: 13, color: 'var(--light-text)' }}>{t.search}</span>
      </motion.div>

      {/* Carousel */}
      {featured.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}
          style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 280, marginBottom: '1.8rem', cursor: 'pointer' }}
          onClick={() => { viewArtwork(currentArt.id); navigate(`/artwork/${currentArt.id}`) }}>
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}
              style={{ position: 'absolute', inset: 0, background: currentArt?.gradient || '#222' }}>
              {currentArt?.image && <img src={currentArt.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </motion.div>
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.1) 100%)' }} />
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
          <button onClick={e => { e.stopPropagation(); prevSlide() }}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); nextSlide() }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <ChevronRight size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5 }}>
            {featured.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setSlide(i) }}
                style={{ width: i === slide ? 18 : 6, height: 6, borderRadius: 3, background: i === slide ? '#FAF0DC' : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Artists — responsive scrollable with chevrons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>{t.artists}</div>
        <button onClick={() => navigate('/artists')} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-rust)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          See all <ChevronRight size={11} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.8rem' }}>
        {/* Left chevron */}
        <motion.button onClick={() => scrollArtists(-1)}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mid-text)', flexShrink: 0 }}
          whileTap={{ scale: 0.9 }} whileHover={{ borderColor: 'var(--accent-rust)', color: 'var(--accent-rust)' }}>
          <ChevronLeft size={14} />
        </motion.button>

        {/* Scrollable artists row */}
        <div ref={artistScrollRef} style={{ flex: 1, display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
          <style>{`.artist-scroll::-webkit-scrollbar{display:none}`}</style>
          {artists.map((artist, i) => (
            <motion.div key={artist.id}
              style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', scrollSnapAlign: 'start',
                width: 'clamp(52px, 14vw, 70px)' }}
              onClick={() => navigate('/artists')}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 + i * .03 }}
              whileHover={{ y: -3 }}>
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0 }}>
                {artist.image
                  ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(12px,4vw,18px)', color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
              </div>
              <div style={{ fontSize: 'clamp(8px,2.5vw,10px)', color: 'var(--mid-text)', textAlign: 'center', lineHeight: 1.3, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.short || artist.name}</div>
            </motion.div>
          ))}
        </div>

        {/* Right chevron */}
        <motion.button onClick={() => scrollArtists(1)}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mid-text)', flexShrink: 0 }}
          whileTap={{ scale: 0.9 }} whileHover={{ borderColor: 'var(--accent-rust)', color: 'var(--accent-rust)' }}>
          <ChevronRight size={14} />
        </motion.button>
      </div>

      {/* Did You Know */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
        style={{ background: 'linear-gradient(135deg,rgba(184,150,12,.08),rgba(196,98,45,.08))', border: '1px solid rgba(184,150,12,.25)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: '1.8rem', display: 'flex', gap: 12 }}>
        <Star size={18} strokeWidth={1.5} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 4 }}>{t.didYouKnow}</div>
          <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.65 }}>{FACTS[factIdx]}</div>
        </div>
      </motion.div>

      {/* Artworks */}
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

      {/* Pull to refresh hint */}
      <div style={{ textAlign: 'center', padding: '0 0 2rem', fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
        ↑ Scroll up to refresh
      </div>
    </div>
  )
}
