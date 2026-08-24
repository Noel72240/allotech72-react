import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config, { fullName } from '../config.js'

export default function Presse() {
  const articles = config.presse || []
  const of = articles[0]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `${config.brand} dans la presse`,
    url: `${config.siteUrl}/presse`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: config.brand,
      url: config.siteUrl,
    },
  }

  return (
    <PageLayout
      title="Allotech72 dans la presse — Ouest-France / Maine Libre"
      description={`${fullName()} (Allotech72, Lombron) dans Ouest-France : lancement de l’entreprise de dépannage informatique en Sarthe.`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container presse-page">
        <div className="stag">Presse</div>
        <h1>
          {config.brand} dans les <span className="c">médias</span>
        </h1>
        <div className="div-line" style={{ marginLeft: 0 }} />
        <p className="presse-page__lead">
          {fullName()}, technicien informatique à {config.ville}, a été interviewé par Ouest-France / Le Maine Libre
          au lancement d’Allotech72.
        </p>

        {of && (
          <article className="presse-card">
            <p className="presse-card__kicker">{of.label} · 8 août 2026</p>
            <h2>{of.titre}</h2>
            <p>
              Passionné de high-tech depuis l’enfance, {config.prenom} a lancé son activité à {config.ville} :
              réparation d’ordinateurs et de téléphones, toutes marques, intervention en Sarthe.
              L’article original est chez l’éditeur — on n’en recopie pas le texte.
            </p>
            <a className="bm bp" href={of.url} target="_blank" rel="noopener noreferrer">
              Lire sur Ouest-France →
            </a>
          </article>
        )}

        <p className="presse-page__cta">
          Besoin d’un dépannage ? <a href={`tel:${config.telBrut}`}>{config.telephone}</a>
          {' · '}
          <Link to="/prendre-rdv">Prendre RDV</Link>
        </p>
      </div>
    </PageLayout>
  )
}
