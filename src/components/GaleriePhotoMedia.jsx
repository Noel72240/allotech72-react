import { isGalerieAvantApres, getGalerieMainImage } from '../lib/galerie.js'

export default function GaleriePhotoMedia({ photo, onLightbox }) {
  const open = (src, titre) => src && onLightbox?.({ src, titre })

  if (!isGalerieAvantApres(photo)) {
    const src = getGalerieMainImage(photo)
    return (
      <div
        className="gal-media gal-media--single"
        role={src ? 'button' : undefined}
        tabIndex={src ? 0 : undefined}
        onClick={() => open(src, photo.titre)}
        onKeyDown={(e) => {
          if (src && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            open(src, photo.titre)
          }
        }}
      >
        {src ? (
          <img src={src} alt={photo.titre || ''} loading="lazy" decoding="async" />
        ) : (
          <div className="gal-media__empty">
            <span aria-hidden="true">📷</span>
            <span>Photo</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="gal-media gal-media--compare">
      {[['avant_url', 'Avant'], ['apres_url', 'Après']].map(([key, label]) => (
        <div
          key={key}
          className="gal-media__half"
          role={photo[key] ? 'button' : undefined}
          tabIndex={photo[key] ? 0 : undefined}
          onClick={() => open(photo[key], `${photo.titre} — ${label}`)}
          onKeyDown={(e) => {
            if (photo[key] && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              open(photo[key], `${photo.titre} — ${label}`)
            }
          }}
        >
          {photo[key] ? (
            <img src={photo[key]} alt={`${photo.titre} — ${label}`} loading="lazy" decoding="async" />
          ) : (
            <div className="gal-media__empty">
              <span aria-hidden="true">📷</span>
              <span>{label}</span>
            </div>
          )}
          <span className={`gal-media__badge gal-media__badge--${key === 'avant_url' ? 'avant' : 'apres'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
