import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import { useCart } from '../../hooks/useCart.jsx'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { formatPrice } from '../../lib/shop.js'

export default function Panier() {
  const { lines, total, count, setQty, removeItem, clearCart } = useCart()
  const { settings } = useShopCatalog()

  return (
    <PageLayout
      title="Panier"
      description="Votre panier Allotech72 — paiement sécurisé SumUp."
    >
      <section className="sp">
        <div className="container cart-page">
          <div className="shop-topbar">
            <div>
              <span className="stag">// Boutique</span>
              <h2 style={{ marginTop: 8 }}>Panier</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 560 }}>
                {count === 0
                  ? 'Votre panier est vide.'
                  : `${count} article${count > 1 ? 's' : ''} — total ${formatPrice(total)}`}
              </p>
            </div>
            <Link className="shop-backlink" to="/vente">← Continuer mes achats</Link>
          </div>

          {lines.length === 0 ? (
            <div className="shop-empty">
              <p>Aucun article pour le moment.</p>
              <Link to="/vente" className="shop-btn primary" style={{ display: 'inline-flex', marginTop: 12 }}>
                Voir la boutique
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-lines">
                {lines.map(({ product, qty, lineTotal }) => (
                  <div key={product.id} className="cart-line">
                    <div className="cart-line-media">
                      {product.image ? (
                        <img src={product.image} alt="" />
                      ) : (
                        <span aria-hidden>📦</span>
                      )}
                    </div>
                    <div className="cart-line-body">
                      <div className="cart-line-title">{product.title}</div>
                      <div className="cart-line-price">{formatPrice(product.price)} / unité</div>
                      <div className="cart-line-qty">
                        <button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Moins">−</button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Plus">+</button>
                      </div>
                    </div>
                    <div className="cart-line-end">
                      <div className="cart-line-total">{formatPrice(lineTotal)}</div>
                      <button type="button" className="cart-line-remove" onClick={() => removeItem(product.id)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <div className="cart-summary-actions">
                  <button type="button" className="shop-btn" onClick={clearCart}>
                    Vider le panier
                  </button>
                  {settings.sumupEnabled ? (
                    <Link to="/panier/paiement" className="shop-btn primary">
                      Payer avec SumUp →
                    </Link>
                  ) : (
                    <p className="cart-sumup-hint">
                      Paiement en ligne bientôt disponible. Contactez-nous pour finaliser la commande.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
