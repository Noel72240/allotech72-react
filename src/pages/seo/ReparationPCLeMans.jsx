import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Réparation ordinateur Le Mans',
  description: 'Réparation ordinateur PC et Mac à domicile sur Le Mans et Sarthe.',
  provider: { '@type':'LocalBusiness', name:config.brand, telephone:'+33'+config.telBrut.slice(1) },
  areaServed: { '@type':'City', name:'Le Mans' },
  serviceType: 'Réparation ordinateur',
  aggregateRating: { '@type':'AggregateRating', ratingValue:'5', reviewCount:String(config.avis.length), bestRating:'5' },
  review: config.avis.slice(0,3).map(a => ({
    '@type':'Review',
    author: { '@type':'Person', name:a.nom },
    reviewRating: { '@type':'Rating', ratingValue:'5', bestRating:'5' },
    reviewBody: a.texte,
  })),
}

const interventions = [
  { ico:'💻', titre:'PC qui ne démarre plus', desc:'Diagnostic complet, remplacement composants défaillants (alimentation, disque dur, RAM, carte mère).' },
  { ico:'🐌', titre:'Ordinateur lent', desc:'Nettoyage logiciel, suppression virus, optimisation démarrage, upgrade SSD ou RAM.' },
  { ico:'⌨️', titre:'Écran ou clavier cassé', desc:'Remplacement écran LCD, clavier, touchpad sur PC portable toutes marques.' },
  { ico:'🔧', titre:'Montage PC sur mesure', desc:'Assemblage PC gaming ou bureautique, câblage soigné, configuration Windows.' },
  { ico:'💾', titre:'Récupération de données', desc:'Récupération fichiers sur disque dur en panne, SSD, clé USB ou carte SD.' },
  { ico:'🌡️', titre:'Surchauffe et bruit', desc:'Nettoyage ventilateurs, remplacement pâte thermique, amélioration refroidissement.' },
]

export default function ReparationPCLeMans() {
  return (
    <PageLayout
      title="Réparation Ordinateur Le Mans — PC & Mac à domicile | Allotech72"
      description="Réparation ordinateur PC et Mac à domicile sur Le Mans et Sarthe. PC qui ne démarre plus, lenteur, écran cassé, récupération données. Technicien local — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container" style={{ paddingBottom:80 }}>

        <div style={{ textAlign:'center', padding:'40px 0 52px' }}>
          <nav style={{ fontSize:'.78rem', color:'var(--dim)', marginBottom:20 }}>
            <Link to="/" style={{ color:'var(--c)', textDecoration:'none' }}>Accueil</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <Link to="/depannage-informatique-le-mans" style={{ color:'var(--c)', textDecoration:'none' }}>Dépannage informatique</Link>
            <span style={{ margin:'0 8px' }}>›</span>
            <span>Réparation ordinateur Le Mans</span>
          </nav>
          <div className="stag">PC & Mac — Le Mans & Sarthe</div>
          <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Réparation <span style={{ color:'var(--c)' }}>Ordinateur</span><br />Le Mans & Sarthe
          </h1>
          <p style={{ color:'var(--dim)', fontSize:'1rem', maxWidth:580, margin:'0 auto 32px', lineHeight:1.8 }}>
            Votre PC ou Mac est en panne ? <strong style={{ color:'var(--tx)' }}>{config.brand}</strong> intervient à votre domicile sur Le Mans pour diagnostiquer et réparer votre ordinateur rapidement.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:28 }}>
            {['⭐ 5/5 sur Google','🏠 Intervention à domicile','⚡ Réponse rapide','💰 Tarif transparent'].map((b,i) => (
              <span key={i} style={{ background:'rgba(0,207,255,0.07)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--tx)', padding:'6px 14px', borderRadius:100, fontSize:'.78rem', fontWeight:600 }}>{b}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:64 }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div className="stag">Nos réparations</div>
            <h2>Réparations <span className="c">PC & Mac</span> à domicile</h2>
            <div className="div-line" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
            {interventions.map((item,i) => (
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
            <div className="stag">Avis clients</div>
            <h2><span className="c">5/5</span> — {config.avis.length}+ avis vérifiés</h2>
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

        <div style={{ textAlign:'center', background:'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border:'1px solid rgba(0,207,255,0.2)', borderRadius:24, padding:'40px 28px' }}>
          <h2 style={{ marginBottom:14 }}>Votre ordinateur en panne à <span className="c">Le Mans</span> ?</h2>
          <p style={{ color:'var(--dim)', marginBottom:28 }}>Intervention à domicile — diagnostic — tarif transparent</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Formulaire de contact →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
