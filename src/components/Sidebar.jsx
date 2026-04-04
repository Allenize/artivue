import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Compass, Image, Heart, Users2, Palette, Sun, Moon, Globe, X, LogOut, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ArtivueLogo from '../components/ArtivueLogo'

const NAV = [
  { icon: Home, key: 'home', path: '/home' },
  { icon: Compass, key: 'explore', path: '/explore' },
  { icon: Image, key: 'artworks', path: '/artworks' },
  { icon: Palette, key: 'artists', path: '/artists' },
  { icon: Users2, key: 'community', path: '/community' },
  { icon: Heart, key: 'favorites', path: '/favorites' },
]

function SidebarContent({ onClose }) {
  const { t, theme, toggleTheme, lang, setLang, currentUser, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ width: 240, height: '100%', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ padding: '1.8rem 1.5rem 1.2rem', borderBottom: '1px solid rgba(237,230,214,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <ArtivueLogo size={34} />
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 15, color: 'var(--sidebar-text)', letterSpacing: '.12em', textTransform: 'uppercase', lineHeight: 1.15 }}>Artivue</div>
        </div>
        {onClose && <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(237,230,214,.4)', cursor: 'pointer' }}><X size={16} /></button>}
      </div>

      {currentUser && (
        <div style={{ padding: '.9rem 1.5rem', borderBottom: '1px solid rgba(237,230,214,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 500, flexShrink: 0 }}>
            {currentUser.initials}
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--sidebar-text)', fontWeight: 500 }}>{currentUser.name}</div>
            <div style={{ fontSize: 9, color: 'rgba(237,230,214,.45)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{currentUser.role}</div>
          </div>
        </div>
      )}

      <nav style={{ padding: '.8rem 0', flex: 1 }}>
        {NAV.map(({ icon: Icon, key, path }) => (
          <NavLink key={path} to={path} onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 1.5rem', fontSize: 12, letterSpacing: '.08em',
              textDecoration: 'none',
              color: isActive ? 'var(--sidebar-text)' : 'rgba(237,230,214,.42)',
              borderLeft: isActive ? '2px solid var(--accent-rust)' : '2px solid transparent',
              background: isActive ? 'rgba(237,230,214,.04)' : 'transparent',
              transition: 'all .2s',
            })}
          >
            <Icon size={14} strokeWidth={1.5} />
            <span style={{ textTransform: 'capitalize' }}>{t[key]}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(237,230,214,.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'rgba(237,230,214,.05)', border: '1px solid rgba(237,230,214,.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'rgba(237,230,214,.6)', fontSize: 11, letterSpacing: '.08em', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}{t.darkMode}</span>
          <div style={{ width: 26, height: 14, borderRadius: 7, background: theme === 'dark' ? 'var(--accent-rust)' : 'rgba(237,230,214,.2)', position: 'relative', transition: 'background .3s' }}>
            <div style={{ position: 'absolute', top: 2, left: theme === 'dark' ? 14 : 2, width: 10, height: 10, borderRadius: '50%', background: 'var(--sidebar-text)', transition: 'left .3s' }} />
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={11} style={{ color: 'rgba(237,230,214,.35)' }} />
          {['en', 'fil'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ flex: 1, background: lang === l ? 'var(--accent-rust)' : 'rgba(237,230,214,.06)', border: 'none', borderRadius: 6, padding: '5px 0', fontSize: 10, color: lang === l ? '#fff' : 'rgba(237,230,214,.4)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.06em', transition: 'all .2s' }}>
              {l === 'en' ? 'EN' : 'FIL'}
            </button>
          ))}
        </div>

        {currentUser ? (
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: '1px solid rgba(196,98,45,.3)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--accent-rust)', fontSize: 11, letterSpacing: '.08em', fontFamily: 'Jost,sans-serif' }}>
            <LogOut size={12} />{t.logout}
          </button>
        ) : (
          <NavLink to="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(237,230,214,.06)', border: '1px solid rgba(237,230,214,.1)', borderRadius: 8, padding: '7px 12px', textDecoration: 'none', color: 'rgba(237,230,214,.6)', fontSize: 11, letterSpacing: '.08em' }}>
            <User size={12} />{t.login}
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, zIndex: 50, display: 'none' }} className="desktop-sidebar">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div style={{ position: 'fixed', inset: 0, background: 'rgba(10,8,5,.7)', zIndex: 98, backdropFilter: 'blur(2px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} />
            <motion.div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, zIndex: 99 }}
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <SidebarContent onClose={onMobileClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media(min-width:769px){.desktop-sidebar{display:block!important}}
      `}</style>
    </>
  )
}
