import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Flag, Plus, X, Send, Image,
  Search, Share2, Clock, TrendingUp, Sparkles, ChevronDown,
  Palette, BookOpen
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ImageUpload from '../components/ImageUpload'

const timeAgo = (t) => {
  if (!t) return ''
  const ms = t?.seconds ? t.seconds * 1000 : t
  const d = Date.now() - ms
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`
  return `${Math.floor(d / 86400000)}d ago`
}

const SORT_OPTIONS = [
  { id: 'newest',    label: 'Newest',         icon: Sparkles       },
  { id: 'popular',   label: 'Most Liked',     icon: TrendingUp     },
  { id: 'discussed', label: 'Most Discussed', icon: MessageCircle  },
]

function StatPill({ icon: Icon, value, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px' }}>
      <Icon size={13} style={{ color }} />
      <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, color: 'var(--dark-text)' }}>{value}</span>
      <span style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.06em' }}>{label}</span>
    </div>
  )
}

function PendingBanner({ post }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(196,98,45,.07)', border: '1px dashed rgba(196,98,45,.4)', borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: post.gradient || 'var(--warm-tan)' }}>
        {post.image && <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 13, fontStyle: 'italic', color: 'var(--dark-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
        <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={9} /> Awaiting admin approval...
        </div>
      </div>
      <span style={{ fontSize: 9, background: 'rgba(196,98,45,.12)', color: 'var(--accent-rust)', border: '1px solid rgba(196,98,45,.25)', borderRadius: 20, padding: '3px 10px', letterSpacing: '.08em', flexShrink: 0 }}>PENDING</span>
    </motion.div>
  )
}

function PostCard({ post, onLike, onComment, onReport, currentUser }) {
  const [showComments, setShowComments] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const [comment, setComment] = useState('')
  const [shared, setShared] = useState(false)
  const isLiked = currentUser && post.likes?.includes(currentUser.uid || currentUser.id)
  const desc = post.description || ''

  const handleShare = () => {
    const text = `Check out "${post.title}" by ${post.userName} on Artivue!`
    if (navigator.share) navigator.share({ title: post.title, text }).catch(() => {})
    else navigator.clipboard?.writeText(text)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <motion.div className="card" style={{ overflow: 'hidden', marginBottom: 14 }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
        {post.image
          ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: post.gradient || 'linear-gradient(135deg,var(--warm-tan),var(--accent-rust))' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 55%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(250,246,238,.9)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '5px 11px' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>{post.userInitials}</div>
            <span style={{ fontSize: 11, color: 'var(--dark-text)', fontWeight: 500 }}>{post.userName}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, color: 'rgba(255,255,255,.85)', background: 'rgba(0,0,0,.35)', borderRadius: 10, padding: '3px 9px', backdropFilter: 'blur(4px)' }}>
          {timeAgo(post.createdAt || post.time)}
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: '#FAF0DC', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,.5)' }}>{post.title}</div>
        </div>
      </div>

      <div style={{ padding: '12px 14px 14px' }}>
        {desc && (
          <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.7, marginBottom: 10 }}>
            {showFull || desc.length <= 100 ? desc : desc.slice(0, 100) + '...'}
            {desc.length > 100 && (
              <span onClick={() => setShowFull(s => !s)} style={{ color: 'var(--accent-rust)', cursor: 'pointer', fontSize: 11, marginLeft: 4 }}>
                {showFull ? ' show less' : ' read more'}
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onLike(post.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: isLiked ? 'rgba(196,98,45,.12)' : 'var(--beige)', border: `1px solid ${isLiked ? 'var(--accent-rust)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 13px', cursor: 'pointer', fontSize: 11, color: isLiked ? 'var(--accent-rust)' : 'var(--mid-text)', transition: 'all .2s' }}>
            <Heart size={12} fill={isLiked ? 'var(--accent-rust)' : 'none'} stroke={isLiked ? 'var(--accent-rust)' : 'var(--mid-text)'} />
            {post.likes?.length || 0}
          </button>
          <button onClick={() => setShowComments(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: showComments ? 'rgba(43,79,160,.08)' : 'var(--beige)', border: `1px solid ${showComments ? 'rgba(43,79,160,.3)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 13px', cursor: 'pointer', fontSize: 11, color: showComments ? 'var(--info)' : 'var(--mid-text)' }}>
            <MessageCircle size={12} />
            {post.comments?.length || 0}
          </button>
          <button onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: shared ? 'rgba(42,122,90,.1)' : 'var(--beige)', border: `1px solid ${shared ? 'rgba(42,122,90,.4)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 13px', cursor: 'pointer', fontSize: 11, color: shared ? 'var(--success)' : 'var(--mid-text)', transition: 'all .2s' }}>
            <Share2 size={12} />
            {shared ? 'Copied!' : 'Share'}
          </button>
          <button onClick={() => onReport(post.id)} title="Report"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)', padding: 4 }}>
            <Flag size={12} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
                {(!post.comments || post.comments.length === 0) && (
                  <div style={{ fontSize: 11, color: 'var(--light-text)', textAlign: 'center', padding: '10px 0' }}>No comments yet</div>
                )}
                {post.comments?.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0, fontWeight: 600 }}>{c.userName?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--dark-text)' }}>{c.userName}</span>
                        <span style={{ fontSize: 9, color: 'var(--light-text)' }}>{timeAgo(c.time)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--mid-text)', marginTop: 2, lineHeight: 1.5 }}>{c.text}</div>
                    </div>
                  </div>
                ))}
                {currentUser ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..."
                      style={{ flex: 1, background: 'var(--beige)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 16px', fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none' }}
                      onKeyDown={e => { if (e.key === 'Enter' && comment.trim()) { onComment(post.id, comment); setComment('') } }} />
                    <button onClick={() => { if (comment.trim()) { onComment(post.id, comment); setComment('') } }}
                      style={{ background: 'var(--accent-rust)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <Send size={13} color="#fff" />
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--light-text)', textAlign: 'center', paddingTop: 8 }}>
                    <a href="/login" style={{ color: 'var(--accent-rust)', textDecoration: 'none', fontWeight: 500 }}>Log in</a> to comment
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function CommunityScreen() {
  const { community, currentUser, likePost, addPost, addComment, addNotification, t } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image: null })
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const approved = community.filter(p => p.status === 'approved')
  const myPending = currentUser
    ? community.filter(p => p.status === 'pending' && (p.userId === currentUser.uid || p.userId === currentUser.id))
    : []

  const handlePost = async () => {
    if (!form.title.trim() || submitting) return
    setSubmitting(true)
    try {
      await addPost({ title: form.title.trim(), description: form.description.trim(), image: form.image })
      setForm({ title: '', description: '', image: null })
      setShowForm(false)
      addNotification('Submitted for review! Admin will approve it shortly.')
    } catch (e) {
      addNotification('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  const filtered = useMemo(() => {
    let list = [...approved]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.userName?.toLowerCase().includes(q)
      )
    }
    if (sort === 'popular') list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    else if (sort === 'discussed') list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
    else list.sort((a, b) => {
      const ta = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.time || 0)
      const tb = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.time || 0)
      return tb - ta
    })
    return list
  }, [approved, search, sort])

  const totalLikes = approved.reduce((s, p) => s + (p.likes?.length || 0), 0)
  const totalComments = approved.reduce((s, p) => s + (p.comments?.length || 0), 0)
  const SortIcon = SORT_OPTIONS.find(s => s.id === sort)?.icon || Sparkles

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontWeight: 300, color: 'var(--dark-text)', lineHeight: 1.1 }}>{t.community}</div>
            <div style={{ fontSize: 11, color: 'var(--light-text)', marginTop: 3 }}>A gallery of community artworks</div>
          </div>
          {currentUser && (
            <button onClick={() => setShowForm(s => !s)} className="btn btn-rust" style={{ flexShrink: 0 }}>
              {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> Share Art</>}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatPill icon={Palette} value={approved.length} label="artworks" color="var(--accent-rust)" />
          <StatPill icon={Heart} value={totalLikes} label="likes" color="#e05c8a" />
          <StatPill icon={BookOpen} value={totalComments} label="comments" color="var(--info)" />
        </div>
      </motion.div>

      {!currentUser && (
        <div style={{ background: 'rgba(43,79,160,.07)', border: '1px solid rgba(43,79,160,.2)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: '1rem', fontSize: 12, color: 'var(--info)', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent-rust)', textDecoration: 'none', fontWeight: 500 }}>Log in</a> to share your own artwork
        </div>
      )}

      {myPending.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent-rust)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={10} /> Your submissions awaiting review ({myPending.length})
          </div>
          {myPending.map(p => <PendingBanner key={p.id} post={p} />)}
        </motion.div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: '1rem' }}>Share Your Artwork</div>
            <ImageUpload value={form.image} onChange={img => setForm(f => ({ ...f, image: img }))} label="Artwork Image" height={180} />
            <input className="field" placeholder="Artwork Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className="field" placeholder="Tell us about your piece... (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 75 }} />
            <div style={{ fontSize: 10, color: 'var(--light-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 5, background: 'var(--beige)', borderRadius: 8, padding: '8px 12px' }}>
              <Clock size={11} style={{ color: 'var(--accent-rust)', flexShrink: 0 }} />
              Your post will appear publicly after admin approval.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handlePost} className="btn btn-primary" disabled={!form.title.trim() || submitting} style={{ opacity: (!form.title.trim() || submitting) ? .5 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--light-text)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artworks or artists..."
            style={{ width: '100%', paddingLeft: 34, paddingRight: 12, height: 38, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowSortMenu(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '0 14px', height: 38, cursor: 'pointer', fontSize: 11, color: 'var(--mid-text)', whiteSpace: 'nowrap' }}>
            <SortIcon size={12} />
            {SORT_OPTIONS.find(s => s.id === sort)?.label}
            <ChevronDown size={11} />
          </button>
          <AnimatePresence>
            {showSortMenu && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                style={{ position: 'absolute', right: 0, top: 44, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px', zIndex: 20, minWidth: 160, boxShadow: '0 6px 24px rgba(0,0,0,.1)' }}>
                {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => { setSort(id); setShowSortMenu(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', background: sort === id ? 'rgba(196,98,45,.08)' : 'none', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: sort === id ? 'var(--accent-rust)' : 'var(--mid-text)', fontFamily: 'Jost,sans-serif', textAlign: 'left' }}>
                    <Icon size={13} /> {label}
                    {sort === id && <span style={{ marginLeft: 'auto' }}>checkmark</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {search.trim() && (
        <div style={{ fontSize: 11, color: 'var(--light-text)', marginBottom: 10 }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </div>
      )}

      {approved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--light-text)' }}>
          <Palette size={44} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .3 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22 }}>No community posts yet</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Be the first to share your artwork!</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--light-text)' }}>
          <Search size={32} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .4 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18 }}>No results found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search term</div>
        </div>
      ) : (
        filtered.map(post => (
          <PostCard key={post.id} post={post} currentUser={currentUser}
            onLike={likePost} onComment={addComment}
            onReport={() => addNotification('Post reported. Thank you.')} />
        ))
      )}
    </div>
  )
}
