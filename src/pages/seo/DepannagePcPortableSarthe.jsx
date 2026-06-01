import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Dépannage PC portable Sarthe',
  description: 'Réparation PC portable à domicile en Sarthe : écran, clavier, batterie, lenteur, démarrage impossible.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Réparation ordinateur portable',
}

const points = [
  { ico: '💻', titre: 'Portable qui ne démarre plus', desc: 'Diagnostic alimentation, écran noir, ventilateur bruyant — réparation ou conseil de remplacement.' },
  { ico: '⌨️', titre: 'Écran & clavier', desc: 'Remplacement d\'écran LCD, clavier défaillant, touchpad — toutes marques courantes.' },
  { ico: '🔋', titre: 'Batterie & charge', desc: 'Autonomie faible, charge qui saute — test batterie et connecteur d\'alimentation.' },
  { ico: '🐌', titre: 'Lenteur & surchauffe', desc: 'Nettoyage interne, pâte thermique, upgrade SSD/RAM pour redonner vie à votre laptop.' },
]

export default function DepannagePcPortableSarthe() {
  return (
    <PageLayout
      title="Dépannage PC Portable Sarthe — Réparation laptop à domicile | Allotech72"
      description="Dépannage et réparation PC portable en Sarthe : écran cassé, clavier, batterie, lenteur. Intervention à domicile — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Dépannage PC portable</span>
          </nav>
          <div className="stag">Laptop & notebook — Sarthe</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Dépannage <span style={{ color: 'var(--c)' }}>PC portable</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Votre ordinateur portable est en panne ? <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> intervient
            à domicile en Sarthe pour réparer ou diagnostiquer votre laptop rapidement.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {points.map((item, i) => (
              <div key={i} className="svc-card rev">
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.ico}</div>
                <h3>{item.titre}</h3>
                <p style={{ color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.9rem', marginBottom: 40 }}>
          PC fixe plutôt ?{' '}
          <Link to="/reparation-ordinateur-le-mans" style={{ color: 'var(--c)' }}>Réparation ordinateur Le Mans</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Portable en panne en <span className="c">Sarthe</span> ?</h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
      </div>
    </PageLayout>
  )
}
