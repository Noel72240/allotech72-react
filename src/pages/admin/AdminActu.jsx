import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import {
  mapActuRow,
  slugifyActu,
  resolveUniqueActuSlug,
  buildActuExcerpt,
  actuCharStatus,
  ACTU_MIN_CHARS,
  ACTU_MAX_CHARS,
  formatActuDate,
} from '../../lib/actu.js'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const inp  = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none' }
const lbl  = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer', transition:'all .2s' }
const btnD = { background:'rgba(255,80,80,0.12)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:'.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }

const emptyForm = () => ({
  title: '',
  body: '',
  slug: '',
  published: true,
  published_at: new Date().toISOString().slice(0, 10),
})

const Msg = ({ msg }) => msg ? (
  <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

export default function AdminActu() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(emptyForm())
  const [editId, setEditId]   = useState(null)
  const [msg, setMsg]         = useState(null)
  const [saving, setSaving]   = useState(false)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase.from('actu').select('*').order('published_at', { ascending: false })
    setPosts((data || []).map(mapActuRow))
    setLoading(false)
  }

  const charLen = form.body.length
  const charInfo = actuCharStatus(charLen)

  const resetForm = () => {
    setForm(emptyForm())
    setEditId(null)
  }

  const startEdit = (post) => {
    setEditId(post.id)
    setForm({
      title: post.title,
      body: post.body,
      slug: post.slug,
      published: post.published,
      published_at: (post.publishedAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
    })
    setMsg(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const savePost = async () => {
    if (!form.title.trim()) { setMsg({ ok: false, txt: 'Le titre est obligatoire.' }); return }
    if (!form.body.trim()) { setMsg({ ok: false, txt: 'Le texte est obligatoire.' }); return }
    if (charLen < ACTU_MIN_CHARS) {
      setMsg({ ok: false, txt: `Minimum ${ACTU_MIN_CHARS} caractères pour le SEO (actuellement ${charLen}).` })
      return
    }
    if (charLen > ACTU_MAX_CHARS) {
      setMsg({ ok: false, txt: `Maximum ${ACTU_MAX_CHARS} caractères (actuellement ${charLen}).` })
      return
    }

    setSaving(true)
    const slug = resolveUniqueActuSlug({
      slug: form.slug || slugifyActu(form.title),
      title: form.title,
      actuId: editId,
      posts,
    })
    const excerpt = buildActuExcerpt(form.body)
    const published_at = form.published_at
      ? new Date(`${form.published_at}T12:00:00`).toISOString()
      : new Date().toISOString()

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      excerpt,
      slug,
      published: form.published,
      published_at,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editId) {
        const { error } = await supabase.from('actu').update(payload).eq('id', editId)
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Actualité mise à jour !' })
      } else {
        const { error } = await supabase.from('actu').insert([payload])
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Actualité publiée !' })
      }
      resetForm()
      fetchPosts()
      setTimeout(() => setMsg(null), 3000)
    } catch (e) {
      setMsg({ ok: false, txt: `Erreur : ${e.message}` })
    }
    setSaving(false)
  }

  const deletePost = async (id) => {
    if (!window.confirm('Supprimer cette actualité ?')) return
    await supabase.from('actu').delete().eq('id', id)
    if (editId === id) resetForm()
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const togglePublished = async (post) => {
    await supabase.from('actu').update({ published: !post.published, updated_at: new Date().toISOString() }).eq('id', post.id)
    fetchPosts()
  }

  return (
    <div className="admin-dash-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24, alignItems:'start' }}>
      <div className="admin-dash-card" style={card}>
        <h3 style={{ color:'#fff', marginBottom:8, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
          {editId ? '✏️ Modifier l\'actu' : '➕ Nouvelle actu'}
        </h3>
        <p style={{ color:'var(--dim)', fontSize:'.78rem', marginBottom:24, lineHeight:1.5 }}>
          Rédigez une actualité de <strong style={{ color:'var(--c)' }}>{ACTU_MIN_CHARS} à {ACTU_MAX_CHARS} caractères</strong> chaque semaine pour le référencement local.
        </p>

        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Titre *</label>
          <input
            style={inp}
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || slugifyActu(e.target.value) })}
            placeholder="Ex. : Comment protéger son PC des virus en 2026"
          />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Référence URL (slug)</label>
          <input
            style={inp}
            type="text"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            placeholder="auto-généré depuis le titre"
          />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Texte de l'actu * ({ACTU_MIN_CHARS}–{ACTU_MAX_CHARS} car.)</label>
          <textarea
            style={{ ...inp, minHeight: 220, resize: 'vertical', lineHeight: 1.65 }}
            value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Rédigez votre actualité ici. Séparez les paragraphes par une ligne vide."
          />
          <div style={{ marginTop:8, fontSize:'.75rem', fontWeight:600, color: charInfo.color }}>
            {charInfo.label}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          <div>
            <label style={lbl}>Date de publication</label>
            <input
              style={inp}
              type="date"
              value={form.published_at}
              onChange={e => setForm({ ...form, published_at: e.target.value })}
            />
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', paddingBottom:4 }}>
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', color:'var(--tx)', fontSize:'.88rem' }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
                style={{ width:18, height:18, accentColor:'var(--c)' }}
              />
              Publiée en ligne
            </label>
          </div>
        </div>

        <Msg msg={msg} />

        <div style={{ display:'flex', gap:10 }}>
          <button style={{ ...btnP, flex:1, opacity: saving ? .6 : 1 }} onClick={savePost} disabled={saving}>
            {saving ? '⏳ Enregistrement…' : editId ? 'Mettre à jour →' : 'Publier l\'actu →'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ ...btnP, background:'rgba(0,207,255,0.1)', color:'var(--tx)', border:'1px solid rgba(0,207,255,0.25)' }}
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      <div>
        <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
          Actualités ({posts.length})
          <button onClick={fetchPosts} style={{ background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'4px 12px', borderRadius:6, cursor:'pointer', fontSize:'.72rem' }}>🔄</button>
        </div>

        {loading ? (
          <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>⏳ Chargement…</div>
        ) : posts.length === 0 ? (
          <div style={{ color:'var(--dim)', textAlign:'center', padding:40 }}>Aucune actualité pour l'instant</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {posts.map(p => (
              <div key={p.id} style={{ background:'rgba(5,14,28,0.7)', border:'1px solid rgba(0,207,255,0.1)', borderRadius:14, padding:'16px 18px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:6 }}>
                      <span style={{
                        fontSize:'.65rem', fontWeight:700, padding:'3px 8px', borderRadius:4,
                        background: p.published ? 'rgba(43,255,154,0.12)' : 'rgba(255,184,0,0.12)',
                        color: p.published ? 'var(--g)' : '#FFB800',
                        border: `1px solid ${p.published ? 'rgba(43,255,154,0.3)' : 'rgba(255,184,0,0.3)'}`,
                      }}>
                        {p.published ? 'En ligne' : 'Brouillon'}
                      </span>
                      <span style={{ color:'var(--dim)', fontSize:'.72rem' }}>{formatActuDate(p.publishedAt)}</span>
                      <span style={{ color:'var(--dim)', fontSize:'.72rem' }}>{p.body.length} car.</span>
                    </div>
                    <p style={{ color:'#fff', fontWeight:600, fontSize:'.9rem', marginBottom:6 }}>{p.title}</p>
                    <p style={{ color:'var(--dim)', fontSize:'.78rem', lineHeight:1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {p.excerpt}
                    </p>
                    {p.published && (
                      <Link to={`/actu/${p.slug}`} target="_blank" style={{ color:'var(--c)', fontSize:'.72rem', marginTop:8, display:'inline-block' }}>
                        Voir sur le site →
                      </Link>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button
                      onClick={() => togglePublished(p)}
                      title={p.published ? 'Dépublier' : 'Publier'}
                      style={{ ...btnD, width:36, borderRadius:8, background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)' }}
                    >
                      {p.published ? '👁' : '📝'}
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      style={{ ...btnD, width:36, borderRadius:8, background:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.3)', color:'#FFB800' }}
                    >
                      ✏️
                    </button>
                    <button style={btnD} onClick={() => deletePost(p.id)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
