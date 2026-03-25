// Composant réutilisable — affiche les photos depuis Supabase
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const CATEGORIES = ['Tous', 'Ordinateur', 'Téléphone', 'Tablette', 'Montage PC', 'Réseau', 'Site Web', 'Autre']

export default function GalerieDisplay() {
  const [photos,   setPhotos]   = useState([])
  const [filtre,   setFiltre]   = useState('Tous')
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

  const affichees = filtre === 'Tous' ? photos : photos.filter(p => p.categorie === filtre)

  return (
    <>
      {/* Filtres */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:48 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFiltre(cat)} style={{
            background:   filtre === cat ? 'linear-gradient(135deg,#00CFFF,#00AEEF)' : 'rgba(0,207,255,0.06)',
            border:       `1px solid ${filtre === cat ? 'transparent' : 'rgba(0,207,255,0.2)'}`,
            color:        filtre === cat ? '#040B14' : 'var(--tx)',
            padding:      '8px 20px', borderRadius:100, cursor:'pointer',
            fontWeight:   600, fontSize:'.82rem', fontFamily:"'Outfit',sans-serif", transition:'all .25s',
          }}>{cat}</button>
        ))}
      </div>

      {/* Grille */}
      {affichees.length === 0 ? (
        <div style={{ textAlign:'center', color:'var(--dim)', padding:'80px 0' }}>
          <p style={{ fontSize:'3rem', marginBottom:16 }}>📷</p>
          <p>Aucune photo dans cette catégorie.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
          {affichees.map(photo => (
            <div key={photo.id} className="svc-card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', height:190, background:'#071120' }}>
                {['avant','apres'].map(type => (
                  <div key={type} style={{ position:'relative', overflow:'hidden', cursor: photo[type] ? 'pointer' : 'default' }}
                    onClick={() => photo[type] && setLightbox({ src:photo[type], titre:`${photo.titre} — ${type}` })}
                  >
                    {photo[type]
                      ? <img src={photo[type]} alt={`${photo.titre} ${type}`} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .3s' }}
                          onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                          onMouseLeave={e => e.target.style.transform=''}
                        />
                      : <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                          <span style={{ fontSize:'1.8rem' }}>📷</span>
                          <span style={{ color:'var(--dim)', fontSize:'.72rem' }}>{type}</span>
                        </div>
                    }
                    <div style={{
                      position:'absolute', bottom:0, left:0, right:0,
                      background: type==='avant' ? 'rgba(255,80,80,0.8)' : 'rgba(43,255,154,0.8)',
                      color: type==='avant' ? '#fff' : '#040B14',
                      textAlign:'center', fontSize:'.68rem', fontWeight:700,
                      padding:'5px', fontFamily:"'Orbitron',sans-serif", letterSpacing:'.1em',
                    }}>{type.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'18px 22px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <h3 style={{ margin:0, fontSize:'.95rem', color:'#fff' }}>{photo.titre}</h3>
                  <span className="tag" style={{ flexShrink:0 }}>{photo.categorie}</span>
                </div>
                {photo.description && <p style={{ color:'var(--dim)', fontSize:'.82rem', lineHeight:1.6 }}>{photo.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(4,11,20,0.97)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20, cursor:'zoom-out' }}>
          <img src={lightbox.src} alt={lightbox.titre} style={{ maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain', borderRadius:12, boxShadow:'0 0 60px rgba(0,207,255,0.2)' }} />
          <p style={{ color:'var(--tx)', fontSize:'.9rem', fontFamily:"'Orbitron',sans-serif" }}>{lightbox.titre}</p>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:20, right:20, background:'rgba(0,207,255,0.1)', border:'1px solid rgba(0,207,255,0.3)', color:'var(--tx)', width:44, height:44, borderRadius:'50%', cursor:'pointer', fontSize:'1.1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
      )}
    </>
  )
}
