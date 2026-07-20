import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import SeoBoost from '../../components/seo/SeoBoost.jsx'
import config from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Récupération de données Sarthe',
  description: 'Récupération de fichiers sur disque dur, SSD, clé USB ou PC qui ne démarre plus — intervention en Sarthe.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Récupération de données',
}

const points = [
  { ico: '💾', titre: 'Disque dur & SSD', desc: 'PC qui ne boot plus, disque non reconnu — tentative de récupération de vos documents, photos et dossiers pro.' },
  { ico: '📷', titre: 'Photos & fichiers supprimés', desc: 'Récupération après suppression accidentelle ou formatage, lorsque les données sont encore récupérables.' },
  { ico: '🔑', titre: 'Clé USB & carte SD', desc: 'Support de stockage détecté mais inaccessible — extraction des fichiers importants.' },
  { ico: '💼', titre: 'Données professionnelles', desc: 'Comptabilité, devis, bases clients — priorité aux fichiers métier avant toute réinstallation.' },
]

export default function RecuperationDonneesSarthe() {
  return (
    <PageLayout
      title="Récupération de Données Sarthe — Disque dur, SSD, USB | Allotech72"
      description="Récupération de données en Sarthe : disque dur en panne, fichiers supprimés, PC qui ne démarre plus. Intervention à domicile — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Récupération de données</span>
          </nav>
          <div className="stag">Sauvetage fichiers — Sarthe</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Récupération <span style={{ color: 'var(--c)' }}>de données</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Vos fichiers sont précieux. <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> intervient en Sarthe
            pour tenter de récupérer vos données avant toute réparation ou remplacement de disque.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Urgence données →</Link>
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
          Voir aussi{' '}
          <Link to="/reparation-ordinateur-le-mans" style={{ color: 'var(--c)' }}>réparation ordinateur Le Mans</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Fichiers perdus en <span className="c">Sarthe</span> ?</h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
        <SeoBoost pageKey="recuperation-donnees" />
      </div>
    </PageLayout>
  )
}
