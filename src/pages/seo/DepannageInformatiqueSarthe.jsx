import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config, { fullName } from '../../config.js'
import { SEO_LOCAL_CITIES, SEO_PILLAR } from '../../data/seoPages.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Dépannage informatique Sarthe',
  description: 'Dépannage et assistance informatique à domicile dans toute la Sarthe. PC, portable, réseau, virus.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'AdministrativeArea', name: 'Sarthe' },
  serviceType: 'Dépannage informatique',
}

const points = [
  { ico: '🖥️', titre: 'PC & Mac en panne', desc: 'Ordinateur qui ne démarre plus, écran noir, lenteur extrême — diagnostic et réparation à domicile.' },
  { ico: '💻', titre: 'Portable & bureau', desc: 'Intervention sur PC portable et tour, toutes marques, particuliers et petites entreprises.' },
  { ico: '🛡️', titre: 'Virus & sécurité', desc: 'Nettoyage malware, ransomware, pop-ups — sécurisation de votre poste.' },
  { ico: '📶', titre: 'Réseau & internet', desc: 'Wi-Fi instable, box mal configurée, imprimante réseau — remise en service rapide.' },
]

export default function DepannageInformatiqueSarthe() {
  return (
    <PageLayout
      title="Dépannage Informatique Sarthe — Assistance à domicile | Allotech72"
      description="Dépannage informatique à domicile dans toute la Sarthe. PC, Mac, portable, virus, réseau. Technicien local basé à Lombron — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={SEO_PILLAR.to} style={{ color: 'var(--c)', textDecoration: 'none' }}>{SEO_PILLAR.label}</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Dépannage informatique Sarthe</span>
          </nav>
          <div className="stag">Sarthe (72) — intervention à domicile</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Dépannage <span style={{ color: 'var(--c)' }}>informatique</span><br />en Sarthe
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            {fullName()} intervient à votre domicile dans toute la <strong style={{ color: 'var(--tx)' }}>Sarthe</strong> pour
            dépanner votre ordinateur, votre réseau ou sécuriser votre PC. Basé à Lombron, disponible rapidement.
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

        <p style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.9rem', marginBottom: 24 }}>
          Zone : {SEO_LOCAL_CITIES.slice(0, 6).join(', ')}… — voir aussi{' '}
          <Link to="/depannage-informatique-le-mans" style={{ color: 'var(--c)' }}>dépannage Le Mans</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Besoin d&apos;un dépannage en <span className="c">Sarthe</span> ?</h2>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
      </div>
    </PageLayout>
  )
}
