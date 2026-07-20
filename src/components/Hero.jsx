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

function HeroShowcase() {
  const chips = [
    {
      to: '/wifi-reseau-internet-le-mans',
      label: 'Wi-Fi',
      cls: 'wifi',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 12.5a9 9 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      to: '/virus-malwares-depannage-le-mans',
      label: 'Sécurité',
      cls: 'shield',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      to: '/reparation-ordinateur-le-mans',
      label: 'PC & Mac',
      cls: 'pc',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      ),
    },
    {
      to: '/reparateur-telephone-le-mans',
      label: 'Mobile',
      cls: 'phone',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      ),
    },
    {
      to: '/creation-site-internet-sarthe',
      label: 'Web',
      cls: 'web',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
      ),
    },
  ]

  return (
    <div className="hero-stage">
      <div className="hero-stage__aura" aria-hidden="true" />
      <div className="hero-stage__ring" aria-hidden="true" />

      {chips.map((c) => (
        <Link
          key={c.to}
          to={c.to}
          className={`hero-stage__chip hero-stage__chip--${c.cls}`}
          aria-label={c.label}
        >
          <span className="hero-stage__chip-ico">{c.ico}</span>
          <span className="hero-stage__chip-lbl">{c.label}</span>
        </Link>
      ))}

      <div className="hero-stage__devices" aria-hidden="true">
        <div className="hero-stage__laptop">
          <div className="hero-stage__lid">
            <span className="hero-stage__cam" />
            <div className="hero-stage__screen">
              <div className="hero-stage__scan" />
              <div className="hero-stage__menubar">
                <span /><span /><span />
                <em>atelier.at72</em>
              </div>
              <div className="hero-stage__ui">
                <div className="hero-stage__ui-head">
                  <span className="hero-stage__brand">Allotech72</span>
                  <span className="hero-stage__badge-live">Live</span>
                </div>
                <div className="hero-stage__cards">
                  <span className="hero-stage__mini"><b>PC</b><i style={{ width: '78%' }} /></span>
                  <span className="hero-stage__mini"><b>Net</b><i style={{ width: '64%' }} /></span>
                  <span className="hero-stage__mini"><b>Sec</b><i style={{ width: '90%' }} /></span>
                </div>
                <span className="hero-stage__pill">Diagnostic gratuit</span>
              </div>
            </div>
          </div>
          <div className="hero-stage__hinge" />
          <div className="hero-stage__deck">
            <div className="hero-stage__keys" />
            <div className="hero-stage__track" />
          </div>
        </div>

        <div className="hero-stage__phone">
          <span className="hero-stage__btn hero-stage__btn--vol" />
          <span className="hero-stage__btn hero-stage__btn--pwr" />
          <div className="hero-stage__phone-screen">
            <div className="hero-stage__notch" />
            <div className="hero-stage__status">
              <em>9:41</em>
              <span className="hero-stage__signal" />
            </div>
            <div className="hero-stage__app">
              <i className="hero-stage__app-dot" />
              <strong>À domicile</strong>
              <small>Intervention Sarthe</small>
              <div className="hero-stage__app-row">
                <span /><span /><span />
              </div>
            </div>
            <div className="hero-stage__home" />
          </div>
        </div>
      </div>

      <div className="hero-stage__promises">
        <span>Sarthe · {config.ville}</span>
        <span>Devis transparent</span>
        <span>7j/7</span>
      </div>
    </div>
  )
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
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}
