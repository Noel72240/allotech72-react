import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import ShopProductCarousel from '../../components/shop/ShopProductCarousel.jsx'
import ShopBannerCarousel from '../../components/shop/ShopBannerCarousel.jsx'
import QreateurPromo from '../../components/QreateurPromo.jsx'
import config from '../../config.js'
import { SHOP_CATEGORIES } from '../../data/shopCatalog.js'
import { useShopCatalog } from '../../hooks/useShopCatalog.jsx'
import { getCategoryById } from '../../lib/shop.js'

const SECTIONS = [
  { id: 'all', label: 'Tout voir' },
  { id: 'neuf', label: 'Neuf' },
  { id: 'occasion', label: 'Occasion' },
]

const TRUST_ITEMS = [
  { icon: '🔒', text: 'Paiement sécurisé SumUp' },
  { icon: '📦', text: 'Retrait gratuit à Lombron' },
  { icon: '🚚', text: 'Mondial Relay disponible' },
  { icon: '✓', text: 'Produits testés & garantis' },
]

function buildCarouselRows({ section, categoryId, getProducts, neufCategories }) {
  if (section === 'neuf' && categoryId !== 'all') {
    const cat = getCategoryById(categoryId)
    const products = getProducts({ section: 'neuf', categoryId })
    if (!products.length) return []
    return [{
      id: categoryId,
      title: cat ? `Neuf — ${cat.label}` : 'Produits neufs',
      products,
      seeAllLink: `/boutique/neuf/${categoryId}`,
    }]
  }

  if (section === 'neuf') {
    return neufCategories
      .map(cat => ({
        id: cat.id,
        title: cat.label,
        products: getProducts({ section: 'neuf', categoryId: cat.id }),
        seeAllLink: `/boutique/neuf/${cat.id}`,
      }))
      .filter(row => row.products.length > 0)
  }

  if (section === 'occasion') {
    const products = getProducts({ section: 'occasion' })
    if (!products.length) return []
    return [{
      id: 'occasion',
      title: 'Occasion — PC, écrans & pièces',
      products,
      seeAllLink: '/boutique/occasion',
    }]
  }

  const rows = []

  neufCategories.forEach(cat => {
    const products = getProducts({ section: 'neuf', categoryId: cat.id })
    if (products.length) {
      rows.push({
        id: cat.id,
        title: `Neuf — ${cat.label}`,
        products,
        seeAllLink: `/boutique/neuf/${cat.id}`,
      })
    }
  })

  const occAll = getProducts({ section: 'occasion' })
  if (occAll.length) {
    rows.push({
      id: 'occasion',
      title: 'Occasion — bonnes affaires',
      products: occAll,
      seeAllLink: '/boutique/occasion',
    })
  }

  if (rows.length === 0) {
    const all = getProducts()
    if (all.length) {
      rows.push({
        id: 'all',
        title: 'Nos produits',
        products: all,
        seeAllLink: null,
      })
    }
  }

  return rows
}

export default function VenteHub() {
  const { getProducts, loading, settings } = useShopCatalog()
  const [section, setSection] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const neufCategories = useMemo(
    () => SHOP_CATEGORIES.filter(c => c.section === 'neuf'),
    [],
  )

  const carouselRows = useMemo(
    () => buildCarouselRows({ section, categoryId, getProducts, neufCategories }),
    [section, categoryId, getProducts, neufCategories],
  )

  const onSectionChange = id => {
    setSection(id)
    setCategoryId('all')
  }

  const shopOff = settings.shopEnabled !== true

  return (
    <PageLayout
      title="Boutique"
      description="Boutique Allotech72 : matériel informatique et téléphonie (neuf et occasion). Achat en ligne, retrait ou Mondial Relay."
    >
      <section className="sp shop-page-ecom">
        <div className="container">
          <div className="shop-trust-bar">
            {TRUST_ITEMS.map(item => (
              <span key={item.text} className="shop-trust-item">
                <span aria-hidden>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>

          <QreateurPromo variant="featured" />

          <ShopBannerCarousel banners={settings.banners} />

          <div className="shop-hero shop-hero-compact shop-hero-ecom">
            <div>
              <span className="stag">Boutique en ligne</span>
              <h2>
                Nos <span className="c">produits</span>
              </h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 640 }}>
                Parcourez, ajoutez au panier et payez en ligne. Livraison ou retrait près du Mans.
              </p>
            </div>
            <div className="shop-hero-actions">
              <Link to="/panier" className="shop-hero-cart shop-hero-cart-primary">
                🛒 Mon panier
              </Link>
              <a href={`tel:${config.telBrut}`} className="shop-call shop-call-sm">
                📞 {config.telephone}
              </a>
            </div>
          </div>

          {shopOff ? (
            <div className="shop-empty">
              La boutique est momentanément indisponible.{' '}
              <a href={`tel:${config.telBrut}`}>Appelez-moi</a> pour vos demandes.
            </div>
          ) : (
            <>
              <div className="shop-filters shop-filters-ecom" role="tablist" aria-label="Filtrer la boutique">
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
              ) : carouselRows.length === 0 ? (
                <div className="shop-empty">
                  Aucun produit pour le moment.{' '}
                  <a href={`tel:${config.telBrut}`}>Contactez-moi</a> pour une demande sur mesure.
                </div>
              ) : (
                <div className="shop-carousels">
                  {carouselRows.map(row => (
                    <ShopProductCarousel
                      key={row.id}
                      title={row.title}
                      products={row.products}
                      seeAllLink={row.seeAllLink}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
