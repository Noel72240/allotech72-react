import { Link, useLocation } from 'react-router-dom'
import config from '../config.js'

const HIDDEN = ['/admin', '/panier', '/boutique']

export default function StickyCallBar() {
  const { pathname } = useLocation()
  if (HIDDEN.some((p) => pathname.startsWith(p))) return null

  return (
    <div className="sticky-call-bar" role="region" aria-label="Appel rapide">
      <a href={`tel:${config.telBrut}`} className="sticky-call-bar__call">
        📞 Appeler — {config.telephone}
      </a>
      <Link to="/prendre-rdv" className="sticky-call-bar__rdv">
        Prendre RDV
      </Link>
    </div>
  )
}
