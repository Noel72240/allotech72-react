import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
  fetchWebClientsAdmin,
  uploadClientLogo,
} from '../../lib/clients.js'

const card = { background: 'rgba(5,14,28,0.85)', border: '1px solid rgba(0,207,255,0.15)', borderRadius: 20, padding: 32, backdropFilter: 'blur(20px)' }
const inp = { width: '100%', background: 'rgba(0,207,255,0.04)', border: '1px solid rgba(0,207,255,0.18)', borderRadius: 10, padding: '11px 15px', color: 'var(--tx)', fontFamily: "'Outfit',sans-serif", fontSize: '.92rem', outline: 'none', boxSizing: 'border-box' }
const lbl = { display: 'block', fontSize: '.72rem', fontWeight: 700, color: 'var(--dim)', marginBottom: 6, letterSpacing: '.08em', textTransform: 'uppercase' }
const btnP = { background: 'linear-gradient(135deg,#00CFFF,#00AEEF)', border: 'none', color: '#040B14', padding: '11px 28px', borderRadius: 10, fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: '.82rem', cursor: 'pointer' }
const btnS = { background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)', color: 'var(--c)', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '.78rem', fontWeight: 600 }
const btnD = { background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

const emptyForm = () => ({
  name: '',
  url: '',
  sector: '',
  logo_url: '',
  sort_order: 0,
  published: true,
})

const Msg = ({ msg }) => msg ? (
  <div style={{
    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '.82rem', fontWeight: 600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border: `1px solid ${msg.ok ? 'rgba(43,255,154,0.3)' : 'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}
  >
    {msg.txt}
  </div>
) : null

function normalizeUrl(raw) {
  const v = String(raw || '').trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm())
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState('')
  const logoRef = useRef()

  useEffect(() => { loadClients() }, [])

  const loadClients = async () => {
    setLoading(true)
    try {
      setClients(await fetchWebClientsAdmin())
    } catch (e) {
      setMsg({
        ok: false,
        txt: `Impossible de charger les clients. Exécute supabase/web-clients.sql dans Supabase. (${e.message})`,
      })
      setClients([])
    }
    setLoading(false)
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditId(null)
    setPreview('')
    if (logoRef.current) logoRef.current.value = ''
  }

  const startEdit = (c) => {
    setEditId(c.id)
    setForm({
      name: c.name || '',
      url: c.url || '',
      sector: c.sector || '',
      logo_url: c.logo || '',
      sort_order: c.sortOrder ?? 0,
      published: c.published !== false,
    })
    setPreview('')
    if (logoRef.current) logoRef.current.value = ''
    setMsg(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const removeLogo = () => {
    setForm((f) => ({ ...f, logo_url: '' }))
    setPreview('')
    if (logoRef.current) logoRef.current.value = ''
  }

  const displayLogo = preview || form.logo_url

  const saveClient = async () => {
    if (!form.name.trim()) {
      setMsg({ ok: false, txt: 'Le nom du client est obligatoire.' })
      return
    }

    setSaving(true)
    let logo_url = form.logo_url || ''
    try {
      if (logoRef.current?.files?.[0]) {
        logo_url = await uploadClientLogo(logoRef.current.files[0], form.name)
      }
    } catch (e) {
      setMsg({ ok: false, txt: `Erreur upload logo : ${e.message}` })
      setSaving(false)
      return
    }

    const payload = {
      name: form.name.trim(),
      url: normalizeUrl(form.url),
      sector: form.sector.trim(),
      logo_url,
      sort_order: Number(form.sort_order) || 0,
      published: !!form.published,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editId) {
        const { error } = await supabase.from('web_clients').update(payload).eq('id', editId)
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Client mis à jour.' })
      } else {
        const { error } = await supabase.from('web_clients').insert([payload])
        if (error) throw error
        setMsg({ ok: true, txt: '✅ Client ajouté.' })
      }
      resetForm()
      await loadClients()
    } catch (e) {
      setMsg({ ok: false, txt: e.message || 'Erreur enregistrement.' })
    }
    setSaving(false)
  }

  const deleteClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return
    const { error } = await supabase.from('web_clients').delete().eq('id', id)
    if (error) {
      setMsg({ ok: false, txt: error.message })
      return
    }
    if (editId === id) resetForm()
    setMsg({ ok: true, txt: 'Client supprimé.' })
    await loadClients()
  }

  const togglePublished = async (c) => {
    const { error } = await supabase
      .from('web_clients')
      .update({ published: !c.published, updated_at: new Date().toISOString() })
      .eq('id', c.id)
    if (error) {
      setMsg({ ok: false, txt: error.message })
      return
    }
    setClients((list) => list.map((x) => (x.id === c.id ? { ...x, published: !c.published } : x)))
  }

  return (
    <div className="admin-dash-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'start' }}>
      <div className="admin-dash-card" style={card}>
        <h3 style={{ color: '#fff', marginBottom: 8, fontFamily: "'Orbitron',sans-serif", fontSize: '1rem' }}>
          {editId ? '✏️ Modifier un client' : '➕ Ajouter un client web'}
        </h3>
        <p style={{ color: 'var(--dim)', fontSize: '.8rem', marginBottom: 20, lineHeight: 1.5 }}>
          Affiché dans la section « Ils me font confiance » de l’accueil.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Nom *</label>
          <input
            style={inp}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Boulangerie Dupont"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Site web</label>
          <input
            style={inp}
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://www.exemple.fr"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Secteur</label>
          <input
            style={inp}
            type="text"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
            placeholder="Artisanat, Commerce…"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Ordre d’affichage</label>
          <input
            style={inp}
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            placeholder="0"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Logo</label>
          <input
            ref={logoRef}
            style={{ ...inp, padding: '10px' }}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={onLogoChange}
          />
          {displayLogo ? (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={displayLogo}
                alt=""
                style={{ maxWidth: 120, maxHeight: 56, objectFit: 'contain', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 8 }}
              />
              <button type="button" style={btnS} onClick={removeLogo}>Retirer</button>
            </div>
          ) : (
            <p style={{ color: 'var(--dim)', fontSize: '.75rem', marginTop: 8 }}>
              Sans logo → initiales automatiques sur le site.
            </p>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, cursor: 'pointer', color: 'var(--tx)', fontSize: '.88rem' }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Publié sur l’accueil
        </label>

        <Msg msg={msg} />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={{ ...btnP, opacity: saving ? 0.7 : 1 }} onClick={saveClient} disabled={saving}>
            {saving ? 'Enregistrement…' : editId ? 'Mettre à jour →' : 'Ajouter →'}
          </button>
          {editId ? (
            <button type="button" style={btnS} onClick={resetForm}>Annuler</button>
          ) : null}
        </div>
      </div>

      <div>
        <div style={{ color: 'var(--dim)', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          Clients ({clients.length})
          <button onClick={loadClients} style={btnS}>🔄</button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--dim)', textAlign: 'center', padding: 40 }}>⏳ Chargement…</div>
        ) : clients.length === 0 ? (
          <div style={{ ...card, color: 'var(--dim)', textAlign: 'center' }}>
            Aucun client pour l’instant.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clients.map((c) => (
              <div key={c.id} style={{ ...card, padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 64, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.logo ? (
                    <img src={c.logo} alt="" style={{ maxWidth: 64, maxHeight: 48, objectFit: 'contain' }} />
                  ) : (
                    <span style={{
                      width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg,#00CFFF,#2BFF9A)', color: '#040B14', fontWeight: 800, fontSize: '.8rem',
                    }}
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '.92rem' }}>{c.name}</div>
                  <div style={{ color: 'var(--dim)', fontSize: '.75rem', marginTop: 2 }}>
                    {c.sector || '—'}
                    {c.url ? ` · ${c.url.replace(/^https?:\/\//, '')}` : ''}
                    {' · '}
                    <span style={{ color: c.published ? 'var(--g)' : '#ffb800' }}>
                      {c.published ? 'Publié' : 'Masqué'}
                    </span>
                    {' · ordre '}
                    {c.sortOrder}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="button" style={btnS} onClick={() => togglePublished(c)}>
                    {c.published ? 'Masquer' : 'Publier'}
                  </button>
                  <button type="button" style={btnS} onClick={() => startEdit(c)}>✏️</button>
                  <button type="button" style={btnD} onClick={() => deleteClient(c.id)} title="Supprimer">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
