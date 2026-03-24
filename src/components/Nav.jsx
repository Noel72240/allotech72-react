import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../config.js'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const loc   = useLocation()
  const home  = loc.pathname === '/'

  return (
    <>
      <nav id="nav">
        <div className="ni">

          {/* LOGO — gauche */}
          <Link to="/" style={{ flexShrink:0, display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            {/* Icône moniteur + clé */}
            <div style={{
              position: 'relative',
              width: 48, height: 48,
              flexShrink: 0,
            }}>
              {/* Glow externe */}
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: 16,
                background: 'radial-gradient(ellipse,rgba(0,207,255,0.35) 0%,transparent 70%)',
                filter: 'blur(6px)',
              }}/>
              {/* Fond icône */}
              <div style={{
                width: 48, height: 48,
                background: 'linear-gradient(145deg,#0D2A3E,#071828)',
                border: '1.5px solid rgba(0,207,255,0.5)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,207,255,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}>
                {/* Reflet haut */}
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:'45%',
                  background:'linear-gradient(180deg,rgba(0,207,255,0.12),transparent)',
                  borderRadius:'14px 14px 0 0',
                }}/>
                {/* SVG moniteur + clé */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  {/* Écran */}
                  <rect x="3" y="4" width="22" height="14" rx="2.5" fill="none" stroke="#00CFFF" strokeWidth="1.5"/>
                  <rect x="5" y="6" width="18" height="10" rx="1.5" fill="rgba(0,207,255,0.12)"/>
                  {/* Pied */}
                  <rect x="11" y="18" width="6" height="2.5" rx="1" fill="#00CFFF" opacity="0.6"/>
                  <rect x="9" y="20.5" width="10" height="1.5" rx=".75" fill="#00CFFF" opacity="0.4"/>
                  {/* Clé anglaise */}
                  <path d="M17 8.5 C18.5 7 20.5 7.2 21 8.5 C21.5 9.8 20.5 11 19 11 L15.5 14.5 L14 13 L17 8.5Z" fill="#2BFF9A" opacity="0.9"/>
                  <circle cx="19" cy="9" r="1.2" fill="#040B14"/>
                  {/* Lignes code à gauche */}
                  <rect x="6" y="9" width="5" height="1.2" rx=".6" fill="#00CFFF" opacity="0.7"/>
                  <rect x="6" y="11.5" width="3.5" height="1.2" rx=".6" fill="#2BFF9A" opacity="0.5"/>
                  <rect x="6" y="14" width="4.5" height="1.2" rx=".6" fill="#00CFFF" opacity="0.4"/>
                </svg>
              </div>
            </div>

            {/* Texte */}
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
              <span style={{
                fontFamily: "'Orbitron',sans-serif",
                fontWeight: 900,
                fontSize: '1.3rem',
                letterSpacing: '0.02em',
                background: 'linear-gradient(90deg,#00CFFF 0%,#2BFF9A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 8px rgba(0,207,255,0.4))',
              }}>
                Allotech72
              </span>
              <span style={{
                fontSize: '.5rem',
                color: 'rgba(0,207,255,0.55)',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700,
                marginTop: 3,
              }}>
                Dépannage & Web
              </span>
            </div>
          </Link>

          {/* LIENS DESKTOP — poussés à droite */}
          <ul className="nl">
            <li><a href={home ? '#services'  : '/#services'}>Services</a></li>
            <li><a href={home ? '#avantages' : '/#avantages'}>Avantages</a></li>
            <li><a href={home ? '#qui'       : '/#qui'}>Qui suis-je</a></li>
            <li><a href={home ? '#zone'      : '/#zone'}>Zone</a></li>
            <li><Link to="/avis">Avis</Link></li>
            <li><Link to="/galerie">Galerie</Link></li>
            <li style={{ marginLeft: 8 }}>
              <a href={`tel:${config.telBrut}`} className="ncta">📞 {config.telephone}</a>
            </li>
          </ul>

          {/* MOBILE — bouton appel + burger */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: 8,
            marginLeft: 'auto',
          }} className="mob-controls">
            <a href={`tel:${config.telBrut}`} className="tel-mobile" style={{
              background: 'linear-gradient(135deg,#00CFFF,#00AEEF)',
              color: '#040B14', fontWeight: 700,
              padding: '7px 12px', borderRadius: 8,
              textDecoration: 'none', fontSize: '.78rem',
              fontFamily: "'Orbitron',sans-serif",
              whiteSpace: 'nowrap',
            }}>
              📞 Appeler
            </a>

            <button
              className="burger"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              style={{ flexShrink: 0 }}
            >
              <span style={{ transform: open ? 'rotate(45deg) translate(5px, 6px)' : '' }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -6px)' : '' }} />
            </button>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE */}
      <div className={`mob${open ? ' open' : ''}`}>
        <a href={home ? '#services'  : '/#services'}  onClick={close}>Services</a>
        <a href={home ? '#avantages' : '/#avantages'} onClick={close}>Avantages</a>
        <a href={home ? '#qui'       : '/#qui'}       onClick={close}>Qui suis-je ?</a>
        <a href={home ? '#zone'      : '/#zone'}      onClick={close}>Zone</a>
        <Link to="/avis" onClick={close}>Avis</Link>
        <Link to="/galerie" onClick={close}>Galerie</Link>
        <a href={home ? '#contact'   : '/#contact'}   onClick={close}>Contact</a>
        <a href={`tel:${config.telBrut}`} style={{
          color: 'var(--c)',
          fontFamily: "'Orbitron',sans-serif",
          fontSize: '1.2rem',
        }}>
          📞 {config.telephone}
        </a>
      </div>
    </>
  )
}
