import { Link } from 'react-router-dom'
import config from '../config.js'

export default function FaqHome() {
  const items = config.faq || []
  if (!items.length) return null

  return (
    <section id="faq" className="sp faq-home">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="stag">Questions fréquentes</div>
          <h2>
            Avant d’<span className="c">appeler</span>
          </h2>
          <div className="div-line" />
        </div>

        <div className="faq-home__list">
          {items.map((item, i) => (
            <details key={item.q} className="faq-item rev" open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.r}</p>
            </details>
          ))}
        </div>

        <p className="faq-home__cta rev">
          Pas de réponse ? <Link to="/prendre-rdv">Prendre un créneau</Link>
          {' · '}
          <a href={`tel:${config.telBrut}`}>{config.telephone}</a>
        </p>
      </div>
    </section>
  )
}
