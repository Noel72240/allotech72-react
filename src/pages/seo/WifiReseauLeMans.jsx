import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import SeoBoost from '../../components/seo/SeoBoost.jsx'
import config from '../../config.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Dépannage Wi-Fi et réseau Le Mans',
  description: 'Réparation connexion internet, configuration box, Wi-Fi instable, câblage et partage à domicile sur Le Mans et Sarthe.',
  provider: { '@type': 'LocalBusiness', name: config.brand, telephone: '+33' + config.telBrut.slice(1) },
  areaServed: { '@type': 'City', name: 'Le Mans' },
  serviceType: 'Dépannage réseau informatique',
}

const points = [
  { ico: '📶', titre: 'Wi-Fi faible ou instable', desc: 'Optimisation du placement de la box, choix du canal, répéteur ou mesh selon votre logement.' },
  { ico: '🏠', titre: 'Box & fibre', desc: 'Aide à la configuration, dépannage après changement d’offre, mot de passe oublié, coupure aléatoire.' },
  { ico: '🔌', titre: 'Câblage & partage', desc: 'Branchement CPL, switch, imprimante réseau, partage de fichiers entre PC sur votre réseau local.' },
  { ico: '🛡️', titre: 'Sécurité du réseau', desc: 'Changement du mot de passe Wi-Fi, invités, filtrage basique des appareils connectés.' },
]

export default function WifiReseauLeMans() {
  return (
    <PageLayout
      title="Wi-Fi & réseau — dépannage internet à domicile Le Mans | Allotech72"
      description="Dépannage Wi-Fi, box internet et réseau à domicile sur Le Mans et en Sarthe. Connexion instable, fibre, partage. Technicien local — 06 13 89 39 67."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', padding: '40px 0 52px' }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to="/depannage-informatique-le-mans" style={{ color: 'var(--c)', textDecoration: 'none' }}>Dépannage informatique</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Wi-Fi & réseau</span>
          </nav>
          <div className="stag">Réseau — Le Mans & Sarthe</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.7rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Wi-Fi, box & <span style={{ color: 'var(--c)' }}>réseau</span>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.8 }}>
            Internet qui coupe, Wi-Fi absent, imprimante introuvable ? <strong style={{ color: 'var(--tx)' }}>{config.brand}</strong> intervient à domicile pour remettre votre réseau d’équerre.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Prendre contact →</Link>
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="stag">Ce que l’on fait</div>
            <h2>Réseau & <span className="c">internet</span></h2>
            <div className="div-line" />
          </div>
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

        <p style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.9rem', marginBottom: 40, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          Problème plutôt sur le PC lui-même ? Voir{' '}
          <Link to="/reparation-ordinateur-le-mans" style={{ color: 'var(--c)' }}>réparation ordinateur</Link>
          {' '}ou{' '}
          <Link to="/virus-malwares-depannage-le-mans" style={{ color: 'var(--c)' }}>suppression de virus</Link>.
        </p>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))', border: '1px solid rgba(0,207,255,0.2)', borderRadius: 24, padding: '36px 24px' }}>
          <h2 style={{ marginBottom: 12 }}>Réseau capricieux à <span className="c">Le Mans</span> ?</h2>
          <p style={{ color: 'var(--dim)', marginBottom: 24 }}>Intervention à domicile — explications claires</p>
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
        </div>
        <SeoBoost pageKey="wifi-reseau" />
      </div>
    </PageLayout>
  )
}
