import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import ShopProductCard from '../../components/shop/ShopProductCard.jsx'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { getCategoryById } from '../../lib/shop.js'

export default function VenteNeufCategorie() {
  const { categoryId } = useParams()
  const { getProducts, loading } = useShopCatalog()

  const category = useMemo(() => getCategoryById(categoryId), [categoryId])
  const products = useMemo(
    () => getProducts({ section: 'neuf', categoryId }),
    [getProducts, categoryId]
  )

  const title = category ? `Neuf — ${category.label}` : 'Neuf — Catégorie'

  return (
    <PageLayout
      title={title}
      description={category ? `Produits neufs — ${category.label}.` : 'Produits neufs par catégorie.'}
    >
      <section className="sp">
        <div className="container">
          <div className="shop-topbar">
            <div>
              <span className="stag">Boutique</span>
              <h2 style={{ marginTop: 8 }}>{title}</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 760 }}>
                Disponible en stock, sur commande ou sur devis selon la référence.
              </p>
            </div>
            <div className="shop-top-actions">
              <Link className="shop-backlink" to="/boutique/neuf">← Catégories</Link>
              <a className="shop-call" href={`tel:${config.telBrut}`}>📞 {config.telephone}</a>
            </div>
          </div>

          {!category ? (
            <div className="shop-empty">
              Catégorie inconnue. <Link to="/boutique/neuf">Retour aux catégories</Link>.
            </div>
          ) : loading ? (
            <div className="shop-empty">Chargement…</div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              Pas de produits affichés pour le moment. Contacte-moi pour une demande spécifique.
            </div>
          ) : (
            <div className="shop-grid">
              {products.map(p => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
