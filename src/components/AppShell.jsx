import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import ArtivueLogo from './ArtivueLogo'
import { useApp } from '../context/AppContext'

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { notifications } = useApp()

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
          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 16, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>
            Artivue
          </span>
        </div>

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
    </div>
  )
}
