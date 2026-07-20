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

function HeroDesk() {
  const [scan, setScan] = useState(18)
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  )

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setScan(100)
      return
    }
    const id = setInterval(() => {
      setScan((v) => (v >= 100 ? 12 : v + 1))
    }, 70)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setClock(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const topics = [
    {
      to: '/depannage-informatique-le-mans',
      title: 'PC lent',
      hint: 'Optimisation',
      tone: 'amber',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      ),
    },
    {
      to: '/virus-malwares-depannage-le-mans',
      title: 'Virus',
      hint: 'Nettoyage',
      tone: 'cyan',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      to: '/wifi-reseau-internet-le-mans',
      title: 'Wi-Fi',
      hint: 'Connexion',
      tone: 'green',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 12.5a9 9 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      to: '/reparateur-telephone-le-mans',
      title: 'Écran',
      hint: 'Mobile',
      tone: 'blue',
      ico: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      ),
    },
  ]

  return (
    <div className="hero-desk">
      <div className="hero-desk__glow" aria-hidden="true" />
      <span className="hero-desk__float hero-desk__float--a" aria-hidden="true" />
      <span className="hero-desk__float hero-desk__float--b" aria-hidden="true" />
      <span className="hero-desk__float hero-desk__float--c" aria-hidden="true" />

      <div className="hero-desk__panel">
        <div className="hero-desk__chrome">
          <span className="hero-desk__traffic" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span className="hero-desk__title">AT72 · Desk live</span>
          <span className="hero-desk__live">
            <i /> En ligne
          </span>
        </div>

        <div className="hero-desk__body">
          <div className="hero-desk__radar" aria-hidden="true">
            <div className="hero-desk__ring hero-desk__ring--1" />
            <div className="hero-desk__ring hero-desk__ring--2" />
            <div className="hero-desk__ring hero-desk__ring--3" />
            <div className="hero-desk__sweep" />
            <div className="hero-desk__core">
              <strong>{scan}%</strong>
              <span>Analyse</span>
            </div>
          </div>

          <div className="hero-desk__side">
            <div className="hero-desk__meter">
              <div className="hero-desk__meter-head">
                <span>Santé PC</span>
                <b>OK</b>
              </div>
              <div className="hero-desk__bar"><i style={{ width: '86%' }} /></div>
            </div>
            <div className="hero-desk__meter">
              <div className="hero-desk__meter-head">
                <span>Sécurité</span>
                <b>Stable</b>
              </div>
              <div className="hero-desk__bar hero-desk__bar--g"><i style={{ width: '92%' }} /></div>
            </div>
            <div className="hero-desk__meter">
              <div className="hero-desk__meter-head">
                <span>Réseau</span>
                <b>Bon</b>
              </div>
              <div className="hero-desk__bar hero-desk__bar--c"><i style={{ width: '78%' }} /></div>
            </div>
            <div className="hero-desk__meta">
              <span>Sarthe · {config.ville}</span>
              <span>{clock}</span>
            </div>
          </div>
        </div>

        <div className="hero-desk__ask">
          <div className="hero-desk__ask-top">
            <p>Par où commencer ?</p>
            <a href={`tel:${config.telBrut}`} className="hero-desk__call">
              {config.telephone}
            </a>
          </div>
          <div className="hero-desk__topics">
            {topics.map((t) => (
              <Link key={t.to} to={t.to} className={`hero-desk__topic hero-desk__topic--${t.tone}`}>
                <span className="hero-desk__topic-ico" aria-hidden="true">{t.ico}</span>
                <span className="hero-desk__topic-txt">
                  <strong>{t.title}</strong>
                  <em>{t.hint}</em>
                </span>
                <span className="hero-desk__topic-go" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
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
            <HeroDesk />
          </div>
        </div>
      </div>
    </section>
  )
}
