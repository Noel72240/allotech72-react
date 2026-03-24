// ══════════════════════════════════════════════
// Cookies Context — état partagé dans toute l'app
// ══════════════════════════════════════════════
import { createContext, useContext, useState, useEffect } from 'react'

const KEY = 'at72_cookies'
const CookiesContext = createContext(null)

export function CookiesProvider({ children }) {
  const [consent, setConsent] = useState(undefined) // undefined = pas encore chargé

  // Lecture localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    setConsent(stored ? JSON.parse(stored) : null)
  }, [])

  const accept = () => {
    const val = { analytics: true, marketing: false, date: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(val))
    setConsent(val)
  }

  const reject = () => {
    const val = { analytics: false, marketing: false, date: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(val))
    setConsent(val)
  }

  const reset = () => {
    localStorage.removeItem(KEY)
    setConsent(null) // ← tous les composants voient null → bandeau réapparaît
  }

  return (
    <CookiesContext.Provider value={{
      consent,
      accept,
      reject,
      reset,
      pending: consent === null, // null = pas choisi, undefined = chargement
    }}>
      {children}
    </CookiesContext.Provider>
  )
}

export function useCookies() {
  const ctx = useContext(CookiesContext)
  if (!ctx) throw new Error('useCookies doit être dans <CookiesProvider>')
  return ctx
}
