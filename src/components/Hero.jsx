import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import config, { fullName } from '../config.js'

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
  {fullName()} — technicien informatique à domicile basé à {config.ville} — intervient rapidement chez vous sur Le Mans et toute la Sarthe.<br />
  Dépannage PC, réparation téléphone, montage sur mesure, création de site internet :<br />
  chaque intervention est réalisée avec précision, sans jargon, au juste prix.<br />
  Diagnostic gratuit, devis transparent, déplacement rapide — 7j/7.<br />
  Faites confiance au spécialiste informatique de proximité en Sarthe.
</p>

            <div className="hacts">
              <a href={`tel:${config.telBrut}`} className="bm bp" onMouseMove={magMove} onMouseLeave={magLeave}>
                📞 Appeler maintenant
              </a>
              <Link to="/boutique" className="bm bo hero-shop-btn" onMouseMove={magMove} onMouseLeave={magLeave}>
                🛒 Boutique en ligne
              </Link>
              <a href="#contact" className="bm bo hero-devis-btn" onMouseMove={magMove} onMouseLeave={magLeave}>
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

          <div className="hr">
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-visual__glow" />
              <div className="hero-visual__card">
                <div className="hero-visual__top">
                  <span className="hero-visual__dot" />
                  <span className="hero-visual__dot" />
                  <span className="hero-visual__dot" />
                  <span className="hero-visual__label">Diagnostic Allotech72</span>
                </div>

                <div className="hero-visual__screen">
                  <svg className="hero-visual__device" viewBox="0 0 120 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="4" width="104" height="62" rx="6" stroke="currentColor" strokeWidth="2" opacity=".9" />
                    <rect x="14" y="10" width="92" height="46" rx="3" fill="url(#heroScreenGrad)" />
                    <path d="M2 70h116" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".55" />
                    <path d="M42 70h36c2 0 3 1.5 3 3H39c0-1.5 1-3 3-3z" fill="currentColor" opacity=".4" />
                    <defs>
                      <linearGradient id="heroScreenGrad" x1="14" y1="10" x2="106" y2="56" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00CFFF" stopOpacity=".35" />
                        <stop offset="1" stopColor="#2BFF9A" stopOpacity=".2" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="hero-visual__status">
                    <span className="hero-visual__ok" />
                    Système prêt
                  </div>
                </div>

                <ul className="hero-visual__list">
                  <li>
                    <span className="hero-visual__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                    </span>
                    <div>
                      <strong>PC &amp; Mac</strong>
                      <em>Réparation · upgrade</em>
                    </div>
                  </li>
                  <li>
                    <span className="hero-visual__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
                    </span>
                    <div>
                      <strong>Téléphone</strong>
                      <em>Écran · batterie</em>
                    </div>
                  </li>
                  <li>
                    <span className="hero-visual__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>
                    </span>
                    <div>
                      <strong>Sites web</strong>
                      <em>Vitrine · SEO Sarthe</em>
                    </div>
                  </li>
                  <li>
                    <span className="hero-visual__ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
                    </span>
                    <div>
                      <strong>Sécurité</strong>
                      <em>Virus · malwares</em>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
