/**
 * Après paiement SumUp : vérifie le checkout et met à jour le stock Supabase.
 * Variables Vercel : SUMUP_API_KEY, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL (ou SUPABASE_URL)
 */
import { createClient } from '@supabase/supabase-js'
import { notifyOrderByEmail } from './notify-order.js'

function getSupabaseAdmin() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY et SUPABASE_URL (ou VITE_SUPABASE_URL) requis sur Vercel.',
    )
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

function isPaidStatus(data) {
  if (!data) return false
  const status = String(data.status || '').toUpperCase()
  if (['PAID', 'SUCCESSFUL', 'SUCCESS', 'COMPLETED'].includes(status)) return true
  const txs = data.transactions || data.transaction || []
  const list = Array.isArray(txs) ? txs : [txs]
  return list.some(t => {
    const s = String(t?.status || '').toUpperCase()
    return ['SUCCESSFUL', 'PAID', 'SUCCESS'].includes(s)
  })
}

async function fetchCheckout(apiKey, checkoutId, checkoutReference) {
  if (checkoutId) {
    const res = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) return data
  }

  if (checkoutReference) {
    const res = await fetch(
      `https://api.sumup.com/v0.1/checkouts?checkout_reference=${encodeURIComponent(checkoutReference)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      if (Array.isArray(data)) return data[0]
      if (Array.isArray(data?.items)) return data.items[0]
      return data
    }
  }

  return null
}

async function fulfillStock(supabase, items) {
  const sold = []
  const updated = []

  for (const line of items) {
    const productId = line?.productId
    const qty = Math.max(1, Math.floor(Number(line?.qty) || 1))
    if (!productId) continue

    const { data: product, error } = await supabase
      .from('shop_products')
      .select('id, title, stock')
      .eq('id', productId)
      .maybeSingle()

    if (error) throw error
    if (!product) continue

    if (product.stock == null) continue

    const newStock = Number(product.stock) - qty

    if (newStock <= 0) {
      const { error: soldErr } = await supabase
        .from('shop_products')
        .update({
          stock: 0,
          availability: 'vendu',
          published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
      if (soldErr) throw soldErr
      sold.push({ id: productId, title: product.title })
    } else {
      const { error: upErr } = await supabase
        .from('shop_products')
        .update({
          stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
      if (upErr) throw upErr
      updated.push({ id: productId, title: product.title, stock: newStock })
    }
  }

  return { sold, updated }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.SUMUP_API_KEY?.trim()
  if (!apiKey) {
    return res.status(503).json({ error: 'SumUp non configuré' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Corps JSON invalide' })
  }

  const checkoutReference = String(body.checkout_reference || '').trim()
  const checkoutId = String(body.checkout_id || body.checkoutId || '').trim()
  const items = Array.isArray(body.items) ? body.items : []
  const customer = body.customer && typeof body.customer === 'object' ? body.customer : null
  const shipping = body.shipping && typeof body.shipping === 'object' ? body.shipping : null
  const amounts = body.amounts && typeof body.amounts === 'object' ? body.amounts : null
  const itemsDetail = Array.isArray(body.items_detail) ? body.items_detail : items

  if (!checkoutReference || !checkoutId || items.length === 0) {
    return res.status(400).json({ error: 'Commande incomplète (ref, id, articles)' })
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: existing } = await supabase
      .from('shop_order_fulfillments')
      .select('checkout_reference')
      .eq('checkout_reference', checkoutReference)
      .maybeSingle()

    if (existing) {
      return res.status(200).json({ ok: true, alreadyFulfilled: true })
    }

    const checkout = await fetchCheckout(apiKey, checkoutId, checkoutReference)
    if (!checkout || !isPaidStatus(checkout)) {
      return res.status(402).json({
        error: 'Paiement non confirmé',
        status: checkout?.status || 'unknown',
      })
    }

    const stockResult = await fulfillStock(supabase, items)

    let notificationSent = false
    try {
      const notifyRes = await notifyOrderByEmail({
        checkoutReference,
        checkoutId,
        customer,
        shipping,
        amounts,
        itemsDetail,
        items,
      })
      notificationSent = !!notifyRes.ok
    } catch (mailErr) {
      console.error('Email commande:', mailErr?.message || mailErr)
    }

    const { error: logErr } = await supabase.from('shop_order_fulfillments').insert({
      checkout_reference: checkoutReference,
      checkout_id: checkoutId,
      items,
      customer,
      shipping,
      amounts,
      items_detail: itemsDetail,
      notification_sent: notificationSent,
    })
    if (logErr) throw logErr

    return res.status(200).json({
      ok: true,
      sold: stockResult.sold,
      updated: stockResult.updated,
      notificationSent,
    })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Erreur serveur' })
  }
}
