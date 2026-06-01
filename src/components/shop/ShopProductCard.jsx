import config from '../../config.js'
import { useCart } from '../../hooks/useCart.jsx'
import { canAddToCart, formatPrice, availabilityLabel } from '../../lib/shop.js'

export default function ShopProductCard({ product }) {
  const { addItem } = useCart()
  const purchasable = canAddToCart(product)

  const onAdd = () => {
    const res = addItem(product.id, 1)
    if (!res.ok && res.msg) window.alert(res.msg)
  }

  return (
    <article className="shop-card">
      <div className="shop-card-media">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" />
        ) : (
          <div className="shop-card-media-placeholder" aria-hidden>📦</div>
        )}
      </div>

      <div className="shop-card-top">
        <div className="shop-badges">
          <span className={`shop-badge ${product.availability === 'vendu' ? 'sold' : ''}`}>
            {availabilityLabel(product.availability)}
          </span>
          {product.condition ? (
            <span className="shop-badge subtle">{product.condition}</span>
          ) : null}
        </div>
        <div className="shop-price">{formatPrice(product.price)}</div>
      </div>

      <div className="shop-title">{product.title}</div>

      {Array.isArray(product.highlights) && product.highlights.length > 0 && (
        <ul className="shop-highlights">
          {product.highlights.slice(0, 5).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <div className="shop-actions">
        {purchasable ? (
          <button type="button" className="shop-btn primary" onClick={onAdd}>
            Ajouter au panier
          </button>
        ) : (
          <a className="shop-btn primary" href={`tel:${config.telBrut}`}>
            Nous contacter
          </a>
        )}
        <a className="shop-btn" href="/#contact">
          Message
        </a>
      </div>

      <div className="shop-ref">Réf: {product.slug || product.id}</div>
    </article>
  )
}
