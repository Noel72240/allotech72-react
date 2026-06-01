// Layout partagé pour les pages secondaires (Galerie, Avis…)
// Inclut background, curseur, nav, footer, cookies, modals
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Background   from './Background.jsx'
import Cursor       from './Cursor.jsx'
import Nav          from './Nav.jsx'
import Footer       from './Footer.jsx'
import Modals       from './Modals.jsx'
import CookieBanner from './CookieBanner.jsx'
import SeoSidebar   from './SeoSidebar.jsx'
import config       from '../config.js'
import { isSeoHubPath } from '../data/seoPages.js'

function resolvePageTitle(title, brand) {
  if (!title) return brand
  const t = String(title).trim()
  if (t.toLowerCase().includes(brand.toLowerCase())) return t
  return `${t} | ${brand}`
}

export default function PageLayout({ children, title, description }) {
  const location = useLocation()
  const base = config.siteUrl.replace(/\/$/, '')
  const canonical = `${base}${location.pathname === '/' ? '/' : location.pathname}`
  const resolvedTitle = resolvePageTitle(title, config.brand)
  const ogImage = `${base}/og-image.jpg`
  const desc = description || config.seoDesc
  const showSeoAside = isSeoHubPath(location.pathname)

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
        <title>{resolvedTitle}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content={config.brand} />
        <meta property="og:title" content={resolvedTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={resolvedTitle} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div id="cursor" /><div id="cring" />
      <Background />
      <Cursor />
      <Nav />

      <main style={{ paddingTop: 90, minHeight: '100vh', position: 'relative', zIndex: 5 }}>
        {showSeoAside ? (
          <div className="container seo-page-layout">
            <SeoSidebar />
            <div className="seo-page-main">{children}</div>
          </div>
        ) : (
          children
        )}
      </main>

      <Footer />
      <Modals />
      <CookieBanner />

      <button id="btt" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>▲</button>
    </>
  )
}
