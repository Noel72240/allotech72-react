// ══════════════════════════════════════════════════════════
// Page SEO dédiée — /depannage-informatique-le-mans
// Objectif : remonter sur "dépannage informatique Le Mans"
// ══════════════════════════════════════════════════════════
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config from '../config.js'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Dépannage informatique Le Mans',
  description: 'Service de dépannage et réparation informatique à domicile sur Le Mans et la Sarthe. Réparation PC, téléphone, tablette. Intervention rapide.',
  provider: {
    '@type': 'LocalBusiness',
    name: config.brand,
    telephone: '+33' + config.telBrut.slice(1),
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.adresse,
      addressLocality: config.ville,
      postalCode: config.codePostal,
      addressCountry: 'FR',
    },
  },
  areaServed: {
    '@type': 'City',
    name: 'Le Mans',
  },
  serviceType: 'Dépannage informatique',
}

const services = [
  {
    ico: '🖥️',
    h2: 'Réparation ordinateur Le Mans',
    texte: `Votre PC Windows ou Mac est lent, ne démarre plus, ou a un écran cassé ? ${config.brand} intervient directement à votre domicile sur Le Mans et ses communes alentours. Diagnostic précis, réparation rapide, tarif transparent.`,
    tags: ['PC Windows', 'Mac', 'Ordinateur portable', 'Tour PC', 'Montage PC gaming'],
  },
  {
    ico: '📱',
    h2: 'Réparateur téléphone Le Mans',
    texte: `Écran fissuré, batterie qui ne tient plus, smartphone bloqué ? Noël Liebault répare votre iPhone ou téléphone Android directement chez vous, sans que vous ayez à vous déplacer. Intervention soigneuse sur toutes marques.`,
    tags: ['iPhone', 'Samsung', 'Huawei', 'Android', 'Tablette'],
  },
  {
    ico: '🛡️',
    h2: 'Suppression virus et sécurisation PC',
    texte: `Votre ordinateur est infecté, redirigé, ou anormalement lent ? ${config.brand} nettoie votre PC de tous les malwares, spywares et virus, puis le sécurise pour éviter de futures infections. Conseils personnalisés inclus.`,
    tags: ['Virus', 'Malware', 'Spyware', 'Ransomware', 'Optimisation'],
  },
  {
    ico: '💾',
    h2: 'Récupération de données Le Mans',
    texte: `Disque dur en panne, fichiers supprimés par erreur, PC qui ne démarre plus ? Nous mettons tout en œuvre pour récupérer vos précieuses photos, documents et fichiers professionnels avant toute intervention matérielle.`,
    tags: ['Récupération données', 'Disque dur', 'Photos perdues', 'Sauvegarde'],
  },
  {
    ico: '📶',
    h2: 'Dépannage réseau et Wi-Fi Le Mans',
    texte: `Connexion internet instable, Wi-Fi qui coupe, box mal configurée ? ${config.brand} diagnostique et résout vos problèmes de réseau à domicile sur toute la zone Le Mans et Sarthe.`,
    tags: ['Wi-Fi', 'Box internet', 'Réseau', 'Fibre', 'ADSL'],
  },
  {
    ico: '🌐',
    h2: 'Création site internet vitrine',
    texte: `Artisan, commerçant ou entrepreneur en Sarthe ? ${config.brand} crée votre site internet vitrine moderne, rapide et bien référencé sur Google. Design professionnel, formulaire de contact, SEO local inclus.`,
    tags: ['Site vitrine', 'SEO local', 'React', 'Responsive', 'Google'],
  },
]

const faq = [
  { q: 'Quel est le délai d\'intervention à Le Mans ?', r: `${config.brand} intervient généralement dans les 24 à 48h. Pour les urgences, contactez directement Noël au ${config.telephone}.` },
  { q: 'Combien coûte un dépannage informatique à domicile ?', r: 'Les tarifs sont transparents et communiqués avant toute intervention. Un simple déplacement + diagnostic à partir de 40€. Devis gratuit au téléphone.' },
  { q: 'Intervenez-vous dans toute la Sarthe ?', r: `${config.brand} couvre Le Mans, Lombron, Allonnes, Champagné, Montfort-le-Gesnois, Connerré, Yvré-l'Évêque, Changé, Saint-Mars-la-Brière et tout le secteur Sarthe.` },
  { q: 'Réparez-vous les téléphones iPhone et Android ?', r: 'Oui, Noël répare tous les smartphones et tablettes : iPhone, Samsung, Huawei, et toutes marques Android, à votre domicile.' },
  { q: 'Proposez-vous des cours d\'informatique à domicile ?', r: `Oui ! ${config.brand} propose des initiations à l'informatique pour débutants et seniors, directement chez vous, à votre rythme.` },
]

export default function DepannageLeMansSEO() {
  return (
    <PageLayout
      title="Dépannage Informatique Le Mans — Réparation PC, Téléphone | Allotech72"
      description="Dépannage informatique à domicile sur Le Mans et Sarthe. Réparation PC, téléphone, tablette, récupération données, suppression virus. Technicien local — 06 13 89 39 67."
    >
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="container" style={{ paddingBottom: 80 }}>

        {/* ═══ HERO ═══ */}
        <div style={{ textAlign: 'center', padding: '40px 0 56px' }}>
          {/* Breadcrumb */}
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 24 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Dépannage informatique Le Mans</span>
          </nav>

          <div className="stag">Technicien local — Sarthe (72)</div>

          {/* H1 optimisé */}
          <h1 style={{
            fontFamily: "'Orbitron',sans-serif",
            fontSize: 'clamp(1.8rem,4vw,3rem)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.1, marginBottom: 24,
          }}>
            Dépannage Informatique<br />
            <span style={{ color: 'var(--c)' }}>Le Mans</span> & <span style={{ color: 'var(--g)' }}>Sarthe</span>
          </h1>

          <p style={{ color: 'var(--dim)', fontSize: '1.05rem', maxWidth: 620, margin: '0 auto 36px', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--tx)' }}>Noël Liebault — {config.brand}</strong> intervient à votre domicile pour réparer votre ordinateur, téléphone ou tablette. Diagnostic précis, tarifs transparents, déplacement rapide sur Le Mans et tout le secteur Sarthe.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Devis gratuit →</Link>
          </div>

          {/* Badges confiance */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
            {[
              '⭐ 32+ avis 5 étoiles',
              '🏠 Intervention à domicile',
              '💰 Tarifs transparents',
              '⚡ Disponible 6j/7',
            ].map((b, i) => (
              <span key={i} style={{
                background: 'rgba(0,207,255,0.07)',
                border: '1px solid rgba(0,207,255,0.2)',
                color: 'var(--tx)', padding: '7px 16px',
                borderRadius: 100, fontSize: '.8rem', fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>
        </div>

        {/* ═══ SERVICES H2 ═══ */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="stag">Nos interventions</div>
            <h2>Services de <span className="c">réparation informatique</span><br />à Le Mans et Sarthe</h2>
            <div className="div-line" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {services.map((s, i) => (
              <div key={i} className="svc-card rev">
                <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>{s.ico}</div>
                <h2 style={{
                  fontFamily: "'Orbitron',sans-serif", color: 'var(--c)',
                  fontSize: '.95rem', fontWeight: 700, marginBottom: 12,
                }}>{s.h2}</h2>
                <p style={{ color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.75 }}>{s.texte}</p>
                <div className="tags" style={{ marginTop: 14 }}>
                  {s.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ZONE D'INTERVENTION ═══ */}
        <div style={{
          background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.15)',
          borderRadius: 20, padding: '36px', marginBottom: 72,
        }}>
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", color: '#fff', fontSize: '1.2rem', marginBottom: 16 }}>
            Zone d'intervention — <span style={{ color: 'var(--c)' }}>Le Mans & Sarthe</span>
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.92rem', lineHeight: 1.8, marginBottom: 20 }}>
            {config.brand} intervient sur <strong style={{ color: 'var(--tx)' }}>Le Mans</strong> et toutes les communes du secteur Sarthe : <strong style={{ color: 'var(--tx)' }}>Lombron, Allonnes, Champagné, Montfort-le-Gesnois, Connerré, Yvré-l'Évêque, Changé, Saint-Mars-la-Brière, Rouillon, Arnage, Mulsanne, Parigné-l'Évêque</strong> et environs.
          </p>
          <a href={`tel:${config.telBrut}`} className="bm bp" style={{ display: 'inline-flex' }}>
            📞 Appeler — {config.telephone}
          </a>
        </div>

        {/* ═══ FAQ ═══ */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="stag">Questions fréquentes</div>
            <h2>FAQ — <span className="c">Dépannage informatique Le Mans</span></h2>
            <div className="div-line" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faq.map((f, i) => (
              <details key={i} style={{
                background: 'rgba(5,14,28,0.7)',
                border: '1px solid rgba(0,207,255,0.12)',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <summary style={{
                  padding: '18px 22px', cursor: 'pointer',
                  fontFamily: "'Orbitron',sans-serif", fontSize: '.88rem',
                  fontWeight: 700, color: '#fff',
                  listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {f.q}
                  <span style={{ color: 'var(--c)', flexShrink: 0, marginLeft: 12 }}>+</span>
                </summary>
                <div style={{ padding: '0 22px 18px', color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.75 }}>
                  {f.r}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ═══ AVIS ═══ */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="stag">Avis vérifiés</div>
            <h2>Ce que disent nos clients<br /><span className="c">Le Mans & Sarthe</span></h2>
            <div className="div-line" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {config.avis.slice(0, 6).map((a, i) => (
              <div key={i} className="avis-card">
                <div className="avis-head">
                  <div className="avis-av">{a.initiales}</div>
                  <div>
                    <h4>{a.nom}</h4>
                    <div className="avis-stars">★★★★★</div>
                    <div className="avis-type">{a.type}</div>
                  </div>
                </div>
                <p className="avis-txt">"{a.texte}"</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/avis" className="bm bo">Voir tous les avis →</Link>
          </div>
        </div>

        {/* ═══ CTA FINAL ═══ */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg,rgba(0,207,255,0.08),rgba(43,255,154,0.05))',
          border: '1px solid rgba(0,207,255,0.2)',
          borderRadius: 24, padding: '48px 32px',
        }}>
          <h2 style={{ marginBottom: 16 }}>
            Besoin d'un <span className="c">technicien informatique</span><br />sur Le Mans ?
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.95rem', marginBottom: 32 }}>
            Contactez Noël Liebault — {config.brand} — pour un devis gratuit.<br />
            Intervention rapide sur Le Mans et tout le secteur Sarthe.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Formulaire de contact →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
