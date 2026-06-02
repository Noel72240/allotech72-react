import { Link } from 'react-router-dom'
import { useCookies } from '../hooks/useCookies.jsx'
import config, { fullName } from '../config.js'
import { SEO_FOOTER_SECONDARY, SEO_PILLAR } from '../data/seoPages.js'

const openModal = (id) => {
  document.getElementById(id)?.classList.add('open')
  document.body.style.overflow = 'hidden'
}

export default function Footer() {
  const { reset } = useCookies()
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="container">
        <div className="fg2">
          <div className="fb">
            <a href="#hero" className="footer-logo-link">
              <img src="/logo-allotech72.png" alt="Allotech72" className="footer-logo-img" />
            </a>
            <p>Dépannage informatique à domicile sur Le Mans et le secteur Sarthe. Réparation PC, téléphone, tablette, création de sites internet et applications mobiles.</p>
            <p className="sr">SIRET : {config.siret} – {config.statut} – {fullName()}</p>
            <p className="sr">TVA non applicable, art. 293B du CGI</p>
          </div>

          <div className="fcol">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/boutique" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Boutique (neuf & occasion)</Link></li>
              <li><Link to="/depannage-informatique-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Dépannage Le Mans</Link></li>
              <li><Link to="/reparation-ordinateur-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Réparation PC Le Mans</Link></li>
              <li><Link to="/reparateur-telephone-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Réparateur téléphone</Link></li>
              <li><Link to="/creation-site-internet-sarthe" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Création site Sarthe</Link></li>
              {SEO_FOOTER_SECONDARY.map((l) => (
                <li key={l.to}><Link to={l.to} style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.88rem' }}>{l.label}</Link></li>
              ))}
              <li>
                <Link to={SEO_PILLAR.to} style={{ color:'var(--c)', textDecoration:'none', fontSize:'.88rem', fontWeight:600 }}>
                  {SEO_PILLAR.label} →
                </Link>
              </li>
              <li><a href="#services">Mes services</a></li>
              <li><a href="#qui">Qui suis-je ?</a></li>
              <li><a href="#zone">Zone</a></li>
              <li><Link to="/avis">Avis clients</Link></li>
              <li><Link to="/galerie">Galerie</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="fcol">
            <h4>Légal & Confidentialité</h4>
            <ul>
              <li><a href="#" onClick={e => { e.preventDefault(); openModal('m-legal') }}>Mentions légales</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); openModal('m-conf') }}>Politique de confidentialité</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); openModal('m-cgv') }}>CGV boutique</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); reset() }}>🍪 Gestion des cookies</a></li>
              <li><a href={`tel:${config.telBrut}`}>{config.telephone}</a></li>
              {config.facebook && <li><a href={config.facebook} target="_blank" rel="noopener">Facebook</a></li>}
            </ul>
          </div>
        </div>

        <div className="fbot">
          <p>© {year} {config.brand} – {fullName()} – Tous droits réservés</p>
          <div className="ll">
            <a href="#" onClick={e => { e.preventDefault(); openModal('m-legal') }}>Mentions légales</a>
            <a href="#" onClick={e => { e.preventDefault(); openModal('m-conf') }}>Confidentialité</a>
            <a href="#" onClick={e => { e.preventDefault(); openModal('m-cgv') }}>CGV</a>
            <a href="#" onClick={e => { e.preventDefault(); reset() }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
