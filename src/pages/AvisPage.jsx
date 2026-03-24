import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import config from '../config.js'

const STORAGE_KEY = 'at72_avis_extra'

export default function AvisPage() {
  const [extra, setExtra] = useState([])
  const allAvis = [...config.avis, ...extra]

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setExtra(JSON.parse(stored))
  }, [])

  return (
    <PageLayout
      title="Avis clients"
      description={`${config.avis.length}+ avis clients 5 étoiles pour ${config.brand} — dépannage informatique sur Le Mans et la Sarthe.`}
    >
      <div className="container" style={{ paddingBottom: 80 }}>

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: 52, paddingTop: 20 }}>
          <div className="stag">Google Reviews</div>
          <h2>Avis <span className="c">Clients</span></h2>
          <div className="div-line" />
        </div>

        {/* Bannière score */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
          marginBottom: 56, padding: '28px 40px',
          background: 'rgba(43,255,154,0.04)', border: '1px solid rgba(43,255,154,0.15)',
          borderRadius: 20, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '1.6rem', letterSpacing: 4 }}>⭐⭐⭐⭐⭐</div>
          <div style={{
            fontFamily: "'Orbitron',sans-serif", fontSize: '3rem', fontWeight: 900,
            color: '#2BFF9A', textShadow: '0 0 30px rgba(43,255,154,0.4)',
          }}>5/5</div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontFamily: "'Orbitron',sans-serif", fontSize: '1rem' }}>Note parfaite</p>
            <p style={{ color: 'var(--dim)', fontSize: '.88rem', marginTop: 4 }}>
              {allAvis.length} avis vérifiés · 100% de satisfaction
            </p>
          </div>
          {config.google && (
            <a href={config.google} target="_blank" rel="noopener" style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', padding: '10px 20px', borderRadius: 10,
              textDecoration: 'none', fontSize: '.82rem', fontWeight: 600,
              transition: 'background .2s',
            }}>Voir sur Google Maps →</a>
          )}
        </div>

        {/* Grille masonry-like */}
        <div style={{
          columns: 'auto 300px', columnGap: 20,
        }}>
          {allAvis.map((a, i) => (
            <div key={i} className="avis-card" style={{
              width: '100%', marginBottom: 20, breakInside: 'avoid',
              display: 'inline-block',
            }}>
              <div className="avis-head">
                <div className="avis-av">{a.initiales}</div>
                <div>
                  <h4>{a.nom}</h4>
                  <div className="avis-stars">★★★★★</div>
                  <div className="avis-type">{a.type}</div>
                </div>
              </div>
              <p className="avis-txt">"{a.texte}"</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <p style={{ color: 'var(--dim)', marginBottom: 8, fontSize: '.95rem' }}>
            Vous aussi, faites confiance à {config.brand}
          </p>
          <p style={{ color: 'var(--dim)', fontSize: '.82rem', marginBottom: 24 }}>
            Intervention rapide · Tarifs transparents · 100% satisfaction
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${config.telBrut}`} className="bm bp">📞 {config.telephone}</a>
            <Link to="/#contact" className="bm bo">Demander un devis →</Link>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
