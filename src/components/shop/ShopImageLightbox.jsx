import { useEffect } from 'react'

export default function ShopImageLightbox({ src, title, onClose }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!src) return null

  return (
    <div
      className="shop-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Image produit agrandie'}
    >
      <button
        type="button"
        className="shop-lightbox-close"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>
      <div className="shop-lightbox-inner" onClick={e => e.stopPropagation()}>
        <img src={src} alt={title || ''} />
        {title ? <p className="shop-lightbox-caption">{title}</p> : null}
      </div>
    </div>
  )
}
