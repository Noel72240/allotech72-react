import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const AUTO_MS = 5500

function isExternal(url) {
  return /^https?:\/\//i.test(url || '')
}

function BannerSlide({ banner, isActive }) {
  const img = (
    <img
      src={banner.image}
      alt={banner.alt || 'Promotion boutique Allotech72'}
      className="shop-banner-img"
      loading={isActive ? 'eager' : 'lazy'}
    />
  )

  if (!banner.link?.trim()) {
    return <div className="shop-banner-slide-inner">{img}</div>
  }

  if (isExternal(banner.link)) {
    return (
      <a href={banner.link} className="shop-banner-slide-inner" target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    )
  }

  return (
    <Link to={banner.link} className="shop-banner-slide-inner">
      {img}
    </Link>
  )
}

/** Grand bandeau promo défilant (style e-commerce). */
export default function ShopBannerCarousel({ banners = [] }) {
  const slides = banners.filter(b => b.enabled !== false && b.image?.trim())
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

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

  if (count === 0) {
    return null
  }

  return (
    <section
      className="shop-banner-carousel"
      aria-roledescription="carousel"
      aria-label="Promotions boutique"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shop-banner-viewport">
        <div
          className="shop-banner-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((banner, i) => (
            <div
              key={`${banner.image}-${i}`}
              className={`shop-banner-slide${i === index ? ' is-active' : ''}`}
              aria-hidden={i !== index}
            >
              <BannerSlide banner={banner} isActive={i === index} />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="shop-banner-arrow prev"
              onClick={() => goTo(index - 1)}
              aria-label="Bannière précédente"
            >
              ‹
            </button>
            <button
              type="button"
              className="shop-banner-arrow next"
              onClick={() => goTo(index + 1)}
              aria-label="Bannière suivante"
            >
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="shop-banner-dots" role="tablist" aria-label="Choisir une bannière">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Bannière ${i + 1}`}
              className={`shop-banner-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
