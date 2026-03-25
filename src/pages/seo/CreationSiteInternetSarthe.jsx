import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création site internet Sarthe',
  description: 'Création site internet vitrine pour artisans et commerçants en Sarthe. Design moderne, SEO local, formulaire de contact. Devis gratuit.',
  provider: { '@type':'LocalBusiness', name:config.brand, telephone:'+33'+config.telBrut.slice(1) },
  areaServed: { '@type':'State', name:'Sarthe' },
  serviceType: 'Création site web',
  aggregateRating: { '@type':'AggregateRating', ratingValue:'5', reviewCount:String(config.avis.length), bestRating:'5' },
}

const prestations = [
  { ico:'🎨', titre:'Site vitrine moderne', desc:'Design professionnel adapté à votre activité, responsive mobile, animations modernes.' },
  { ico:'🔍', titre:'SEO local inclus', desc:'Référencement optimisé pour apparaître sur Google dans votre secteur géographique.' },
  { ico:'📱', titre:'100% responsive', desc:'Votre site s\'affiche parfaitement sur mobile, tablette et ordinateur.' },
  { ico:'📧', titre:'Formulaire de contact', desc:'Formulaire de contact avec réception par email, sans abonnement supplémentaire.' },
  { ico:'⚡', titre:'Site rapide', desc:'Performances optimisées pour un chargement rapide — critère important pour Google.' },
  { ico:'🔒', titre:'RGPD & mentions légales', desc:'Mentions légales, politique de confidentialité et gestion des cookies conformes.' },
]

export default function CreationSiteInternetSarthe() {
  return (
    <PageLayout
      title="Création Site Internet Sarthe — Site vitrine artisan & commerçant | Allotech72"
      description="Création site internet vitrine en Sarthe pour artisans, commerçants et indépendants. Design moderne, SEO local, responsive. Devis gratuit — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container" style={{ paddingBottom:80 }}>

        <div style={{ textAlign:'center', padding:'40px 0 52px' }}>
          <nav style={{ fontSize:'.78rem', color:'var(--dim)', marginBottom:20 }}>
            <Link to="/" style={{ color:'var(--c)', textDecoration:'none' }}>Accueil</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <span>Création site internet Sarthe</span>
          </nav>
          <div className="stag">Site vitrine — Sarthe (72)</div>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Création <span style={{ color:'var(--c)' }}>Site Internet</span><br />Sarthe & Le Mans
          </h1>
          <p style={{ color:'var(--dim)', fontSize:'1rem', maxWidth:600, margin:'0 auto 32px', lineHeight:1.8 }}>
            Artisan, commerçant ou indépendant en Sarthe ? <strong style={{ color:'var(--tx)' }}>{config.brand}</strong> crée votre site internet vitrine professionnel, optimisé pour Google, à un tarif accessible.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:28 }}>
            {['🌐 Site vitrine professionnel','📍 SEO local Sarthe','📱 Responsive mobile','💰 Tarif accessible'].map((b,i) => (
              <span key={i} style={{ background:'rgba(0,207,255,0.07)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--tx)', padding:'6px 14px', borderRadius:100, fontSize:'.78rem', fontWeight:600 }}>{b}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:64 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div className="stag">Nos prestations</div>
            <h2>Tout ce qui est <span className="c">inclus</span></h2>
            <div className="div-line" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
            {prestations.map((item,i) => (
              <div key={i} className="svc-card rev">
                <div style={{ fontSize:'2rem', marginBottom:14 }}>{item.ico}</div>
                <h3>{item.titre}</h3>
                <p style={{ color:'var(--dim)', fontSize:'.88rem', lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exemple — ce site */}
        <div style={{ background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:'32px', marginBottom:64 }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div className="stag">Exemple concret</div>
            <h2>Ce site a été créé par <span className="c">{config.brand}</span></h2>
          </div>
          <p style={{ color:'var(--dim)', textAlign:'center', fontSize:'.95rem', lineHeight:1.8 }}>
            Le site que vous visitez actuellement ({config.siteUrl}) est un exemple de nos réalisations —
            design moderne, animations, SEO optimisé, espace admin, formulaire de contact, mentions légales RGPD.
          </p>
        </div>

        <div style={{ textAlign:'center', background:'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border:'1px solid rgba(0,207,255,0.2)', borderRadius:24, padding:'40px 28px' }}>
          <h2 style={{ marginBottom:14 }}>Votre projet de site en <span className="c">Sarthe</span> ?</h2>
          <p style={{ color:'var(--dim)', marginBottom:28 }}>Devis gratuit — réponse rapide — tarif transparent</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
