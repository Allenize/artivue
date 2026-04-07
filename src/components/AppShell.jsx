import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Shield } from 'lucide-react'
import Sidebar from './Sidebar'
import ArtivueLogo from './ArtivueLogo'
import { useApp } from '../context/AppContext'

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { notifications, currentUser } = useApp()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="main-area">
        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark-text)', display: 'flex', flexShrink: 0 }}>
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <ArtivueLogo size={28} />
          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--dark-text)', flex: 1 }}>
            Artistic Vision
          </span>
          {/* Admin back button — only for admins */}
          {currentUser?.role === 'admin' && (
            <motion.button
              onClick={() => navigate('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(184,150,12,.12)', border: '1px solid rgba(184,150,12,.3)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: 'var(--accent-gold)', fontSize: 10, fontFamily: 'Jost,sans-serif', letterSpacing: '.06em', textTransform: 'uppercase', flexShrink: 0 }}
              whileTap={{ scale: .95 }}>
              <Shield size={11} /> Admin
            </motion.button>
          )}
        </div>

        {/* Admin back button for desktop — shown in sidebar bottom already, but also show as floating badge */}
        {currentUser?.role === 'admin' && (
          <div style={{ position: 'fixed', bottom: 24, left: 260, zIndex: 100 }} className="admin-float-btn">
            <motion.button
              onClick={() => navigate('/admin')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent-gold)', border: 'none', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', color: '#fff', fontSize: 11, fontFamily: 'Jost,sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(184,150,12,.4)' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Shield size={13} /> Admin Panel
            </motion.button>
          </div>
        )}

        {/* Toast notifications */}
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
          <AnimatePresence>
            {notifications.map(n => (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 20, scale: .9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: .9 }}
                style={{ background: 'var(--dark-text)', color: 'var(--cream)', padding: '10px 16px', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>
                {n.msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .2 }}>
          <Outlet />
        </motion.div>
      </div>

      <style>{`
        @media(max-width:768px) { .admin-float-btn { display: none !important; } }
        @media(min-width:769px) { .admin-float-btn { left: 260px; } }
      `}</style>
    </div>
  )
}
