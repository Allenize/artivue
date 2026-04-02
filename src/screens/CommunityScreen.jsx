import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Flag, Plus, X, Send, Image } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ImageUpload from '../components/ImageUpload'

function PostCard({ post, onLike, onComment, onReport, currentUser }) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const isLiked = currentUser && post.likes.includes(currentUser.id)
  const timeAgo = (t) => { const d = Date.now() - t; if (d < 3600000) return `${Math.floor(d / 60000)}m ago`; if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`; return `${Math.floor(d / 86400000)}d ago` }

  return (
    <motion.div className="card" style={{ overflow: 'hidden', marginBottom: 12 }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        {post.image ? <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: post.gradient || 'linear-gradient(135deg,var(--warm-tan),var(--accent-rust))' }} />}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(250,246,238,.88)', backdropFilter: 'blur(4px)', borderRadius: 20, padding: '5px 10px' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 600 }}>{post.userInitials}</div>
            <span style={{ fontSize: 11, color: 'var(--dark-text)', fontWeight: 500 }}>{post.userName}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 9, color: 'rgba(255,255,255,.8)', background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: '3px 8px' }}>{timeAgo(post.time)}</div>
      </div>

      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: 4 }}>{post.title}</div>
        <div style={{ fontSize: 12, color: 'var(--mid-text)', lineHeight: 1.6, marginBottom: 10 }}>{post.description}</div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => onLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: isLiked ? 'rgba(196,98,45,.1)' : 'var(--beige)', border: `1px solid ${isLiked ? 'var(--accent-rust)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 11, color: isLiked ? 'var(--accent-rust)' : 'var(--mid-text)', transition: 'all .2s' }}>
            <Heart size={12} fill={isLiked ? 'var(--accent-rust)' : 'none'} stroke={isLiked ? 'var(--accent-rust)' : 'var(--mid-text)'} />{post.likes.length}
          </button>
          <button onClick={() => setShowComments(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--beige)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 11, color: 'var(--mid-text)' }}>
            <MessageCircle size={12} />{post.comments.length}
          </button>
          <button onClick={() => onReport(post.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            <Flag size={11} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10 }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>{c.userName[0]}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--dark-text)', marginRight: 6 }}>{c.userName}</span>
                      <span style={{ fontSize: 11, color: 'var(--mid-text)' }}>{c.text}</span>
                    </div>
                  </div>
                ))}
                {currentUser && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…"
                      style={{ flex: 1, background: 'var(--beige)', border: '1px solid var(--border)', borderRadius: 20, padding: '7px 14px', fontFamily: 'Jost,sans-serif', fontSize: 12, color: 'var(--dark-text)', outline: 'none' }}
                      onKeyDown={e => { if (e.key === 'Enter' && comment.trim()) { onComment(post.id, comment); setComment('') } }} />
                    <button onClick={() => { if (comment.trim()) { onComment(post.id, comment); setComment('') } }}
                      style={{ background: 'var(--accent-rust)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <Send size={13} stroke="#fff" />
                    </button>
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
  const { community, currentUser, likePost, deletePost, addPost, addComment, addNotification, t } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image: null })
  const approved = community.filter(p => p.status === 'approved')

  const handlePost = () => {
    if (!form.title.trim()) return
    addPost({ title: form.title, description: form.description, image: form.image, gradient: `linear-gradient(135deg,hsl(${Math.random()*360},60%,40%),hsl(${Math.random()*360},60%,60%))` })
    setForm({ title: '', description: '', image: null })
    setShowForm(false)
    addNotification('Your artwork has been submitted for review! 🎨')
  }

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 26, fontWeight: 300, color: 'var(--dark-text)', marginBottom: 4 }}>{t.community}</div>
          <div style={{ fontSize: 11, color: 'var(--light-text)' }}>{approved.length} community artworks</div>
        </div>
        {currentUser && (
          <button onClick={() => setShowForm(s => !s)} className="btn btn-rust" style={{ flexShrink: 0 }}>
            {showForm ? <><X size={12} />{t.cancel}</> : <><Plus size={12} />{t.postArt}</>}
          </button>
        )}
      </motion.div>

      {!currentUser && (
        <div style={{ background: 'rgba(43,79,160,.07)', border: '1px solid rgba(43,79,160,.2)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: '1.5rem', fontSize: 12, color: 'var(--info)', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent-rust)', textDecoration: 'none', fontWeight: 500 }}>Log in</a> to share your own artwork with the community
        </div>
      )}

      {/* Post form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: 'var(--dark-text)', marginBottom: '1rem' }}>Share Your Artwork</div>
            <ImageUpload value={form.image} onChange={img => setForm(f => ({ ...f, image: img }))} label="Artwork Image" height={180} />
            <input className="field" placeholder="Artwork Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className="field" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ minHeight: 70 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handlePost} className="btn btn-primary">Submit for Review</button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">{t.cancel}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {approved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--light-text)' }}>
          <Image size={40} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: .4 }} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20 }}>No community posts yet</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Be the first to share your artwork!</div>
        </div>
      ) : (
        approved.map(post => (
          <PostCard key={post.id} post={post} currentUser={currentUser}
            onLike={likePost} onComment={addComment}
            onReport={() => addNotification('Post reported. Thank you.')} />
        ))
      )}
    </div>
  )
}
