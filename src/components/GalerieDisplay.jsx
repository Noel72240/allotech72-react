import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import GaleriePhotoMedia from './GaleriePhotoMedia.jsx'

const CATEGORIES = ['Tous', 'Ordinateur', 'Téléphone', 'Tablette', 'Montage PC', 'Réseau', 'Site Web', 'Autre']

export default function GalerieDisplay() {
  const [photos, setPhotos] = useState([])
  const [filtre, setFiltre] = useState('Tous')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('galerie')
        .select('*')
        .order('id', { ascending: false })
      if (data) setPhotos(data)
    }
    fetch()
  }, [])

  const affichees = filtre === 'Tous' ? photos : photos.filter((p) => p.categorie === filtre)

  return (
    <>
      <div className="gal-filters" role="tablist" aria-label="Filtrer la galerie">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filtre === cat}
            className={`gal-filters__btn${filtre === cat ? ' is-active' : ''}`}
            onClick={() => setFiltre(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {affichees.length === 0 ? (
        <div className="gal-page__empty">
          <p className="gal-page__empty-ico" aria-hidden="true">📷</p>
          <p>Aucune photo dans cette catégorie.</p>
        </div>
      ) : (
        <div className="gal-grid">
          {affichees.map((photo) => (
            <article key={photo.id} className="gal-card">
              <GaleriePhotoMedia photo={photo} onLightbox={setLightbox} />
              <div className="gal-card__body">
                <div className="gal-card__top">
                  <h3 className="gal-card__title">{photo.titre}</h3>
                  {photo.categorie ? (
                    <span className="gal-card__tag">{photo.categorie}</span>
                  ) : null}
                </div>
                {photo.description ? (
                  <p className="gal-card__desc">{photo.description}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="gal-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.titre}
        >
          <img src={lightbox.src} alt={lightbox.titre} />
          <p>{lightbox.titre}</p>
          <button
            type="button"
            className="gal-lightbox__close"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
