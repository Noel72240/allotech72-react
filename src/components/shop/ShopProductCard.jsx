import { useState } from 'react'
import config from '../../config.js'
import { useCart } from '../../hooks/useCart.jsx'
import { canAddToCart, formatPrice, availabilityLabel, getProductStock } from '../../lib/shop.js'
import ShopImageLightbox from './ShopImageLightbox.jsx'

export default function ShopProductCard({ product }) {
  const { addItem } = useCart()
  const [lightbox, setLightbox] = useState(false)
  const purchasable = canAddToCart(product)
  const stock = getProductStock(product)

  const onAdd = () => {
    const res = addItem(product.id, 1)
    if (!res.ok && res.msg) window.alert(res.msg)
  }

  const openLightbox = () => {
    if (product.image) setLightbox(true)
  }

  return (
    <>
      <article className="shop-card">
        <div
          className={`shop-card-media${product.image ? ' is-clickable' : ''}`}
          onClick={openLightbox}
          onKeyDown={e => {
            if (product.image && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              openLightbox()
            }
          }}
          role={product.image ? 'button' : undefined}
          tabIndex={product.image ? 0 : undefined}
          aria-label={product.image ? `Agrandir : ${product.title}` : undefined}
        >
          {product.image ? (
            <>
              <img src={product.image} alt={product.title} loading="lazy" />
              <span className="shop-card-media-hint" aria-hidden>🔍 Agrandir</span>
            </>
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

        {stock !== null && stock <= 3 && (
          <p className="shop-stock-hint">
            {stock === 1 ? '1 seul exemplaire disponible' : `${stock} en stock`}
          </p>
        )}

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

      {lightbox && (
        <ShopImageLightbox
          src={product.image}
          title={product.title}
          onClose={() => setLightbox(false)}
        />
      )}
    </>
  )
}
