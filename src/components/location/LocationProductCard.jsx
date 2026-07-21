import config, { siteDomainForEmail } from '../../config.js'
import {
  formatLocationPrice,
  locationAvailabilityLabel,
} from '../../data/locationCatalog.js'

export default function LocationProductCard({ item }) {
  const email = `contact@${siteDomainForEmail()}`
  const mailSubject = encodeURIComponent(`Location — ${item.title}`)
  const mailBody = encodeURIComponent(
    `Bonjour,\n\nJe souhaite louer : ${item.title}\nDurée souhaitée : …\nDates : …\n\nMerci.`,
  )
  const mailto = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`

  return (
    <article className="shop-card location-card">
      <div className="shop-card-media">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <div className="shop-card-media-placeholder" aria-hidden>
            📦
          </div>
        )}
      </div>

      <div className="shop-card-top">
        <div className="shop-badges">
          <span className={`shop-badge${item.availability === 'indispo' ? ' sold' : ''}`}>
            {locationAvailabilityLabel(item.availability)}
          </span>
          {item.condition ? <span className="shop-badge subtle">{item.condition}</span> : null}
        </div>
        <div className="shop-price">{formatLocationPrice(item)}</div>
      </div>

      <div className="shop-title">{item.title}</div>

      {Array.isArray(item.highlights) && item.highlights.length > 0 && (
        <ul className="shop-highlights">
          {item.highlights.slice(0, 5).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <div className="shop-actions">
        {item.availability === 'indispo' ? (
          <button type="button" className="shop-btn" disabled>
            Indisponible
          </button>
        ) : (
          <>
            <a className="shop-btn primary" href={`tel:${config.telBrut}`}>
              Réserver · {config.telephone}
            </a>
            <a className="shop-btn" href={mailto}>
              Demander un devis
            </a>
          </>
        )}
      </div>
    </article>
  )
}
