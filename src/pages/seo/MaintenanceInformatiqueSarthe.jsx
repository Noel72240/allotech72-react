import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Maintenance informatique Sarthe',
  description: 'Maintenance préventive et curative informatique pour particuliers et TPE en Sarthe. Mises à jour, sauvegardes, optimisation.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Maintenance informatique',
}

const points = [
  { ico: '🔄', titre: 'Mises à jour & correctifs', desc: 'Windows, logiciels et pilotes à jour pour limiter pannes et failles de sécurité.' },
  { ico: '💾', titre: 'Sauvegardes', desc: 'Mise en place ou vérification de sauvegardes locales ou cloud de vos fichiers importants.' },
  { ico: '⚡', titre: 'Optimisation PC', desc: 'Nettoyage disque, programmes au démarrage, performance retrouvée sur postes anciens.' },
  { ico: '🏢', titre: 'TPE & indépendants', desc: 'Parc réduit (1 à 5 postes) : maintenance régulière ou intervention ponctuelle en Sarthe.' },
]

export default function MaintenanceInformatiqueSarthe() {
  return (
    <PageLayout
      title="Maintenance Informatique Sarthe — Entretien PC & TPE | Allotech72"
      description="Maintenance informatique en Sarthe : mises à jour, sauvegardes, optimisation PC pour particuliers et petites entreprises. Lombron — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Maintenance informatique</span>
          </nav>
          <div className="stag">Entretien & suivi — Sarthe</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Maintenance <span style={{ color: 'var(--g)' }}>informatique</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Anticiper les pannes coûte moins cher que les subir. <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> assure
            la maintenance de vos ordinateurs en Sarthe : mises à jour, sauvegardes et optimisation.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
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

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Maintenance PC en <span className="c">Sarthe</span></h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
      </div>
    </PageLayout>
  )
}
