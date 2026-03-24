import { useEffect, useRef, useState } from 'react'
import config from '../config.js'

function useTyping(phrases) {
  const [text, setText] = useState('')
  const state = useRef({ pi: 0, ci: 0, del: false })

  useEffect(() => {
    let timer
    const tick = () => {
      const { pi, ci, del } = state.current
      const p = phrases[pi]
      if (!del) {
        setText(p.slice(0, ci + 1))
        state.current.ci++
        if (ci + 1 === p.length) { state.current.del = true; timer = setTimeout(tick, 1800); return }
      } else {
        setText(p.slice(0, ci - 1))
        state.current.ci--
        if (ci - 1 === 0) { state.current.del = false; state.current.pi = (pi + 1) % phrases.length }
      }
      timer = setTimeout(tick, del ? 40 : 80)
    }
    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [phrases])

  return text
}

function useCounters() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = +e.target.dataset.target
          let c = 0
          const iv = setInterval(() => {
            c += Math.ceil(target / 35)
            if (c >= target) { c = target; clearInterval(iv) }
            e.target.textContent = c + '+'
          }, 40)
          obs.unobserve(e.target)
        }
      })
    })
    document.querySelectorAll('[data-target]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Hero() {
  const typed = useTyping(config.typingPhrases)
  useCounters()

  // Magnetic buttons — desktop seulement
  const isMobile = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
  const magMove = (e) => {
    if (isMobile()) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) * .25
    const y = (e.clientY - r.top  - r.height / 2) * .25
    e.currentTarget.style.transform = `translate(${x}px,${y}px) translateY(-3px)`
  }
  const magLeave = (e) => { e.currentTarget.style.transform = '' }

  return (
    <section id="hero">
      <div className="container">
        <div className="hg">
          <div className="hl">
            <div className="hbadge">
              <div className="bdot" />
              Intervention rapide à domicile
            </div>

            <h1>
              Dépannage<br />
              <span className="glitch" data-text="Informatique">Informatique</span><br />
              <span className="gt">Le Mans & Sarthe</span>
            </h1>

            <div className="tl">
              {typed}<span className="tc" />
            </div>

            <p className="hdesc">
              {config.prenom} {config.nom} — technicien passionné basé à {config.ville} — intervient chez vous pour réparer vos appareils et crée votre site internet ou application mobile. Diagnostic précis, conseils clairs, tarifs transparents.
            </p>

            <div className="hacts">
              <a href={`tel:${config.telBrut}`} className="bm bp" onMouseMove={magMove} onMouseLeave={magLeave}>
                📞 Appeler maintenant
              </a>
              <a href="#contact" className="bm bo" onMouseMove={magMove} onMouseLeave={magLeave}>
                Devis gratuit →
              </a>
            </div>

            <div className="hstats">
              {config.stats.map((s, i) => (
                <div key={i}>
                  <div className="stn" data-target={s.num || undefined}>
                    {s.fixed ?? '0+'}
                  </div>
                  <div className="stl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphic */}
          <div className="hr">
            <div className="dsc">
              <div className="dr r1" /><div className="dr r2" /><div className="dr r3" />
              <div className="dow">
                <div className="dorb">💻</div>
                <div className="fi fi1">📱</div>
                <div className="fi fi2">🛡️</div>
                <div className="fi fi3">🌐</div>
                <div className="fi fi4">📶</div>
              </div>
              <div className="clines">
                &gt; boot.diagnose()<br />
                &gt; scan.virus: ✓ clean<br />
                &gt; repair.status: OK<br />
                &gt; client.happy: true
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
