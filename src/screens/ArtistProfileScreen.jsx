import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ArtistProfileScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { artists, artworks, favorites, toggleFavorite, viewArtwork } = useApp()
  const artist = artists.find(a => a.id === id)
  const artistWorks = artworks.filter(a => a.artistId === id)

  if (!artist) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: 'var(--mid-text)', marginBottom: 12 }}>Artist not found</div>
      <button onClick={() => navigate('/artists')} className="btn btn-outline">Back to Artists</button>
    </div>
  )

  return (
    <div style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Hero banner */}
      <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: artist.color || '#8B5E3C' }}>
        {artist.image && <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7))' }} />
        <motion.button
          style={{ position: 'absolute', top: 18, left: 18, background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--dark-text)', fontFamily: 'Jost,sans-serif' }}
          onClick={() => navigate(-1)} whileTap={{ scale: .95 }}>
          <ArrowLeft size={13} /> Back
        </motion.button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.8rem', display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,.8)', flexShrink: 0 }}>
            {artist.image
              ? <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', background: artist.color || '#8B5E3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: '#FAF0DC', fontStyle: 'italic', lineHeight: 1.1 }}>{artist.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,224,200,.8)', marginTop: 3 }}>{artist.era} · {artist.nationality}</div>
          </div>
        </div>
      </div>

      <div className="page" style={{ paddingTop: '1.5rem' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 18px', textAlign: 'center', flex: 1, minWidth: 80 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: 'var(--dark-text)' }}>{artistWorks.length}</div>
            <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Works</div>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 18px', textAlign: 'center', flex: 1, minWidth: 80 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: 'var(--dark-text)' }}>{artistWorks.reduce((s, a) => s + (a.likes?.length || 0), 0)}</div>
            <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Likes</div>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 18px', textAlign: 'center', flex: 1, minWidth: 80 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: 'var(--dark-text)' }}>{artistWorks.reduce((s, a) => s + (a.views || 0), 0)}</div>
            <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Views</div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: 10 }}>Biography</div>
        <div style={{ fontSize: 13, color: 'var(--mid-text)', lineHeight: 1.85, borderLeft: '2px solid var(--warm-tan)', paddingLeft: 14, marginBottom: '2rem' }}>{artist.bio}</div>

        {/* Artworks */}
        {artistWorks.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: '1rem' }}>Artworks</div>
            <div className="artwork-grid">
              {artistWorks.map((art, i) => (
                <motion.div key={art.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}
                  onClick={() => { viewArtwork(art.id); navigate(`/artwork/${art.id}`) }} whileHover={{ y: -4 }}>
                  <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                    {art.image ? <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
                    <button onClick={e => { e.stopPropagation(); toggleFavorite(art.id) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250,246,238,.88)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Heart size={12} fill={favorites.includes(art.id) ? 'var(--accent-rust)' : 'none'} stroke={favorites.includes(art.id) ? 'var(--accent-rust)' : 'var(--mid-text)'} />
                    </button>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.2, marginBottom: 3 }}>{art.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="tag">{art.category}</span>
                      <span style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
