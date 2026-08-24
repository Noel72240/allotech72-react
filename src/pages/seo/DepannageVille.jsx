import { Link, Navigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/PageLayout.jsx'
import config, { fullName } from '../../config.js'
import { SEO_PILLAR } from '../../data/seoPages.js'
import { getCityByPath, SEO_CITY_PAGES } from '../../data/seoCities.js'

export default function DepannageVille() {
  const { pathname } = useLocation()
  const city = getCityByPath(pathname)
  if (!city) return <Navigate to="/depannage-informatique-sarthe" replace />

  const others = SEO_CITY_PAGES.filter((c) => c.to !== city.to)
  const tel = `+33${config.telBrut.slice(1)}`
  const url = `${config.siteUrl}${city.to}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Dépannage informatique ${city.name}`,
    description: city.lead,
    url,
    provider: {
      '@type': 'LocalBusiness',
      name: config.brand,
      telephone: tel,
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.adresse,
        addressLocality: config.ville,
        postalCode: config.codePostal,
        addressCountry: 'FR',
      },
    },
    areaServed: { '@type': 'City', name: city.name },
    serviceType: 'Dépannage informatique à domicile',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r },
    })),
  }

  const title = `Dépannage informatique ${city.name} (${city.postal}) | Allotech72`
  const description = `${city.lead} Diagnostic gratuit, ${city.delay.toLowerCase()}. ${config.telephone}`

  return (
    <PageLayout title={title} description={description}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="city-page">
        <nav className="city-page__bc">
          <Link to="/">Accueil</Link>
          <span>›</span>
          <Link to={SEO_PILLAR.to}>{SEO_PILLAR.label}</Link>
          <span>›</span>
          <span>{city.name}</span>
        </nav>

        <header className="city-page__hero">
          <div className="stag">{city.name} ({city.postal}) · ~{city.km} km de {config.ville}</div>
          <h1>
            Dépannage informatique à <span className="c">{city.name}</span>
          </h1>
          <p>{city.lead}</p>
          <ul className="city-page__facts">
            <li>Délai : {city.delay}</li>
            <li>Déplacement : {city.deplacement}</li>
            <li>Trajet : ~{city.driveMin} min depuis {config.ville}</li>
          </ul>
          <div className="city-page__acts">
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/prendre-rdv" className="bm bo">Prendre RDV →</Link>
          </div>
        </header>

        <div className="city-page__grid">
          <article className="city-page__card">
            <h2>Pourquoi un technicien à {city.name} ?</h2>
            <p>{city.angle}</p>
            <p>{city.local}</p>
            <p>
              {fullName()} ({config.brand}) : diagnostic gratuit, devis avant réparation, garantie Proximité 30 jours.
              Grille : <Link to="/tarifs">tarifs</Link>.
            </p>
          </article>
          <article className="city-page__card">
            <h2>Communes autour</h2>
            <p>Depuis {city.name}, les déplacements voisins se calent souvent sur le même créneau :</p>
            <ul>
              {city.nearby.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="city-page__muted">Toute la Sarthe reste couverte — cherchez votre commune sur l’accueil.</p>
          </article>
        </div>

        <section className="city-page__faq">
          <h2>Questions à {city.name}</h2>
          {city.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </section>

        <section className="city-page__more">
          <h2>Autres villes</h2>
          <ul>
            <li><Link to="/depannage-informatique-le-mans">Le Mans</Link></li>
            {others.map((c) => (
              <li key={c.to}><Link to={c.to}>{c.name}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  )
}
