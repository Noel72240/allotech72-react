import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'

export default function VenteHub() {
  return (
    <PageLayout
      title="Vente"
      description="Vente de matériel informatique et téléphonie (neuf et occasion). PC d'occasion, écrans, pièces, accessoires et câbles."
    >
      <section className="sp">
        <div className="container">
          <div className="shop-hero">
            <span className="stag">// Vente</span>
            <h2>
              Matériel <span className="c">neuf</span> & <span className="g">occasion</span>
            </h2>
            <p className="sub" style={{ marginLeft: 0, marginRight: 0, maxWidth: 760 }}>
              Une sélection de produits disponibles localement. Pour réserver ou demander une référence précise, contacte-moi et je te réponds rapidement.
            </p>
          </div>

          <div className="shop-tiles">
            <Link to="/vente/occasion" className="shop-tile">
              <div className="shop-tile-kicker">Occasion</div>
              <div className="shop-tile-title">PC, écrans, pièces</div>
              <div className="shop-tile-desc">Produits testés, nettoyés, stock limité.</div>
              <div className="shop-tile-cta">Voir l’occasion →</div>
            </Link>

            <Link to="/vente/neuf" className="shop-tile alt">
              <div className="shop-tile-kicker">Neuf</div>
              <div className="shop-tile-title">Catégories</div>
              <div className="shop-tile-desc">Informatique, téléphonie, accessoires, câbles.</div>
              <div className="shop-tile-cta">Voir le neuf →</div>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

