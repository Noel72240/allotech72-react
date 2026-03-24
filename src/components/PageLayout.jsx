// Layout partagé pour les pages secondaires (Galerie, Avis…)
// Inclut background, curseur, nav, footer, cookies, modals
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Background   from './Background.jsx'
import Cursor       from './Cursor.jsx'
import Nav          from './Nav.jsx'
import Footer       from './Footer.jsx'
import Modals       from './Modals.jsx'
import CookieBanner from './CookieBanner.jsx'
import config       from '../config.js'

export default function PageLayout({ children, title, description }) {
  // Scroll nav shrink
  useEffect(() => {
    const nav = document.getElementById('nav')
    const btt = document.getElementById('btt')
    const fn  = () => {
      nav?.classList.toggle('sc', window.scrollY > 50)
      btt?.classList.toggle('show', window.scrollY > 300)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <Helmet>
        <title>{title} | {config.brand}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <div id="cursor" /><div id="cring" />
      <Background />
      <Cursor />
      <Nav />

      <main style={{ paddingTop: 90, minHeight: '100vh', position: 'relative', zIndex: 5 }}>
        {children}
      </main>

      <Footer />
      <Modals />
      <CookieBanner />

      <button id="btt" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>▲</button>
    </>
  )
}
