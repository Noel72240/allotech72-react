import { useEffect }                    from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Helmet }                        from 'react-helmet-async'
import config                            from './config.js'

import Background   from './components/Background.jsx'
import Cursor       from './components/Cursor.jsx'
import Nav          from './components/Nav.jsx'
import Hero         from './components/Hero.jsx'
import Services     from './components/Services.jsx'
import Avantages    from './components/Avantages.jsx'
import About        from './components/About.jsx'
import Zone         from './components/Zone.jsx'
import Avis         from './components/Avis.jsx'
import Contact      from './components/Contact.jsx'
import Footer       from './components/Footer.jsx'
import Modals       from './components/Modals.jsx'
import CookieBanner from './components/CookieBanner.jsx'

import Galerie   from './pages/Galerie.jsx'
import AvisPage  from './pages/AvisPage.jsx'
import NotFound  from './pages/NotFound.jsx'
import AdminPage from './pages/admin/AdminPage.jsx'

// ─────────────────────────────────────────────
// SEO Head — page d'accueil
// ─────────────────────────────────────────────
function SeoHome() {
  // JSON-LD : LocalBusiness enrichi
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type':    ['LocalBusiness', 'ComputerRepair'],
    '@id':       config.siteUrl + '/#business',
    name:        config.brand,
    description: config.seoDesc,
    url:         config.siteUrl,
    telephone:   '+33' + config.telBrut.slice(1),
    email:       `contact@${config.siteUrl.replace('https://','').replace('http://','')}`,
    logo:        config.siteUrl + '/favicon.svg',
    image:       config.siteUrl + '/og-image.jpg',
    priceRange:  '€',
    paymentAccepted: 'Cash, Chèque, Virement',
    currenciesAccepted: 'EUR',
    address: {
      '@type':         'PostalAddress',
      streetAddress:    config.adresse,
      addressLocality:  config.ville,
      postalCode:       config.codePostal,
      addressRegion:   'Pays de la Loire',
      addressCountry:  'FR',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:    48.0665,
      longitude:   0.3721,
    },
    openingHoursSpecification: [
      { '@type':'OpeningHoursSpecification', dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'], opens:'08:00', closes:'19:00' },
      { '@type':'OpeningHoursSpecification', dayOfWeek:['Saturday'], opens:'08:00', closes:'17:00' },
    ],
    areaServed: config.communes
      .filter(c => c !== '…et environs')
      .map(name => ({ '@type':'City', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:    'Services informatiques',
      itemListElement: config.services.map((s, i) => ({
        '@type':    'Offer',
        position:    i + 1,
        name:        s.titre,
        description: s.desc,
        areaServed:  config.ville + ', Sarthe, Pays de la Loire',
      })),
    },
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   '5',
      reviewCount:    String(config.avis.length),
      bestRating:    '5',
      worstRating:   '1',
    },
    review: config.avis.slice(0, 5).map(a => ({
      '@type':       'Review',
      author:        { '@type':'Person', name: a.nom },
      reviewRating:  { '@type':'Rating', ratingValue:'5', bestRating:'5' },
      reviewBody:     a.texte,
      name:           a.type,
    })),
    sameAs: [config.facebook, config.google, config.instagram].filter(Boolean),
    founder: { '@type':'Person', name:`${config.prenom} ${config.nom}` },
    vatID:   'FR - TVA non applicable art.293B CGI',
  }

  // JSON-LD : BreadcrumbList
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type':'ListItem', position:1, name:'Accueil',  item: config.siteUrl + '/' },
      { '@type':'ListItem', position:2, name:'Services', item: config.siteUrl + '/#services' },
      { '@type':'ListItem', position:3, name:'Galerie',  item: config.siteUrl + '/galerie' },
      { '@type':'ListItem', position:4, name:'Avis',     item: config.siteUrl + '/avis' },
      { '@type':'ListItem', position:5, name:'Contact',  item: config.siteUrl + '/#contact' },
    ],
  }

  // JSON-LD : FAQ (boost SEO avec rich snippets)
  const faq = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: [
      { '@type':'Question', name:'Quel est le tarif d\'une intervention à domicile ?',    acceptedAnswer:{ '@type':'Answer', text:`Les tarifs de ${config.brand} sont transparents et communiqués avant toute intervention. Contactez-nous au ${config.telephone} pour un devis gratuit.` } },
      { '@type':'Question', name:'Quelle est la zone d\'intervention d\'Allotech72 ?',    acceptedAnswer:{ '@type':'Answer', text:`${config.brand} intervient sur Le Mans, Lombron, Allonnes, Champagné, Montfort-le-Gesnois et tout le secteur Sarthe.` } },
      { '@type':'Question', name:'Combien de temps dure une réparation informatique ?',  acceptedAnswer:{ '@type':'Answer', text:'La durée dépend de la panne, mais la plupart des interventions se règlent en 1 à 2 heures directement à votre domicile.' } },
      { '@type':'Question', name:'Intervenez-vous sur les téléphones et tablettes ?',    acceptedAnswer:{ '@type':'Answer', text:`Oui, ${config.brand} répare les smartphones Android et iPhone, ainsi que les tablettes de toutes marques.` } },
      { '@type':'Question', name:'Proposez-vous des cours d\'informatique à domicile ?', acceptedAnswer:{ '@type':'Answer', text:`Oui ! ${config.prenom} propose des cours d'initiation à l'informatique à domicile, adaptés aux débutants et aux seniors.` } },
    ],
  }

  const ogImage = config.siteUrl + '/og-image.jpg'

  return (
    <Helmet>
      {/* ── TITLE & META ── */}
      <title>{config.seoTitle}</title>
      <meta name="description"   content={config.seoDesc} />
      <meta name="keywords"      content={config.seoKeywords} />
      <meta name="author"        content={`${config.prenom} ${config.nom} – ${config.brand}`} />
      <meta name="robots"        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot"     content="index, follow" />
      <link rel="canonical"      href={config.siteUrl + '/'} />

      {/* ── GEO LOCAL ── */}
      <meta name="geo.region"    content="FR-72" />
      <meta name="geo.placename" content={config.ville} />
      <meta name="geo.position"  content="48.0665;0.3721" />
      <meta name="ICBM"          content="48.0665, 0.3721" />

      {/* ── OPEN GRAPH ── */}
      <meta property="og:type"          content="website" />
      <meta property="og:url"           content={config.siteUrl + '/'} />
      <meta property="og:title"         content={config.seoTitle} />
      <meta property="og:description"   content={config.seoDesc} />
      <meta property="og:image"         content={ogImage} />
      <meta property="og:image:width"   content="1200" />
      <meta property="og:image:height"  content="630" />
      <meta property="og:image:alt"     content={`${config.brand} — Dépannage informatique Le Mans`} />
      <meta property="og:locale"        content="fr_FR" />
      <meta property="og:site_name"     content={config.brand} />

      {/* ── TWITTER / X CARD ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={config.seoTitle} />
      <meta name="twitter:description" content={config.seoDesc} />
      <meta name="twitter:image"       content={ogImage} />

      {/* ── JSON-LD ── */}
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </Helmet>
  )
}

// ─────────────────────────────────────────────
// Page d'accueil
// ─────────────────────────────────────────────
function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); obs.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.rev').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const prog = document.getElementById('prog')
    const btt  = document.getElementById('btt')
    const nav  = document.getElementById('nav')
    const fn = () => {
      const s = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (prog) prog.style.width = (s / h * 100) + '%'
      if (btt)  btt.classList.toggle('show', s > 300)
      if (nav)  nav.classList.toggle('sc', s > 50)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <SeoHome />
      <div id="cursor" /><div id="cring" /><div id="prog" />
      <Background />
      <Cursor />
      <Nav />
      <main>
        <Hero /><Services /><Avantages /><About /><Zone /><Avis /><Contact />
      </main>
      <Footer />
      <Modals />
      <CookieBanner />
      <button id="btt" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>▲</button>
    </>
  )
}

// ─────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/avis"    element={<AvisPage />} />
        <Route path="/admin"   element={<AdminPage />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
