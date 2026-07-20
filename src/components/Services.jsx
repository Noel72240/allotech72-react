import { Link } from 'react-router-dom'
import config from '../config.js'

const isMobile = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches

const tilt = (e) => {
  if (isMobile()) return
  const r = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width  - .5
  const y = (e.clientY - r.top)  / r.height - .5
  e.currentTarget.style.transform = `translateY(-8px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`
}
const untilt = (e) => { e.currentTarget.style.transform = '' }

function ServiceCard({ s, i }) {
  const priceLabel = s.priceFrom
    ? (s.priceFrom === 'Devis' || s.priceFrom === 'Sur devis'
      ? s.priceFrom
      : `Dès ${s.priceFrom}`)
    : null

  const body = (
    <>
      {priceLabel && <span className="svc-price">{priceLabel}</span>}
      <span className="si">{s.icon}</span>
      <h3>{s.titre}</h3>
      <p>{s.desc}</p>
      <div className="tags">
        {s.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
      </div>
      {s.to && <span className="svc-more">En savoir plus →</span>}
    </>
  )

  if (s.to) {
    const isHash = s.to.startsWith('/#') || s.to.startsWith('#')
    if (isHash) {
      return (
        <a
          key={i}
          href={s.to.replace(/^\//, '')}
          className="svc-card rev"
          onMouseMove={tilt}
          onMouseLeave={untilt}
        >
          {body}
        </a>
      )
    }
    return (
      <Link
        key={i}
        to={s.to}
        className="svc-card rev"
        onMouseMove={tilt}
        onMouseLeave={untilt}
      >
        {body}
      </Link>
    )
  }

  return (
    <div key={i} className="svc-card rev" onMouseMove={tilt} onMouseLeave={untilt}>
      {body}
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="stag">Prestations</div>
          <h2>Mes <span className="c">Services</span></h2>
          <div className="div-line" />
          <p className="sub">Réparation, dépannage, création web & mobile — tout pour vous aider.</p>
        </div>

        <div className="sg">
          {config.services.map((s, i) => (
            <ServiceCard key={i} s={s} i={i} />
          ))}
        </div>

        <div className="services-cta rev">
          <p>Devis transparent avant toute réparation — déplacement + diagnostic dès 20€.</p>
          <a href={`tel:${config.telBrut}`} className="bm bp">
            📞 {config.telephone}
          </a>
        </div>
      </div>
    </section>
  )
}
