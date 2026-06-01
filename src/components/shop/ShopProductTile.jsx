import { useState } from 'react'
import config from '../../config.js'
import { useCart } from '../../hooks/useCart.jsx'
import { canAddToCart, formatPrice, availabilityLabel, getProductStock } from '../../lib/shop.js'
import ShopImageLightbox from './ShopImageLightbox.jsx'

/** Carte produit compacte — style e-commerce (carousel). */
export default function ShopProductTile({ product }) {
  const { addItem } = useCart()
  const [lightbox, setLightbox] = useState(false)
  const purchasable = canAddToCart(product)
  const stock = getProductStock(product)

  const onAdd = e => {
    e.preventDefault()
    e.stopPropagation()
    const res = addItem(product.id, 1)
    if (!res.ok && res.msg) window.alert(res.msg)
  }

  return (
    <>
      <article className="shop-tile-ecom">
        <button
          type="button"
          className="shop-tile-ecom-media"
          onClick={() => product.image && setLightbox(true)}
          aria-label={product.image ? `Voir ${product.title}` : undefined}
        >
          {product.image ? (
            <img src={product.image} alt={product.title} loading="lazy" />
          ) : (
            <span className="shop-tile-ecom-ph" aria-hidden>📦</span>
          )}
        </button>

        <div className="shop-tile-ecom-body">
          <h4 className="shop-tile-ecom-title">{product.title}</h4>

          <div className="shop-tile-ecom-meta">
            <span className="shop-tile-ecom-seller">Allotech72 · Sarthe</span>
          </div>

          <div className="shop-tile-ecom-price">{formatPrice(product.price)}</div>

          {stock !== null && (
            <p className="shop-tile-ecom-stock">
              {stock === 0 ? 'Rupture' : stock <= 3 ? `${stock} en stock` : 'En stock'}
            </p>
          )}

          <span className={`shop-tile-ecom-badge${product.availability === 'vendu' ? ' sold' : ''}`}>
            {availabilityLabel(product.availability)}
          </span>

          {purchasable ? (
            <button type="button" className="shop-tile-ecom-cart" onClick={onAdd}>
              Ajouter au panier
            </button>
          ) : (
            <a className="shop-tile-ecom-cart outline" href={`tel:${config.telBrut}`}>
              Nous contacter
            </a>
          )}
        </div>
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
