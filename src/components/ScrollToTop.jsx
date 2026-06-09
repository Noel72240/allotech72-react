import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Remonte en haut à chaque changement de route ; ancre #section si présente. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo(0, 0)
        }
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
