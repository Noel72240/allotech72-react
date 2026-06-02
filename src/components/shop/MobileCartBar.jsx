import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.jsx'
import { formatPrice } from '../../lib/shop.js'

export default function MobileCartBar() {
  const { count, total } = useCart()

  return (
    <div className="mobile-cartbar" role="region" aria-label="Accès rapide au panier">
      <div className="mobile-cartbar-inner">
        <div className="mobile-cartbar-left">
          <div className="mobile-cartbar-kicker">Panier</div>
          <div className="mobile-cartbar-meta">
            <span className="mobile-cartbar-count">
              {count} article{count > 1 ? 's' : ''}
            </span>
            <span className="mobile-cartbar-sep" aria-hidden>•</span>
            <span className="mobile-cartbar-total">{formatPrice(total)}</span>
          </div>
        </div>
        <Link to="/panier" className="mobile-cartbar-cta" aria-label="Ouvrir le panier">
          🛒 Voir
        </Link>
      </div>
    </div>
  )
}

