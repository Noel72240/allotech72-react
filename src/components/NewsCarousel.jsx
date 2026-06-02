import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const AUTO_MS = 6500

function isExternal(url) {
  return /^https?:\/\//i.test(url || '')
}

function SlideLink({ slide, children }) {
  const href = slide?.link?.trim()
  if (!href) return <div className="news-slide-inner">{children}</div>

  if (isExternal(href)) {
    return (
      <a className="news-slide-inner" href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link className="news-slide-inner" to={href}>
      {children}
    </Link>
  )
}

export default function NewsCarousel({ title = 'Les nouveautés Allotech72', slides = [] }) {
  const list = useMemo(
    () => (Array.isArray(slides) ? slides : []).filter(s => s?.image && (s?.title || s?.text)),
    [slides],
  )

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = list.length

  const goTo = useCallback(
    next => {
      if (count <= 1) return
      setIndex(i => (next + count) % count)
    },
    [count],
  )

  useEffect(() => {
    setIndex(0)
  }, [count])

  useEffect(() => {
    if (count <= 1 || paused) return undefined
    const id = setInterval(() => setIndex(i => (i + 1) % count), AUTO_MS)
    return () => clearInterval(id)
  }, [count, paused])

  if (count === 0) return null

  return (
    <section className="news-section sp" aria-label={title}>
      <div className="container">
        <div className="rev" style={{ textAlign: 'center', marginBottom: 34 }}>
          <div className="stag">Actualités</div>
          <h2>
            Les <span className="c">nouveautés</span> <span className="g">Allotech72</span>
          </h2>
          <div className="div-line" />
          <p className="sub">Promos, arrivages et infos importantes — mis à jour facilement.</p>
        </div>

        <div
          className="news-carousel"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="news-viewport">
            <div className="news-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {list.map((slide, i) => (
                <div key={`${slide.image}-${i}`} className={`news-slide${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
                  <SlideLink slide={slide}>
                    <img
                      src={slide.image}
                      alt={slide.title || slide.text || 'Nouveauté Allotech72'}
                      className="news-img"
                      loading={i === index ? 'eager' : 'lazy'}
                    />
                    <div className="news-overlay" />
                    <div className="news-content">
                      {slide.kicker ? <div className="news-kicker">{slide.kicker}</div> : null}
                      {slide.title ? <div className="news-title">{slide.title}</div> : null}
                      {slide.text ? <div className="news-text">{slide.text}</div> : null}
                      {slide.cta ? <div className="news-cta">{slide.cta} →</div> : null}
                    </div>
                  </SlideLink>
                </div>
              ))}
            </div>

            {count > 1 ? (
              <>
                <button type="button" className="news-arrow prev" onClick={() => goTo(index - 1)} aria-label="Nouveauté précédente">
                  ‹
                </button>
                <button type="button" className="news-arrow next" onClick={() => goTo(index + 1)} aria-label="Nouveauté suivante">
                  ›
                </button>
              </>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="news-dots" role="tablist" aria-label="Choisir une nouveauté">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Nouveauté ${i + 1}`}
                  className={`news-dot${i === index ? ' active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

