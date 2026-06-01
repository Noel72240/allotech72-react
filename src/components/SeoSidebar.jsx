import { NavLink } from 'react-router-dom'
import { SEO_SIDEBAR_LINKS } from '../data/seoPages.js'

export default function SeoSidebar() {
  return (
    <aside className="seo-aside" aria-label="Guides locaux Allotech72">
      <div className="seo-aside-card">
        <p className="seo-aside-kicker">Sarthe & Le Mans</p>
        <h2 className="seo-aside-title">Guides locaux</h2>
        <nav className="seo-aside-nav">
          {SEO_SIDEBAR_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => 'seo-aside-link' + (isActive ? ' is-active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
