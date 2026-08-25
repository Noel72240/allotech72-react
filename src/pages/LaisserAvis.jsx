import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config, { reviewLinks } from '../config.js'

export default function LaisserAvis() {
  const links = reviewLinks()
  const sms = `${config.siteUrl.replace(/\/$/, '')}/avis/laisser`

  return (
    <PageLayout
      title="Laisser un avis Allotech72 — Google, AlloVoisin, Facebook"
      description={`Merci pour votre confiance. Un avis Google aide d’autres foyers en Sarthe à trouver ${config.brand}. ${config.telephone}`}
    >
      <div className="container laisser-avis">
        <div className="stag">Après l’intervention</div>
        <h1>
          Un avis, <span className="c">ça compte</span>
        </h1>
        <div className="div-line" />
        <p className="laisser-avis__lead">
          30 secondes, sans compte Allotech72. Google est le plus important : c’est lui qui affiche
          Allotech72 quand on cherche un informaticien au Mans.
        </p>

        <ul className="laisser-avis__list">
          {links.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                className={'laisser-avis__btn' + (s.featured ? ' is-featured' : '')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>{s.featured ? '★ Avis Google' : s.label}</strong>
                {s.hint ? <span>{s.hint}</span> : null}
              </a>
            </li>
          ))}
        </ul>

        <p className="laisser-avis__sms">
          Lien à envoyer après un dépannage : <code>{sms}</code>
        </p>
        <p className="laisser-avis__back">
          <Link to="/avis">Voir les avis déjà publiés →</Link>
        </p>
      </div>
    </PageLayout>
  )
}
