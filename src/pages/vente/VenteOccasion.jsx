import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import ShopProductCard from '../../components/shop/ShopProductCard.jsx'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { getShopCategories } from '../../lib/shop.js'

export default function VenteOccasion() {
  const { getProducts, loading } = useShopCatalog()
  const categories = getShopCategories('occasion')
  const products = getProducts({ section: 'occasion' })

  return (
    <PageLayout
      title="Vente occasion"
      description="PC d'occasion, écrans et pièces: produits testés et disponibles localement."
    >
      <section className="sp">
        <div className="container">
          <div className="shop-topbar">
            <div>
              <span className="stag">// Vente</span>
              <h2 style={{ marginTop: 8 }}>Occasion</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 760 }}>
                Stock limité. Ajoutez au panier ou contactez-moi pour une référence précise.
              </p>
            </div>
            <a className="shop-call" href={`tel:${config.telBrut}`}>📞 {config.telephone}</a>
          </div>

          <div className="shop-category-row">
            {categories.map(c => (
              <a key={c.id} className="shop-chip" href={`#cat-${c.id}`}>{c.label}</a>
            ))}
          </div>

          {loading ? (
            <div className="shop-empty">Chargement des produits…</div>
          ) : (
            categories.map(c => {
              const items = products.filter(p => p.categoryId === c.id)
              return (
                <div key={c.id} id={`cat-${c.id}`} className="shop-block">
                  <div className="shop-block-head">
                    <h3 style={{ marginBottom: 0 }}>{c.label}</h3>
                    <Link className="shop-backlink" to="/vente">← Retour vente</Link>
                  </div>

                  {items.length === 0 ? (
                    <div className="shop-empty">
                      Aucun produit en ligne pour le moment. Contacte-moi pour une demande.
                    </div>
                  ) : (
                    <div className="shop-grid">
                      {items.map(p => (
                        <ShopProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </PageLayout>
  )
}
