import { isGalerieAvantApres, getGalerieMainImage } from '../lib/galerie.js'

const labelStyle = (i) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: i === 0 ? 'rgba(255,80,80,0.8)' : 'rgba(43,255,154,0.8)',
  color: i === 0 ? '#fff' : '#040B14',
  textAlign: 'center',
  fontSize: '.68rem',
  fontWeight: 700,
  padding: '5px',
  fontFamily: "'Orbitron',sans-serif",
  letterSpacing: '.1em',
})

export default function GaleriePhotoMedia({ photo, onLightbox, height = 190 }) {
  const open = (src, titre) => src && onLightbox({ src, titre })

  if (!isGalerieAvantApres(photo)) {
    const src = getGalerieMainImage(photo)
    return (
      <div
        style={{ height, background: '#071120', position: 'relative', overflow: 'hidden', cursor: src ? 'pointer' : 'default' }}
        onClick={() => open(src, photo.titre)}
      >
        {src ? (
          <img
            src={src}
            alt={photo.titre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.target.style.transform = '' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: '1.8rem' }}>📷</span>
            <span style={{ color: 'var(--dim)', fontSize: '.72rem' }}>Photo</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height, background: '#071120' }}>
      {[['avant_url', 'AVANT'], ['apres_url', 'APRÈS']].map(([key, label], i) => (
        <div
          key={key}
          style={{ position: 'relative', overflow: 'hidden', cursor: photo[key] ? 'pointer' : 'default' }}
          onClick={() => open(photo[key], `${photo.titre} — ${label}`)}
        >
          {photo[key] ? (
            <img
              src={photo[key]}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.target.style.transform = '' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.8rem' }}>📷</span>
              <span style={{ color: 'var(--dim)', fontSize: '.72rem' }}>{label}</span>
            </div>
          )}
          <div style={labelStyle(i)}>{label}</div>
        </div>
      ))}
    </div>
  )
}
