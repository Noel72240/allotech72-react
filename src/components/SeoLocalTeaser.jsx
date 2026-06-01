import { Link } from 'react-router-dom'
import { SEO_FOOTER_SECONDARY } from '../data/seoPages.js'

/** Maillage interne discret sur l’accueil — pas dans le menu principal */
export default function SeoLocalTeaser() {
  const [a, b] = SEO_FOOTER_SECONDARY
  return (
    <div className="container">
      <p className="seo-local-teaser rev">
        Besoin d’aide sur un cas précis ? Guides{' '}
        <Link to={a.to}>{a.label}</Link>
        {' · '}
        <Link to={b.to}>{b.label}</Link>
        {' — '}
        <Link to="/depannage-informatique-le-mans">tous les services à Le Mans & en Sarthe</Link>.
      </p>
    </div>
  )
}
