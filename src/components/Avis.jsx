import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import config from '../config.js'

function sourceHref(id) {
  if (id === 'google') return config.google || null
  if (id === 'facebook') return config.facebook || null
  if (id === 'allovoisin') return config.allovoisin || null
  if (id === 'pagesjaunes') return config.pagesJaunes || null
  return null
}

function AvisSources({ className = '' }) {
  const sources = config.avisSources || []
  return (
    <ul className={`avis-sources ${className}`.trim()} aria-label="Sources des avis">
      {sources.map((s) => {
        const href = sourceHref(s.id)
        const inner = <span>{s.label}</span>
        return (
          <li key={s.id} className={`avis-source avis-source--${s.id}`}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
            ) : (
              inner
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function Avis() {
  const [slide, setSlide]   = useState(0)
  const [allAvis, setAllAvis] = useState(config.avis) // commence avec config
  const trackRef            = useRef(null)
  const getVis = () => window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3
  const [vis, setVis]       = useState(() => getVis())
  const total               = Math.max(1, Math.ceil(allAvis.length / vis))

  // Charger les avis Supabase + les fusionner avec config.avis
  useEffect(() => {
    const fetchAvis = async () => {
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        // Avis Supabase en premier, puis config.avis
        setAllAvis([...data, ...config.avis])
      }
    }
    fetchAvis()
  }, [])

  useEffect(() => {
    const onResize = () => setVis(getVis())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setSlide(0)
  }, [vis, allAvis.length])

  useEffect(() => {
    const iv = setInterval(() => setSlide(s => (s + 1) % total), 5000)
    return () => clearInterval(iv)
  }, [total])

  useEffect(() => {
    if (!trackRef.current) return
    const cw = trackRef.current.children[0]?.offsetWidth + 20 || 0
    trackRef.current.style.transform = `translateX(-${slide * vis * cw}px)`
  }, [slide, vis])

  const go = (n) => setSlide(Math.max(0, Math.min(n, total - 1)))

  return (
    <section id="avis" className="sp">
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="stag">Avis regroupés</div>
          <h2>Avis <span className="c">Clients</span></h2>
          <div className="div-line" />
          <p className="sub avis-sources-lead">
            Google · AlloVoisin · Facebook · Pages Jaunes
          </p>
          <AvisSources />
        </div>

        <div className="rb rev">
          <div className="rsbig">⭐⭐⭐⭐⭐</div>
          <div className="rscore">5/5</div>
          <div className="ri">
            <p style={{ color: '#fff', fontWeight: 600, fontFamily: "'Orbitron',sans-serif", fontSize: '.9rem' }}>Note parfaite</p>
            <p>{allAvis.length}+ avis · 100% de satisfaction</p>
            <p className="avis-rb-sources">Sur Google, AlloVoisin, Facebook &amp; Pages Jaunes</p>
          </div>
        </div>

        <div className="avis-wrap rev">
          <div className="avis-track" ref={trackRef}>
            {allAvis.map((a, i) => (
              <div key={i} className="avis-card">
                <div className="avis-head">
                  <div className="avis-av">{a.initiales}</div>
                  <div>
                    <h4>{a.nom}</h4>
                    <div className="avis-stars">★★★★★</div>
                    <div className="avis-type">{a.type}</div>
                  </div>
                </div>
                <p className="avis-txt">{a.texte}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cnav rev">
          <button className="cbtn" onClick={() => go(slide - 1)}>◀</button>
          <div className="cdots">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`cdot${i === slide ? ' active' : ''}`} onClick={() => go(i)} />
            ))}
          </div>
          <button className="cbtn" onClick={() => go((slide + 1) % total)}>▶</button>
        </div>

        <div className="avis-more rev">
          <Link to="/avis" className="bm bo">Voir tous les avis →</Link>
        </div>
      </div>
    </section>
  )
}

export { AvisSources }
