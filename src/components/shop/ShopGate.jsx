import { Link } from 'react-router-dom'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import config from '../../config.js'

/** Bloque /boutique et /panier quand la boutique est désactivée (admin). */
export default function ShopGate({ children }) {
  const { settings, loading } = useShopCatalog()

  if (loading) {
    return (
      <div className="sp" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--dim)' }}>
        Chargement…
      </div>
    )
  }

  if (settings.shopEnabled !== true) {
    return (
      <div className="sp">
        <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
          <span className="stag">Boutique</span>
          <h1 style={{ margin: '0 0 12px' }}>
            Boutique <span className="c">indisponible</span>
          </h1>
          <p className="sub" style={{ margin: '0 auto 24px' }}>
            La vente en ligne est temporairement fermée. Pour un devis ou une disponibilité, contactez-moi.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">
              📞 {config.telephone}
            </a>
            <Link to="/" className="bm bo">
              Accueil →
            </Link>
            <a href="/#contact" className="bm bo">
              Contact →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return children
}
