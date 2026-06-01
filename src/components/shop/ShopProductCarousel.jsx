import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ShopProductTile from './ShopProductTile.jsx'

export default function ShopProductCarousel({ title, products, seeAllLink, seeAllLabel = 'Voir tout' }) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return undefined
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      ro.disconnect()
    }
  }, [products])

  const scroll = dir => {
    const el = trackRef.current
    if (!el) return
    const step = Math.max(220, Math.floor(el.clientWidth * 0.85))
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  if (!products?.length) return null

  return (
    <section className="shop-carousel-row" aria-label={title}>
      <div className="shop-carousel-head">
        <h3 className="shop-carousel-title">{title}</h3>
        {seeAllLink && (
          <Link to={seeAllLink} className="shop-carousel-see-all">
            {seeAllLabel} →
          </Link>
        )}
      </div>

      <div className="shop-carousel-wrap">
        {canPrev && (
          <button
            type="button"
            className="shop-carousel-arrow prev"
            onClick={() => scroll(-1)}
            aria-label="Produits précédents"
          >
            ‹
          </button>
        )}

        <div className={`shop-carousel-track${products.length <= 2 ? ' is-sparse' : ''}`} ref={trackRef}>
          {products.map(p => (
            <ShopProductTile key={p.id} product={p} />
          ))}
        </div>

        {canNext && (
          <button
            type="button"
            className="shop-carousel-arrow next"
            onClick={() => scroll(1)}
            aria-label="Produits suivants"
          >
            ›
          </button>
        )}
      </div>
    </section>
  )
}
