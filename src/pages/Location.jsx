import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import LocationProductCard from '../components/location/LocationProductCard.jsx'
import config, { siteDomainForEmail } from '../config.js'
import { LOCATION_CATEGORIES } from '../data/locationCatalog.js'
import { fetchLocationItems, filterLocationItems } from '../lib/location.js'

const TRUST_ITEMS = [
  { icon: '✓', text: 'Matériel testé avant départ' },
  { icon: '📅', text: 'Location à la journée ou à la semaine' },
  { icon: '📍', text: 'Remise / retrait près du Mans' },
  { icon: '💬', text: 'Devis rapide sur mesure' },
]

export default function Location() {
  const [categoryId, setCategoryId] = useState('all')
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const email = `contact@${siteDomainForEmail()}`

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const rows = await fetchLocationItems({ allowStaticFallback: true })
        if (!cancelled) setAllItems(rows)
      } catch {
        if (!cancelled) setAllItems([])
      }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const items = useMemo(
    () => filterLocationItems(allItems, categoryId),
    [allItems, categoryId],
  )

  return (
    <PageLayout
      title="Location de matériel informatique"
      description="Location PC portable, écrans, vidéoprojecteur et matériel réseau près du Mans et en Sarthe. Tarifs à la journée ou à la semaine — Allotech72."
    >
      <section className="sp shop-page-ecom location-page">
        <div className="container">
          <div className="shop-trust-bar">
            {TRUST_ITEMS.map(item => (
              <span key={item.text} className="shop-trust-item">
                <span aria-hidden>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>

          <div className="shop-hero shop-hero-compact shop-hero-ecom">
            <div>
              <span className="stag">Location matériel</span>
              <h1 style={{ margin: 0 }}>
                Location <span className="c">informatique</span>
              </h1>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 640 }}>
                PC portables, écrans, vidéoprojecteur, réseau — pour un remplacement, une formation,
                un événement ou un besoin ponctuel près du Mans.
              </p>
            </div>
            <div className="shop-hero-actions">
              <Link to="/boutique" className="shop-hero-cart">
                🛒 Boutique
              </Link>
              <a href={`tel:${config.telBrut}`} className="shop-call shop-call-sm">
                📞 {config.telephone}
              </a>
            </div>
          </div>

          <div className="shop-filters shop-filters-ecom" role="tablist" aria-label="Filtrer la location">
            {LOCATION_CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={categoryId === c.id}
                className={`shop-filter-chip${categoryId === c.id ? ' active' : ''}`}
                onClick={() => setCategoryId(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="shop-empty">Chargement du matériel…</div>
          ) : items.length === 0 ? (
            <div className="shop-empty">
              Aucun matériel dans cette catégorie.{' '}
              <a href={`tel:${config.telBrut}`}>Appelez-moi</a> pour une demande sur mesure.
            </div>
          ) : (
            <div className="location-grid">
              {items.map(item => (
                <LocationProductCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="location-note">
            <h2>Comment ça marche ?</h2>
            <ol>
              <li>Choisissez le matériel et la durée (jour / semaine / plus long).</li>
              <li>
                Appelez le <a href={`tel:${config.telBrut}`}>{config.telephone}</a> ou écrivez à{' '}
                <a href={`mailto:${email}`}>{email}</a>.
              </li>
              <li>Remise ou retrait près de Lombron / Le Mans — matériel contrôlé avant départ.</li>
            </ol>
            <p>
              Besoin d’un kit complet (PC + écran + câbles) ? On compose une offre adaptée.
              Pour acheter plutôt que louer, voir la{' '}
              <Link to="/boutique">boutique neuf &amp; occasion</Link>.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
