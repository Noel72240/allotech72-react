import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import '../styles/outils.css'
import config from '../config.js'
import {
  OUTILS,
  OUTILS_CATEGORIES,
  OUTILS_FAQ,
  REMOTE_SERVICES,
  ALLOTECH_SERVICES,
  ANYDESK,
  ANYDESK_STEPS,
} from '../data/outils.js'

const SEO_TITLE = 'Outils informatiques gratuits - Diagnostic PC et assistance à distance | ALLOTECH72'
const SEO_DESC =
  'Téléchargez gratuitement les meilleurs outils de diagnostic, nettoyage et maintenance PC recommandés par ALLOTECH72. Assistance informatique à distance disponible avec AnyDesk.'

function AnyDeskShowcase() {
  return (
    <section className="anydesk-showcase rev" aria-labelledby="anydesk-title">
      <div className="anydesk-showcase-glow" aria-hidden />
      <div className="anydesk-showcase-inner">
        <div className="anydesk-showcase-logo-col">
          <div className="anydesk-logo-wrap">
            <img
              src={ANYDESK.logo}
              alt="AnyDesk — logiciel d'assistance à distance"
              className="anydesk-logo-lg"
              loading="eager"
            />
          </div>
          <span className="outil-badge outil-badge--anydesk">⭐ Recommandé par ALLOTECH72</span>
          <p className="anydesk-tagline">Logiciel n°1 pour l&apos;assistance à distance</p>
        </div>

        <div className="anydesk-showcase-main">
          <p className="anydesk-eyebrow">Assistance informatique à distance</p>
          <h2 id="anydesk-title">
            Intervention rapide avec <span className="anydesk-red">AnyDesk</span>
          </h2>
          <p className="anydesk-lead">
            <strong>{config.brand}</strong> peut prendre la main sur votre ordinateur à distance pour résoudre
            de nombreux problèmes <strong>sans déplacement</strong> — messagerie, virus, Windows, imprimantes…
          </p>
          <ul className="outils-check-list anydesk-services">
            {REMOTE_SERVICES.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <ol className="anydesk-steps">
            {ANYDESK_STEPS.map(step => (
              <li key={step.n}>
                <span className="anydesk-step-n">{step.n}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="anydesk-showcase-cta">
          <a
            href={ANYDESK.url}
            target="_blank"
            rel="noopener noreferrer"
            className="anydesk-btn-primary"
          >
            <img src={ANYDESK.logo} alt="" className="anydesk-btn-logo" aria-hidden />
            Télécharger AnyDesk
          </a>
          <Link to="/contact" className="bm bo anydesk-btn-secondary">
            Contacter ALLOTECH72
          </Link>
          <a href={`tel:${config.telBrut}`} className="anydesk-phone">
            📞 {config.telephone}
          </a>
          <p className="anydesk-cta-hint">Gratuit · Windows · Mac · Linux</p>
        </div>
      </div>
    </section>
  )
}

function ToolCard({ tool }) {
  const isFeatured = tool.featured
  const isAnyDesk = tool.id === 'anydesk'

  return (
    <article
      className={`outil-card svc-card rev${isFeatured ? ' outil-card--featured' : ''}${isAnyDesk ? ' outil-card--anydesk' : ''}`}
      id={tool.id}
    >
      {tool.recommended && (
        <span className="outil-badge outil-badge--anydesk">⭐ Recommandé par ALLOTECH72</span>
      )}
      <div className="outil-card-body">
        <div className="outil-card-head">
          {tool.logo ? (
            <img src={tool.logo} alt="" className="outil-logo" aria-hidden />
          ) : (
            <span className="outil-icon" aria-hidden>{tool.icon}</span>
          )}
          <div>
            <h3>{tool.name}</h3>
            <span className="outil-cat-label">
              {OUTILS_CATEGORIES.find(c => c.id === tool.category)?.label}
            </span>
          </div>
        </div>
        <p>{tool.description}</p>
        {tool.features?.length > 0 && (
          <ul className="outil-features">
            {tool.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className={isAnyDesk ? 'anydesk-btn-primary outil-dl-btn' : `bm ${isFeatured ? 'bp' : 'bo'}`}
        >
          {isAnyDesk && <img src={ANYDESK.logo} alt="" className="anydesk-btn-logo" aria-hidden />}
          Télécharger {tool.name} →
        </a>
      </div>
      {isAnyDesk && (
        <div className="outil-card-anydesk-visual" aria-hidden>
          <img src={ANYDESK.logo} alt="" className="anydesk-logo-watermark" />
        </div>
      )}
    </article>
  )
}

export default function Outils() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState(null)

  const base = config.siteUrl.replace(/\/$/, '')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return OUTILS.filter(tool => {
      if (category !== 'all' && tool.category !== category) return false
      if (!q) return true
      const hay = `${tool.name} ${tool.description} ${tool.features?.join(' ') || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, category])

  const grouped = useMemo(() => {
    if (category !== 'all') {
      return [{ id: category, tools: filtered }]
    }
    return OUTILS_CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
      id: cat.id,
      label: cat.label,
      tools: filtered.filter(t => t.category === cat.id),
    })).filter(g => g.tools.length > 0)
  }, [filtered, category])

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Outils gratuits', item: `${base}/outils` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: OUTILS_FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Outils informatiques gratuits ALLOTECH72',
    description: SEO_DESC,
    numberOfItems: OUTILS.length,
    itemListElement: OUTILS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      url: tool.url,
      description: tool.description,
    })),
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: SEO_TITLE,
    description: SEO_DESC,
    url: `${base}/outils`,
    inLanguage: 'fr-FR',
    isPartOf: { '@type': 'WebSite', name: config.brand, url: base },
    about: {
      '@type': 'Thing',
      name: 'Outils de diagnostic et maintenance informatique',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: config.brand,
      telephone: '+33' + config.telBrut.slice(1),
      url: base,
    },
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') }),
      { threshold: 0.08 },
    )
    const els = document.querySelectorAll('.outils-page .rev')
    els.forEach(el => {
      el.classList.add('vis')
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [filtered, category])

  return (
    <PageLayout title={SEO_TITLE} description={SEO_DESC}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <div className="container outils-page" style={{ paddingBottom: 80 }}>

        {/* ── HÉRO ── */}
        <header className="outils-hero rev">
          <nav className="outils-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden>›</span>
            <span>Outils gratuits</span>
          </nav>
          <div className="stag">Gratuit & recommandé</div>
          <h1>
            Outils informatiques gratuits<br />
            <span className="c">recommandés par ALLOTECH72</span>
          </h1>
          <p className="outils-hero-sub">
            Sélection enrichie d&apos;outils gratuits pour diagnostiquer, nettoyer, sécuriser,
            sauvegarder et optimiser votre ordinateur — recommandés par ALLOTECH72.
          </p>
          <Link to="/contact" className="bm bp">Besoin d&apos;aide ? Contactez ALLOTECH72</Link>
        </header>

        <AnyDeskShowcase />

        {/* ── RECHERCHE & FILTRES ── */}
        <section className="outils-toolbar rev" aria-label="Recherche et filtres">
          <div className="outils-search-wrap">
            <span className="outils-search-icon" aria-hidden>🔍</span>
            <input
              type="search"
              className="outils-search"
              placeholder="Rechercher un outil…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Rechercher un outil"
            />
            {query && (
              <button type="button" className="outils-search-clear" onClick={() => setQuery('')} aria-label="Effacer">
                ✕
              </button>
            )}
          </div>
          <div className="outils-filters" role="group" aria-label="Filtrer par catégorie">
            {OUTILS_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`outils-filter-btn${category === cat.id ? ' active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <p className="outils-result-count" aria-live="polite">
            {filtered.length} outil{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
          </p>
        </section>

        {/* ── GRILLE OUTILS ── */}
        {filtered.length === 0 ? (
          <div className="outils-empty rev">
            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔎</p>
            <p>Aucun outil ne correspond à votre recherche.</p>
            <button type="button" className="bm bo" style={{ marginTop: 16 }} onClick={() => { setQuery(''); setCategory('all') }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          grouped.map(group => (
            <section key={group.id} className="outils-section rev" aria-labelledby={`cat-${group.id}`}>
              {category === 'all' && (
                <>
                  <h2 id={`cat-${group.id}`} className="outils-section-title">
                    {OUTILS_CATEGORIES.find(c => c.id === group.id)?.label}
                  </h2>
                  <div className="div-line" style={{ marginBottom: 28 }} />
                </>
              )}
              <div className="outils-grid">
                {group.tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))
        )}

        {/* ── FAQ SEO ── */}
        <section className="outils-faq rev" aria-labelledby="faq-title">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="stag">Questions fréquentes</div>
            <h2 id="faq-title">FAQ — <span className="g">Outils & assistance</span></h2>
            <div className="div-line" />
          </div>
          <div className="outils-faq-list">
            {OUTILS_FAQ.map((item, i) => (
              <div key={i} className={`outils-faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  type="button"
                  className="outils-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="outils-faq-chevron" aria-hidden>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="outils-faq-a">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ALLOTECH72 ── */}
        <section className="outils-cta rev" aria-labelledby="cta-title">
          <h2 id="cta-title">Besoin d&apos;un <span className="c">dépannage informatique</span> ?</h2>
          <p>
            <strong>{config.brand}</strong> intervient à domicile et à distance pour :
          </p>
          <ul className="outils-check-list outils-check-list--center">
            {ALLOTECH_SERVICES.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p style={{ marginTop: 20, color: 'var(--dim)' }}>
            📞 <a href={`tel:${config.telBrut}`} style={{ color: 'var(--c)', textDecoration: 'none', fontWeight: 600 }}>{config.telephone}</a>
            {' '}—{' '}
            <a href={config.siteUrl} style={{ color: 'var(--g)', textDecoration: 'none' }}>{config.siteUrl.replace(/^https?:\/\//, '')}</a>
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link to="/contact" className="bm bp">Contacter ALLOTECH72</Link>
            <a href={`tel:${config.telBrut}`} className="bm bo">📞 {config.telephone}</a>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
