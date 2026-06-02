import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../config.js'
import { SEO_NAV_DROPDOWN_PRIMARY, SEO_NAV_DROPDOWN_EXTRA } from '../data/seoPages.js'
import CartNavButton from './shop/CartNavButton.jsx'

export default function Nav() {
  const [open,     setOpen]     = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const close  = () => { setOpen(false); setDropdown(false) }
  const loc    = useLocation()
  const home   = loc.pathname === '/'
  const onShop = loc.pathname.startsWith('/boutique') || loc.pathname.startsWith('/panier')

  return (
    <>
      <nav id="nav">
        <div className="ni">

          {/* LOGO */}
          <Link to="/" style={{ flexShrink:0, display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
            <img src="/logoat72.png" alt="Allotech72" style={{ width:48, height:48, objectFit:'contain' }} />
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
              <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:'1.3rem', background:'linear-gradient(90deg,#00CFFF,#2BFF9A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 8px rgba(0,207,255,0.4))' }}>
                Allotech72
              </span>
              <span style={{ fontSize:'.5rem', color:'rgba(0,207,255,0.55)', letterSpacing:'.22em', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif", fontWeight:700, marginTop:3 }}>
                Dépannage & Web
              </span>
            </div>
          </Link>

          {/* LIENS DESKTOP */}
          <ul className="nl">

            {/* MENU DÉROULANT — 3 pages phares + lien web (le reste : menu latéral sur pages SEO + footer) */}
            <li style={{ position:'relative' }}
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <a href={home ? '#services' : '/#services'} style={{ display:'flex', alignItems:'center', gap:5 }}>
                Services
                <span style={{ fontSize:'.65rem', transition:'transform .2s', display:'inline-block', transform: dropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </a>

              {dropdown && (
                <div style={{
                  position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                  marginTop:0, paddingTop:8, width:300,
                  background:'rgba(4,11,20,0.97)', backdropFilter:'blur(24px)',
                  border:'1px solid rgba(0,207,255,0.2)', borderRadius:14,
                  boxShadow:'0 16px 48px rgba(0,0,0,0.5)',
                  zIndex:999, overflow:'hidden',
                  animation:'fadeIn .15s ease',
                }}>
                  <div style={{ padding:'8px 8px 4px', borderBottom:'1px solid rgba(0,207,255,0.1)' }}>
                    <a href={home ? '#services' : '/#services'} style={{ display:'block', padding:'8px 12px', color:'var(--c)', textDecoration:'none', fontSize:'.82rem', fontWeight:700, fontFamily:"'Orbitron',sans-serif" }}>
                      Tous nos services →
                    </a>
                  </div>
                  <div style={{ padding:'6px 8px' }}>
                    <div style={{ padding:'6px 12px 4px', color:'rgba(0,207,255,0.45)', fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>
                      Pages locales phares
                    </div>
                    {SEO_NAV_DROPDOWN_PRIMARY.map((l,i) => (
                      <Link key={i} to={l.to} onClick={() => setDropdown(false)} style={{
                        display:'block', padding:'9px 12px',
                        color:'var(--tx)', textDecoration:'none',
                        fontSize:'.82rem', borderRadius:8,
                        transition:'background .15s, color .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(0,207,255,0.08)'; e.currentTarget.style.color='var(--c)' }}
                        onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='var(--tx)' }}
                      >
                        {l.label}
                      </Link>
                    ))}
                    <div style={{ borderTop:'1px solid rgba(0,207,255,0.1)', margin:'6px 0', paddingTop:6 }} />
                    <Link to={SEO_NAV_DROPDOWN_EXTRA.to} onClick={() => setDropdown(false)} style={{
                      display:'block', padding:'9px 12px',
                      color:'var(--tx)', textDecoration:'none',
                      fontSize:'.82rem', borderRadius:8, fontWeight:600,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(43,255,154,0.08)'; e.currentTarget.style.color='var(--g)' }}
                      onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='var(--tx)' }}
                    >
                      {SEO_NAV_DROPDOWN_EXTRA.label}
                    </Link>
                    <p style={{ padding:'8px 12px 6px', margin:0, fontSize:'.68rem', color:'rgba(200,220,255,0.45)', lineHeight:1.4 }}>
                      Autres guides (virus, Wi-Fi…) : pied de page ou pages spécialisées.
                    </p>
                  </div>
                </div>
              )}
            </li>

            <li><a href={home ? '#avantages' : '/#avantages'}>Avantages</a></li>
            <li><a href={home ? '#qui'       : '/#qui'}>Qui suis-je</a></li>
            <li><a href={home ? '#zone'      : '/#zone'}>Zone</a></li>
            <li><Link to="/avis">Avis</Link></li>
            <li><Link to="/galerie">Galerie</Link></li>
            <li><Link to="/boutique" className="nav-shop-cta">🛒 Boutique</Link></li>
            <li><CartNavButton /></li>
            <li style={{ marginLeft:8 }}>
              <a href={`tel:${config.telBrut}`} className="ncta">📞 {config.telephone}</a>
            </li>
          </ul>

          {/* MOBILE — bouton appel + burger */}
          <div className="mob-controls" style={{ display:'none', alignItems:'center', gap:8, marginLeft:'auto' }}>
            <a
              href={`tel:${config.telBrut}`}
              className="tel-mobile"
              style={{
                background:'linear-gradient(135deg,#00CFFF,#00AEEF)',
                color:'#040B14',
                fontWeight:700,
                padding:'7px 12px',
                borderRadius:8,
                textDecoration:'none',
                fontSize:'.78rem',
                fontFamily:"'Orbitron',sans-serif",
                whiteSpace:'nowrap',
                display:'inline-flex',
                alignItems:'center',
                gap:8,
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
              style={{ flexShrink:0 }}
            >
              <span className="burger-line top" aria-hidden />
              <span className="burger-line mid" aria-hidden />
              <span className="burger-line bot" aria-hidden />
            </button>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE */}
      <div className={`mob${open ? ' open' : ''}`}>
        <Link to="/boutique" className="mob-shop-cta" onClick={close}>🛒 Voir la boutique</Link>

        <a href={home ? '#services'  : '/#services'}  onClick={close}>Services</a>

        <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center', borderTop:'1px solid rgba(0,207,255,0.1)', borderBottom:'1px solid rgba(0,207,255,0.1)', padding:'12px 0', width:'100%' }}>
          <div style={{ color:'rgba(0,207,255,0.5)', fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Guides locaux phares</div>
          {SEO_NAV_DROPDOWN_PRIMARY.map((l,i) => (
            <Link key={i} to={l.to} onClick={close} style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.9rem', fontFamily:"'Orbitron',sans-serif", fontWeight:600, textAlign:'center' }}>
              {l.label}
            </Link>
          ))}
          <Link to={SEO_NAV_DROPDOWN_EXTRA.to} onClick={close} style={{ color:'var(--c)', textDecoration:'none', fontSize:'.88rem', fontFamily:"'Orbitron',sans-serif", fontWeight:700, marginTop:4 }}>
            {SEO_NAV_DROPDOWN_EXTRA.label}
          </Link>
        </div>

        <a href={home ? '#avantages' : '/#avantages'} onClick={close}>Avantages</a>
        <a href={home ? '#qui'       : '/#qui'}       onClick={close}>Qui suis-je ?</a>
        <a href={home ? '#zone'      : '/#zone'}      onClick={close}>Zone</a>
        <a href={home ? '#avis'      : '/#avis'}      onClick={close}>Avis</a>
        <Link to="/galerie" onClick={close}>Galerie</Link>
        <Link to="/panier" onClick={close}>Panier 🛒</Link>
        <a href={home ? '#contact'   : '/#contact'}   onClick={close}>Contact</a>
        <a href={`tel:${config.telBrut}`} style={{ color:'var(--c)', fontFamily:"'Orbitron',sans-serif", fontSize:'1.2rem' }}>
          📞 {config.telephone}
        </a>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @media (max-width: 950px) { .mob-controls { display: flex !important; } .tel-mobile { display: flex !important; } }
      `}</style>
    </>
  )
}
