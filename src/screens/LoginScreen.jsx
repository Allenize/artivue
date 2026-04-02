import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import ArtivueLogo from '../components/ArtivueLogo'
import { useApp } from '../context/AppContext'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login, register, addNotification } = useApp()
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await login(form.email.trim(), form.password)
      if (result.success) {
        addNotification('Welcome to Artivue! 🎨')
        navigate(result.role === 'admin' ? '/admin' : '/home', { replace: true })
      } else {
        setError(result.error || 'Login failed. Please check your email and password.')
      }
    } catch (e) {
      setError('Something went wrong: ' + e.message)
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) return setError('Please fill all fields')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const result = await register(form.name, form.email.trim(), form.password)
      if (result.success) {
        addNotification('Account created! Welcome 🎨')
        navigate('/home', { replace: true })
      } else {
        setError(result.error)
      }
    } catch (e) {
      setError('Something went wrong: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--beige)', padding: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
        style={{ width: '100%', maxWidth: 400, background: 'var(--cream)', borderRadius: 'var(--r-xl)', padding: '2.5rem 2rem', boxShadow: 'var(--shadow)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.8rem' }}>
          <ArtivueLogo size={80} />
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 30, fontWeight: 300, color: 'var(--dark-text)', marginTop: '1rem' }}>
            {mode === 'login' ? 'Welcome Back' : 'Join Us'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.18em', textTransform: 'uppercase', marginTop: 4 }}>
            Artivue
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mode === 'register' && (
              <input className="field" placeholder="Full Name" value={form.name}
                onChange={e => set('name', e.target.value)} />
            )}
            <input className="field" placeholder="Email Address" type="email" value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <div style={{ position: 'relative' }}>
              <input className="field" placeholder="Password" type={showPw ? 'text' : 'password'} value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                style={{ paddingRight: 40 }} />
              <button onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {mode === 'register' && (
              <input className="field" placeholder="Confirm Password" type="password" value={form.confirm}
                onChange={e => set('confirm', e.target.value)} />
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div style={{ background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#C0392B', marginBottom: '.8rem', lineHeight: 1.5 }}>
            ⚠️ {error}
          </div>
        )}

        <motion.button whileTap={{ scale: .98 }}
          onClick={mode === 'login' ? handleLogin : handleRegister}
          disabled={loading}
          style={{ width: '100%', background: loading ? 'var(--mid-text)' : 'var(--dark-text)', color: 'var(--cream)', border: 'none', borderRadius: 12, padding: '13px', fontFamily: 'Jost,sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '.5rem' }}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
        </motion.button>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: 12, color: 'var(--light-text)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: 'var(--accent-rust)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
