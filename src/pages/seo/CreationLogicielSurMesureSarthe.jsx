import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import SeoBoost from '../../components/seo/SeoBoost.jsx'
import config from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création logiciel sur mesure Sarthe',
  description: 'Développement de logiciels métier, applications web et portails clients professionnels pour entreprises en Sarthe.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Développement logiciel sur mesure',
}

const points = [
  { ico: '⚙️', titre: 'Logiciel métier', desc: 'Outils adaptés à votre activité : gestion interne, suivi de chantiers, devis, planning — sur mesure.' },
  { ico: '🔐', titre: 'Portail client professionnel', desc: 'Espace client sécurisé : suivi de commandes, documents, tickets — accessible 24h/24.' },
  { ico: '📱', titre: 'Application web & mobile', desc: 'Interfaces modernes React, responsive, hébergées et maintenues selon vos besoins.' },
  { ico: '🔗', titre: 'Intégrations', desc: 'Connexion à vos outils existants (email, paiement, CRM léger) pour un flux de travail fluide.' },
]

export default function CreationLogicielSurMesureSarthe() {
  return (
    <PageLayout
      title="Création Logiciel sur Mesure Sarthe — App métier & portail client | Allotech72"
      description="Développement logiciel sur mesure en Sarthe : application métier, portail client pro, outil interne. Devis gratuit Allotech72 — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Logiciel sur mesure</span>
          </nav>
          <div className="stag">Développement — Sarthe (72)</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Logiciel <span style={{ color: 'var(--g)' }}>sur mesure</span><br />& portail client — Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 620, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Au-delà des sites vitrines, <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> conçoit des
            <strong style={{ color: 'var(--tx)' }}> logiciels et portails clients</strong> pour les professionnels de Sarthe :
            artisans, TPE, indépendants et commerçants.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Parler de votre projet →</Link>
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
          Site vitrine ? Voir{' '}
          <Link to="/creation-site-internet-sarthe" style={{ color: 'var(--c)' }}>création site internet Sarthe</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Projet logiciel en <span className="c">Sarthe</span> ?</h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
        <SeoBoost pageKey="logiciel-sur-mesure" />
      </div>
    </PageLayout>
  )
}
