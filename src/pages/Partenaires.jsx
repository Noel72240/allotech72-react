import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config from '../config.js'
import { PARTENAIRES } from '../data/partenaires.js'
import '../styles/partenaires.css'

const SEO_TITLE = 'Partenaires — Annuaire & collaborations | ALLOTECH72'
const SEO_DESC =
  'Découvrez les partenaires d’ALLOTECH72. Lien réciproque avec ServicesDeGeek, l’annuaire gratuit des informaticiens en France.'

export default function Partenaires() {
  const base = config.siteUrl.replace(/\/$/, '')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Partenaires', item: `${base}/partenaires` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Partenaires ALLOTECH72',
    numberOfItems: PARTENAIRES.length,
    itemListElement: PARTENAIRES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: p.url,
      description: p.description,
    })),
  }

  useEffect(() => {
    const els = document.querySelectorAll('.partenaires-page .rev')
    els.forEach(el => el.classList.add('vis'))
  }, [])

  return (
    <PageLayout title={SEO_TITLE} description={SEO_DESC}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="container partenaires-page" style={{ paddingBottom: 80 }}>
        <header className="partenaires-hero rev">
          <nav className="partenaires-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden>›</span>
            <span>Partenaires</span>
          </nav>
          <div className="stag">Collaborations</div>
          <h1>
            Nos <span className="c">partenaires</span>
          </h1>
          <p className="partenaires-hero-sub">
            ALLOTECH72 collabore avec des acteurs du numérique pour mieux servir les clients
            en Sarthe et en France. Échange de liens et recommandations croisées.
          </p>
        </header>

        <div className="partenaires-grid">
          {PARTENAIRES.map(p => (
            <article key={p.id} className="partenaire-card svc-card rev">
              <div className="partenaire-logo-wrap">
                <img
                  src={p.logo}
                  alt={`Logo ${p.name}`}
                  className="partenaire-logo"
                  loading="eager"
                />
              </div>
              <span className="partenaire-badge">🤝 Partenaire officiel</span>
              <h2>{p.name}</h2>
              <p className="partenaire-tagline">{p.tagline}</p>
              <p className="partenaire-desc">{p.description}</p>
              {p.highlights?.length > 0 && (
                <ul className="partenaire-tags">
                  {p.highlights.map(h => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bm bp partenaire-cta"
              >
                Visiter {p.name} →
              </a>
              <p className="partenaire-url">
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.url.replace(/^https?:\/\//, '')}
                </a>
              </p>
            </article>
          ))}
        </div>

        <section className="partenaires-cta rev">
          <h2>Vous souhaitez devenir partenaire ?</h2>
          <p>
            Échange de liens, annuaire, ou collaboration locale — contactez {config.brand}.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Link to="/contact" className="bm bp">Nous contacter</Link>
            <a href={`tel:${config.telBrut}`} className="bm bo">📞 {config.telephone}</a>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
