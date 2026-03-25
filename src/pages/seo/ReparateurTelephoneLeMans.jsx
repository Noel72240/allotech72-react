import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Réparateur téléphone Le Mans',
  description: 'Réparation smartphone et tablette à domicile sur Le Mans et Sarthe. Écran cassé, batterie, logiciel bloqué. iPhone et Android.',
  provider: { '@type':'LocalBusiness', name:config.brand, telephone:'+33'+config.telBrut.slice(1) },
  areaServed: { '@type':'City', name:'Le Mans' },
  serviceType: 'Réparation téléphone',
  aggregateRating: { '@type':'AggregateRating', ratingValue:'5', reviewCount:String(config.avis.length), bestRating:'5' },
  review: config.avis.slice(0,3).map(a => ({
    '@type':'Review',
    author: { '@type':'Person', name:a.nom },
    reviewRating: { '@type':'Rating', ratingValue:'5', bestRating:'5' },
    reviewBody: a.texte,
  })),
}

const reparations = [
  { ico:'📱', titre:'Écran cassé ou fissuré', desc:'Remplacement écran iPhone, Samsung, Huawei et toutes marques Android. Résultat comme neuf.' },
  { ico:'🔋', titre:'Batterie défaillante', desc:'Remplacement batterie sur smartphone et tablette. Retrouvez une autonomie optimale.' },
  { ico:'💧', titre:'Dégât des eaux', desc:'Nettoyage et séchage professionnel après contact avec l\'eau. Récupération possible dans de nombreux cas.' },
  { ico:'🔌', titre:'Problème de charge', desc:'Remplacement connecteur de charge, nettoyage port USB-C ou Lightning.' },
  { ico:'📷', titre:'Caméra défaillante', desc:'Remplacement module caméra avant ou arrière sur iPhone et Android.' },
  { ico:'🔒', titre:'Téléphone bloqué', desc:'Déblocage logiciel, réinitialisation, récupération données avant formatage.' },
]

export default function ReparateurTelephoneLeMans() {
  return (
    <PageLayout
      title="Réparateur Téléphone Le Mans — iPhone & Android à domicile | Allotech72"
      description="Réparateur téléphone à domicile sur Le Mans et Sarthe. Écran cassé, batterie, dégât des eaux, iPhone et Android. Intervention rapide — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container" style={{ paddingBottom:80 }}>

        <div style={{ textAlign:'center', padding:'40px 0 52px' }}>
          <nav style={{ fontSize:'.78rem', color:'var(--dim)', marginBottom:20 }}>
            <Link to="/" style={{ color:'var(--c)', textDecoration:'none' }}>Accueil</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <Link to="/depannage-informatique-le-mans" style={{ color:'var(--c)', textDecoration:'none' }}>Dépannage informatique</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <span>Réparateur téléphone Le Mans</span>
          </nav>
          <div className="stag">iPhone & Android — Le Mans & Sarthe</div>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Réparateur <span style={{ color:'var(--g)' }}>Téléphone</span><br />Le Mans & Sarthe
          </h1>
          <p style={{ color:'var(--dim)', fontSize:'1rem', maxWidth:580, margin:'0 auto 32px', lineHeight:1.8 }}>
            Écran cassé, batterie à plat, téléphone bloqué ? <strong style={{ color:'var(--tx)' }}>{config.brand}</strong> répare votre iPhone ou téléphone Android directement à votre domicile sur Le Mans.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:28 }}>
            {['📱 iPhone & Android','🏠 À votre domicile','⭐ 5/5 Google','⚡ Intervention rapide'].map((b,i) => (
              <span key={i} style={{ background:'rgba(43,255,154,0.07)', border:'1px solid rgba(43,255,154,0.2)', color:'var(--tx)', padding:'6px 14px', borderRadius:100, fontSize:'.78rem', fontWeight:600 }}>{b}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:64 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div className="stag">Nos réparations</div>
            <h2>Réparations <span className="g">smartphone</span> à domicile</h2>
            <div className="div-line" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
            {reparations.map((item,i) => (
              <div key={i} className="svc-card rev">
                <div style={{ fontSize:'2rem', marginBottom:14 }}>{item.ico}</div>
                <h3>{item.titre}</h3>
                <p style={{ color:'var(--dim)', fontSize:'.88rem', lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:64 }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div className="stag">Ils nous font confiance</div>
            <h2><span className="g">5/5</span> — {config.avis.length}+ avis Google</h2>
            <div className="div-line" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {config.avis.slice(0,3).map((a,i) => (
              <div key={i} className="avis-card">
                <div className="avis-head">
                  <div className="avis-av">{a.initiales}</div>
                  <div><h4>{a.nom}</h4><div className="avis-stars">★★★★★</div><div className="avis-type">{a.type}</div></div>
                </div>
                <p className="avis-txt">"{a.texte}"</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center', background:'linear-gradient(135deg,rgba(43,255,154,0.07),rgba(0,207,255,0.04))', border:'1px solid rgba(43,255,154,0.2)', borderRadius:24, padding:'40px 28px' }}>
          <h2 style={{ marginBottom:14 }}>Votre téléphone cassé à <span className="g">Le Mans</span> ?</h2>
          <p style={{ color:'var(--dim)', marginBottom:28 }}>Réparation à domicile — toutes marques — tarif transparent</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Formulaire de contact →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
