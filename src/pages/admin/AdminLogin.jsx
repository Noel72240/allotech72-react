import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import config from '../../config.js'

const EMAIL_KEY = 'at72_admin_email'

export default function AdminLogin() {
  const { login, loginError } = useAuth()
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(EMAIL_KEY) || import.meta.env.VITE_ADMIN_EMAIL || ''
    } catch {
      return import.meta.env.VITE_ADMIN_EMAIL || ''
    }
  })
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await login(email, password)
    if (ok) {
      try {
        localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase())
      } catch { /* ignore */ }
    }
    setSubmitting(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, cursor: 'default',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg,#00CFFF,#2BFF9A)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '2rem',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(0,207,255,0.4)',
          }}>🔐</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', color: '#fff', marginBottom: 8 }}>
            Espace Admin
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '.88rem' }}>{config.brand}</p>
        </div>

        <div style={{
          background: 'rgba(5,14,28,0.85)',
          border: '1px solid rgba(0,207,255,0.15)',
          borderRadius: 20, padding: 36,
          backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handleSubmit}>

            <div className="fg" style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@exemple.fr"
                required
                autoFocus
              />
            </div>

            <div className="fg" style={{ marginBottom: 20 }}>
              <label>Mot de passe</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p style={{
                color: '#ff6b6b', fontSize: '.82rem', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 14px',
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.25)',
                borderRadius: 8,
              }}>
                ⚠️ {loginError}
              </p>
            )}

            <button type="submit" className="bsend" disabled={submitting}>
              {submitting ? 'Connexion…' : 'Connexion →'}
            </button>

          </form>

          <p style={{ color: 'var(--dim)', fontSize: '.75rem', textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
            Compte unique Supabase : le même identifiant fonctionne sur tous vos appareils.
            <br />
            <span style={{ opacity: .75 }}>Créez l’utilisateur dans le tableau Supabase (Authentication → Users).</span>
          </p>
        </div>
      </div>
    </div>
  )
}
