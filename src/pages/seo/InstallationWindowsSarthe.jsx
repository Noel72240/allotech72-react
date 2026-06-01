import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Installation Windows Sarthe',
  description: 'Installation, réinstallation et configuration Windows 10 et 11 à domicile en Sarthe. Sauvegarde, drivers, mises à jour.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Installation système Windows',
}

const points = [
  { ico: '🪟', titre: 'Windows 10 & 11', desc: 'Installation propre ou réinstallation après panne, avec activation et configuration initiale.' },
  { ico: '💾', titre: 'Sauvegarde avant formatage', desc: 'Récupération de vos documents personnels avant toute réinstallation du système.' },
  { ico: '⚙️', titre: 'Drivers & mises à jour', desc: 'Pilotes matériels, Windows Update, office et logiciels essentiels configurés.' },
  { ico: '🛡️', titre: 'Sécurité de base', desc: 'Antivirus, pare-feu et compte utilisateur sécurisé dès la première utilisation.' },
]

export default function InstallationWindowsSarthe() {
  return (
    <PageLayout
      title="Installation Windows Sarthe — Réinstallation PC 10 & 11 | Allotech72"
      description="Installation et réinstallation Windows 10/11 à domicile en Sarthe. Sauvegarde données, drivers, configuration. Technicien local — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Installation Windows</span>
          </nav>
          <div className="stag">Windows 10 & 11 — Sarthe</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Installation <span style={{ color: 'var(--c)' }}>Windows</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            PC lent, infecté ou bloqué ? <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> réinstalle Windows
            chez vous en Sarthe, avec sauvegarde de vos fichiers et remise en service complète.
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
          Données à sauver ? Voir{' '}
          <Link to="/recuperation-donnees-sarthe" style={{ color: 'var(--c)' }}>récupération de données Sarthe</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Réinstallation Windows en <span className="c">Sarthe</span></h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
      </div>
    </PageLayout>
  )
}
