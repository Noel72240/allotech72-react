import config from '../config.js'

export default function Formules() {
  const formules = config.formules || []
  if (!formules.length) return null

  return (
    <section id="formules" className="sp formules">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="stag">Offres Allotech72</div>
          <h2>
            3 formules <span className="c">claires</span>
          </h2>
          <div className="div-line" />
          <p className="sub">
            Pas de forfait opaque — vous choisissez le niveau d’aide, devis annoncé avant réparation.
          </p>
        </div>

        <div className="formules__grid">
          {formules.map((f) => (
            <article
              key={f.id}
              className={'formule-card rev' + (f.featured ? ' is-featured' : '')}
            >
              {f.badge && <span className="formule-card__badge">{f.badge}</span>}
              <h3>{f.nom}</h3>
              <p className="formule-card__price">{f.price}</p>
              <p className="formule-card__desc">{f.desc}</p>
              {f.points?.length > 0 && (
                <ul className="formule-card__points">
                  {f.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              <a href={`tel:${config.telBrut}`} className="bm bp formule-card__cta">
                📞 {config.telephone}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
