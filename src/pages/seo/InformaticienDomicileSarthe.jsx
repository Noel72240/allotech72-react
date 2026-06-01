import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config, { fullName } from '../../config.js'
import { SEO_LOCAL_CITIES, SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Informaticien à domicile Sarthe',
  description: 'Informaticien et technicien informatique à domicile en Sarthe. Aide PC, tablette, smartphone pour particuliers et seniors.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Assistance informatique à domicile',
}

const points = [
  { ico: '🏠', titre: 'Intervention chez vous', desc: 'Pas de déplacement en magasin : l\'informaticien vient à votre domicile en Sarthe.' },
  { ico: '👴', titre: 'Seniors & débutants', desc: 'Explications claires, patience et pédagogie pour prendre en main ordinateur, tablette ou smartphone.' },
  { ico: '🔧', titre: 'Dépannage & réglages', desc: 'Mises à jour, imprimante, messagerie, sauvegardes, connexion internet — tout le quotidien numérique.' },
  { ico: '🎓', titre: 'Cours informatique', desc: 'Initiation sur mesure à votre rythme : navigation web, emails, photos, visioconférence.' },
]

export default function InformaticienDomicileSarthe() {
  return (
    <PageLayout
      title="Informaticien à Domicile Sarthe — Technicien PC & aide numérique | Allotech72"
      description="Informaticien à domicile en Sarthe : dépannage PC, aide seniors, cours informatique, tablette et smartphone. Lombron — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Informaticien à domicile</span>
          </nav>
          <div className="stag">À domicile — Sarthe (72)</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Informaticien <span style={{ color: 'var(--g)' }}>à domicile</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            {fullName()} — votre <strong style={{ color: 'var(--tx)' }}>informaticien de proximité</strong> en Sarthe.
            Dépannage, conseils et accompagnement numérique directement chez vous.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Prendre rendez-vous →</Link>
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
          {SEO_LOCAL_CITIES.join(', ')} et alentours.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Un informaticien près de chez vous en <span className="c">Sarthe</span></h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
      </div>
    </PageLayout>
  )
}
