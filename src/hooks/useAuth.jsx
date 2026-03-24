// ══════════════════════════════════════════════
// Auth Context — état partagé dans toute l'app
// Hash : SHA-256 via SubtleCrypto (natif navigateur, pas de librairie)
// ══════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Hash SHA-256 natif (SubtleCrypto) — asynchrone
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const STORE_KEY = 'at72_admin'

function getStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {} } catch { return {} }
}
function setStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

// ── Context ──
const AuthContext = createContext(null)

// ── Provider ──
export function AuthProvider({ children }) {
  const [isLoggedIn,     setIsLoggedIn]     = useState(false)
  const [mustChangePass, setMustChangePass] = useState(false)
  const [loginError,     setLoginError]     = useState('')
  const [loading,        setLoading]        = useState(false)

  // Vérif session au montage
  useEffect(() => {
    if (sessionStorage.getItem('at72_session') === '1') {
      const store = getStore()
      setIsLoggedIn(true)
      setMustChangePass(store.mustChange !== false)
    }
  }, [])

  // ── Connexion (async SHA-256) ──
  const login = useCallback(async (password) => {
    setLoading(true)
    try {
      const hash   = await sha256(password)
      const store  = getStore()
      const stored = store.hash || await sha256('allotech72')

      if (hash !== stored) {
        setLoginError('Mot de passe incorrect.')
        setLoading(false)
        return false
      }
      sessionStorage.setItem('at72_session', '1')
      const mustChange = store.mustChange !== false
      setIsLoggedIn(true)
      setMustChangePass(mustChange)
      setLoginError('')
      setLoading(false)
      return true
    } catch {
      setLoginError('Erreur lors de la connexion, réessayez.')
      setLoading(false)
      return false
    }
  }, [])

  // ── Changement de mot de passe (async SHA-256) ──
  const changePassword = useCallback(async (oldPass, newPass, confirmPass) => {
    const store      = getStore()
    const oldHash    = await sha256(oldPass)
    const storedHash = store.hash || await sha256('allotech72')

    if (oldHash !== storedHash)    return { ok: false, msg: 'Ancien mot de passe incorrect.' }
    if (newPass.length < 8)        return { ok: false, msg: 'Le nouveau mot de passe doit faire au moins 8 caractères.' }
    if (newPass !== confirmPass)   return { ok: false, msg: 'Les mots de passe ne correspondent pas.' }

    const newHash = await sha256(newPass)
    setStore({ ...store, hash: newHash, mustChange: false })
    setMustChangePass(false)
    return { ok: true, msg: 'Mot de passe modifié avec succès !' }
  }, [])

  // ── Déconnexion ──
  const logout = useCallback(() => {
    sessionStorage.removeItem('at72_session')
    setIsLoggedIn(false)
    setMustChangePass(false)
    setLoginError('')
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, mustChangePass, loginError, loading, login, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
