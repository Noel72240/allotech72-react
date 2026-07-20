import { useEffect, useMemo }           from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Helmet }                        from 'react-helmet-async'
import config, { siteDomainForEmail, fullName } from './config.js'
import { getActiveHomeNews } from './lib/shop.js'
import { useShopCatalog } from './hooks/useShopCatalog.jsx'

import Background   from './components/Background.jsx'
import Cursor       from './components/Cursor.jsx'
import Nav          from './components/Nav.jsx'
import Hero         from './components/Hero.jsx'
import NewsCarousel from './components/NewsCarousel.jsx'
import Services     from './components/Services.jsx'
import ProblemMatch from './components/ProblemMatch.jsx'
import Avantages    from './components/Avantages.jsx'
import About        from './components/About.jsx'
import Zone         from './components/Zone.jsx'
import SeoLocalTeaser from './components/SeoLocalTeaser.jsx'
import Clients      from './components/Clients.jsx'
import Avis         from './components/Avis.jsx'
import Contact      from './components/Contact.jsx'
import Footer       from './components/Footer.jsx'
import Modals       from './components/Modals.jsx'
import CookieBanner from './components/CookieBanner.jsx'

import ConfigBanner from './components/ConfigBanner.jsx'
import ScrollToTop  from './components/ScrollToTop.jsx'
import GoogleAnalytics from './components/GoogleAnalytics.jsx'
import Galerie      from './pages/Galerie.jsx'
import Actu         from './pages/Actu.jsx'
import ActuArticle  from './pages/ActuArticle.jsx'
import AvisPage     from './pages/AvisPage.jsx'
import References   from './pages/References.jsx'
import Outils         from './pages/Outils.jsx'
import Partenaires    from './pages/Partenaires.jsx'
import ContactRedirect from './components/ContactRedirect.jsx'
import NotFound  from './pages/NotFound.jsx'
import AdminPage             from './pages/admin/AdminPage.jsx'
import DepannageLeMansSEO       from './pages/DepannageLeMansSEO.jsx'
import ReparationPCLeMans       from './pages/seo/ReparationPCLeMans.jsx'
import ReparateurTelephoneLeMans from './pages/seo/ReparateurTelephoneLeMans.jsx'
import CreationSiteInternetSarthe from './pages/seo/CreationSiteInternetSarthe.jsx'
import VirusMalwaresLeMans        from './pages/seo/VirusMalwaresLeMans.jsx'
import WifiReseauLeMans           from './pages/seo/WifiReseauLeMans.jsx'
import ServicesInformatiquesSarthe  from './pages/seo/ServicesInformatiquesSarthe.jsx'
import DepannageInformatiqueSarthe  from './pages/seo/DepannageInformatiqueSarthe.jsx'
import InformaticienDomicileSarthe  from './pages/seo/InformaticienDomicileSarthe.jsx'
import RecuperationDonneesSarthe    from './pages/seo/RecuperationDonneesSarthe.jsx'
import InstallationWindowsSarthe    from './pages/seo/InstallationWindowsSarthe.jsx'
import MaintenanceInformatiqueSarthe from './pages/seo/MaintenanceInformatiqueSarthe.jsx'
import DepannagePcPortableSarthe    from './pages/seo/DepannagePcPortableSarthe.jsx'
import CreationLogicielSurMesureSarthe from './pages/seo/CreationLogicielSurMesureSarthe.jsx'
import VenteHub                  from './pages/vente/VenteHub.jsx'
import VenteOccasion             from './pages/vente/VenteOccasion.jsx'
import VenteNeuf                 from './pages/vente/VenteNeuf.jsx'
import VenteNeufCategorie         from './pages/vente/VenteNeufCategorie.jsx'
import Panier                       from './pages/vente/Panier.jsx'
import Checkout, { CheckoutSuccess } from './pages/vente/Checkout.jsx'
import AdamWidget from './components/adam/AdamWidget.jsx'

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
    email:       `contact@${siteDomainForEmail()}`,
    logo:        config.siteUrl + '/logo-allotech72.png',
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
      reviewCount:    String(config.avisTotal || config.avis.length),
      bestRating:    '5',
      worstRating:   '1',
    },
    review: config.avis.slice(0, 5).map(a => ({
      '@type':       'Review',
      itemReviewed:  { '@type':'LocalBusiness', '@id': config.siteUrl + '/#business', name: config.brand },
      author:        { '@type':'Person', name: a.nom },
      reviewRating:  { '@type':'Rating', ratingValue:'5', bestRating:'5', worstRating:'1' },
      reviewBody:     a.texte,
      name:           a.type,
    })),
    sameAs: [config.facebook, config.google, config.instagram].filter(Boolean),
    founder: { '@type':'Person', name: fullName() },
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
      { '@type':'Question', name:'Proposez-vous des cours d\'informatique à domicile ?', acceptedAnswer:{ '@type':'Answer', text:`Oui ! ${fullName()} propose des cours d'initiation à l'informatique à domicile, adaptés aux débutants et aux seniors.` } },
    ],
  }

  const ogImage = config.siteUrl + '/og-image.png'

  return (
    <Helmet>
      {/* ── TITLE & META ── */}
      <title>{config.seoTitle}</title>
      <meta name="description"   content={config.seoDesc} />
      <meta name="keywords"      content={config.seoKeywords} />
      <meta name="author"        content={`${fullName()} – ${config.brand}`} />
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
  const { settings } = useShopCatalog()
  const newsSlides = useMemo(() => {
    const fromAdmin = getActiveHomeNews(settings.homeNews)
    if (fromAdmin.length) return fromAdmin
    return config.newsSlides || []
  }, [settings.homeNews])

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
        <Hero />
        <NewsCarousel slides={newsSlides} />
        <ProblemMatch />
        <Services /><Avantages /><About /><Zone /><SeoLocalTeaser /><Clients /><Avis /><Contact />
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
      <ScrollToTop />
      <GoogleAnalytics />
      <ConfigBanner />
      <AdamWidget />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/outils" element={<Outils />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route path="/contact" element={<ContactRedirect />} />
        <Route path="/actu" element={<Actu />} />
        <Route path="/actu/:slug" element={<ActuArticle />} />
        <Route path="/avis"    element={<AvisPage />} />
        <Route path="/references" element={<References />} />
        <Route path="/admin"   element={<AdminPage />} />
        <Route path="/boutique" element={<VenteHub />} />
        <Route path="/boutique/occasion" element={<VenteOccasion />} />
        <Route path="/boutique/neuf" element={<VenteNeuf />} />
        <Route path="/boutique/neuf/:categoryId" element={<VenteNeufCategorie />} />
        <Route path="/vente" element={<Navigate to="/boutique" replace />} />
        <Route path="/vente/occasion" element={<Navigate to="/boutique/occasion" replace />} />
        <Route path="/vente/neuf" element={<Navigate to="/boutique/neuf" replace />} />
        <Route path="/vente/neuf/:categoryId" element={<Navigate to="/boutique/neuf/:categoryId" replace />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/panier/paiement" element={<Checkout />} />
        <Route path="/panier/confirmation" element={<CheckoutSuccess />} />
        <Route path="/depannage-informatique-le-mans" element={<DepannageLeMansSEO />} />
        <Route path="/reparation-ordinateur-le-mans"      element={<ReparationPCLeMans />} />
        <Route path="/reparateur-telephone-le-mans"       element={<ReparateurTelephoneLeMans />} />
        <Route path="/creation-site-internet-sarthe"      element={<CreationSiteInternetSarthe />} />
        <Route path="/virus-malwares-depannage-le-mans"   element={<VirusMalwaresLeMans />} />
        <Route path="/wifi-reseau-internet-le-mans"      element={<WifiReseauLeMans />} />
        <Route path="/services-informatiques-sarthe"    element={<ServicesInformatiquesSarthe />} />
        <Route path="/depannage-informatique-sarthe"     element={<DepannageInformatiqueSarthe />} />
        <Route path="/informaticien-domicile-sarthe"     element={<InformaticienDomicileSarthe />} />
        <Route path="/recuperation-donnees-sarthe"       element={<RecuperationDonneesSarthe />} />
        <Route path="/installation-windows-sarthe"       element={<InstallationWindowsSarthe />} />
        <Route path="/maintenance-informatique-sarthe"   element={<MaintenanceInformatiqueSarthe />} />
        <Route path="/depannage-pc-portable-sarthe"      element={<DepannagePcPortableSarthe />} />
        <Route path="/creation-logiciel-sur-mesure-sarthe" element={<CreationLogicielSurMesureSarthe />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
