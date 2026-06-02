import { useState, useEffect, useRef } from 'react'
import {
  HOME_NEWS_SLOTS,
  normalizeHomeNews,
  fetchShopSettings,
  saveShopSettings,
  uploadProductImage,
} from '../../lib/shop.js'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const inp  = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none' }
const lbl  = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer' }

const Msg = ({ msg }) => msg ? (
  <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

export default function AdminHome() {
  const [homeNews, setHomeNews] = useState(normalizeHomeNews([]))
  const [load, setLoad] = useState(true)
  const [msg, setMsg] = useState(null)
  const [uploading, setUploading] = useState(null)
  const fileRefs = useRef([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoad(true)
      try {
        const sett = await fetchShopSettings()
        if (!cancelled) setHomeNews(sett.homeNews || normalizeHomeNews([]))
      } catch (e) {
        if (!cancelled) setMsg({ ok: false, txt: e.message })
      }
      if (!cancelled) setLoad(false)
    })()
    return () => { cancelled = true }
  }, [])

  const updateSlide = (idx, patch) => {
    setHomeNews(prev => {
      const next = normalizeHomeNews(prev)
      next[idx] = { ...next[idx], ...patch }
      return next
    })
  }

  const onImage = async (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(idx)
    setMsg({ ok: true, txt: '⏳ Upload image…' })
    try {
      const url = await uploadProductImage(file)
      updateSlide(idx, { image: url })
      setMsg({ ok: true, txt: '✅ Image uploadée — cliquez Enregistrer' })
    } catch (err) {
      setMsg({ ok: false, txt: err.message })
    }
    setUploading(null)
    if (fileRefs.current[idx]) fileRefs.current[idx].value = ''
  }

  const save = async () => {
    setMsg({ ok: true, txt: 'Enregistrement…' })
    try {
      await saveShopSettings({ homeNews })
      setMsg({ ok: true, txt: '✅ Page d’accueil enregistrée' })
      setTimeout(() => setMsg(null), 3000)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
  }

  if (load) {
    return <div style={{ color:'var(--dim)', padding:40, textAlign:'center' }}>⏳ Chargement…</div>
  }

  return (
    <div className="admin-dash-card" style={{ ...card, maxWidth: 720 }}>
      <h3 style={{ color:'#fff', marginBottom:8, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
        Les nouveautés Allotech72
      </h3>
      <p style={{ color:'var(--dim)', fontSize:'.82rem', lineHeight:1.6, marginBottom:20 }}>
        Carousel sous le hero sur la page d&apos;accueil — {HOME_NEWS_SLOTS} emplacements. Format image recommandé{' '}
        <strong>1200 × 525 px</strong> (ratio 16:7). Au minimum une image et un titre ou un texte par slide visible.
      </p>
      <Msg msg={msg} />
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {normalizeHomeNews(homeNews).map((slide, idx) => (
          <div key={idx} style={{
            padding:16, borderRadius:14,
            border:'1px solid rgba(0,207,255,0.15)',
            background:'rgba(0,207,255,0.03)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <strong style={{ color:'var(--c)', fontSize:'.85rem' }}>Emplacement {idx + 1}</strong>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.85rem' }}>
                <input
                  type="checkbox"
                  checked={slide.enabled !== false}
                  onChange={e => updateSlide(idx, { enabled: e.target.checked })}
                />
                Visible
              </label>
            </div>
            {slide.image && (
              <div style={{ marginBottom:12, borderRadius:10, overflow:'hidden', maxHeight:140, background:'#071120' }}>
                <img src={slide.image} alt="" style={{ width:'100%', height:140, objectFit:'cover' }} />
              </div>
            )}
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Image (.jpg .png .webp)</label>
              <input
                ref={el => { fileRefs.current[idx] = el }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ ...inp, padding:'9px 12px' }}
                disabled={uploading === idx}
                onChange={e => onImage(idx, e)}
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Petit label (optionnel)</label>
              <input
                style={inp}
                value={slide.kicker}
                onChange={e => updateSlide(idx, { kicker: e.target.value })}
                placeholder="Nouveauté, Promo…"
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Titre</label>
              <input
                style={inp}
                value={slide.title}
                onChange={e => updateSlide(idx, { title: e.target.value })}
                placeholder="Ex : Boutique en ligne"
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Texte</label>
              <textarea
                style={{ ...inp, minHeight:88, resize:'vertical' }}
                value={slide.text}
                onChange={e => updateSlide(idx, { text: e.target.value })}
                placeholder="Description courte affichée sur la slide…"
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Bouton (optionnel)</label>
              <input
                style={inp}
                value={slide.cta}
                onChange={e => updateSlide(idx, { cta: e.target.value })}
                placeholder="Voir la boutique"
              />
            </div>
            <div>
              <label style={lbl}>Lien du bouton (optionnel)</label>
              <input
                style={inp}
                value={slide.link}
                onChange={e => updateSlide(idx, { link: e.target.value })}
                placeholder="/boutique ou /#contact ou https://…"
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" style={{ ...btnP, marginTop:20 }} onClick={save}>
        Enregistrer la page d&apos;accueil
      </button>
    </div>
  )
}
