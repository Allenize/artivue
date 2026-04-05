import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Heart, MapPin, Calendar, Layers, Ruler, Eye, ThumbsUp, Share2, Send, MessageCircle, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

function extractColors(imageUrl, count = 8) {
  return new Promise((resolve) => {
    if (!imageUrl) { resolve([]); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 80; canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data
      const colorMap = {}
      for (let i = 0; i < data.length; i += 12) {
        const r = Math.round(data[i] / 28) * 28
        const g = Math.round(data[i+1] / 28) * 28
        const b = Math.round(data[i+2] / 28) * 28
        if (data[i+3] < 128) continue
        const key = `${r},${g},${b}`
        colorMap[key] = (colorMap[key] || 0) + 1
      }
      const sorted = Object.entries(colorMap).sort((a,b) => b[1]-a[1]).slice(0, count).map(([k]) => {
        const [r,g,b] = k.split(',')
        const toHex = n => parseInt(n).toString(16).padStart(2,'0')
        return { rgb: `rgb(${r},${g},${b})`, hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase() }
      })
      resolve(sorted)
    }
    img.onerror = () => resolve([])
    img.src = imageUrl
  })
}

export default function ArtworkDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { artworks, artists, favorites, toggleFavorite, likeArtwork, addArtworkComment, currentUser, t } = useApp()
  const art = artworks.find(a => a.id === id) || artworks[0]
  const artist = artists.find(a => a.id === art?.artistId)
  const isFav = favorites.includes(art?.id)
  const isLiked = currentUser && art?.likes?.includes(currentUser.uid)
  const related = artworks.filter(a => a.id !== art?.id && (a.artistId === art?.artistId || a.category === art?.category)).slice(0, 4)
  const [colors, setColors] = useState([])
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [copied, setCopied] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const pageRef = useRef(null)

  useEffect(() => {
    if (art?.image) extractColors(art.image, 8).then(setColors)
    else setColors([])
  }, [art?.image])

  // Reading progress bar
  useEffect(() => {
    const el = pageRef.current?.closest('.main-area') || window
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable > 0) setReadProgress((window.scrollY / scrollable) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: art.title, text: `Check out "${art.title}" by ${art.artist} on Artivue`, url }) }
      catch(e) {}
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleComment = () => {
    if (!comment.trim()) return
    addArtworkComment(id, comment)
    setComment('')
  }

  const readingTime = art?.description ? Math.ceil(art.description.split(' ').length / 200) : 1

  if (!art) return <div style={{ padding: '2rem' }}>Artwork not found.</div>

  return (
    <div ref={pageRef} style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'var(--border)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--accent-rust)', width: `${readProgress}%`, transition: 'width .1s', borderRadius: 1 }} />
      </div>

      {/* Hero */}
      <div style={{ height: 320, position: 'relative', overflow: 'hidden' }}>
        {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,.6))' }} />

        <div style={{ position: 'absolute', top: 18, left: 18, display: 'flex', gap: 8 }}>
          <motion.button style={{ background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--dark-text)', fontFamily: 'Jost,sans-serif' }}
            onClick={() => navigate(-1)} whileTap={{ scale: .95 }}>
            <ArrowLeft size={13} /> Back
          </motion.button>
        </div>

        <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', gap: 8 }}>
          <motion.button style={{ background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={handleShare} whileTap={{ scale: .9 }}>
            <Share2 size={14} style={{ color: copied ? 'var(--success)' : 'var(--mid-text)' }} />
          </motion.button>
          <motion.button style={{ background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => toggleFavorite(art.id)} whileTap={{ scale: .9 }}>
            <Heart size={15} fill={isFav ? 'var(--accent-rust)' : 'none'} stroke={isFav ? 'var(--accent-rust)' : 'var(--mid-text)'} />
          </motion.button>
          <motion.button style={{ background: isLiked ? 'var(--accent-rust)' : 'rgba(250,246,238,.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => likeArtwork(art.id)} whileTap={{ scale: .9 }}>
            <ThumbsUp size={14} stroke={isLiked ? '#fff' : 'var(--mid-text)'} />
          </motion.button>
        </div>

        {copied && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 70, right: 18, background: 'var(--dark-text)', color: 'var(--cream)', padding: '6px 12px', borderRadius: 8, fontSize: 11 }}>
            Link copied! ✅
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
          style={{ position: 'absolute', bottom: 22, left: 22 }}>
          <div style={{ display: 'inline-block', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 20, padding: '3px 12px', marginBottom: 8 }}>{art.movement} · {art.year}</div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 32, fontWeight: 300, color: '#FAF0DC', fontStyle: 'italic', lineHeight: 1.1 }}>{art.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,224,200,.85)', marginTop: 5, cursor: 'pointer' }} onClick={() => artist && navigate('/artist/' + artist.id)}>{art.artist}</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} style={{ padding: '1.5rem' }}>
        {/* Stats + Reading time */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--mid-text)' }}><Eye size={13} strokeWidth={1.5} />{art.views || 0} views</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--mid-text)' }}><ThumbsUp size={13} strokeWidth={1.5} />{art.likes?.length || 0} likes</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--mid-text)' }}><MessageCircle size={13} strokeWidth={1.5} />{art.comments?.length || 0} comments</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--light-text)', marginLeft: 'auto' }}><BookOpen size={12} strokeWidth={1.5} />{readingTime} min read</div>
        </div>

        {/* Metadata chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
          {[[Layers, art.medium],[Ruler, art.dimensions],[MapPin, art.location],[Calendar, String(art.year)]].filter(([,v]) => v).map(([Icon, val]) => (
            <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 12px', fontSize: 11, color: 'var(--mid-text)' }}>
              <Icon size={11} strokeWidth={1.5} style={{ color: 'var(--light-text)' }} />{val}
            </div>
          ))}
        </div>

        {/* Color Palette */}
        {colors.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: 10 }}>Color Palette</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: c.rgb, border: '1px solid var(--border)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                  <div style={{ fontSize: 8, color: 'var(--light-text)', letterSpacing: '.04em', fontFamily: 'monospace' }}>{c.hex}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: 10 }}>{t.aboutArtwork}</div>
        <div style={{ fontSize: 13, color: 'var(--mid-text)', lineHeight: 1.85, borderLeft: '2px solid var(--warm-tan)', paddingLeft: 14, marginBottom: '1.5rem' }}>{art.description}</div>

        {/* Fun fact */}
        {art.fact && (
          <div style={{ background: 'rgba(184,150,12,.07)', border: '1px solid rgba(184,150,12,.2)', borderRadius: 12, padding: '14px 16px', marginBottom: '1.5rem', display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: 4 }}>{t.didYouKnow}</div>
              <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.6 }}>{art.fact}</div>
            </div>
          </div>
        )}

        {/* Tags */}
        {art.tags?.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>{art.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>}

        {/* Artist profile */}
        {artist && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: 10 }}>{t.artistProfile}</div>
            <motion.div className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}
              onClick={() => navigate('/artist/' + artist.id)} whileHover={{ x: 2 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                {artist.image ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, fontStyle: 'italic', color: 'var(--dark-text)' }}>{artist.name}</div>
                <div style={{ fontSize: 10, color: 'var(--accent-gold)', marginBottom: 6 }}>{artist.era}</div>
                <div style={{ fontSize: 12, color: 'var(--light-text)', lineHeight: 1.6 }}>{artist.bio?.substring(0, 130)}…</div>
              </div>
              <ArrowLeft size={13} style={{ transform: 'rotate(180deg)', color: 'var(--accent-rust)', flexShrink: 0, marginTop: 4 }} />
            </motion.div>
          </div>
        )}

        {/* Comments section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageCircle size={12} /> Comments ({art.comments?.length || 0})
            </div>
            <button onClick={() => setShowComments(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--accent-rust)' }}>
              {showComments ? 'Hide' : 'Show'}
            </button>
          </div>
          {showComments && (
            <div>
              {art.comments?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {art.comments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 600, flexShrink: 0 }}>
                        {c.userName?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--dark-text)', marginBottom: 2 }}>{c.userName}</div>
                        <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.5 }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--light-text)', textAlign: 'center', padding: '1rem', marginBottom: 12 }}>No comments yet. Be the first!</div>
              )}
              {currentUser ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…"
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '9px 16px', fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none' }} />
                  <motion.button onClick={handleComment} style={{ background: 'var(--accent-rust)', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                    whileTap={{ scale: .9 }}>
                    <Send size={14} stroke="#fff" />
                  </motion.button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--light-text)', textAlign: 'center', padding: '.8rem', background: 'var(--card-bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--accent-rust)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log in</span> to leave a comment
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related artworks */}
        {related.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: 10 }}>{t.relatedArtworks}</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {related.map(w => (
                <motion.div key={w.id} style={{ flexShrink: 0, width: 110, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--card-bg)' }}
                  onClick={() => navigate(`/artwork/${w.id}`)} whileHover={{ y: -3 }}>
                  <div style={{ height: 75, overflow: 'hidden' }}>
                    {w.image ? <img src={w.image} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: w.gradient }} />}
                  </div>
                  <div style={{ padding: '7px 8px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 12, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2 }}>{w.title}</div>
                    <div style={{ fontSize: 9, color: 'var(--light-text)', marginTop: 2 }}>{w.year}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
