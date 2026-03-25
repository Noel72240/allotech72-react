// ══════════════════════════════════════════════
// Auth Context — état partagé dans toute l'app
// ══════════════════════════════════════════════
import { createContext, useContext, useState, useEffect } from 'react'

// Hash simple côté client
function simpleHash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return (h >>> 0).toString(16)
}

const DEFAULT_HASH = simpleHash('allotech72')
const STORE_KEY    = 'at72_admin'

function getStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {} } catch { return {} }
}
function setStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

// ── Context ──
const AuthContext = createContext(null)

// ── Provider à mettre autour de l'app ──
export function AuthProvider({ children }) {
  const [isLoggedIn,     setIsLoggedIn]     = useState(false)
  const [mustChangePass, setMustChangePass] = useState(false)
  const [loginError,     setLoginError]     = useState('')

  // Vérif session au montage
  useEffect(() => {
    if (sessionStorage.getItem('at72_session') === '1') {
      const store = getStore()
      setIsLoggedIn(true)
      setMustChangePass(store.mustChange !== false)
    }
  }, [])

  // ── Connexion ──
  const login = (password) => {
    const store  = getStore()
    const hash   = simpleHash(password)
    const stored = store.hash || DEFAULT_HASH

    if (hash !== stored) {
      setLoginError('Mot de passe incorrect.')
      return false
    }
    sessionStorage.setItem('at72_session', '1')
    const mustChange = store.mustChange !== false
    setIsLoggedIn(true)
    setMustChangePass(mustChange)
    setLoginError('')
    return true
  }

  // ── Changement de mot de passe ──
  const changePassword = (oldPass, newPass, confirmPass) => {
    const store      = getStore()
    const oldHash    = simpleHash(oldPass)
    const storedHash = store.hash || DEFAULT_HASH

    if (oldHash !== storedHash)    return { ok: false, msg: 'Ancien mot de passe incorrect.' }
    if (newPass.length < 8)        return { ok: false, msg: 'Le nouveau mot de passe doit faire au moins 8 caractères.' }
    if (newPass !== confirmPass)   return { ok: false, msg: 'Les mots de passe ne correspondent pas.' }

    setStore({ ...store, hash: simpleHash(newPass), mustChange: false })
    setMustChangePass(false)   // ← mise à jour immédiate
    return { ok: true, msg: 'Mot de passe modifié avec succès !' }
  }

  // ── Déconnexion ──
  const logout = () => {
    sessionStorage.removeItem('at72_session')
    setIsLoggedIn(false)
    setMustChangePass(false)
    setLoginError('')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, mustChangePass, loginError, login, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook à utiliser dans les composants ──
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
