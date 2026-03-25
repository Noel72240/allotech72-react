import { Link } from 'react-router-dom'
import { useCookies } from '../hooks/useCookies.jsx'
import config from '../config.js'

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
            <a href="#hero" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:4 }}>
              <div style={{ position:'relative', width:40, height:40, flexShrink:0 }}>
                <div style={{ position:'absolute', inset:-3, borderRadius:13, background:'radial-gradient(ellipse,rgba(0,207,255,0.3) 0%,transparent 70%)', filter:'blur(5px)' }}/>
                <div style={{ width:40, height:40, background:'linear-gradient(145deg,#0D2A3E,#071828)', border:'1.5px solid rgba(0,207,255,0.45)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', boxShadow:'0 0 16px rgba(0,207,255,0.25)' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'linear-gradient(180deg,rgba(0,207,255,0.1),transparent)', borderRadius:'12px 12px 0 0' }}/>
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="4" width="22" height="14" rx="2.5" fill="none" stroke="#00CFFF" strokeWidth="1.5"/>
                    <rect x="5" y="6" width="18" height="10" rx="1.5" fill="rgba(0,207,255,0.1)"/>
                    <rect x="11" y="18" width="6" height="2.5" rx="1" fill="#00CFFF" opacity="0.5"/>
                    <rect x="9" y="20.5" width="10" height="1.5" rx=".75" fill="#00CFFF" opacity="0.35"/>
                    <path d="M17 8.5 C18.5 7 20.5 7.2 21 8.5 C21.5 9.8 20.5 11 19 11 L15.5 14.5 L14 13 L17 8.5Z" fill="#2BFF9A" opacity="0.85"/>
                    <circle cx="19" cy="9" r="1.2" fill="#040B14"/>
                    <rect x="6" y="9" width="5" height="1.2" rx=".6" fill="#00CFFF" opacity="0.6"/>
                    <rect x="6" y="11.5" width="3.5" height="1.2" rx=".6" fill="#2BFF9A" opacity="0.45"/>
                  </svg>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:'1.1rem', background:'linear-gradient(90deg,#00CFFF,#2BFF9A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 6px rgba(0,207,255,0.35))' }}>Allotech72</span>
                <span style={{ fontSize:'.48rem', color:'rgba(0,207,255,0.5)', letterSpacing:'.2em', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif", fontWeight:700, marginTop:3 }}>Dépannage & Web</span>
              </div>
            </a>
            <p>Dépannage informatique à domicile sur Le Mans et le secteur Sarthe. Réparation PC, téléphone, tablette, création de sites internet et applications mobiles.</p>
            <p className="sr">SIRET : {config.siret} – {config.statut} – {config.prenom} {config.nom}</p>
            <p className="sr">TVA non applicable, art. 293B du CGI</p>
          </div>

          <div className="fcol">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/depannage-informatique-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Dépannage Le Mans</Link></li>
              <li><Link to="/reparation-ordinateur-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Réparation PC Le Mans</Link></li>
              <li><Link to="/reparateur-telephone-le-mans" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Réparateur téléphone</Link></li>
              <li><Link to="/creation-site-internet-sarthe" style={{color:'var(--dim)',textDecoration:'none',fontSize:'.88rem'}}>Création site Sarthe</Link></li>
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
              <li><a href="#" onClick={e => { e.preventDefault(); reset() }}>🍪 Gestion des cookies</a></li>
              <li><a href={`tel:${config.telBrut}`}>{config.telephone}</a></li>
              {config.facebook && <li><a href={config.facebook} target="_blank" rel="noopener">Facebook</a></li>}
            </ul>
          </div>
        </div>

        <div className="fbot">
          <p>© {year} {config.brand} – {config.prenom} {config.nom} – Tous droits réservés</p>
          <div className="ll">
            <a href="#" onClick={e => { e.preventDefault(); openModal('m-legal') }}>Mentions légales</a>
            <a href="#" onClick={e => { e.preventDefault(); openModal('m-conf') }}>Confidentialité</a>
            <a href="#" onClick={e => { e.preventDefault(); reset() }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
