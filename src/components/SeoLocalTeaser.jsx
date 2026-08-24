import { Link } from 'react-router-dom'
import {
  SEO_ALL_SERVICE_PAGES,
  SEO_CITY_PAGES,
  SEO_FOOTER_SECONDARY,
  SEO_PILLAR,
} from '../data/seoPages.js'

/** Maillage interne fort sur l’accueil — guides SEO locaux */
export default function SeoLocalTeaser() {
  const links = [
    SEO_PILLAR,
    ...SEO_FOOTER_SECONDARY,
    ...SEO_ALL_SERVICE_PAGES.filter(
      (p) =>
        p.to !== SEO_PILLAR.to &&
        !SEO_FOOTER_SECONDARY.some((s) => s.to === p.to),
    ).slice(0, 8),
  ]

  return (
    <div className="container">
      <div className="seo-local-teaser rev">
        <p className="seo-local-teaser__title">Guides locaux — Le Mans & Sarthe</p>
        <ul className="seo-local-teaser__links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <p className="seo-local-teaser__title" style={{ marginTop: 18 }}>Dépannage par ville</p>
        <ul className="seo-local-teaser__links">
          <li><Link to="/depannage-informatique-le-mans">Le Mans</Link></li>
          {SEO_CITY_PAGES.map((c) => (
            <li key={c.to}><Link to={c.to}>{c.name}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
