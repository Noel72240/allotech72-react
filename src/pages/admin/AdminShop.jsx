import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
  SHOP_CATEGORIES,
  SHOP_BUCKET,
  mapProductToRow,
  fetchShopProducts,
  fetchShopSettings,
  saveShopSettings,
  fetchShopOrders,
  cancelShopOrder,
  restoreStockForCancelledOrder,
  SHOP_BANNER_SLOTS,
  normalizeShopBanners,
  uploadProductImage,
  isDbProductId,
  formatPrice,
  resolveUniqueProductSlug,
  formatShopDbError,
} from '../../lib/shop.js'

const card = { background:'rgba(5,14,28,0.85)', border:'1px solid rgba(0,207,255,0.15)', borderRadius:20, padding:32, backdropFilter:'blur(20px)' }
const inp  = { width:'100%', background:'rgba(0,207,255,0.04)', border:'1px solid rgba(0,207,255,0.18)', borderRadius:10, padding:'11px 15px', color:'var(--tx)', fontFamily:"'Outfit',sans-serif", fontSize:'.92rem', outline:'none' }
const lbl  = { display:'block', fontSize:'.72rem', fontWeight:700, color:'var(--dim)', marginBottom:6, letterSpacing:'.08em', textTransform:'uppercase' }
const btnP = { background:'linear-gradient(135deg,#00CFFF,#00AEEF)', border:'none', color:'#040B14', padding:'11px 28px', borderRadius:10, fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:'.82rem', cursor:'pointer' }
const btnD = { background:'rgba(255,80,80,0.12)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff6b6b', width:34, height:34, borderRadius:'50%', cursor:'pointer', fontSize:'.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }

const AVAILABILITY = [
  { value: 'en_stock', label: 'En stock' },
  { value: 'sur_commande', label: 'Sur commande' },
  { value: 'sur_devis', label: 'Sur devis' },
  { value: 'vendu', label: 'Vendu' },
]

const emptyProduct = () => ({
  id: null,
  slug: '',
  title: '',
  section: 'neuf',
  categoryId: 'informatique',
  price: '',
  condition: '',
  highlightsText: '',
  availability: 'en_stock',
  image: '',
  published: true,
  sortOrder: 0,
  stock: '1',
})

function highlightsToText(arr) {
  return (arr || []).join('\n')
}

function textToHighlights(text) {
  return text.split('\n').map(s => s.trim()).filter(Boolean)
}

const Msg = ({ msg }) => msg ? (
  <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:'.82rem', fontWeight:600,
    background: msg.ok ? 'rgba(43,255,154,0.1)' : 'rgba(255,80,80,0.1)',
    border:`1px solid ${msg.ok ? 'rgba(43,255,154,0.3)':'rgba(255,80,80,0.3)'}`,
    color: msg.ok ? 'var(--g)' : '#ff6b6b',
  }}>{msg.txt}</div>
) : null

export default function AdminShop() {
  const [subTab, setSubTab] = useState('products')
  const [products, setProducts] = useState([])
  const [load, setLoad] = useState(true)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState(emptyProduct())
  const [uploading, setUploading] = useState(false)
  const imageRef = useRef()

  const [settings, setSettings] = useState({
    sumupMerchantCode: '',
    sumupEnabled: false,
    shopEnabled: true,
    mondialRelayFee: 0.5,
    mondialRelayBrand: '',
    pickupEnabled: true,
    banners: normalizeShopBanners([]),
  })
  const [settingsMsg, setSettingsMsg] = useState(null)
  const [bannerUploading, setBannerUploading] = useState(null)
  const bannerRefs = useRef([])
  const [orders, setOrders] = useState([])
  const [ordersLoad, setOrdersLoad] = useState(false)
  const [cancellingRef, setCancellingRef] = useState(null)
  const [restoringRef, setRestoringRef] = useState(null)

  const loadAll = async () => {
    setLoad(true)
    try {
      const [prods, sett] = await Promise.all([
        fetchShopProducts({ includeUnpublished: true, allowStaticFallback: false }),
        fetchShopSettings(),
      ])
      setProducts(prods)
      setSettings(sett)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
    setLoad(false)
  }

  useEffect(() => { loadAll() }, [])

  const loadOrders = async () => {
    setOrdersLoad(true)
    try {
      const rows = await fetchShopOrders(80)
      setOrders(rows)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
    setOrdersLoad(false)
  }

  useEffect(() => {
    if (subTab === 'orders') loadOrders()
  }, [subTab])

  const cancelOrder = async order => {
    if (order.status === 'cancelled') return
    const ok = window.confirm(
      `Annuler la commande ${order.checkout_reference} ?\n\n` +
        '• Le stock des articles sera remis en boutique\n' +
        '• Le remboursement client sur SumUp reste à faire manuellement si besoin',
    )
    if (!ok) return

    setCancellingRef(order.checkout_reference)
    try {
      const restored = await cancelShopOrder(order.checkout_reference)
      await Promise.all([loadOrders(), loadAll()])
      const stockMsg = restored.length
        ? restored.map(r => `${r.qty}× ${r.title} (stock : ${r.newStock ?? '—'})`).join(' · ')
        : null
      setMsg({
        ok: true,
        txt: stockMsg
          ? `✅ Commande annulée — remis en boutique : ${stockMsg}`
          : '✅ Commande annulée (aucun article avec stock suivi)',
      })
      setTimeout(() => setMsg(null), 6000)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
    setCancellingRef(null)
  }

  const restoreStock = async order => {
    if (!window.confirm(`Remettre le stock pour la commande ${order.checkout_reference} ?`)) return
    setRestoringRef(order.checkout_reference)
    try {
      const restored = await restoreStockForCancelledOrder(order.checkout_reference)
      await Promise.all([loadOrders(), loadAll()])
      const stockMsg = restored.map(r => `${r.qty}× ${r.title} (stock : ${r.newStock ?? '—'})`).join(' · ')
      setMsg({ ok: true, txt: stockMsg ? `✅ Stock remis : ${stockMsg}` : '✅ Aucun article à remettre' })
      setTimeout(() => setMsg(null), 6000)
    } catch (e) {
      setMsg({ ok: false, txt: e.message })
    }
    setRestoringRef(null)
  }

  const editProduct = p => {
    setForm({
      id: p.id,
      slug: p.slug || '',
      title: p.title,
      section: p.section,
      categoryId: p.categoryId,
      price: p.price ?? '',
      condition: p.condition || '',
      highlightsText: highlightsToText(p.highlights),
      availability: p.availability,
      image: p.image || '',
      published: p.published !== false,
      sortOrder: p.sortOrder ?? 0,
      stock: p.stock != null ? String(p.stock) : '',
    })
    setSubTab('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => setForm(emptyProduct())

  const onImagePick = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg({ ok: true, txt: '⏳ Upload photo…' })
    try {
      const url = await uploadProductImage(file)
      setForm(f => ({ ...f, image: url }))
      setMsg({ ok: true, txt: '✅ Photo uploadée' })
      setTimeout(() => setMsg(null), 2500)
    } catch (err) {
      setMsg({ ok: false, txt: err.message })
    }
    setUploading(false)
    if (imageRef.current) imageRef.current.value = ''
  }

  const saveProduct = async () => {
    if (!form.title.trim()) {
      setMsg({ ok: false, txt: 'Le titre est obligatoire.' })
      return
    }

    const uniqueSlug = resolveUniqueProductSlug({
      slug: form.slug,
      title: form.title,
      productId: form.id,
      products,
    })

    const payload = mapProductToRow({
      slug: uniqueSlug,
      title: form.title,
      section: form.section,
      categoryId: form.categoryId,
      price: form.price === '' ? null : form.price,
      condition: form.condition,
      highlights: textToHighlights(form.highlightsText),
      availability: form.availability,
      image: form.image,
      published: form.published,
      sortOrder: form.sortOrder,
      stock: form.stock,
    })
    payload.updated_at = new Date().toISOString()

    try {
      const slugNote = uniqueSlug !== (form.slug?.trim() || '')
        ? ` (réf. « ${uniqueSlug} »)`
        : ''

      if (form.id) {
        const { error } = await supabase.from('shop_products').update(payload).eq('id', form.id)
        if (error) throw error
        setMsg({ ok: true, txt: `✅ Produit mis à jour${slugNote}` })
      } else {
        const { error } = await supabase.from('shop_products').insert([payload])
        if (error) throw error
        setMsg({ ok: true, txt: `✅ Produit ajouté${slugNote}` })
        resetForm()
      }
      loadAll()
      setTimeout(() => setMsg(null), 3000)
    } catch (e) {
      setMsg({ ok: false, txt: formatShopDbError(e.message) })
    }
  }

  const deleteProduct = async product => {
    if (!window.confirm(`Supprimer « ${product.title} » ?`)) return

    if (!isDbProductId(product.id)) {
      setMsg({
        ok: false,
        txt: "Ce produit est un exemple intégré au site, pas un enregistrement Supabase. Exécutez supabase/shop.sql puis ajoutez vos produits ici, ou supprimez-les côté public en vidant la table.",
      })
      return
    }

    const { data, error } = await supabase
      .from('shop_products')
      .delete()
      .eq('id', product.id)
      .select('id')

    if (error) {
      setMsg({ ok: false, txt: `Erreur suppression : ${error.message}` })
      return
    }

    if (!data?.length) {
      setMsg({
        ok: false,
        txt: 'Aucune ligne supprimée (droits RLS ou produit déjà supprimé). Vérifiez que shop.sql est appliqué et que vous êtes connecté en admin.',
      })
      return
    }

    setProducts(prev => prev.filter(p => p.id !== product.id))
    if (form.id === product.id) resetForm()
    setMsg({ ok: true, txt: '✅ Produit supprimé' })
    setTimeout(() => setMsg(null), 3000)
  }

  const saveSettingsClick = async () => {
    setSettingsMsg({ ok: true, txt: 'Enregistrement…' })
    try {
      await saveShopSettings(settings)
      setSettingsMsg({ ok: true, txt: '✅ Réglages enregistrés' })
      setTimeout(() => setSettingsMsg(null), 3000)
    } catch (e) {
      setSettingsMsg({ ok: false, txt: e.message })
    }
  }

  const saveBannersClick = async () => {
    setSettingsMsg({ ok: true, txt: 'Enregistrement bannières…' })
    try {
      await saveShopSettings({ banners: settings.banners })
      setSettingsMsg({ ok: true, txt: '✅ Bannières enregistrées' })
      setTimeout(() => setSettingsMsg(null), 3000)
    } catch (e) {
      setSettingsMsg({ ok: false, txt: e.message })
    }
  }

  const updateBanner = (idx, patch) => {
    setSettings(s => {
      const banners = normalizeShopBanners(s.banners)
      banners[idx] = { ...banners[idx], ...patch }
      return { ...s, banners }
    })
  }

  const onBannerImage = async (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerUploading(idx)
    setSettingsMsg({ ok: true, txt: '⏳ Upload bannière…' })
    try {
      const url = await uploadProductImage(file)
      updateBanner(idx, { image: url })
      setSettingsMsg({ ok: true, txt: '✅ Image uploadée — cliquez Enregistrer' })
    } catch (err) {
      setSettingsMsg({ ok: false, txt: err.message })
    }
    setBannerUploading(null)
    if (bannerRefs.current[idx]) bannerRefs.current[idx].value = ''
  }

  const categoriesForSection = SHOP_CATEGORIES.filter(c => c.section === form.section)

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        <button type="button" onClick={() => setSubTab('products')} style={{
          padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700,
          background: subTab === 'products' ? 'rgba(0,207,255,0.2)' : 'rgba(0,207,255,0.06)',
          color: subTab === 'products' ? 'var(--c)' : 'var(--dim)',
        }}>Produits</button>
        <button type="button" onClick={() => setSubTab('settings')} style={{
          padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700,
          background: subTab === 'settings' ? 'rgba(0,207,255,0.2)' : 'rgba(0,207,255,0.06)',
          color: subTab === 'settings' ? 'var(--c)' : 'var(--dim)',
        }}>SumUp & livraison</button>
        <button type="button" onClick={() => setSubTab('orders')} style={{
          padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700,
          background: subTab === 'orders' ? 'rgba(0,207,255,0.2)' : 'rgba(0,207,255,0.06)',
          color: subTab === 'orders' ? 'var(--c)' : 'var(--dim)',
        }}>Commandes</button>
        <button type="button" onClick={() => setSubTab('banners')} style={{
          padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700,
          background: subTab === 'banners' ? 'rgba(0,207,255,0.2)' : 'rgba(0,207,255,0.06)',
          color: subTab === 'banners' ? 'var(--c)' : 'var(--dim)',
        }}>Bannières</button>
      </div>

      {subTab === 'banners' && (
        <div className="admin-dash-card" style={{ ...card, maxWidth: 720 }}>
          <h3 style={{ color:'#fff', marginBottom:8, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
            Bannières page boutique
          </h3>
          <p style={{ color:'var(--dim)', fontSize:'.82rem', lineHeight:1.6, marginBottom:20 }}>
            Jusqu’à {SHOP_BANNER_SLOTS} images larges — format recommandé <strong>1200 × 400 px</strong> (ratio 3:1) pour un remplissage parfait. Défilement automatique sur le site.
          </p>
          <Msg msg={settingsMsg} />
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {normalizeShopBanners(settings.banners).map((banner, idx) => (
              <div key={idx} style={{
                padding:16, borderRadius:14,
                border:'1px solid rgba(0,207,255,0.15)',
                background:'rgba(0,207,255,0.03)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <strong style={{ color:'var(--c)', fontSize:'.85rem' }}>Bannière {idx + 1}</strong>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.85rem' }}>
                    <input
                      type="checkbox"
                      checked={banner.enabled !== false}
                      onChange={e => updateBanner(idx, { enabled: e.target.checked })}
                    />
                    Visible
                  </label>
                </div>
                {banner.image && (
                  <div style={{ marginBottom:12, borderRadius:10, overflow:'hidden', maxHeight:140, background:'#071120' }}>
                    <img src={banner.image} alt="" style={{ width:'100%', height:140, objectFit:'cover' }} />
                  </div>
                )}
                <div style={{ marginBottom:10 }}>
                  <label style={lbl}>Image (.jpg .png .webp)</label>
                  <input
                    ref={el => { bannerRefs.current[idx] = el }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ ...inp, padding:'9px 12px' }}
                    disabled={bannerUploading === idx}
                    onChange={e => onBannerImage(idx, e)}
                  />
                </div>
                <div style={{ marginBottom:10 }}>
                  <label style={lbl}>Lien au clic (optionnel)</label>
                  <input
                    style={inp}
                    value={banner.link}
                    onChange={e => updateBanner(idx, { link: e.target.value })}
                    placeholder="/boutique/neuf/accessoires-telephonie ou https://…"
                  />
                </div>
                <div>
                  <label style={lbl}>Texte alternatif (accessibilité)</label>
                  <input
                    style={inp}
                    value={banner.alt}
                    onChange={e => updateBanner(idx, { alt: e.target.value })}
                    placeholder={`Promotion ${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" style={{ ...btnP, marginTop:20 }} onClick={saveBannersClick}>
            Enregistrer les bannières
          </button>
        </div>
      )}

      {subTab === 'settings' && (
        <div className="admin-dash-card" style={{ ...card, maxWidth: 560 }}>
          <h3 style={{ color:'#fff', marginBottom:20, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>Réglages boutique</h3>
          <Msg msg={settingsMsg} />
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Code marchand SumUp</label>
            <input style={inp} value={settings.sumupMerchantCode} onChange={e => setSettings(s => ({ ...s, sumupMerchantCode: e.target.value }))} placeholder="MH4H92C7" />
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer' }}>
            <input type="checkbox" checked={settings.sumupEnabled} onChange={e => setSettings(s => ({ ...s, sumupEnabled: e.target.checked }))} />
            <span style={{ color:'var(--tx)', fontSize:'.9rem' }}>Activer le paiement SumUp sur le site</span>
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, cursor:'pointer' }}>
            <input type="checkbox" checked={settings.shopEnabled} onChange={e => setSettings(s => ({ ...s, shopEnabled: e.target.checked }))} />
            <span style={{ color:'var(--tx)', fontSize:'.9rem' }}>Boutique visible</span>
          </label>

          <h4 style={{ color:'#fff', margin:'24px 0 14px', fontFamily:"'Orbitron',sans-serif", fontSize:'.9rem' }}>Livraison</h4>
          <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer' }}>
            <input type="checkbox" checked={settings.pickupEnabled !== false} onChange={e => setSettings(s => ({ ...s, pickupEnabled: e.target.checked }))} />
            <span style={{ color:'var(--tx)', fontSize:'.9rem' }}>Proposer le retrait sur place (gratuit)</span>
          </label>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Frais Mondial Relay (€)</label>
            <input style={inp} type="number" min="0" step="0.01" value={settings.mondialRelayFee ?? 0.5} onChange={e => setSettings(s => ({ ...s, mondialRelayFee: e.target.value }))} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={lbl}>Code client Mondial Relay (8 car.)</label>
            <input style={inp} value={settings.mondialRelayBrand || ''} onChange={e => setSettings(s => ({ ...s, mondialRelayBrand: e.target.value }))} placeholder="BDTEST  (test) ou votre code MR" />
            <p style={{ color:'var(--dim)', fontSize:'.72rem', marginTop:6, lineHeight:1.5 }}>
              Fourni par Mondial Relay pour le widget point relais. Sans code, le client pourra saisir le relais manuellement.
            </p>
          </div>

          <p style={{ color:'var(--dim)', fontSize:'.78rem', lineHeight:1.6, marginBottom:16 }}>
            Clés serveur Vercel : <code>SUMUP_API_KEY</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>FORMSPREE_ID</code> (email commande).
          </p>
          <button type="button" style={btnP} onClick={saveSettingsClick}>Enregistrer</button>
        </div>
      )}

      {subTab === 'orders' && (
        <div className="admin-dash-card" style={card}>
          <Msg msg={msg} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
            <h3 style={{ color:'#fff', margin:0, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>Commandes payées</h3>
            <button type="button" onClick={loadOrders} style={{ background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:'.78rem' }}>🔄 Actualiser</button>
          </div>
          {ordersLoad ? (
            <div style={{ color:'var(--dim)', padding:40, textAlign:'center' }}>Chargement…</div>
          ) : orders.length === 0 ? (
            <div style={{ color:'var(--dim)', padding:24, lineHeight:1.7, fontSize:'.88rem' }}>
              Aucune commande enregistrée. Exécutez <code>supabase/shop-orders-shipping.sql</code> puis <code>shop-order-cancel.sql</code> si besoin.
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {orders.map(o => {
                const c = o.customer || {}
                const s = o.shipping || {}
                const a = o.amounts || {}
                const items = o.items_detail || o.items || []
                const isCancelled = o.status === 'cancelled'
                const needsStockRestore = isCancelled && !o.stock_restored
                return (
                  <div key={o.checkout_reference} style={{
                    background: isCancelled ? 'rgba(255,80,80,0.06)' : 'rgba(5,14,28,0.7)',
                    border: isCancelled ? '1px solid rgba(255,80,80,0.25)' : '1px solid rgba(0,207,255,0.12)',
                    borderRadius:14, padding:16, opacity: isCancelled ? 0.85 : 1,
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:10, alignItems:'flex-start' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                        <strong style={{ color: isCancelled ? '#ff8a8a' : 'var(--c)', fontSize:'.85rem' }}>{o.checkout_reference}</strong>
                        {isCancelled && (
                          <span style={{
                            fontSize:'.68rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase',
                            padding:'3px 8px', borderRadius:6, background:'rgba(255,80,80,0.15)', color:'#ff8a8a',
                            border:'1px solid rgba(255,80,80,0.35)',
                          }}>Annulée</span>
                        )}
                      </div>
                      <span style={{ color:'var(--dim)', fontSize:'.75rem' }}>
                        {new Date(o.created_at).toLocaleString('fr-FR')}
                        {isCancelled && o.cancelled_at && (
                          <> · annulée le {new Date(o.cancelled_at).toLocaleString('fr-FR')}</>
                        )}
                      </span>
                    </div>
                    <div style={{ color:'#fff', fontSize:'.88rem', marginBottom:8 }}>
                      {c.name || '—'} · {c.email || '—'} · {c.phone || '—'}
                    </div>
                    {(c.address || c.postCode || c.city) && (
                      <div style={{ color:'var(--dim)', fontSize:'.8rem', marginBottom:8, lineHeight:1.5 }}>
                        📍 {c.address || '—'}
                        {(c.postCode || c.city) && (
                          <span> — {[c.postCode, c.city].filter(Boolean).join(' ')}</span>
                        )}
                      </div>
                    )}
                    <div style={{ color:'var(--dim)', fontSize:'.8rem', marginBottom:8, lineHeight:1.6 }}>
                      {s.mode === 'mondial_relay' ? (
                        <>
                          📦 Mondial Relay
                          {s.relay?.name && ` — ${s.relay.name}`}
                          {s.relay?.address && `, ${s.relay.address}`}
                          {s.relayManual && ` (manuel: ${s.relayManual})`}
                          {a.shippingFee != null && ` · port ${formatPrice(a.shippingFee)}`}
                        </>
                      ) : (
                        <>🏪 Retrait sur place{a.shippingFee ? ` · port ${formatPrice(a.shippingFee)}` : ''}</>
                      )}
                    </div>
                    <div style={{ color:'var(--dim)', fontSize:'.78rem', lineHeight:1.5 }}>
                      {items.map((it, i) => (
                        <span key={i}>{it.qty}× {it.title || it.productId}{i < items.length - 1 ? ' · ' : ''}</span>
                      ))}
                      {a.total != null && (
                        <span style={{ display:'block', marginTop:6, color: isCancelled ? '#ff8a8a' : 'var(--g)', fontWeight:600 }}>
                          Total {formatPrice(a.total)}
                          {!isCancelled && (o.notification_sent ? ' · email envoyé' : ' · email non confirmé')}
                        </span>
                      )}
                    </div>
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(o)}
                        disabled={cancellingRef === o.checkout_reference}
                        style={{
                          marginTop:12, padding:'8px 14px', borderRadius:8, cursor:'pointer', fontSize:'.78rem', fontWeight:600,
                          background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.35)', color:'#ff8a8a',
                          opacity: cancellingRef === o.checkout_reference ? 0.6 : 1,
                        }}
                      >
                        {cancellingRef === o.checkout_reference ? 'Annulation…' : 'Annuler la commande'}
                      </button>
                    )}
                    {needsStockRestore && (
                      <button
                        type="button"
                        onClick={() => restoreStock(o)}
                        disabled={restoringRef === o.checkout_reference}
                        style={{
                          marginTop:12, padding:'8px 14px', borderRadius:8, cursor:'pointer', fontSize:'.78rem', fontWeight:600,
                          background:'rgba(43,255,154,0.1)', border:'1px solid rgba(43,255,154,0.35)', color:'var(--g)',
                          opacity: restoringRef === o.checkout_reference ? 0.6 : 1,
                        }}
                      >
                        {restoringRef === o.checkout_reference ? 'Remise en stock…' : 'Remettre le stock (+1)'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {subTab === 'products' && (
        <div className="admin-dash-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:24, alignItems:'start' }}>
          <div className="admin-dash-card" style={card}>
            <h3 style={{ color:'#fff', marginBottom:8, fontFamily:"'Orbitron',sans-serif", fontSize:'1rem' }}>
              {form.id ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
            </h3>
            {form.id && (
              <button type="button" onClick={resetForm} style={{ background:'none', border:'none', color:'var(--c)', cursor:'pointer', fontSize:'.8rem', marginBottom:16 }}>
                + Créer un autre produit
              </button>
            )}

            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Titre *</label>
              <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Référence (slug)</label>
              <input style={inp} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Laisser vide = généré depuis le titre" />
              <p style={{ color:'var(--dim)', fontSize:'.72rem', marginTop:6 }}>
                Identifiant unique. Si déjà utilisé, un suffixe (-2, -3…) est ajouté automatiquement.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div>
                <label style={lbl}>Section</label>
                <select style={{ ...inp, cursor:'pointer' }} value={form.section} onChange={e => {
                  const section = e.target.value
                  const firstCat = SHOP_CATEGORIES.find(c => c.section === section)?.id || ''
                  setForm(f => ({ ...f, section, categoryId: firstCat }))
                }}>
                  <option value="neuf">Neuf</option>
                  <option value="occasion">Occasion</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Catégorie</label>
                <select style={{ ...inp, cursor:'pointer' }} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  {categoriesForSection.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div>
                <label style={lbl}>Prix (€)</label>
                <input style={inp} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Vide = sur devis" />
              </div>
              <div>
                <label style={lbl}>Stock</label>
                <input style={inp} type="number" min="0" step="1" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="1 = 1 seul exemplaire" />
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Disponibilité</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}>
                {AVAILABILITY.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <p style={{ color:'var(--dim)', fontSize:'.72rem', marginTop:6 }}>
                Stock à 1 : après paiement SumUp, l’article passe en « Vendu » (masqué du site, visible en admin).
              </p>
            </div>
            {form.section === 'occasion' && (
              <div style={{ marginBottom:12 }}>
                <label style={lbl}>État</label>
                <input style={inp} value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} placeholder="Très bon état" />
              </div>
            )}
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Points clés (1 par ligne)</label>
              <textarea style={{ ...inp, minHeight:80, resize:'vertical' }} value={form.highlightsText} onChange={e => setForm(f => ({ ...f, highlightsText: e.target.value }))} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Photo (.jpg .png .webp)</label>
              <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onImagePick} style={{ ...inp, padding:'9px 12px' }} disabled={uploading} />
              {form.image && (
                <div style={{ marginTop:10, borderRadius:10, overflow:'hidden', height:120 }}>
                  <img src={form.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:16, marginBottom:16, flexWrap:'wrap' }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                <span style={{ fontSize:'.85rem' }}>Publié</span>
              </label>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <label style={{ ...lbl, marginBottom:0 }}>Ordre</label>
                <input style={{ ...inp, width:70 }} type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
              </div>
            </div>
            <Msg msg={msg} />
            <button type="button" style={{ ...btnP, width:'100%', opacity: uploading ? .6 : 1 }} onClick={saveProduct} disabled={uploading}>
              {form.id ? 'Mettre à jour' : 'Ajouter le produit'} →
            </button>
            <p style={{ color:'#FFB800', fontSize:'.7rem', marginTop:10, textAlign:'center' }}>
              Bucket Storage Supabase : <strong>{SHOP_BUCKET}</strong> (public)
            </p>
          </div>

          <div>
            <div style={{ color:'var(--dim)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:10 }}>
              Produits ({products.length})
              <button type="button" onClick={loadAll} style={{ background:'rgba(0,207,255,0.08)', border:'1px solid rgba(0,207,255,0.2)', color:'var(--c)', padding:'4px 12px', borderRadius:6, cursor:'pointer', fontSize:'.72rem' }}>🔄</button>
            </div>
            {load ? <div style={{ color:'var(--dim)', padding:40, textAlign:'center' }}>Chargement…</div> : products.length === 0 ? (
              <div style={{ color:'var(--dim)', padding:40, textAlign:'center', lineHeight:1.7 }}>
                <p>Aucun produit en base Supabase.</p>
                <p style={{ marginTop:10, fontSize:'.85rem' }}>
                  1. Exécutez <code>supabase/shop.sql</code> dans le SQL Editor<br />
                  2. Créez le bucket Storage <strong>vente</strong> (public)<br />
                  3. Ajoutez un produit avec le formulaire à gauche
                </p>
                <p style={{ marginTop:12, fontSize:'.78rem', color:'rgba(255,184,0,0.9)' }}>
                  Les 3 exemples visibles sur le site disparaîtront dès que vous ajoutez au moins un vrai produit.
                </p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {products.map(p => (
                  <div key={p.id} style={{
                    background: p.availability === 'vendu' ? 'rgba(255,80,80,0.06)' : 'rgba(5,14,28,0.7)',
                    border: p.availability === 'vendu' ? '1px solid rgba(255,80,80,0.2)' : '1px solid rgba(0,207,255,0.1)',
                    borderRadius:14, padding:12, display:'flex', gap:12, alignItems:'center',
                    opacity: p.availability === 'vendu' ? 0.85 : 1,
                  }}>
                    <div style={{ width:56, height:56, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#071120' }}>
                      {p.image ? <img src={p.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>📦</div>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:'#fff', fontWeight:600, fontSize:'.88rem' }}>{p.title}</div>
                      <div style={{ color:'var(--dim)', fontSize:'.72rem' }}>
                        {p.section} · {p.categoryId}
                        {p.availability === 'vendu' && ' · vendu'}
                        {p.stock != null && p.availability !== 'vendu' ? ` · stock ${p.stock}` : ''}
                        {p.stock == null && p.availability !== 'vendu' ? ' · stock illimité' : ''}
                        {!p.published && p.availability !== 'vendu' && ' · masqué'}
                      </div>
                    </div>
                    <button type="button" style={{ ...btnP, padding:'8px 14px', fontSize:'.72rem' }} onClick={() => editProduct(p)}>Modifier</button>
                    <button type="button" style={btnD} onClick={() => deleteProduct(p)} title="Supprimer">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
