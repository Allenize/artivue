import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import ArtivueLogo from '../components/ArtivueLogo'
import { useApp } from '../context/AppContext'

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { notifications } = useApp()

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--beige)' }} className="main-area">
        {/* Mobile topbar */}
        <div className="mobile-topbar" style={{ display: 'none', padding: '13px 16px', background: 'var(--cream)', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark-text)', display: 'flex' }}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <ArtivueLogo size={26} />
          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--dark-text)' }}>
            Artivue
          </span>
        </div>

        {/* Notifications toast */}
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence>
            {notifications.map(n => (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 20, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
                style={{ background: 'var(--dark-text)', color: 'var(--cream)', padding: '10px 16px', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,.2)', maxWidth: 280 }}
              >
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
        @media(min-width:769px){.main-area{margin-left:240px}}
        @media(max-width:768px){.mobile-topbar{display:flex!important}}
      `}</style>
    </div>
  )
}
