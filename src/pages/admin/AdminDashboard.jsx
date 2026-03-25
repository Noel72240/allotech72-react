import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'
import config from '../../config.js'

const CATEGORIES = ['Ordinateur','Téléphone','Tablette','Montage PC','Réseau','Site Web','Autre']
const BUCKET     = 'galerie'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const inp  = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none' }
const lbl  = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer', transition:'all .2s' }
const btnD = { background:'rgba(255,80,80,0.12)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:'.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }

const Msg = ({ msg }) => msg ? (
  <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [tab, setTab] = useState('avis')

  // ══ AVIS (Supabase) ══
  const [avis,     setAvis]     = useState([])
  const [avisLoad, setAvisLoad] = useState(true)
  const [avisForm, setAvisForm] = useState({ nom:'', type:'', texte:'' })
  const [avisMsg,  setAvisMsg]  = useState(null)

  // ══ GALERIE (Supabase) ══
  const [photos,    setPhotos]    = useState([])
  const [photoLoad, setPhotoLoad] = useState(true)
  const [photoForm, setPhotoForm] = useState({ titre:'', categorie:'Ordinateur', description:'' })
  const [photoMsg,  setPhotoMsg]  = useState(null)
  const [preview,   setPreview]   = useState({ avant:'', apres:'' })
  const [uploading, setUploading] = useState(false)
  const [lightbox,  setLightbox]  = useState(null)
  const avantRef = useRef()
  const apresRef = useRef()

  useEffect(() => { fetchAvis(); fetchPhotos() }, [])

  // ── AVIS : lire ──
  const fetchAvis = async () => {
    setAvisLoad(true)
    const { data } = await supabase.from('avis').select('*').order('created_at', { ascending:false })
    setAvis(data || [])
    setAvisLoad(false)
  }

  // ── AVIS : ajouter ──
  const addAvis = async () => {
    if (!avisForm.nom.trim() || !avisForm.texte.trim()) { setAvisMsg({ ok:false, txt:'Nom et texte obligatoires.' }); return }
    const initiales = avisForm.nom.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
    const { error } = await supabase.from('avis').insert([{ nom:avisForm.nom.trim(), initiales, type:avisForm.type.trim(), texte:avisForm.texte.trim() }])
    if (error) { setAvisMsg({ ok:false, txt:`Erreur : ${error.message}` }); return }
    setAvisForm({ nom:'', type:'', texte:'' })
    setAvisMsg({ ok:true, txt:'✅ Avis ajouté !' })
    fetchAvis()
    setTimeout(() => setAvisMsg(null), 3000)
  }

  // ── AVIS : supprimer ──
  const deleteAvis = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return
    await supabase.from('avis').delete().eq('id', id)
    setAvis(prev => prev.filter(a => a.id !== id))
  }

  // ── GALERIE : lire ──
  const fetchPhotos = async () => {
    setPhotoLoad(true)
    const { data } = await supabase.from('galerie').select('*').order('created_at', { ascending:false })
    setPhotos(data || [])
    setPhotoLoad(false)
  }

  // ── GALERIE : upload image dans Storage ──
  const uploadImage = async (file, path) => {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert:true })
    if (error) throw error
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  // ── GALERIE : ajouter ──
  const addPhoto = async () => {
    if (!photoForm.titre.trim()) { setPhotoMsg({ ok:false, txt:'Le titre est obligatoire.' }); return }
    setUploading(true)
    setPhotoMsg({ ok:true, txt:'⏳ Upload en cours...' })
    try {
      const ts = Date.now()
      let avant_url = null, apres_url = null
      if (avantRef.current?.files[0]) avant_url = await uploadImage(avantRef.current.files[0], `avant_${ts}`)
      if (apresRef.current?.files[0]) apres_url = await uploadImage(apresRef.current.files[0], `apres_${ts}`)

      const { error } = await supabase.from('galerie').insert([{
        titre:       photoForm.titre.trim(),
        categorie:   photoForm.categorie,
        description: photoForm.description.trim(),
        avant_url,
        apres_url,
      }])
      if (error) throw error

      setPhotoForm({ titre:'', categorie:'Ordinateur', description:'' })
      setPreview({ avant:'', apres:'' })
      if (avantRef.current) avantRef.current.value = ''
      if (apresRef.current) apresRef.current.value = ''
      setPhotoMsg({ ok:true, txt:'✅ Photo ajoutée !' })
      fetchPhotos()
      setTimeout(() => setPhotoMsg(null), 3000)
    } catch (e) {
      setPhotoMsg({ ok:false, txt:`Erreur upload : ${e.message}` })
    }
    setUploading(false)
  }

  // ── GALERIE : supprimer ──
  const deletePhoto = async (id) => {
    if (!window.confirm('Supprimer cette photo ?')) return
    await supabase.from('galerie').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const onFileChange = (type, e) => {
    if (e.target.files[0]) setPreview(p => ({ ...p, [type]: URL.createObjectURL(e.target.files[0]) }))
  }

  const Tab = ({ id, ico, label }) => (
    <button onClick={() => setTab(id)} style={{
      display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:10, border:'none', cursor:'pointer',
      fontFamily:"'Orbitron',sans-serif", fontSize:'.78rem', fontWeight:700,
      background: tab===id ? 'linear-gradient(135deg,#00CFFF,#00AEEF)' : 'rgba(0,207,255,0.07)',
      color: tab===id ? '#040B14' : 'var(--tx)', transition:'all .2s',
    }}>{ico} {label}</button>
  )

  return (
    <div style={{ minHeight:'100vh', paddingTop:80 }}>

      {/* HEADER */}
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, height:70, background:'rgba(4,11,20,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,207,255,0.12)', display:'flex', alignItems:'center', padding:'0 28px' }}>
        <div style={{ maxWidth:1140, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, background:'linear-gradient(135deg,#00CFFF,#2BFF9A)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>⚙️</div>
            <div>
              <div style={{ fontFamily:"'Orbitron',sans-serif", color:'#fff', fontWeight:700, fontSize:'.95rem' }}>Espace Admin</div>
              <div style={{ color:'var(--dim)', fontSize:'.72rem' }}>{config.brand}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Link to="/" target="_blank" style={{ color:'rgba(200,232,255,0.7)', textDecoration:'none', fontSize:'.82rem', fontWeight:600, padding:'8px 16px', border:'1px solid rgba(0,207,255,0.2)', borderRadius:8 }}>👁 Voir le site</Link>
            <button onClick={logout} style={{ background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontSize:'.82rem', fontWeight:600 }}>Déconnexion</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 28px 80px' }}>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:36 }}>
          {[
            { ico:'⭐', val:config.avis.length + avis.length, lbl:'Avis total' },
            { ico:'🗄️', val:avis.length,   lbl:'Avis Supabase' },
            { ico:'📷', val:photos.length, lbl:'Photos galerie' },
            { ico:'🛠️', val:config.services.length, lbl:'Services' },
          ].map((s,i) => (
            <div key={i} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, padding:'18px 22px', display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:'1.6rem' }}>{s.ico}</span>
              <div>
                <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'1.8rem', fontWeight:900, color:'var(--c)', lineHeight:1 }}>{s.val}</div>
                <div style={{ color:'var(--dim)', fontSize:'.75rem', marginTop:3 }}>{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:'flex', gap:10, marginBottom:32, flexWrap:'wrap' }}>
          <Tab id="avis"    ico="⭐" label="Avis clients" />
          <Tab id="galerie" ico="📷" label="Galerie photos" />
          <Tab id="infos"   ico="ℹ️"  label="Infos site" />
        </div>

        {/* ═══ AVIS ═══ */}
        {tab === 'avis' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24, alignItems:'start' }}>
            <div style={card}>
              <h3 style={{ color:'#fff', marginBottom:24, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>➕ Ajouter un avis</h3>
              <div style={{ marginBottom:14 }}><label style={lbl}>Nom *</label><input style={inp} type="text" value={avisForm.nom} onChange={e=>setAvisForm({...avisForm,nom:e.target.value})} placeholder="Jean Dupont" /></div>
              <div style={{ marginBottom:14 }}><label style={lbl}>Type d'intervention</label><input style={inp} type="text" value={avisForm.type} onChange={e=>setAvisForm({...avisForm,type:e.target.value})} placeholder="Réparation ordinateur" /></div>
              <div style={{ marginBottom:20 }}><label style={lbl}>Texte de l'avis *</label><textarea style={{ ...inp, minHeight:110, resize:'vertical' }} value={avisForm.texte} onChange={e=>setAvisForm({...avisForm,texte:e.target.value})} placeholder="Texte de l'avis Google..." /></div>
              <Msg msg={avisMsg} />
              <button style={{ ...btnP, width:'100%' }} onClick={addAvis}>Ajouter l'avis →</button>
            </div>

            <div>
              <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
                Avis ({avis.length})
                <button onClick={fetchAvis} style={{ background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'4px 12px', borderRadius:6, cursor:'pointer', fontSize:'.72rem' }}>🔄</button>
              </div>
              {avisLoad ? <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>⏳ Chargement...</div> :
               avis.length === 0 ? <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>Aucun avis</div> : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {avis.map(a => (
                    <div key={a.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, padding:'14px 18px', display:'flex', gap:14, alignItems:'flex-start' }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#00CFFF,#2BFF9A)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',sans-serif", fontWeight:700, color:'#040B14', fontSize:'.85rem', flexShrink:0 }}>{a.initiales}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                          <span style={{ color:'#fff', fontWeight:600, fontSize:'.88rem' }}>{a.nom}</span>
                          <span style={{ color:'#FFD700', fontSize:'.75rem' }}>★★★★★</span>
                        </div>
                        {a.type && <div style={{ color:'var(--c)', fontSize:'.7rem', fontWeight:600, marginBottom:4 }}>{a.type}</div>}
                        <p style={{ color:'var(--dim)', fontSize:'.8rem', lineHeight:1.6, fontStyle:'italic', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>"{a.texte}"</p>
                      </div>
                      <button style={btnD} onClick={() => deleteAvis(a.id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ GALERIE ═══ */}
        {tab === 'galerie' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:24, alignItems:'start' }}>
            <div style={card}>
              <h3 style={{ color:'#fff', marginBottom:24, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>➕ Ajouter une photo</h3>
              <div style={{ marginBottom:14 }}><label style={lbl}>Titre *</label><input style={inp} type="text" value={photoForm.titre} onChange={e=>setPhotoForm({...photoForm,titre:e.target.value})} placeholder="Changement écran iPhone" /></div>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>Catégorie</label>
                <select style={{ ...inp, appearance:'none', cursor:'pointer' }} value={photoForm.categorie} onChange={e=>setPhotoForm({...photoForm,categorie:e.target.value})}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}><label style={lbl}>Description</label><input style={inp} type="text" value={photoForm.description} onChange={e=>setPhotoForm({...photoForm,description:e.target.value})} placeholder="Courte description" /></div>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>📷 Photo AVANT (.jpg .png .webp)</label>
                <input ref={avantRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e=>onFileChange('avant',e)} style={{ ...inp, padding:'9px 12px', cursor:'pointer' }} />
                {preview.avant && <div style={{ marginTop:8, borderRadius:8, overflow:'hidden', height:90, position:'relative' }}><img src={preview.avant} alt="avant" style={{ width:'100%', height:'100%', objectFit:'cover' }} /><div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,80,80,0.8)', color:'#fff', fontSize:'.62rem', fontWeight:700, textAlign:'center', padding:3, fontFamily:"'Orbitron',sans-serif" }}>AVANT</div></div>}
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={lbl}>📷 Photo APRÈS (.jpg .png .webp)</label>
                <input ref={apresRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e=>onFileChange('apres',e)} style={{ ...inp, padding:'9px 12px', cursor:'pointer' }} />
                {preview.apres && <div style={{ marginTop:8, borderRadius:8, overflow:'hidden', height:90, position:'relative' }}><img src={preview.apres} alt="apres" style={{ width:'100%', height:'100%', objectFit:'cover' }} /><div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(43,255,154,0.8)', color:'#040B14', fontSize:'.62rem', fontWeight:700, textAlign:'center', padding:3, fontFamily:"'Orbitron',sans-serif" }}>APRÈS</div></div>}
              </div>
              <Msg msg={photoMsg} />
              <button style={{ ...btnP, width:'100%', opacity: uploading ? .6 : 1 }} onClick={addPhoto} disabled={uploading}>
                {uploading ? '⏳ Upload...' : 'Ajouter la photo →'}
              </button>
              <p style={{ color:'#FFB800', fontSize:'.7rem', marginTop:10, textAlign:'center' }}>⚠️ .jpg .png .webp uniquement — pas de .heic</p>
            </div>

            <div>
              <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
                Galerie ({photos.length})
                <button onClick={fetchPhotos} style={{ background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'4px 12px', borderRadius:6, cursor:'pointer', fontSize:'.72rem' }}>🔄</button>
              </div>
              {photoLoad ? <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>⏳ Chargement...</div> :
               photos.length === 0 ? <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>Aucune photo</div> : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                  {photos.map(p => (
                    <div key={p.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, overflow:'hidden' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', height:110, background:'#071120' }}>
                        {['avant_url','apres_url'].map((key,i) => {
                          const type = i===0 ? 'avant' : 'apres'
                          return (
                            <div key={key} style={{ position:'relative', overflow:'hidden', cursor: p[key] ? 'zoom-in' : 'default' }}
                              onClick={() => p[key] && setLightbox({ src:p[key], titre:`${p.titre} — ${type}` })}
                            >
                              {p[key] ? <img src={p[key]} alt={type} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--dim)', fontSize:'.65rem', flexDirection:'column', gap:4 }}><span style={{ fontSize:'1.2rem' }}>📷</span>{type}</div>}
                              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'3px 0', textAlign:'center', fontSize:'.62rem', fontWeight:700, fontFamily:"'Orbitron',sans-serif", background: i===0 ? 'rgba(255,80,80,0.8)' : 'rgba(43,255,154,0.8)', color: i===0 ? '#fff' : '#040B14' }}>
                                {type.toUpperCase()}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                        <div>
                          <p style={{ color:'#fff', fontSize:'.82rem', fontWeight:600 }}>{p.titre}</p>
                          <span style={{ background:'rgba(0,207,255,0.1)', color:'var(--c)', fontSize:'.65rem', padding:'2px 8px', borderRadius:4 }}>{p.categorie}</span>
                        </div>
                        <button style={btnD} onClick={() => deletePhoto(p.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INFOS */}
        {tab === 'infos' && (
          <div style={card}>
            <h3 style={{ color:'#fff', marginBottom:24, fontFamily:"'Orbitron',sans-serif" }}>ℹ️ Infos du site</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
              {[['Marque',config.brand],['Technicien',`${config.prenom} ${config.nom}`],['Téléphone',config.telephone],['Ville',config.ville],['SIRET',config.siret],['Avis Supabase',`${avis.length}`],['Photos',`${photos.length}`]].map(([k,v]) => (
                <div key={k} style={{ background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:10, padding:'12px 16px' }}>
                  <div style={{ color:'var(--dim)', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>{k}</div>
                  <div style={{ color:'#fff', fontSize:'.88rem', fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(4,11,20,0.97)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20, cursor:'zoom-out' }}>
          <img src={lightbox.src} alt={lightbox.titre} style={{ maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain', borderRadius:12 }} />
          <p style={{ color:'var(--tx)', fontFamily:"'Orbitron',sans-serif", fontSize:'.85rem' }}>{lightbox.titre}</p>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:20, right:20, background:'rgba(0,207,255,0.1)', border:'1px solid rgba(0,207,255,0.3)', color:'var(--tx)', width:44, height:44, borderRadius:'50%', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
        </div>
      )}
    </div>
  )
}
