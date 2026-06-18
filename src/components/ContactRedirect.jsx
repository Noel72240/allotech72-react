import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/** /contact → accueil section contact (URL demandée en SEO) */
export default function ContactRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
    const t = setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(t)
  }, [navigate])

  return null
}
