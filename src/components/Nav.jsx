import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../config.js'
import {
  SEO_NAV_DROPDOWN_PRIMARY,
  SEO_NAV_DROPDOWN_EXTRA,
  SEO_PILLAR,
} from '../data/seoPages.js'
import CartNavButton from './shop/CartNavButton.jsx'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const closeTimer = useRef(null)
  const close = () => { setOpen(false); setDropdown(false) }
  const loc = useLocation()
  const home = loc.pathname === '/'
  const onShop = loc.pathname.startsWith('/boutique') || loc.pathname.startsWith('/panier')
  const pageActive = (path) =>
    loc.pathname === path || (path.length > 1 && loc.pathname.startsWith(`${path}/`))

  const openServices = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setDropdown(true)
  }

  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      setDropdown(false)
      closeTimer.current = null
    }, 280)
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  return (
    <>
      <nav id="nav">
        <div className="ni">

          <Link to="/" className="nav-brand" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <img src="/logoat72.png" alt="Allotech72" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(90deg,#00CFFF,#2BFF9A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Allotech72
              </span>
              <span style={{ fontSize: '.55rem', color: 'rgba(180,205,230,0.55)', letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginTop: 4 }}>
                Dépannage & Web
              </span>
            </div>
          </Link>

          <ul className="nl">
            <li
              className={`nav-services${dropdown ? ' is-open' : ''}`}
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <a
                href={home ? '#services' : '/#services'}
                className="nav-services__trigger"
                aria-expanded={dropdown}
                aria-haspopup="true"
              >
                Services
                <span className="nav-services__chev" aria-hidden="true">▼</span>
              </a>

              <div className="nav-services__panel" hidden={!dropdown} role="menu">
                <div className="nav-services__bar">
                  <div className="nav-services__bar-top">
                    <span className="nav-services__brand">Allotech72</span>
                    <span className="nav-services__badge">Sarthe</span>
                  </div>
                  <p className="nav-services__bar-sub">
                    Dépannage, réparation &amp; web — à domicile ou à distance
                  </p>
                  <div className="nav-services__bar-meta">
                    <span>📍 Le Mans &amp; environs</span>
                    <span>⚡ Intervention rapide</span>
                    <span>💬 Devis gratuit</span>
                  </div>
                </div>
                <div className="nav-services__list">
                  {[...SEO_NAV_DROPDOWN_PRIMARY, SEO_NAV_DROPDOWN_EXTRA].map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setDropdown(false)}
                      className={`nav-services__row${pageActive(l.to) ? ' is-active' : ''}`}
                      role="menuitem"
                    >
                      <span className="nav-services__ico" aria-hidden="true">{l.ico}</span>
                      <span className="nav-services__txt">
                        <span className="nav-services__name">{l.label}</span>
                        <span className="nav-services__hint">{l.hint}</span>
                        {l.desc ? <span className="nav-services__desc">{l.desc}</span> : null}
                        {l.tags?.length ? (
                          <span className="nav-services__tags">
                            {l.tags.map((t) => (
                              <span key={t} className="nav-services__tag">{t}</span>
                            ))}
                          </span>
                        ) : null}
                      </span>
                      <span className="nav-services__arrow" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
                <div className="nav-services__foot">
                  <Link
                    to={SEO_PILLAR.to}
                    onClick={() => setDropdown(false)}
                    className="nav-services__cta"
                    role="menuitem"
                  >
                    Tous les services
                  </Link>
                </div>
              </div>
            </li>

            <li><a href={home ? '#avantages' : '/#avantages'}>Avantages</a></li>
            <li><a href={home ? '#qui' : '/#qui'}>Qui suis-je</a></li>
            <li><a href={home ? '#zone' : '/#zone'}>Zone</a></li>
            <li><Link to="/avis" className={pageActive('/avis') ? 'nav-page-active' : ''}>Avis</Link></li>
            <li><Link to="/galerie" className={pageActive('/galerie') ? 'nav-page-active' : ''}>Galerie</Link></li>
            <li><Link to="/outils" className={pageActive('/outils') ? 'nav-page-active' : ''}>Outils</Link></li>
            <li><Link to="/partenaires" className={pageActive('/partenaires') ? 'nav-page-active' : ''}>Partenaires</Link></li>
            <li><Link to="/actu" className={pageActive('/actu') ? 'nav-page-active' : ''}>Actu</Link></li>
            <li><Link to="/boutique" className={`nav-shop-cta${pageActive('/boutique') ? ' is-active' : ''}`}>Boutique</Link></li>
            <li><CartNavButton /></li>
            <li>
              <a href={`tel:${config.telBrut}`} className="ncta">{config.telephone}</a>
            </li>
          </ul>

          <div className="mob-controls" style={{ display: 'none', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <a
              href={`tel:${config.telBrut}`}
              className="tel-mobile"
              style={{
                background: 'linear-gradient(135deg,#00CFFF,#00AEEF)',
                color: '#040B14',
                fontWeight: 700,
                padding: '7px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '.78rem',
                fontFamily: "'Orbitron',sans-serif",
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span aria-hidden>📞</span>
              <span className="tel-mobile-txt">Appeler</span>
            </a>
            {onShop ? <CartNavButton /> : null}
            <button
              className={`burger${open ? ' open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
              style={{ flexShrink: 0 }}
            >
              <span className="burger-line top" aria-hidden />
              <span className="burger-line mid" aria-hidden />
              <span className="burger-line bot" aria-hidden />
            </button>
          </div>

        </div>
      </nav>

      <div className={`mob${open ? ' open' : ''}`}>
        <Link to="/boutique" className="mob-shop-cta" onClick={close}>🛒 Voir la boutique</Link>

        <a href={home ? '#services' : '/#services'} onClick={close}>Services</a>

        <div className="mob-services">
          <div className="shop-guides-title">Guides locaux</div>
          {SEO_NAV_DROPDOWN_PRIMARY.map((l) => (
            <Link key={l.to} to={l.to} onClick={close} className="mob-services__link">
              {l.label}{l.hint ? ` · ${l.hint}` : ''}
            </Link>
          ))}
          <Link to={SEO_NAV_DROPDOWN_EXTRA.to} onClick={close} className="mob-services__link">
            {SEO_NAV_DROPDOWN_EXTRA.label}
            {SEO_NAV_DROPDOWN_EXTRA.hint ? ` · ${SEO_NAV_DROPDOWN_EXTRA.hint}` : ''}
          </Link>
        </div>

        <a href={home ? '#avantages' : '/#avantages'} onClick={close}>Avantages</a>
        <a href={home ? '#qui' : '/#qui'} onClick={close}>Qui suis-je ?</a>
        <a href={home ? '#zone' : '/#zone'} onClick={close}>Zone</a>
        <Link to="/avis" className={pageActive('/avis') ? 'nav-page-active' : ''} onClick={close}>Avis</Link>
        <Link to="/galerie" className={pageActive('/galerie') ? 'nav-page-active' : ''} onClick={close}>Galerie</Link>
        <Link to="/outils" className={pageActive('/outils') ? 'nav-page-active' : ''} onClick={close}>Outils gratuits</Link>
        <Link to="/partenaires" className={pageActive('/partenaires') ? 'nav-page-active' : ''} onClick={close}>Partenaires</Link>
        <Link to="/actu" className={pageActive('/actu') ? 'nav-page-active' : ''} onClick={close}>Actu</Link>
        <Link to="/panier" onClick={close}>Panier 🛒</Link>
        <a href={home ? '#contact' : '/#contact'} onClick={close}>Contact</a>
        <a href={`tel:${config.telBrut}`} style={{ color: 'var(--c)', fontFamily: "'Orbitron',sans-serif", fontSize: '1.2rem' }}>
          📞 {config.telephone}
        </a>
      </div>

      <style>{`
        @media (max-width: 950px) { .mob-controls { display: flex !important; } .tel-mobile { display: flex !important; } }
      `}</style>
    </>
  )
}
