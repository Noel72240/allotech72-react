import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
  LOCATION_CATEGORIES,
  fetchLocationItems,
  mapLocationToRow,
  uploadLocationImage,
  isDbLocationId,
  formatLocationDbError,
  formatLocationPrice,
  locationAvailabilityLabel,
} from '../../lib/location.js'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const inp  = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none', boxSizing:'border-box' }
const lbl  = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer' }
const btnS = { background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'8px 14px', borderRadius:8, cursor:'pointer', fontSize:'.78rem', fontWeight:600 }
const btnD = { background:'rgba(255,80,80,0.12)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:'.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }

const AVAILABILITY = [
  { value: 'dispo', label: 'Disponible' },
  { value: 'sur_demande', label: 'Sur demande' },
  { value: 'indispo', label: 'Indisponible' },
]

const CATEGORIES = LOCATION_CATEGORIES.filter(c => c.id !== 'all')

const emptyForm = () => ({
  id: null,
  title: '',
  categoryId: CATEGORIES[0]?.id || 'pc',
  priceDay: '',
  priceWeek: '',
  condition: '',
  highlightsText: '',
  availability: 'dispo',
  image: '',
  published: true,
  sortOrder: 0,
})

function highlightsToText(arr) {
  return (arr || []).join('\n')
}

function textToHighlights(text) {
  return String(text || '').split('\n').map(s => s.trim()).filter(Boolean)
}

const Msg = ({ msg }) => msg ? (
  <div style={{
    padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

export default function AdminLocation() {
  const [items, setItems] = useState([])
  const [load, setLoad] = useState(true)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [uploading, setUploading] = useState(false)
  const imageRef = useRef()

  const loadAll = async () => {
    setLoad(true)
    try {
      const rows = await fetchLocationItems({ includeUnpublished: true, allowStaticFallback: false })
      setItems(rows)
      setMsg(null)
    } catch (e) {
      setItems([])
      setMsg({ ok: false, txt: formatLocationDbError(e.message) })
    }
    setLoad(false)
  }

  useEffect(() => { loadAll() }, [])

  const resetForm = () => {
    setForm(emptyForm())
    if (imageRef.current) imageRef.current.value = ''
  }

  const editItem = item => {
    setForm({
      id: item.id,
      title: item.title || '',
      categoryId: item.categoryId || CATEGORIES[0]?.id || 'pc',
      priceDay: item.priceDay ?? '',
      priceWeek: item.priceWeek ?? '',
      condition: item.condition || '',
      highlightsText: highlightsToText(item.highlights),
      availability: item.availability || 'dispo',
      image: item.image || '',
      published: item.published !== false,
      sortOrder: item.sortOrder ?? 0,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onImagePick = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg({ ok: true, txt: '⏳ Upload photo…' })
    try {
      const url = await uploadLocationImage(file)
      setForm(f => ({ ...f, image: url }))
      setMsg({ ok: true, txt: '✅ Photo uploadée' })
      setTimeout(() => setMsg(null), 2500)
    } catch (err) {
      setMsg({ ok: false, txt: err.message })
    }
    setUploading(false)
    if (imageRef.current) imageRef.current.value = ''
  }

  const saveItem = async () => {
    if (!form.title.trim()) {
      setMsg({ ok: false, txt: 'Le titre est obligatoire.' })
      return
    }

    const payload = mapLocationToRow({
      title: form.title,
      categoryId: form.categoryId,
      priceDay: form.priceDay,
      priceWeek: form.priceWeek,
      condition: form.condition,
      highlights: textToHighlights(form.highlightsText),
      availability: form.availability,
      image: form.image,
      published: form.published,
      sortOrder: form.sortOrder,
    })
    payload.updated_at = new Date().toISOString()

    try {
      if (form.id) {
        const { error } = await supabase.from('location_items').update(payload).eq('id', form.id)
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Matériel mis à jour' })
      } else {
        const { error } = await supabase.from('location_items').insert([payload])
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Matériel ajouté' })
        resetForm()
      }
      await loadAll()
      setTimeout(() => setMsg(null), 3000)
    } catch (e) {
      setMsg({ ok: false, txt: formatLocationDbError(e.message) })
    }
  }

  const deleteItem = async item => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return
    if (!isDbLocationId(item.id)) {
      setMsg({
        ok: false,
        txt: 'Cet article n’est pas en base. Exécute supabase/location.sql puis ajoute tes locations ici.',
      })
      return
    }

    const { data, error } = await supabase
      .from('location_items')
      .delete()
      .eq('id', item.id)
      .select('id')

    if (error) {
      setMsg({ ok: false, txt: formatLocationDbError(error.message) })
      return
    }
    if (!data?.length) {
      setMsg({ ok: false, txt: 'Aucune ligne supprimée (RLS ?). Vérifie location.sql et ta connexion admin.' })
      return
    }

    setItems(prev => prev.filter(i => i.id !== item.id))
    if (form.id === item.id) resetForm()
    setMsg({ ok: true, txt: '✅ Matériel supprimé' })
    setTimeout(() => setMsg(null), 3000)
  }

  const catLabel = id => CATEGORIES.find(c => c.id === id)?.label || id

  return (
    <div>
      <div style={{
        marginBottom: 20, padding: '14px 18px', borderRadius: 12,
        background: 'rgba(0,207,255,0.06)', border: '1px solid rgba(0,207,255,0.2)',
        color: 'var(--tx)', fontSize: '.88rem', lineHeight: 1.5,
      }}>
        Gère le catalogue de la page <strong style={{ color: 'var(--c)' }}>/location</strong>.
        {' '}Si la liste reste vide ou en erreur : exécute <code style={{ color: 'var(--g)' }}>supabase/location.sql</code> dans Supabase → SQL Editor
        (bucket <code>vente</code> déjà utilisé pour les photos).
      </div>

      <div className="admin-dash-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:24, alignItems:'start' }}>
        <div style={card}>
          <h3 style={{ color:'#fff', marginBottom:20, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
            {form.id ? '✏️ Modifier le matériel' : '➕ Nouveau matériel de location'}
          </h3>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Titre *</label>
            <input style={inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="PC portable bureautique" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Catégorie</label>
              <select style={inp} value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Disponibilité</label>
              <select style={inp} value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}>
                {AVAILABILITY.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Prix / jour (€)</label>
              <input style={inp} type="number" min="0" step="0.01" value={form.priceDay} onChange={e => setForm({ ...form, priceDay: e.target.value })} placeholder="25" />
            </div>
            <div>
              <label style={lbl}>Prix / semaine (€)</label>
              <input style={inp} type="number" min="0" step="0.01" value={form.priceWeek} onChange={e => setForm({ ...form, priceWeek: e.target.value })} placeholder="99" />
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Condition / note</label>
            <input style={inp} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} placeholder="Testé & prêt" />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Points clés (1 par ligne)</label>
            <textarea
              style={{ ...inp, minHeight:90, resize:'vertical' }}
              value={form.highlightsText}
              onChange={e => setForm({ ...form, highlightsText: e.target.value })}
              placeholder={'Windows 11\nSSD\nIdéal formation'}
            />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Photo</label>
            {form.image ? (
              <div style={{ marginBottom:10, position:'relative', width:'100%', maxWidth:220, height:140, borderRadius:12, overflow:'hidden', border:'1px solid rgba(0,207,255,0.2)' }}>
                <img src={form.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            ) : null}
            <input ref={imageRef} type="file" accept="image/*" onChange={onImagePick} disabled={uploading} style={{ color:'var(--dim)', fontSize:'.8rem' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:18 }}>
            <div>
              <label style={lbl}>Ordre d’affichage</label>
              <input style={inp} type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} />
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:8 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'var(--tx)', fontSize:'.9rem' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                Publié sur /location
              </label>
            </div>
          </div>

          <Msg msg={msg} />

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button type="button" style={{ ...btnP, opacity: uploading ? 0.6 : 1 }} onClick={saveItem} disabled={uploading}>
              {form.id ? 'Enregistrer →' : 'Ajouter →'}
            </button>
            {form.id ? (
              <button type="button" style={btnS} onClick={resetForm}>Annuler</button>
            ) : null}
          </div>
        </div>

        <div>
          <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
            Matériels ({items.length})
            <button type="button" onClick={loadAll} style={btnS}>🔄</button>
          </div>

          {load ? (
            <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>⏳ Chargement…</div>
          ) : items.length === 0 ? (
            <div style={{ ...card, color:'var(--dim)', textAlign:'center' }}>
              Aucun matériel en base pour l’instant. Ajoute-en à gauche (après avoir exécuté location.sql).
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {items.map(item => (
                <div key={item.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, padding:'14px 16px', display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', background:'#071120', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                      <span aria-hidden>📦</span>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:'#fff', fontWeight:700, fontSize:'.92rem' }}>{item.title}</div>
                    <div style={{ color:'var(--c)', fontSize:'.75rem', marginTop:2 }}>
                      {catLabel(item.categoryId)} · {formatLocationPrice(item)} · {locationAvailabilityLabel(item.availability)}
                      {!item.published ? ' · brouillon' : ''}
                    </div>
                  </div>
                  <button type="button" style={btnS} onClick={() => editItem(item)}>Modifier</button>
                  <button type="button" style={btnD} onClick={() => deleteItem(item)} aria-label="Supprimer">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
