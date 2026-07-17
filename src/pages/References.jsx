import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { fetchWebClientsPublic } from '../lib/clients.js'
import config from '../config.js'

function ClientLogo({ client }) {
  if (client.logo) {
    return (
      <img
        className="clients__logo-img"
        src={client.logo}
        alt={`Logo ${client.name}`}
        loading="lazy"
        decoding="async"
      />
    )
  }
  const initials = client.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return <span className="clients__logo-fallback" aria-hidden="true">{initials}</span>
}

export default function References() {
  const [list, setList] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchWebClientsPublic()
      .then((rows) => {
        if (!cancelled) {
          setList(rows)
          setReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => { cancelled = true }
  }, [])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Références web — sites créés par ${config.brand}`,
    description: 'Liste des sites internet réalisés par Allotech72 pour des clients en Sarthe.',
    numberOfItems: list.length,
    itemListElement: list.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: c.url || undefined,
    })),
  }

  return (
    <PageLayout
      title="Références web — Sites créés en Sarthe | Allotech72"
      description={`Sites internet créés par ${config.brand} pour des entreprises et indépendants en Sarthe. Découvrez nos références web et demandez votre devis.`}
    >
      {ready && list.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <div className="container references-page" style={{ paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 20 }}>
          <nav style={{ fontSize: '.78rem', color: 'var(--dim)', marginBottom: 20 }}>
            <Link to="/" style={{ color: 'var(--c)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Références web</span>
          </nav>
          <div className="stag">Création de sites</div>
          <h1 style={{
            fontFamily: "'Orbitron',sans-serif",
            fontSize: 'clamp(1.7rem,4vw,2.6rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 16,
          }}
          >
            Références <span className="c">web</span>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: '1rem', maxWidth: 560, margin: '0 auto 20px', lineHeight: 1.7 }}>
            Sites internet réalisés par {config.brand} pour des clients en Sarthe.
            Chaque lien pointe vers le site en ligne.
          </p>
          <div className="div-line" />
        </div>

        {!ready ? (
          <p style={{ textAlign: 'center', color: 'var(--dim)' }}>Chargement…</p>
        ) : list.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            border: '1px solid rgba(0,207,255,0.15)',
            borderRadius: 16,
            background: 'rgba(5,14,28,0.6)',
          }}
          >
            <p style={{ color: 'var(--dim)', marginBottom: 20 }}>
              Les références seront publiées ici prochainement.
            </p>
            <Link to="/creation-site-internet-sarthe" className="bm bp">Créer mon site →</Link>
          </div>
        ) : (
          <ul className="references-list">
            {list.map((client) => (
              <li key={client.id || client.name} className="references-list__item">
                <div className="references-list__logo">
                  <ClientLogo client={client} />
                </div>
                <div className="references-list__body">
                  <h2 className="references-list__name">{client.name}</h2>
                  {client.sector ? (
                    <p className="references-list__sector">{client.sector}</p>
                  ) : null}
                  {client.url ? (
                    <a
                      className="references-list__url"
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {client.url.replace(/^https?:\/\//i, '')}
                    </a>
                  ) : (
                    <span className="references-list__url references-list__url--muted">Site bientôt en ligne</span>
                  )}
                </div>
                {client.url ? (
                  <a
                    className="references-list__cta"
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir le site →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/creation-site-internet-sarthe" className="bm bp">Créer mon site →</Link>
          <Link to="/#references" className="bm bo">Voir sur l’accueil</Link>
        </div>
      </div>
    </PageLayout>
  )
}
