import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ChevronRight, ChevronLeft, Star } from 'lucide-react'
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
      </div>
    </motion.div>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { artworks, artists, favorites, toggleFavorite, t, viewArtwork, loadData, dataLoading } = useApp()
  const [slide, setSlide] = useState(0)
  const [factIdx] = useState(Math.floor(Math.random() * FACTS.length))
  const [catFilter, setCatFilter] = useState('All')
  const artistScrollRef = useRef(null)
  const topRef = useRef(null)
  const pullStartY = useRef(null)
  const [refreshing, setRefreshing] = useState(false)

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

  // Overscroll-up pull-to-refresh
  useEffect(() => {
    const el = topRef.current
    if (!el) return

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) pullStartY.current = e.touches[0].clientY
      else pullStartY.current = null
    }
    const onTouchEnd = async (e) => {
      if (pullStartY.current === null) return
      const diff = e.changedTouches[0].clientY - pullStartY.current
      if (diff > 80 && !refreshing && !dataLoading) {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
      }
      pullStartY.current = null
    }
    const onWheel = async (e) => {
      if (el.scrollTop === 0 && e.deltaY < -60 && !refreshing && !dataLoading) {
        setRefreshing(true)
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

  const currentArt = featured[slide]

  return (
    <div ref={topRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Refresh indicator */}
      <AnimatePresence>
        {refreshing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 32 }} exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 11, color: 'var(--accent-rust)', gap: 6 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 13, height: 13, border: '2px solid var(--accent-rust)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            Refreshing…
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)' }}>Discover Art</div>
          <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 2 }}>{artworks.length} masterpieces · pull down to refresh</div>
        </motion.div>

        {/* Search → navigate to Explore */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .08 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 16px', marginBottom: '1.2rem', cursor: 'pointer' }}
          onClick={() => navigate('/explore')} whileHover={{ borderColor: 'var(--accent-rust)' }}>
          <Search size={15} strokeWidth={1.5} style={{ color: 'var(--light-text)' }} />
          <span style={{ fontSize: 13, color: 'var(--light-text)' }}>{t.search}</span>
        </motion.div>

        {/* Carousel */}
        {featured.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}
            style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 260, marginBottom: '1.8rem', cursor: 'pointer' }}
            onClick={() => { viewArtwork(currentArt.id); navigate(`/artwork/${currentArt.id}`) }}>
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}
                style={{ position: 'absolute', inset: 0, background: currentArt?.gradient || '#222' }}>
                {currentArt?.image && <img src={currentArt.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </motion.div>
            </AnimatePresence>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,.65),rgba(0,0,0,.1))' }} />
            <AnimatePresence mode="wait">
              <motion.div key={`txt-${slide}`} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', bottom: 22, left: 22, right: 70 }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,.7)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 5 }}>{t.featuredArtwork}</div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#FAF0DC', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 4 }}>{currentArt?.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,224,200,.8)' }}>{currentArt?.artist} · {currentArt?.year}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)', borderRadius: 20, padding: '5px 12px', marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,.9)' }}>
                  {t.viewArtwork} <ChevronRight size={11} />
                </div>
              </motion.div>
            </AnimatePresence>
            <button onClick={e => { e.stopPropagation(); prevSlide() }}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={e => { e.stopPropagation(); nextSlide() }}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <ChevronRight size={14} />
            </button>
            <div style={{ position: 'absolute', bottom: 10, right: 14, display: 'flex', gap: 4 }}>
              {featured.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setSlide(i) }}
                  style={{ width: i === slide ? 16 : 5, height: 5, borderRadius: 3, background: i === slide ? '#FAF0DC' : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Artists — no chevrons, scrollable, no scrollbar, responsive count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>{t.artists}</div>
          <button onClick={() => navigate('/artists')} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-rust)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            See all <ChevronRight size={11} />
          </button>
        </div>

        <div ref={artistScrollRef}
          style={{ display: 'flex', gap: 16, overflowX: 'auto', marginBottom: '1.8rem', paddingBottom: 4, scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {artists.map((artist, i) => (
            <motion.div key={artist.id}
              style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer',
                width: 'clamp(48px, 13vw, 68px)' }}
              onClick={() => navigate('/artists')}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .04 + i * .03 }}
              whileHover={{ y: -2 }}>
              <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0, transition: 'border-color .2s' }}>
                {artist.image
                  ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(11px,3.5vw,17px)', color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
              </div>
              <div style={{ fontSize: 'clamp(8px,2vw,10px)', color: 'var(--mid-text)', textAlign: 'center', lineHeight: 1.3, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.short || artist.name}</div>
            </motion.div>
          ))}
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

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 4 }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 11, fontFamily: 'Jost,sans-serif', cursor: 'pointer', border: '1px solid', transition: 'all .2s', background: catFilter === cat ? 'var(--dark-text)' : 'var(--card-bg)', color: catFilter === cat ? 'var(--cream)' : 'var(--mid-text)', borderColor: catFilter === cat ? 'transparent' : 'var(--border)' }}>
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

        <div style={{ textAlign: 'center', paddingBottom: '1rem', fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .5 }}>
          ↑ Pull down to refresh
        </div>
      </div>
    </div>
  )
}
