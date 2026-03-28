// ══════════════════════════════════════════════
// Auth — Supabase Auth (même compte PC / mobile / tablette)
// ══════════════════════════════════════════════
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setAuthLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isLoggedIn = !!session

  const login = async (email, password) => {
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (error) {
      const msg =
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message
      setLoginError(msg)
      return false
    }
    return true
  }

  const logout = async () => {
    setLoginError('')
    await supabase.auth.signOut()
  }

  /** Vérifie l’ancien mot de passe puis met à jour (compte unique Supabase). */
  const changePassword = async (oldPass, newPass, confirmPass) => {
    if (newPass.length < 8) {
      return { ok: false, msg: 'Le nouveau mot de passe doit faire au moins 8 caractères.' }
    }
    if (newPass !== confirmPass) {
      return { ok: false, msg: 'Les mots de passe ne correspondent pas.' }
    }
    const { data: { session: s } } = await supabase.auth.getSession()
    const email = s?.user?.email
    if (!email) {
      return { ok: false, msg: 'Session expirée. Reconnectez-vous.' }
    }
    const { error: errSign } = await supabase.auth.signInWithPassword({ email, password: oldPass })
    if (errSign) {
      return { ok: false, msg: 'Mot de passe actuel incorrect.' }
    }
    const { error: errUp } = await supabase.auth.updateUser({ password: newPass })
    if (errUp) {
      return { ok: false, msg: errUp.message }
    }
    return { ok: true, msg: 'Mot de passe modifié avec succès !' }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoggedIn,
        authLoading,
        loginError,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
