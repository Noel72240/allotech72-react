import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import config from '../../config.js'

const GALERIE_KEY = 'at72_galerie'
const AVIS_KEY    = 'at72_avis_extra'
const CATEGORIES  = ['Ordinateur','Téléphone','Tablette','Montage PC','Réseau','Site Web','Autre']

// ── styles réutilisables ──
const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const input = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none' }
const label = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btn   = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer', letterSpacing:'.04em', transition:'all .2s' }
const btnDanger = { background:'rgba(255,80,80,0.12)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:'.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [tab, setTab] = useState('avis')

  // ══ AVIS ══
  const [avisExtra, setAvisExtra] = useState([])
  const [avisForm,  setAvisForm]  = useState({ nom:'', type:'', texte:'' })
  const [avisMsg,   setAvisMsg]   = useState(null)

  // ══ GALERIE ══
  const [photos,     setPhotos]     = useState([])
  const [photoForm,  setPhotoForm]  = useState({ titre:'', categorie:'Ordinateur', description:'' })
  const [photoMsg,   setPhotoMsg]   = useState(null)
  const [preview,    setPreview]    = useState({ avant:'', apres:'' })
  const [lightbox,   setLightbox]   = useState(null)
  const avantRef = useRef()
  const apresRef = useRef()

  useEffect(() => {
    const a = localStorage.getItem(AVIS_KEY)
    const g = localStorage.getItem(GALERIE_KEY)
    if (a) setAvisExtra(JSON.parse(a))
    if (g) setPhotos(JSON.parse(g))
  }, [])

  // ── helpers ──
  const saveAvis   = list => { setAvisExtra(list);  localStorage.setItem(AVIS_KEY,    JSON.stringify(list)) }
  const savePhotos = list => { setPhotos(list);      localStorage.setItem(GALERIE_KEY, JSON.stringify(list)) }
  const readImg    = file  => new Promise(res => { const r=new FileReader(); r.onload=e=>res(e.target.result); r.readAsDataURL(file) })

  // ── AJOUTER AVIS ──
  const addAvis = () => {
    if (!avisForm.nom.trim() || !avisForm.texte.trim()) { setAvisMsg({ ok:false, txt:'Nom et texte sont obligatoires.' }); return }
    const initiales = avisForm.nom.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
    saveAvis([{ ...avisForm, initiales, id:Date.now() }, ...avisExtra])
    setAvisForm({ nom:'', type:'', texte:'' })
    setAvisMsg({ ok:true, txt:'✅ Avis ajouté avec succès !' })
    setTimeout(() => setAvisMsg(null), 3000)
  }

  const deleteAvis = id => { if (window.confirm('Supprimer cet avis ?')) saveAvis(avisExtra.filter(a=>a.id!==id)) }

  // ── AJOUTER PHOTO ──
  const addPhoto = async () => {
    if (!photoForm.titre.trim()) { setPhotoMsg({ ok:false, txt:'Le titre est obligatoire.' }); return }
    const avant = avantRef.current?.files[0] ? await readImg(avantRef.current.files[0]) : ''
    const apres = apresRef.current?.files[0] ? await readImg(apresRef.current.files[0]) : ''
    savePhotos([{ ...photoForm, avant, apres, id:Date.now() }, ...photos])
    setPhotoForm({ titre:'', categorie:'Ordinateur', description:'' })
    setPreview({ avant:'', apres:'' })
    if (avantRef.current) avantRef.current.value = ''
    if (apresRef.current) apresRef.current.value = ''
    setPhotoMsg({ ok:true, txt:'✅ Photo ajoutée avec succès !' })
    setTimeout(() => setPhotoMsg(null), 3000)
  }

  const deletePhoto = id => { if (window.confirm('Supprimer cette photo ?')) savePhotos(photos.filter(p=>p.id!==id)) }

  const onFileChange = async (type, e) => {
    if (e.target.files[0]) setPreview(p=>({ ...p, [type]: URL.createObjectURL(e.target.files[0]) }))
  }

  // ── ONGLETS ──
  const Tab = ({ id, ico, label }) => (
    <button onClick={() => setTab(id)} style={{
      display:'flex', alignItems:'center', gap:8,
      padding:'10px 22px', borderRadius:10, border:'none', cursor:'pointer',
      fontFamily:"'Orbitron',sans-serif", fontSize:'.78rem', fontWeight:700,
      background: tab===id ? 'linear-gradient(135deg,#00CFFF,#00AEEF)' : 'rgba(0,207,255,0.07)',
      color:      tab===id ? '#040B14' : 'var(--tx)',
      transition: 'all .2s',
    }}>{ico} {label}</button>
  )

  return (
    <div style={{ minHeight:'100vh', paddingTop:80, cursor:'default' }}>

      {/* ═══ HEADER ═══ */}
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
            <Link to="/" target="_blank" style={{ color:'rgba(200,232,255,0.7)', textDecoration:'none', fontSize:'.82rem', fontWeight:600, padding:'8px 16px', border:'1px solid rgba(0,207,255,0.2)', borderRadius:8 }}>
              👁 Voir le site
            </Link>
            <button onClick={logout} style={{ background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontSize:'.82rem', fontWeight:600 }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 28px 80px' }}>

        {/* ═══ STATS ═══ */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
          {[
            { ico:'⭐', val: config.avis.length + avisExtra.length, lbl:'Avis total' },
            { ico:'➕', val: avisExtra.length,                      lbl:'Avis ajoutés' },
            { ico:'📷', val: photos.length,                          lbl:'Photos galerie' },
            { ico:'🛠️', val: config.services.length,                 lbl:'Services' },
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

        {/* ⚠️ Avertissement stockage local */}
        <div style={{ background:'rgba(255,184,0,0.07)', border:'1px solid rgba(255,184,0,0.25)', borderRadius:12, padding:'12px 18px', marginBottom:28, display:'flex', gap:12, alignItems:'flex-start' }}>
          <span style={{ fontSize:'1.2rem', flexShrink:0 }}>⚠️</span>
          <div style={{ fontSize:'.8rem', color:'rgba(255,220,100,0.9)', lineHeight:1.5 }}>
            <strong>Stockage local uniquement</strong> — Les avis et photos ajoutés ici sont sauvegardés dans le navigateur (localStorage).
            Ils disparaîtront si vous videz le cache ou changez de navigateur.
            Pour un stockage permanent, envisagez d'intégrer une base de données (Supabase, Firebase…).
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div style={{ display:'flex', gap:10, marginBottom:32, flexWrap:'wrap' }}>
          <Tab id="avis"    ico="⭐" label="Avis clients" />
          <Tab id="galerie" ico="📷" label="Galerie photos" />
          <Tab id="infos"   ico="ℹ️"  label="Infos site" />
        </div>


        {/* ════════════════════════════════
            ONGLET AVIS
        ════════════════════════════════ */}
        {tab === 'avis' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24, alignItems:'start' }}>

            {/* Formulaire */}
            <div style={card}>
              <h3 style={{ color:'#fff', marginBottom:24, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
                ➕ Ajouter un avis client
              </h3>

              <div style={{ marginBottom:14 }}>
                <label style={label}>Nom du client *</label>
                <input style={input} type="text" value={avisForm.nom} onChange={e=>setAvisForm({...avisForm,nom:e.target.value})} placeholder="Ex : Jean Dupont" />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={label}>Type d'intervention</label>
                <input style={input} type="text" value={avisForm.type} onChange={e=>setAvisForm({...avisForm,type:e.target.value})} placeholder="Ex : Réparation ordinateur" />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={label}>Texte de l'avis *</label>
                <textarea style={{ ...input, minHeight:110, resize:'vertical' }} value={avisForm.texte} onChange={e=>setAvisForm({...avisForm,texte:e.target.value})} placeholder="Copiez le texte de l'avis Google ici..." />
              </div>

              {avisMsg && (
                <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600, background: avisMsg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)', border:`1px solid ${avisMsg.ok ? 'rgba(43,255,154,0.3)' : 'rgba(255,80,80,0.3)'}`, color: avisMsg.ok ? 'var(--g)' : '#ff6b6b' }}>
                  {avisMsg.txt}
                </div>
              )}

              <button style={{ ...btn, width:'100%' }} onClick={addAvis}>
                Ajouter l'avis →
              </button>

              <p style={{ color:'var(--dim)', fontSize:'.72rem', marginTop:12, textAlign:'center' }}>
                {config.avis.length} avis de base · {avisExtra.length} ajouté(s)
              </p>
            </div>

            {/* Liste */}
            <div>
              <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                Avis ajoutés ({avisExtra.length})
              </div>

              {avisExtra.length === 0 ? (
                <div style={{ textAlign:'center', color:'var(--dim)', padding:'48px 0', background:'rgba(5,14,28,0.5)', borderRadius:16, border:'1px dashed rgba(0,207,255,0.15)' }}>
                  <p style={{ fontSize:'2.4rem', marginBottom:10 }}>⭐</p>
                  <p>Aucun avis ajouté pour l'instant.</p>
                  <p style={{ fontSize:'.8rem', marginTop:6 }}>Remplissez le formulaire à gauche.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {avisExtra.map(a => (
                    <div key={a.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, padding:'16px 20px', display:'flex', gap:14, alignItems:'flex-start', transition:'border-color .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,207,255,0.3)'}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(0,207,255,0.1)'}
                    >
                      <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#00CFFF,#2BFF9A)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',sans-serif", fontWeight:700, color:'#040B14', fontSize:'.88rem', flexShrink:0 }}>
                        {a.initiales}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ color:'#fff', fontWeight:600, fontSize:'.9rem' }}>{a.nom}</span>
                          <span style={{ color:'#FFD700', fontSize:'.78rem' }}>★★★★★</span>
                        </div>
                        {a.type && <div style={{ color:'var(--c)', fontSize:'.72rem', fontWeight:600, marginBottom:6 }}>{a.type}</div>}
                        <p style={{ color:'var(--dim)', fontSize:'.82rem', lineHeight:1.65, fontStyle:'italic', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
                          "{a.texte}"
                        </p>
                      </div>
                      <button style={btnDanger} onClick={() => deleteAvis(a.id)} title="Supprimer">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ════════════════════════════════
            ONGLET GALERIE
        ════════════════════════════════ */}
        {tab === 'galerie' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:24, alignItems:'start' }}>

            {/* Formulaire */}
            <div style={card}>
              <h3 style={{ color:'#fff', marginBottom:24, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
                ➕ Ajouter une photo
              </h3>

              <div style={{ marginBottom:14 }}>
                <label style={label}>Titre *</label>
                <input style={input} type="text" value={photoForm.titre} onChange={e=>setPhotoForm({...photoForm,titre:e.target.value})} placeholder="Ex : Changement écran iPhone" />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={label}>Catégorie</label>
                <select style={{ ...input, appearance:'none', cursor:'pointer' }} value={photoForm.categorie} onChange={e=>setPhotoForm({...photoForm,categorie:e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={label}>Description</label>
                <input style={input} type="text" value={photoForm.description} onChange={e=>setPhotoForm({...photoForm,description:e.target.value})} placeholder="Courte description de l'intervention" />
              </div>

              {/* Upload AVANT */}
              <div style={{ marginBottom:14 }}>
                <label style={label}>📷 Photo AVANT</label>
                <input ref={avantRef} type="file" accept="image/*" onChange={e=>onFileChange('avant',e)} style={{ ...input, padding:'9px 12px', cursor:'pointer' }} />
                {preview.avant && (
                  <div style={{ marginTop:8, borderRadius:8, overflow:'hidden', height:100, position:'relative' }}>
                    <img src={preview.avant} alt="avant" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,80,80,0.8)', color:'#fff', fontSize:'.65rem', fontWeight:700, textAlign:'center', padding:4, fontFamily:"'Orbitron',sans-serif" }}>AVANT</div>
                  </div>
                )}
              </div>

              {/* Upload APRÈS */}
              <div style={{ marginBottom:20 }}>
                <label style={label}>📷 Photo APRÈS</label>
                <input ref={apresRef} type="file" accept="image/*" onChange={e=>onFileChange('apres',e)} style={{ ...input, padding:'9px 12px', cursor:'pointer' }} />
                {preview.apres && (
                  <div style={{ marginTop:8, borderRadius:8, overflow:'hidden', height:100, position:'relative' }}>
                    <img src={preview.apres} alt="apres" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(43,255,154,0.8)', color:'#040B14', fontSize:'.65rem', fontWeight:700, textAlign:'center', padding:4, fontFamily:"'Orbitron',sans-serif" }}>APRÈS</div>
                  </div>
                )}
              </div>

              {photoMsg && (
                <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600, background: photoMsg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)', border:`1px solid ${photoMsg.ok ? 'rgba(43,255,154,0.3)' : 'rgba(255,80,80,0.3)'}`, color: photoMsg.ok ? 'var(--g)' : '#ff6b6b' }}>
                  {photoMsg.txt}
                </div>
              )}

              <button style={{ ...btn, width:'100%' }} onClick={addPhoto}>
                Ajouter la photo →
              </button>
            </div>

            {/* Grille photos */}
            <div>
              <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                Galerie ({photos.length} photo{photos.length > 1 ? 's' : ''})
              </div>

              {photos.length === 0 ? (
                <div style={{ textAlign:'center', color:'var(--dim)', padding:'48px 0', background:'rgba(5,14,28,0.5)', borderRadius:16, border:'1px dashed rgba(0,207,255,0.15)' }}>
                  <p style={{ fontSize:'2.4rem', marginBottom:10 }}>📷</p>
                  <p>Aucune photo ajoutée pour l'instant.</p>
                  <p style={{ fontSize:'.8rem', marginTop:6 }}>Remplissez le formulaire à gauche.</p>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                  {photos.map(p => (
                    <div key={p.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, overflow:'hidden', transition:'border-color .2s, transform .2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(0,207,255,0.3)'; e.currentTarget.style.transform='translateY(-3px)' }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(0,207,255,0.1)'; e.currentTarget.style.transform='' }}
                    >
                      {/* Photos avant/après */}
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', height:110, background:'#071120' }}>
                        {['avant','apres'].map(type => (
                          <div key={type} style={{ position:'relative', overflow:'hidden', cursor: p[type] ? 'zoom-in' : 'default' }}
                            onClick={() => p[type] && setLightbox({ src:p[type], titre:`${p.titre} — ${type}` })}
                          >
                            {p[type]
                              ? <img src={p[type]} alt={type} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .3s' }}
                                  onMouseEnter={e=>e.target.style.transform='scale(1.1)'}
                                  onMouseLeave={e=>e.target.style.transform=''}
                                />
                              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:4 }}>
                                  <span style={{ fontSize:'1.2rem' }}>📷</span>
                                  <span style={{ color:'var(--dim)', fontSize:'.6rem' }}>{type}</span>
                                </div>
                            }
                            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'3px 0', textAlign:'center', fontSize:'.62rem', fontWeight:700, fontFamily:"'Orbitron',sans-serif", background: type==='avant' ? 'rgba(255,80,80,0.8)' : 'rgba(43,255,154,0.8)', color: type==='avant' ? '#fff' : '#040B14' }}>
                              {type.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Infos + suppr */}
                      <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                        <div style={{ minWidth:0 }}>
                          <p style={{ color:'#fff', fontSize:'.82rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.titre}</p>
                          <span style={{ background:'rgba(0,207,255,0.1)', color:'var(--c)', fontSize:'.65rem', padding:'2px 8px', borderRadius:4, fontWeight:600 }}>{p.categorie}</span>
                        </div>
                        <button style={btnDanger} onClick={() => deletePhoto(p.id)} title="Supprimer">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ════════════════════════════════
            ONGLET INFOS SITE
        ════════════════════════════════ */}
        {tab === 'infos' && (
          <div style={card}>
            <h3 style={{ color:'#fff', marginBottom:8, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>ℹ️ Infos du site</h3>
            <p style={{ color:'var(--dim)', fontSize:'.88rem', marginBottom:28, lineHeight:1.7 }}>
              Pour modifier les informations du site (nom, téléphone, services, communes…), éditez le fichier{' '}
              <code style={{ color:'var(--c)', background:'rgba(0,207,255,0.08)', padding:'2px 8px', borderRadius:4 }}>src/config.js</code>{' '}
              dans VS Code puis sauvegardez — le site se recharge automatiquement.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:12 }}>
              {[
                ['Marque',       config.brand],
                ['Technicien',   `${config.prenom} ${config.nom}`],
                ['Téléphone',    config.telephone],
                ['Ville',        config.ville],
                ['SIRET',        config.siret],
                ['Statut',       config.statut],
                ['Formspree ID', config.formspreeId || '⚠️ Non configuré'],
                ['Services',     `${config.services.length} services`],
                ['Communes',     `${config.communes.length} communes`],
                ['Avis de base', `${config.avis.length} avis`],
              ].map(([k,v]) => (
                <div key={k} style={{ background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:10, padding:'12px 16px' }}>
                  <div style={{ color:'var(--dim)', fontSize:'.68rem', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>{k}</div>
                  <div style={{ color: v.toString().startsWith('⚠️') ? '#FFB800' : '#fff', fontSize:'.88rem', fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(4,11,20,0.97)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20, cursor:'zoom-out' }}>
          <img src={lightbox.src} alt={lightbox.titre} style={{ maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain', borderRadius:12, boxShadow:'0 0 60px rgba(0,207,255,0.2)' }} />
          <p style={{ color:'var(--tx)', fontFamily:"'Orbitron',sans-serif", fontSize:'.85rem' }}>{lightbox.titre}</p>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:20, right:20, background:'rgba(0,207,255,0.1)', border:'1px solid rgba(0,207,255,0.3)', color:'var(--tx)', width:44, height:44, borderRadius:'50%', cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
        </div>
      )}
    </div>
  )
}
