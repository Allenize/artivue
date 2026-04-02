import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArtivueLogo from '../components/ArtivueLogo'

export default function SplashScreen() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/login', { replace: true }), 2800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', backgroundImage: 'radial-gradient(circle at 30% 70%,rgba(196,98,45,.07),transparent 60%),radial-gradient(circle at 70% 30%,rgba(184,150,12,.07),transparent 60%)' }}>
      <motion.div initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18, delay: .1 }}>
        <ArtivueLogo size={120} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .6 }} style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 46, fontWeight: 300, color: 'var(--dark-text)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: '1.2rem', textAlign: 'center' }}>
        Artivue
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75, duration: .6 }} style={{ fontSize: 11, color: 'var(--light-text)', letterSpacing: '.2em', marginTop: '.5rem', textTransform: 'uppercase' }}>
        A Digital Art Museum
      </motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 1.2, ease: 'easeInOut' }} style={{ marginTop: '2.5rem', width: 80, height: 1.5, background: 'linear-gradient(90deg,transparent,var(--accent-rust),transparent)', transformOrigin: 'left' }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0,1,0] }} transition={{ delay: 1.8, duration: .8, repeat: Infinity }} style={{ marginTop: '1.5rem', fontSize: 10, color: 'var(--light-text)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
        Loading…
      </motion.div>
    </div>
  )
}
