import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import { getShopCategories } from '../../lib/shop.js'

export default function VenteNeuf() {
  const categories = getShopCategories('neuf')

  return (
    <PageLayout
      title="Boutique neuf"
      description="Matériel neuf: informatique, téléphonie, accessoires téléphoniques et câbles."
    >
      <section className="sp">
        <div className="container">
          <div className="shop-topbar">
            <div>
              <span className="stag">// Boutique</span>
              <h2 style={{ marginTop: 8 }}>Neuf</h2>
              <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 760 }}>
                Choisis une catégorie. Si tu cherches une référence précise, je peux te proposer une solution adaptée.
              </p>
            </div>
            <Link className="shop-backlink" to="/boutique">← Retour boutique</Link>
          </div>

          <div className="shop-tiles">
            {categories.map(c => (
              <Link key={c.id} to={`/boutique/neuf/${c.id}`} className="shop-tile">
                <div className="shop-tile-kicker">Catégorie</div>
                <div className="shop-tile-title">{c.label}</div>
                <div className="shop-tile-desc">Voir les produits disponibles / sur commande.</div>
                <div className="shop-tile-cta">Ouvrir →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

