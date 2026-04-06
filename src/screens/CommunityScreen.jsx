import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Flag, Plus, X, Send, Image,
  Search, SlidersHorizontal, Share2, Clock, TrendingUp, Sparkles, ChevronDown
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ImageUpload from '../components/ImageUpload'

// ─── helpers ────────────────────────────────────────────────────────────────
const timeAgo = (t) => {
  const d = Date.now() - t
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`
  return `${Math.floor(d / 86400000)}d ago`
}

// ─── PostCard ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onComment, onReport, currentUser }) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [shared, setShared] = useState(false)
  const isLiked = currentUser && post.likes.includes(currentUser.id)

  const handleShare = () => {
    const text = `Check out "${post.title}" by ${post.userName} on Artivue!`
    if (navigator.share) {
      navigator.share({ title: post.title, text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
    }
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <motion.div
      className="card"
      style={{ overflow: 'hidden', marginBottom: 12 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        {post.image
          ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: post.gradient || 'linear-gradient(135deg,var(--warm-tan),var(--accent-rust))' }} />
        }
        {/* Author badge */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(250,246,238,.88)', backdropFilter: 'blur(4px)', borderRadius: 20, padding: '5px 10px' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 600 }}>
              {post.userInitials}
            </div>
            <span style={{ fontSize: 11, color: 'var(--dark-text)', fontWeight: 500 }}>{post.userName}</span>
          </div>
        </div>
        {/* Timestamp */}
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, color: 'rgba(255,255,255,.8)', background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: '3px 8px' }}>
          {timeAgo(post.time)}
        </div>
      </div>

      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: 4 }}>
          {post.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.6, marginBottom: 10 }}>
          {post.description}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: isLiked ? 'rgba(196,98,45,.1)' : 'var(--beige)', border: `1px solid ${isLiked ? 'var(--accent-rust)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 11, color: isLiked ? 'var(--accent-rust)' : 'var(--mid-text)', transition: 'all .2s' }}
          >
            <Heart size={12} fill={isLiked ? 'var(--accent-rust)' : 'none'} stroke={isLiked ? 'var(--accent-rust)' : 'var(--mid-text)'} />
            {post.likes.length}
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: showComments ? 'rgba(43,79,160,.08)' : 'var(--beige)', border: `1px solid ${showComments ? 'rgba(43,79,160,.3)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 11, color: 'var(--mid-text)' }}
          >
            <MessageCircle size={12} />
            {post.comments.length}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: shared ? 'rgba(42,122,90,.1)' : 'var(--beige)', border: `1px solid ${shared ? 'rgba(42,122,90,.4)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 11, color: shared ? 'var(--success)' : 'var(--mid-text)', transition: 'all .2s' }}
          >
            <Share2 size={12} />
            {shared ? 'Copied!' : 'Share'}
          </button>

          {/* Report */}
          <button
            onClick={() => onReport(post.id)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}
          >
            <Flag size={11} />
          </button>
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10 }}>
                {post.comments.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--light-text)', textAlign: 'center', padding: '8px 0' }}>
                    No comments yet. Be the first!
                  </div>
                )}
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>
                      {c.userName[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--dark-text)', marginRight: 6 }}>{c.userName}</span>
                      <span style={{ fontSize: 11, color: 'var(--mid-text)' }}>{c.text}</span>
                      <div style={{ fontSize: 9, color: 'var(--light-text)', marginTop: 2 }}>{timeAgo(c.time || Date.now())}</div>
                    </div>
                  </div>
                ))}
                {currentUser ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment…"
                      style={{ flex: 1, background: 'var(--beige)', border: '1px solid var(--border)', borderRadius: 20, padding: '7px 14px', fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none' }}
                      onKeyDown={e => { if (e.key === 'Enter' && comment.trim()) { onComment(post.id, comment); setComment('') } }}
                    />
                    <button
                      onClick={() => { if (comment.trim()) { onComment(post.id, comment); setComment('') } }}
                      style={{ background: 'var(--accent-rust)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <Send size={13} stroke="#fff" />
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: 'var(--light-text)', textAlign: 'center', padding: '8px 0' }}>
                    <a href="/login" style={{ color: 'var(--accent-rust)', textDecoration: 'none' }}>Log in</a> to comment
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

// ─── PendingBanner ────────────────────────────────────────────────────────────
function PendingBanner({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(196,98,45,.07)', border: '1px solid rgba(196,98,45,.25)', borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: post.gradient || 'var(--warm-tan)' }}>
        {post.image && <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 13, fontStyle: 'italic', color: 'var(--dark-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
        <div style={{ fontSize: 10, color: 'var(--accent-rust)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={9} /> Pending admin approval
        </div>
      </div>
    </motion.div>
  )
}

// ─── SORT options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest', icon: Sparkles },
  { id: 'popular', label: 'Most Liked', icon: TrendingUp },
  { id: 'discussed', label: 'Most Discussed', icon: MessageCircle },
]

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const { community, currentUser, likePost, deletePost, addPost, addComment, addNotification, t } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image: null })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // ── BUG FIX: always pass status:'pending' so AdminScreen can see it ──────────
  const handlePost = () => {
    if (!form.title.trim()) return
    addPost({
      title: form.title,
      description: form.description,
      image: form.image,
      gradient: `linear-gradient(135deg,hsl(${Math.random() * 360},60%,40%),hsl(${Math.random() * 360},60%,60%))`,
      status: 'pending',           // ← critical fix
      likes: [],
      comments: [],
      time: Date.now(),
    })
    setForm({ title: '', description: '', image: null })
    setShowForm(false)
    addNotification('Your artwork has been submitted for review! 🎨')
  }

  const approved = community.filter(p => p.status === 'approved')
  const myPending = currentUser
    ? community.filter(p => p.status === 'pending' && p.userId === currentUser.id)
    : []

  // Filter + sort
  const filtered = useMemo(() => {
    let list = approved
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.userName?.toLowerCase().includes(q)
      )
    }
    if (sort === 'popular') list = [...list].sort((a, b) => b.likes.length - a.likes.length)
    else if (sort === 'discussed') list = [...list].sort((a, b) => b.comments.length - a.comments.length)
    else list = [...list].sort((a, b) => b.time - a.time)
    return list
  }, [approved, search, sort])

  const SortIcon = SORT_OPTIONS.find(s => s.id === sort)?.icon || Sparkles

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}
      >
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>
            {t.community}
          </div>
          <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{approved.length} community artworks</div>
        </div>
        {currentUser && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-rust" style={{ flexShrink: 0 }}>
            {showForm ? <><X size={12} />{t.cancel}</> : <><Plus size={12} />{t.postArt}</>}
          </button>
        )}
      </motion.div>

      {/* Not logged in nudge */}
      {!currentUser && (
        <div style={{ background: 'rgba(43,79,160,.07)', border: '1px solid rgba(43,79,160,.2)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: '1rem', fontSize: 12, color: 'var(--info)', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent-rust)', textDecoration: 'none', fontWeight: 500 }}>Log in</a> to share your own artwork with the community
        </div>
      )}

      {/* My pending posts */}
      {myPending.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent-rust)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={10} /> Your submissions awaiting review
          </div>
          {myPending.map(p => <PendingBanner key={p.id} post={p} />)}
        </motion.div>
      )}

      {/* Post form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '1.5rem' }}
          >
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: '1rem' }}>
              Share Your Artwork
            </div>
            <ImageUpload value={form.image} onChange={img => setForm(f => ({ ...f, image: img }))} label="Artwork Image" height={180} />
            <input
              className="field"
              placeholder="Artwork Title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <textarea
              className="field"
              placeholder="Tell us about your piece…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ minHeight: 70 }}
            />
            <div style={{ fontSize: 10, color: 'var(--light-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> Posts are reviewed before appearing publicly.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handlePost} className="btn btn-primary" disabled={!form.title.trim()}>
                Submit for Review
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">{t.cancel}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Sort bar */}
      {approved.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--light-text)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search artworks, artists…"
              style={{ width: '100%', paddingLeft: 34, paddingRight: 12, height: 36, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortMenu(s => !s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '0 14px', height: 36, cursor: 'pointer', fontSize: 11, color: 'var(--mid-text)', whiteSpace: 'nowrap' }}
            >
              <SortIcon size={12} />
              {SORT_OPTIONS.find(s => s.id === sort)?.label}
              <ChevronDown size={11} />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{ position: 'absolute', right: 0, top: 42, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px', zIndex: 10, minWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}
                >
                  {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => { setSort(id); setShowSortMenu(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', background: sort === id ? 'rgba(196,98,45,.08)' : 'none', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12, color: sort === id ? 'var(--accent-rust)' : 'var(--mid-text)', fontFamily: 'Jost,sans-serif', textAlign: 'left' }}
                    >
                      <Icon size={12} />{label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Results count when searching */}
      {search.trim() && (
        <div style={{ fontSize: 11, color: 'var(--light-text)', marginBottom: 10 }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </div>
      )}

      {/* Empty states */}
      {approved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--light-text)' }}>
          <Image size={40} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .4 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20 }}>No community posts yet</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Be the first to share your artwork!</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--light-text)' }}>
          <Search size={32} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .4 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18 }}>No results found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search term</div>
        </div>
      ) : (
        filtered.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={likePost}
            onComment={addComment}
            onReport={() => addNotification('Post reported. Thank you for keeping the community safe.')}
          />
        ))
      )}
    </div>
  )
}
