import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import SeoBoost from '../../components/seo/SeoBoost.jsx'
import config, { fullName } from '../../config.js'
import { SEO_ALL_SERVICE_PAGES, SEO_LOCAL_CITIES } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Services informatiques en Sarthe — Allotech72',
  description: 'Dépannage informatique, réparation PC et téléphone, récupération de données, création de sites internet et logiciels sur mesure en Sarthe.',
  itemListElement: SEO_ALL_SERVICE_PAGES.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.label,
    url: config.siteUrl + p.to,
  })),
}

const serviceGroups = [
  {
    title: 'Tous nos services informatiques en Sarthe',
    items: SEO_ALL_SERVICE_PAGES,
  },
]

export default function ServicesInformatiquesSarthe() {
  return (
    <PageLayout
      title="Services Informatiques en Sarthe — Dépannage, PC, Téléphone & Web | Allotech72"
      description="Allotech72 : tous vos services informatiques en Sarthe. Dépannage PC, réparation téléphone, récupération données, création site internet et logiciel sur mesure. Lombron — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Services informatiques Sarthe</span>
          </nav>
          <div className="stag">Référence locale — Sarthe (72)</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Services <span style={{ color: 'var(--c)' }}>informatiques</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 640, margin: '0 auto 28px', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--tx)' }}>{fullName()} — {config.brand}</strong> intervient à domicile dans toute la Sarthe :
            dépannage informatique, réparation ordinateur et téléphone, récupération de données, maintenance,
            création de sites internet et développement de logiciels sur mesure pour les professionnels.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>
        </div>

        {serviceGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: 56 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="stag">{group.title}</div>
              <h2>Nos <span className="c">prestations</span></h2>
              <div className="div-line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              {group.items.map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="svc-card rev"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <h3 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.9rem', color: 'var(--c)', marginBottom: 8 }}>
                    {p.label} →
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
          borderRadius: 20, padding: '36px', marginBottom: 56,
        }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", color: '#fff', fontSize: '1.2rem', marginBottom: 16 }}>
            Zone d&apos;intervention — <span style={{ color: 'var(--c)' }}>Sarthe</span>
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.92rem', lineHeight: 1.8, marginBottom: 16 }}>
            Basé à <strong style={{ color: 'var(--tx)' }}>Lombron</strong> ({config.adresse}, {config.codePostal} {config.ville}),
            {config.brand} se déplace dans toute la Sarthe, notamment :
          </p>
          <p style={{ color: 'var(--tx)', fontSize: '.88rem', lineHeight: 1.9 }}>
            {SEO_LOCAL_CITIES.join(', ')} et communes voisines.
          </p>
        </div>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Un besoin informatique en <span className="c">Sarthe</span> ?</h2>
          <p style={{ color: 'var(--dim)', marginBottom: 24 }}>Intervention à domicile — devis gratuit — {config.telephone}</p>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 Appeler maintenant</a>
        </div>
        <SeoBoost pageKey="services-pilier" />
      </div>
    </PageLayout>
  )
}
