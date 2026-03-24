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
            <div key={i} className="svc-card rev" onMouseMove={tilt} onMouseLeave={untilt}>
              <span className="si">{s.icon}</span>
              <h3>{s.titre}</h3>
              <p>{s.desc}</p>
              <div className="tags">
                {s.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
