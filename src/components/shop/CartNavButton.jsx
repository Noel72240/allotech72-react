import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.jsx'

export default function CartNavButton() {
  const { count } = useCart()

  return (
    <Link to="/panier" className="cart-nav-btn" aria-label={`Panier (${count} article${count > 1 ? 's' : ''})`}>
      <span className="cart-nav-ico" aria-hidden>🛒</span>
      {count > 0 && <span className="cart-nav-badge">{count > 99 ? '99+' : count}</span>}
    </Link>
  )
}
