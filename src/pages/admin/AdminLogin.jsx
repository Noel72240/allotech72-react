import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import config from '../../config.js'

export default function AdminLogin() {
  const { login, loginError } = useAuth()
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(password)
    // Pas besoin de navigate — AdminPage bascule automatiquement via le Context
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, cursor: 'default',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo + titre */}
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

        {/* Carte formulaire */}
        <div style={{
          background: 'rgba(5,14,28,0.85)',
          border: '1px solid rgba(0,207,255,0.15)',
          borderRadius: 20, padding: 36,
          backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handleSubmit}>

            <div className="fg" style={{ marginBottom: 20 }}>
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>

            {/* Erreur */}
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

            <button type="submit" className="bsend">
              Connexion →
            </button>

          </form>

          <p style={{ color: 'var(--dim)', fontSize: '.75rem', textAlign: 'center', marginTop: 20 }}>
            Mot de passe par défaut : <code style={{ color: 'var(--c)' }}>allotech72</code><br />
            <span style={{ opacity: .7 }}>Vous devrez le changer à la première connexion.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
