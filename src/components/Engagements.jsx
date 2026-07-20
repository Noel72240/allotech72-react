import { Link } from 'react-router-dom'
import config from '../config.js'

export default function Engagements() {
  const g = config.garantie
  const parcours = config.parcours || []
  const promesse = config.promesse

  if (!g && !parcours.length && !promesse) return null

  return (
    <section id="engagements" className="sp engagements">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="stag">Engagements</div>
          <h2>
            Ce qui nous <span className="c">différencie</span>
          </h2>
          <div className="div-line" />
        </div>

        {promesse && (
          <blockquote className="engagements__promesse rev">
            <p className="engagements__promesse-label">{promesse.titre}</p>
            <p className="engagements__promesse-text">« {promesse.texte} »</p>
          </blockquote>
        )}

        {parcours.length > 0 && (
          <div className="engagements__parcours rev">
            <h3 className="engagements__h3">Comment ça se passe</h3>
            <ol className="engagements__steps">
              {parcours.map((s) => (
                <li key={s.n}>
                  <span className="engagements__n">{s.n}</span>
                  <div>
                    <h4>{s.titre}</h4>
                    <p>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {g && (
          <div className="engagements__garantie rev">
            <div className="engagements__garantie-badge">{g.jours}j</div>
            <div>
              <h3>{g.titre}</h3>
              <p className="engagements__garantie-resume">{g.resume}</p>
              <p className="engagements__garantie-details">{g.details}</p>
              <div className="engagements__garantie-acts">
                <a href={`tel:${config.telBrut}`} className="bm bp">
                  📞 {config.telephone}
                </a>
                <Link to="/#contact" className="bm bo">
                  Demander un devis →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
