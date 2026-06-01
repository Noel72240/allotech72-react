import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import ShopProductCard from '../../components/shop/ShopProductCard.jsx'
import config from '../../config.js'
import { SHOP_CATEGORIES } from '../../data/shopCatalog.js'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'

const SECTIONS = [
  { id: 'all', label: 'Tout voir' },
  { id: 'neuf', label: 'Neuf' },
  { id: 'occasion', label: 'Occasion' },
]

export default function VenteHub() {
  const { getProducts, loading, settings } = useShopCatalog()
  const [section, setSection] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const neufCategories = useMemo(
    () => SHOP_CATEGORIES.filter(c => c.section === 'neuf'),
    [],
  )

  const products = useMemo(() => {
    let list = getProducts(section === 'all' ? {} : { section })
    if (section === 'neuf' && categoryId !== 'all') {
      list = list.filter(p => p.categoryId === categoryId)
    }
    return list
  }, [getProducts, section, categoryId])

  const onSectionChange = id => {
    setSection(id)
    setCategoryId('all')
  }

  const shopOff = settings.shopEnabled === false

  return (
    <PageLayout
      title="Boutique"
      description="Boutique Allotech72 : matériel informatique et téléphonie (neuf et occasion). Achat en ligne, retrait ou Mondial Relay."
    >
      <section className="sp">
        <div className="container">
          <div className="shop-hero shop-hero-compact">
            <span className="stag">Boutique</span>
            <h2>
              Acheter <span className="c">en ligne</span>
            </h2>
            <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 720 }}>
              Produits disponibles immédiatement — paiement sécurisé, retrait à Lombron ou envoi Mondial Relay.
            </p>
            <div className="shop-hero-actions">
              <a href={`tel:${config.telBrut}`} className="shop-call">
                📞 Une question ? {config.telephone}
              </a>
              <Link to="/panier" className="shop-hero-cart">
                🛒 Mon panier
              </Link>
            </div>
          </div>

          {shopOff ? (
            <div className="shop-empty">
              La boutique est momentanément indisponible.{' '}
              <a href={`tel:${config.telBrut}`}>Appelez-moi</a> pour vos demandes.
            </div>
          ) : (
            <>
              <div className="shop-filters" role="tablist" aria-label="Filtrer la boutique">
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={section === s.id}
                    className={`shop-filter-chip${section === s.id ? ' active' : ''}`}
                    onClick={() => onSectionChange(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {section === 'neuf' && (
                <div className="shop-filters shop-filters-sub">
                  <button
                    type="button"
                    className={`shop-filter-chip small${categoryId === 'all' ? ' active' : ''}`}
                    onClick={() => setCategoryId('all')}
                  >
                    Toutes catégories
                  </button>
                  {neufCategories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`shop-filter-chip small${categoryId === c.id ? ' active' : ''}`}
                      onClick={() => setCategoryId(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="shop-empty">Chargement des produits…</div>
              ) : products.length === 0 ? (
                <div className="shop-empty">
                  Aucun produit dans cette sélection pour le moment.{' '}
                  <Link to="/boutique/neuf">Parcourir par catégorie</Link> ou{' '}
                  <a href={`tel:${config.telBrut}`}>contactez-moi</a>.
                </div>
              ) : (
                <div className="shop-grid shop-grid-hub">
                  {products.map(p => (
                    <ShopProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

              <div className="shop-hub-links">
                <span className="shop-hub-links-label">Accès rapide</span>
                <Link to="/boutique/neuf">Catégories neuf →</Link>
                <Link to="/boutique/occasion">Voir l’occasion →</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
