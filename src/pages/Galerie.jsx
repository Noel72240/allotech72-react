import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import GaleriePhotoMedia from '../components/GaleriePhotoMedia.jsx'
import { supabase } from '../lib/supabase.js'
import config from '../config.js'

const CATEGORIES = ['Tous', 'Ordinateur', 'Téléphone', 'Tablette', 'Montage PC', 'Réseau', 'Site Web', 'Autre']
const DESC_PREVIEW = 140

function GalerieCard({ photo, onLightbox }) {
  const [open, setOpen] = useState(false)
  const desc = (photo.description || '').trim()
  const long = desc.length > DESC_PREVIEW

  return (
    <article className={`gal-card${open ? ' is-expanded' : ''}`}>
      <GaleriePhotoMedia photo={photo} onLightbox={onLightbox} />
      <div className="gal-card__body">
        <div className="gal-card__top">
          <h2 className="gal-card__title">{photo.titre}</h2>
          {photo.categorie ? (
            <span className="gal-card__tag">{photo.categorie}</span>
          ) : null}
        </div>
        {desc ? (
          <>
            <p className={`gal-card__desc${open || !long ? ' is-full' : ''}`}>
              {desc}
            </p>
            {long ? (
              <button
                type="button"
                className="gal-card__more"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {open ? 'Réduire' : 'Lire la suite'}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </article>
  )
}

export default function Galerie() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('Tous')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('galerie').select('*').order('created_at', { ascending: false })
      setPhotos(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const affichees = filtre === 'Tous' ? photos : photos.filter((p) => p.categorie === filtre)

  return (
    <PageLayout
      title="Galerie réalisations | Allotech72"
      description={`Réparations ordinateurs, téléphones, montages PC par ${config.brand} sur Le Mans et la Sarthe.`}
    >
      <div className="container gal-page" style={{ paddingBottom: 80 }}>
        <header className="gal-page__header">
          <div className="stag">Réalisations</div>
          <h1 className="gal-page__title">
            Ma <span className="c">Galerie</span>
          </h1>
          <div className="div-line" />
          <p className="gal-page__lead">
            Interventions en Sarthe — réparations, montages et créations, en avant / après ou photo unique.
          </p>
        </header>

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

        {loading ? (
          <div className="gal-page__empty">Chargement…</div>
        ) : affichees.length === 0 ? (
          <div className="gal-page__empty">
            <p className="gal-page__empty-ico" aria-hidden="true">📷</p>
            <p>Aucune photo dans cette catégorie.</p>
          </div>
        ) : (
          <div className="gal-grid">
            {affichees.map((photo) => (
              <GalerieCard key={photo.id} photo={photo} onLightbox={setLightbox} />
            ))}
          </div>
        )}

        <div className="gal-page__cta">
          <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
          <Link to="/#contact" className="bm bo">Demander un devis →</Link>
        </div>
      </div>

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
    </PageLayout>
  )
}
