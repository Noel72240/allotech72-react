import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config from '../config.js'
import { PARTENAIRES, PARTENAIRE_CATEGORIES } from '../data/partenaires.js'
import '../styles/partenaires.css'

const SEO_TITLE = 'Partenaires — Annuaire & collaborations | ALLOTECH72'
const SEO_DESC =
  'Découvrez les partenaires d’ALLOTECH72. Lien réciproque avec ServicesDeGeek, l’annuaire gratuit des informaticiens en France.'

export default function Partenaires() {
  const base = config.siteUrl.replace(/\/$/, '')
  const [cat, setCat] = useState(PARTENAIRE_CATEGORIES[0]?.id || 'annuaires')

  const filtered = useMemo(
    () => PARTENAIRES.filter(p => p.category === cat),
    [cat],
  )
  const activeCat = PARTENAIRE_CATEGORIES.find(c => c.id === cat)

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
      description: p.description || p.hint,
    })),
  }

  useEffect(() => {
    document.querySelectorAll('.partenaires-page .rev').forEach(el => el.classList.add('vis'))
  }, [cat])

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
          <div className="stag">Réseau</div>
          <h1>Nos <span className="c">partenaires</span></h1>
          <p className="partenaires-hero-sub">
            Collaborations et liens réciproques autour d&apos;{config.brand}.
          </p>
        </header>

        <div className="partenaires-menu rev">
          {/* Colonne gauche — catégories */}
          <aside className="partenaires-menu__side" aria-label="Catégories">
            {PARTENAIRE_CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                className={`partenaires-menu__cat${cat === c.id ? ' is-active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                <span className="partenaires-menu__cat-text">
                  <span className="partenaires-menu__cat-title">{c.label}</span>
                  <span className="partenaires-menu__cat-hint">{c.hint}</span>
                </span>
                <span className="partenaires-menu__cat-chev" aria-hidden>›</span>
              </button>
            ))}
            <div className="partenaires-menu__side-foot">
              <Link to="/contact" className="partenaires-menu__express">
                <span aria-hidden>⚡</span> Devenir partenaire
              </Link>
            </div>
          </aside>

          {/* Colonne droite — liste */}
          <div className="partenaires-menu__main">
            <p className="partenaires-menu__eyebrow">· {activeCat?.label?.toUpperCase() || 'PARTENAIRES'}</p>

            <div className="partenaires-menu__featured">
              <span>Tous nos partenaires</span>
              <span aria-hidden>→</span>
            </div>

            <ul className="partenaires-menu__list">
              {filtered.length === 0 ? (
                <li className="partenaires-menu__empty">Aucun partenaire dans cette catégorie.</li>
              ) : (
                filtered.map(p => (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="partenaires-menu__item"
                    >
                      <span
                        className="partenaires-menu__icon"
                        style={{
                          borderColor: p.accent || 'var(--c)',
                          boxShadow: `0 0 16px ${(p.accent || '#00CFFF')}33`,
                        }}
                      >
                        <img src={p.logo} alt="" />
                      </span>
                      <span className="partenaires-menu__item-body">
                        <span className="partenaires-menu__item-title">{p.name}</span>
                        <span className="partenaires-menu__item-desc">{p.description || p.hint}</span>
                      </span>
                    </a>
                  </li>
                ))
              )}
            </ul>

            <div className="partenaires-menu__promo">
              <span
                className="partenaires-menu__icon partenaires-menu__icon--promo"
                aria-hidden
              >
                🔗
              </span>
              <div className="partenaires-menu__promo-text">
                <strong>Lien réciproque</strong>
                <span>Échange de liens partenaires avec {config.brand}</span>
              </div>
              <span className="partenaires-menu__badge">ACTIF</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
