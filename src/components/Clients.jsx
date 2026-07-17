import { Link } from 'react-router-dom'
import { WEB_CLIENTS, WEB_CLIENTS_SHOW_EMPTY } from '../data/clients.js'

function ClientLogo({ client }) {
  if (client.logo) {
    return (
      <img
        className="clients__logo-img"
        src={client.logo}
        alt=""
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

export default function Clients() {
  const list = WEB_CLIENTS.filter((c) => c?.name)
  if (!list.length && !WEB_CLIENTS_SHOW_EMPTY) return null

  return (
    <section id="references" className="sp clients">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="stag">Création de sites</div>
          <h2>Ils me font <span className="c">confiance</span></h2>
          <p className="clients__lead">
            Des entreprises et indépendants en Sarthe qui m’ont confié leur site internet.
          </p>
          <div className="div-line" />
        </div>

        {list.length > 0 ? (
          <ul className="clients__grid rev">
            {list.map((client) => {
              const inner = (
                <>
                  <span className="clients__logo">
                    <ClientLogo client={client} />
                  </span>
                  <span className="clients__meta">
                    <span className="clients__name">{client.name}</span>
                    {client.sector ? (
                      <span className="clients__sector">{client.sector}</span>
                    ) : null}
                  </span>
                </>
              )

              return (
                <li key={client.name + (client.url || '')} className="clients__item">
                  {client.url ? (
                    <a
                      href={client.url}
                      className="clients__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Voir le site de ${client.name}`}
                    >
                      {inner}
                      <span className="clients__visit">Voir le site →</span>
                    </a>
                  ) : (
                    <div className="clients__link clients__link--static">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="clients__empty rev">
            Bientôt : les logos et sites de mes clients web.
          </p>
        )}

        <div className="clients__cta rev">
          <Link to="/creation-site-internet-sarthe" className="bm bp">
            Créer mon site →
          </Link>
        </div>
      </div>
    </section>
  )
}
