import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function ChangePassword({ onDone }) {
  const { changePassword } = useAuth()
  const [form, setForm] = useState({ old: '', new: '', confirm: '' })
  const [msg,  setMsg]  = useState(null)
  const [busy, setBusy] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const result = await changePassword(form.old, form.new, form.confirm)
    setMsg({ ok: result.ok, text: result.msg })
    if (result.ok) {
      setForm({ old: '', new: '', confirm: '' })
    }
    setBusy(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, cursor: 'default',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg,#FFB800,#FF6B00)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '2rem',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(255,184,0,0.4)',
          }}>🔑</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.3rem', color: '#fff', marginBottom: 12 }}>
            Changer le mot de passe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '.85rem' }}>
            Le nouveau mot de passe s’applique à tous vos appareils (compte Supabase).
          </p>
        </div>

        <div style={{
          background: 'rgba(5,14,28,0.85)',
          border: '1px solid rgba(255,184,0,0.2)',
          borderRadius: 20, padding: 36,
          backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handle}>

            <div className="fg" style={{ marginBottom: 14 }}>
              <label>Mot de passe actuel</label>
              <input
                type="password"
                value={form.old}
                onChange={e => setForm({ ...form, old: e.target.value })}
                placeholder="Mot de passe actuel"
                required
                autoFocus
                autoComplete="current-password"
              />
            </div>

            <div className="fg" style={{ marginBottom: 14 }}>
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                value={form.new}
                onChange={e => setForm({ ...form, new: e.target.value })}
                placeholder="8 caractères minimum"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="fg" style={{ marginBottom: 20 }}>
              <label>Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Répéter le mot de passe"
                required
                autoComplete="new-password"
              />
            </div>

            {msg && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                fontSize: '.84rem', fontWeight: 600,
                background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
                border: `1px solid ${msg.ok ? 'rgba(43,255,154,0.3)' : 'rgba(255,80,80,0.3)'}`,
                color: msg.ok ? 'var(--g)' : '#ff6b6b',
              }}>
                {msg.ok ? '✅' : '⚠️'} {msg.text}
              </div>
            )}

            <button
              type="submit"
              className="bsend"
              disabled={busy}
              style={{ background: 'linear-gradient(135deg,#FFB800,#FF6B00)', color: '#040B14', opacity: busy ? 0.7 : 1 }}
            >
              {busy ? 'Enregistrement…' : 'Enregistrer →'}
            </button>

          </form>

          <button
            type="button"
            onClick={onDone}
            style={{
              width: '100%', marginTop: 14, padding: '10px',
              background: 'transparent', border: '1px solid rgba(0,207,255,0.25)',
              color: 'var(--dim)', borderRadius: 10, cursor: 'pointer', fontSize: '.82rem',
            }}
          >
            ← Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
