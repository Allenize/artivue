import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Image, Users, Users2, LogOut, Plus, Edit2, Trash2, X, Save, Check, Eye, ThumbsUp, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ImageUpload from '../components/ImageUpload'
import ArtivueLogo from '../components/ArtivueLogo'

const GRADIENTS = [
  'linear-gradient(160deg,#0B1A3A,#1A3A7A,#2A5A9A)',
  'linear-gradient(135deg,#6B4F1A,#D4A017,#E8C547)',
  'linear-gradient(160deg,#3A4A2A,#6B7A4A,#A89070)',
  'linear-gradient(135deg,#1A3A5A,#2A7A5A,#8ABCAA)',
  'linear-gradient(135deg,#2A2A2A,#4A4A5A,#6A6A7A)',
  'linear-gradient(135deg,#1A3A1A,#4A6A2A,#8A7A3A)',
  'linear-gradient(135deg,#3A1A3A,#7A2A7A,#C4622D)',
  'linear-gradient(135deg,#1A2A3A,#2A5A8A,#4A9AC4)',
]
const DEFAULT_MOVEMENTS = ['Renaissance','Post-Impressionism','Impressionism','Cubism','Surrealism','Abstract','Baroque','Romanticism','Modern']
const DEFAULT_CATEGORIES = ['Portrait','Landscape','Still Life','Abstract','Historical','Religious']
const COLORS = ['#7A4B1A','#2B4FA0','#6B3A8B','#2A7A5A','#8B6A2A','#A03A3A','#4A8B6A','#8B3A6A','#3A6A8B']

function TagManager({ label, items, onAdd, onDelete }) {
  const [newItem, setNewItem] = useState('')
  return (
    <div style={{ marginBottom: '.65rem' }}>
      <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {items.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--beige)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--mid-text)' }}>
            {item}
            <button onClick={() => onDelete(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)', display: 'flex', padding: 0, marginLeft: 2 }}>
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          className="field"
          placeholder={`Add new ${label.toLowerCase()}…`}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { onAdd(newItem.trim()); setNewItem('') } }}
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button
          onClick={() => { if (newItem.trim()) { onAdd(newItem.trim()); setNewItem('') } }}
          style={{ background: 'var(--dark-text)', color: 'var(--cream)', border: 'none', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontSize: 11, fontFamily: 'Jost,sans-serif', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} strokeWidth={1.5} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontFamily: 'Cormorant Garamond,serif', color: 'var(--dark-text)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--accent-gold)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function ArtworkForm({ artwork, artists, categories, movements, onSave, onCancel }) {
  const [f, setF] = useState(artwork || { title: '', artist: '', artistId: '', year: new Date().getFullYear(), movement: movements[0] || '', category: categories[0] || '', medium: 'Oil on canvas', dimensions: '', location: '', gradient: GRADIENTS[0], accent: '#A0C0F0', description: '', tags: '', fact: '', image: null, featured: false })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: '1rem' }}>
        {artwork ? 'Edit Artwork' : 'New Artwork'}
      </div>
      <ImageUpload value={f.image} onChange={v => set('image', v)} label="Artwork Image" height={160} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
        <input className="field" placeholder="Title *" value={f.title} onChange={e => set('title', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Artist Name" value={f.artist} onChange={e => set('artist', e.target.value)} style={{ marginBottom: 0 }} />
        <select className="field" value={f.artistId} onChange={e => set('artistId', e.target.value)} style={{ marginBottom: 0 }}>
          <option value="">Link to Artist Profile</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input className="field" type="number" placeholder="Year" value={f.year} onChange={e => set('year', +e.target.value)} style={{ marginBottom: 0 }} />
        <select className="field" value={f.movement} onChange={e => set('movement', e.target.value)} style={{ marginBottom: 0 }}>{movements.map(m => <option key={m}>{m}</option>)}</select>
        <select className="field" value={f.category} onChange={e => set('category', e.target.value)} style={{ marginBottom: 0 }}>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <input className="field" placeholder="Medium" value={f.medium} onChange={e => set('medium', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Dimensions" value={f.dimensions} onChange={e => set('dimensions', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Museum / Location" value={f.location} onChange={e => set('location', e.target.value)} style={{ marginBottom: 0, gridColumn: 'span 2' }} />
      </div>
      <textarea className="field" placeholder="Description *" value={f.description} onChange={e => set('description', e.target.value)} style={{ marginTop: '.65rem', marginBottom: 0 }} />
      <textarea className="field" placeholder="Fun fact (Did you know?)" value={f.fact} onChange={e => set('fact', e.target.value)} style={{ marginTop: '.65rem', marginBottom: 0, minHeight: 55 }} />
      <input className="field" placeholder="Tags (comma separated)" value={f.tags} onChange={e => set('tags', e.target.value)} style={{ marginTop: '.65rem', marginBottom: 0 }} />

      <div style={{ marginTop: '.8rem' }}>
        <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Background Gradient (if no image)</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {GRADIENTS.map((g, i) => <div key={i} onClick={() => set('gradient', g)} style={{ width: 44, height: 28, borderRadius: 6, background: g, cursor: 'pointer', border: f.gradient === g ? '2.5px solid var(--accent-rust)' : '2.5px solid transparent', transition: 'border .2s' }} />)}
        </div>
      </div>

      <div style={{ marginTop: '.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="featured" checked={f.featured} onChange={e => set('featured', e.target.checked)} style={{ cursor: 'pointer' }} />
        <label htmlFor="featured" style={{ fontSize: 12, color: 'var(--mid-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} />Feature in carousel</label>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
        <button onClick={() => onSave({ ...f, tags: typeof f.tags === 'string' ? f.tags.split(',').map(t => t.trim()).filter(Boolean) : f.tags })} className="btn btn-primary"><Save size={12} />Save</button>
        <button onClick={onCancel} className="btn btn-ghost"><X size={12} />Cancel</button>
      </div>
    </motion.div>
  )
}

function ArtistForm({ artist, onSave, onCancel }) {
  const [f, setF] = useState(artist || { name: '', short: '', initials: '', color: COLORS[0], era: '', nationality: '', bio: '', image: null, gradient: GRADIENTS[2] })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: '1rem' }}>
        {artist ? 'Edit Artist' : 'New Artist'}
      </div>
      <ImageUpload value={f.image} onChange={v => set('image', v)} label="Artist Profile Image" height={140} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
        <input className="field" placeholder="Full Name *" value={f.name} onChange={e => set('name', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Short Name (e.g. Van Gogh)" value={f.short} onChange={e => set('short', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Initials (e.g. VG)" value={f.initials} onChange={e => set('initials', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Nationality" value={f.nationality} onChange={e => set('nationality', e.target.value)} style={{ marginBottom: 0 }} />
        <input className="field" placeholder="Era (e.g. Post-Impressionism · 1853–1890)" value={f.era} onChange={e => set('era', e.target.value)} style={{ marginBottom: 0, gridColumn: 'span 2' }} />
      </div>
      <textarea className="field" placeholder="Biography *" value={f.bio} onChange={e => set('bio', e.target.value)} style={{ marginTop: '.65rem', marginBottom: 0 }} />
      <div style={{ marginTop: '.8rem' }}>
        <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Avatar Color</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {COLORS.map(c => <div key={c} onClick={() => set('color', c)} style={{ width: 26, height: 26, borderRadius: '50%', background: c, cursor: 'pointer', border: f.color === c ? '3px solid var(--accent-rust)' : '3px solid transparent', transition: 'border .2s' }} />)}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 12, color: '#fff', fontStyle: 'italic' }}>{f.initials || '?'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
        <button onClick={() => onSave(f)} className="btn btn-primary"><Save size={12} />Save</button>
        <button onClick={onCancel} className="btn btn-ghost"><X size={12} />Cancel</button>
      </div>
    </motion.div>
  )
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'artworks', label: 'Artworks', icon: Image },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'community', label: 'Community', icon: Users2 },
]

export default function AdminScreen() {
  const navigate = useNavigate()
  const { artworks, artists, community, addArtwork, updateArtwork, deleteArtwork, addArtist, updateArtist, deleteArtist, approvePost, deletePost, logout, currentUser, addNotification } = useApp()
  const [tab, setTab] = useState('dashboard')
  const [artworkForm, setArtworkForm] = useState(null)
  const [artistForm, setArtistForm] = useState(null)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [movements, setMovements] = useState(DEFAULT_MOVEMENTS)

  const addCategory = (cat) => { if (!categories.includes(cat)) setCategories(p => [...p, cat]) }
  const deleteCategory = (cat) => setCategories(p => p.filter(c => c !== cat))
  const addMovement = (mov) => { if (!movements.includes(mov)) setMovements(p => [...p, mov]) }
  const deleteMovement = (mov) => setMovements(p => p.filter(m => m !== mov))

  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/login'); return null
  }

  const pending = community.filter(p => p.status === 'pending')
  const approved = community.filter(p => p.status === 'approved')
  const topViewed = [...artworks].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3)
  const topLiked = [...artworks].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 3)

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--beige)' }}>
      {/* Admin sidebar */}
      <div style={{ width: 220, background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }} className="admin-side">
        <div style={{ padding: '1.8rem 1.5rem 1.2rem', borderBottom: '1px solid rgba(237,230,214,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArtivueLogo size={30} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 13, color: 'var(--sidebar-text)', letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>Admin<br />Panel</div>
        </div>
        <div style={{ padding: '.5rem 0', flex: 1 }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 1.5rem', background: tab === id ? 'rgba(237,230,214,.06)' : 'none', border: 'none', borderLeft: `2px solid ${tab === id ? 'var(--accent-gold)' : 'transparent'}`, color: tab === id ? 'var(--sidebar-text)' : 'rgba(237,230,214,.4)', fontSize: 12, fontFamily: 'Jost,sans-serif', letterSpacing: '.06em', cursor: 'pointer', transition: 'all .2s', textAlign: 'left' }}>
              <Icon size={14} strokeWidth={1.5} />{label}
              {id === 'community' && pending.length > 0 && <span style={{ marginLeft: 'auto', background: 'var(--accent-rust)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600 }}>{pending.length}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(237,230,214,.08)' }}>
          <button onClick={() => { logout(); navigate('/login') }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: '1px solid rgba(196,98,45,.3)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--accent-rust)', fontSize: 11, fontFamily: 'Jost,sans-serif', letterSpacing: '.08em' }}>
            <LogOut size={12} />Logout
          </button>
          <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: '1px solid rgba(237,230,214,.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'rgba(237,230,214,.5)', fontSize: 11, fontFamily: 'Jost,sans-serif', letterSpacing: '.08em', marginTop: 6 }}>
            ← Back to App
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 220, padding: '2rem', overflowY: 'auto', minHeight: '100dvh' }} className="admin-main">
        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Dashboard</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard label="Total Artworks" value={artworks.length} icon={Image} color="var(--accent-rust)" />
              <StatCard label="Total Artists" value={artists.length} icon={Users} color="var(--accent-gold)" />
              <StatCard label="Community Posts" value={approved.length} icon={Users2} color="var(--info)" sub={`${pending.length} pending`} />
              <StatCard label="Total Views" value={artworks.reduce((s, a) => s + (a.views || 0), 0)} icon={Eye} color="var(--success)" />
              <StatCard label="Total Likes" value={artworks.reduce((s, a) => s + (a.likes?.length || 0), 0)} icon={ThumbsUp} color="#8B3A8B" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.2rem' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={12} />Most Viewed</div>
                {topViewed.map(art => (
                  <div key={art.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                      {art.image ? <img src={art.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, fontStyle: 'italic', color: 'var(--dark-text)' }}>{art.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.artist}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mid-text)', fontWeight: 500 }}>{art.views || 0}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.2rem' }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><ThumbsUp size={12} />Most Liked</div>
                {topLiked.map(art => (
                  <div key={art.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                      {art.image ? <img src={art.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, fontStyle: 'italic', color: 'var(--dark-text)' }}>{art.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.artist}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--mid-text)', fontWeight: 500 }}>{art.likes?.length || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ARTWORKS */}
        {tab === 'artworks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Category & Movement Manager */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dark-text)', marginBottom: '1rem' }}>Manage Categories & Movements</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <TagManager label="Categories" items={categories} onAdd={addCategory} onDelete={deleteCategory} />
                <TagManager label="Movements / Eras" items={movements} onAdd={addMovement} onDelete={deleteMovement} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)' }}>Artworks <span style={{ fontSize: 14, fontStyle: 'normal', color: 'var(--light-text)' }}>({artworks.length})</span></div>
              <button onClick={() => setArtworkForm('new')} className="btn btn-primary"><Plus size={12} />Add Artwork</button>
            </div>
            <AnimatePresence>{artworkForm === 'new' && <ArtworkForm artists={artists} categories={categories} movements={movements} onSave={d => { addArtwork(d); setArtworkForm(null); addNotification('Artwork added! ✨') }} onCancel={() => setArtworkForm(null)} />}</AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {artworks.map(art => (
                <div key={art.id}>
                  <AnimatePresence>{artworkForm?.id === art.id && <ArtworkForm artwork={artworkForm} artists={artists} categories={categories} movements={movements} onSave={d => { updateArtwork(d); setArtworkForm(null); addNotification('Artwork updated!') }} onCancel={() => setArtworkForm(null)} />}</AnimatePresence>
                  {artworkForm?.id !== art.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        {art.image ? <img src={art.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: art.gradient }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)' }}>{art.title}</span>
                          {art.featured && <span className="badge badge-gold"><Star size={9} />Featured</span>}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--light-text)' }}>{art.artist} · {art.year} · {art.movement}</div>
                        <div style={{ fontSize: 10, color: 'var(--mid-text)', marginTop: 2 }}>{art.views || 0} views · {art.likes?.length || 0} likes</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setArtworkForm(art)} className="btn btn-ghost btn-sm"><Edit2 size={11} /></button>
                        <button onClick={() => { if (confirm(`Delete "${art.title}"?`)) { deleteArtwork(art.id); addNotification('Artwork deleted.') } }} className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ARTISTS */}
        {tab === 'artists' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)' }}>Artists <span style={{ fontSize: 14, fontStyle: 'normal', color: 'var(--light-text)' }}>({artists.length})</span></div>
              <button onClick={() => setArtistForm('new')} className="btn btn-primary"><Plus size={12} />Add Artist</button>
            </div>
            <AnimatePresence>{artistForm === 'new' && <ArtistForm onSave={d => { addArtist(d); setArtistForm(null); addNotification('Artist added! 🎨') }} onCancel={() => setArtistForm(null)} />}</AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {artists.map(artist => (
                <div key={artist.id}>
                  <AnimatePresence>{artistForm?.id === artist.id && <ArtistForm artist={artistForm} onSave={d => { updateArtist(d); setArtistForm(null); addNotification('Artist updated!') }} onCancel={() => setArtistForm(null)} />}</AnimatePresence>
                  {artistForm?.id !== artist.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border)' }}>
                        {artist.image ? <img src={artist.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: artist.color || artist.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: '#fff', fontStyle: 'italic' }}>{artist.initials}</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)' }}>{artist.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--light-text)' }}>{artist.era} · {artist.nationality}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setArtistForm(artist)} className="btn btn-ghost btn-sm"><Edit2 size={11} /></button>
                        <button onClick={() => { if (confirm(`Delete "${artist.name}"?`)) { deleteArtist(artist.id); addNotification('Artist deleted.') } }} className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMMUNITY MODERATION */}
        {tab === 'community' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: '1.5rem' }}>Community Moderation</div>

            {pending.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent-rust)', marginBottom: '.8rem' }}>Pending Approval ({pending.length})</div>
                {pending.map(post => (
                  <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', gap: 12, background: 'var(--card-bg)', border: '1px solid rgba(196,98,45,.3)', borderRadius: 'var(--r-md)', padding: '14px', marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      {post.image ? <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: post.gradient || 'var(--warm-tan)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontStyle: 'italic', color: 'var(--dark-text)' }}>{post.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--mid-text)' }}>by {post.userName}</div>
                      <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 2 }}>{post.description?.substring(0, 80)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { approvePost(post.id); addNotification('Post approved!') }} className="btn btn-success btn-sm"><Check size={11} />Approve</button>
                      <button onClick={() => { deletePost(post.id); addNotification('Post removed.') }} className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dark-text)', margin: '1.5rem 0 .8rem' }}>Approved Posts ({approved.length})</div>
            {approved.map(post => (
              <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: 'flex', gap: 12, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 8, alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  {post.image ? <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: post.gradient || 'var(--warm-tan)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 14, fontStyle: 'italic', color: 'var(--dark-text)' }}>{post.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--light-text)' }}>by {post.userName} · {post.likes.length} likes · {post.comments.length} comments</div>
                </div>
                <button onClick={() => { deletePost(post.id); addNotification('Post removed.') }} className="btn btn-danger btn-sm"><Trash2 size={11} /></button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-side{width:100%!important;height:auto;position:relative;flex-direction:row;flex-wrap:wrap}
          .admin-main{margin-left:0!important;padding:1rem}
        }
      `}</style>
    </div>
  )
}
