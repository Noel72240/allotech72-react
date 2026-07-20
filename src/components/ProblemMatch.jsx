import { Link } from 'react-router-dom'
import config from '../config.js'

export default function ProblemMatch() {
  const problems = config.problems || []
  if (!problems.length) return null

  return (
    <section id="problemes" className="sp problem-match">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="stag">Simple & rapide</div>
          <h2>
            Vous reconnaissez <span className="c">votre problème</span> ?
          </h2>
          <div className="div-line" />
          <p className="sub">
            Cliquez sur votre cas — on vous oriente vers la bonne solution, avec devis clair.
          </p>
        </div>

        <div className="problem-match__grid">
          {problems.map((p) => (
            <Link key={p.to} to={p.to} className="problem-card rev">
              <div className="problem-card__top">
                <span className="problem-card__ico" aria-hidden="true">{p.ico}</span>
                <h3>{p.title}</h3>
              </div>
              <p className="problem-card__quote">« {p.quote} »</p>
              {p.tags?.length > 0 && (
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
              <span className="problem-card__cta">Voir la solution →</span>
            </Link>
          ))}
        </div>

        <div className="problem-match__cta rev">
          <p>Pas sûr du diagnostic ? Appelez — on vous dit clairement quoi faire.</p>
          <a href={`tel:${config.telBrut}`} className="bm bp">
            📞 {config.telephone}
          </a>
        </div>
      </div>
    </section>
  )
}
