import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config from '../config.js'

const STORAGE_KEY = 'at72_galerie'
const CATEGORIES  = ['Tous', 'Ordinateur', 'Téléphone', 'Tablette', 'Montage PC', 'Réseau', 'Site Web', 'Autre']

const DEFAULT_PHOTOS = [
  { id: 1, titre: 'Montage PC Gaming',       categorie: 'Montage PC',  avant: '', apres: '', description: "Assemblage complet d'un PC gaming haute performance — câblage soigné." },
  { id: 2, titre: 'Changement écran iPhone',  categorie: 'Téléphone',   avant: '', apres: '', description: 'Remplacement écran fissuré iPhone — résultat impeccable, comme neuf.' },
  { id: 3, titre: 'Nettoyage PC portable',    categorie: 'Ordinateur',  avant: '', apres: '', description: 'Dépoussiérage complet + remplacement pâte thermique — -20°C en température.' },
]

export default function Galerie() {
  const [photos,   setPhotos]   = useState(DEFAULT_PHOTOS)
  const [filtre,   setFiltre]   = useState('Tous')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setPhotos(JSON.parse(stored))
  }, [])

  const affichees = filtre === 'Tous' ? photos : photos.filter(p => p.categorie === filtre)

  return (
    <PageLayout
      title="Galerie réalisations"
      description={`Réparations ordinateurs, téléphones, montages PC par ${config.brand} sur Le Mans et la Sarthe.`}
    >
      <div className="container" style={{ paddingBottom: 80 }}>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: 56, paddingTop: 20 }}>
          <div className="stag">Réalisations</div>
          <h2>Ma <span className="c">Galerie</span></h2>
          <div className="div-line" />
          <p className="sub">Photos avant / après de mes interventions — ordinateurs, téléphones, montages PC.</p>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFiltre(cat)} style={{
              background:   filtre === cat ? 'linear-gradient(135deg,#00CFFF,#00AEEF)' : 'rgba(0,207,255,0.06)',
              border:       `1px solid ${filtre === cat ? 'transparent' : 'rgba(0,207,255,0.2)'}`,
              color:        filtre === cat ? '#040B14' : 'var(--tx)',
              padding:      '8px 20px', borderRadius: 100, cursor: 'pointer',
              fontWeight:   600, fontSize: '.82rem', fontFamily: "'Outfit',sans-serif",
              transition:   'all .25s',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grille */}
        {affichees.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--dim)', padding: '80px 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: 16 }}>📷</p>
            <p>Aucune photo dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {affichees.map(photo => (
              <div key={photo.id} className="svc-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Avant / Après */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 190, background: '#071120' }}>
                  {['avant', 'apres'].map(type => (
                    <div key={type} style={{ position: 'relative', overflow: 'hidden', cursor: photo[type] ? 'pointer' : 'default' }}
                      onClick={() => photo[type] && setLightbox({ src: photo[type], titre: `${photo.titre} — ${type}` })}
                    >
                      {photo[type]
                        ? <img src={photo[type]} alt={`${photo.titre} ${type}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = ''}
                          />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <span style={{ fontSize: '1.8rem' }}>📷</span>
                            <span style={{ color: 'var(--dim)', fontSize: '.72rem' }}>{type}</span>
                          </div>
                      }
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: type === 'avant' ? 'rgba(255,80,80,0.8)' : 'rgba(43,255,154,0.8)',
                        color: type === 'avant' ? '#fff' : '#040B14',
                        textAlign: 'center', fontSize: '.68rem', fontWeight: 700,
                        padding: '5px', fontFamily: "'Orbitron',sans-serif", letterSpacing: '.1em',
                      }}>
                        {type.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Infos */}
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '.95rem', color: '#fff' }}>{photo.titre}</h3>
                    <span className="tag" style={{ flexShrink: 0 }}>{photo.categorie}</span>
                  </div>
                  {photo.description && <p style={{ color: 'var(--dim)', fontSize: '.82rem', lineHeight: 1.6 }}>{photo.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ color: 'var(--dim)', marginBottom: 20, fontSize: '.95rem' }}>
            Un appareil en panne ? Je me déplace chez vous.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(4,11,20,0.97)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, padding: 20, cursor: 'zoom-out',
        }}>
          <img src={lightbox.src} alt={lightbox.titre}
            style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 0 60px rgba(0,207,255,0.2)' }}
          />
          <p style={{ color: 'var(--tx)', fontSize: '.9rem', fontFamily: "'Orbitron',sans-serif" }}>{lightbox.titre}</p>
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(0,207,255,0.1)', border: '1px solid rgba(0,207,255,0.3)',
            color: 'var(--tx)', width: 44, height: 44, borderRadius: '50%',
            cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
      )}
    </PageLayout>
  )
}
