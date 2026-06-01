import { supabase, isSupabaseConfigured } from './supabase.js'
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  getShopCategories,
  getCategoryById,
} from '../data/shopCatalog.js'

export const SHOP_BUCKET = 'vente'

export { SHOP_CATEGORIES, getShopCategories, getCategoryById }

/** Normalise une ligne Supabase → format front */
export function mapProductRow(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    section: row.section,
    categoryId: row.category_id,
    price: row.price != null ? Number(row.price) : null,
    condition: row.condition || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    availability: row.availability || 'en_stock',
    image: row.image_url || '',
    published: row.published !== false,
    sortOrder: row.sort_order ?? 0,
    stock: row.stock != null ? Number(row.stock) : null,
  }
}

export function mapProductToRow(p) {
  return {
    slug: p.slug?.trim() || null,
    title: p.title?.trim(),
    section: p.section,
    category_id: p.categoryId,
    price: p.price === '' || p.price == null ? null : Number(p.price),
    condition: p.condition?.trim() || '',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    availability: p.availability || 'en_stock',
    image_url: p.image || '',
    published: p.published !== false,
    sort_order: Number(p.sortOrder) || 0,
    stock: p.stock === '' || p.stock == null ? null : Math.max(0, Math.floor(Number(p.stock))),
  }
}

function mapStaticProduct(p) {
  return {
    id: p.id,
    slug: p.id,
    title: p.title,
    section: p.section,
    categoryId: p.categoryId,
    price: p.price != null ? Number(p.price) : null,
    condition: p.condition || '',
    highlights: p.highlights || [],
    availability: p.availability || 'en_stock',
    image: p.image || '',
    published: true,
    sortOrder: 0,
    isDemo: true,
  }
}

/** UUID Supabase — les produits démo (oc-pc-001…) ne sont pas en base */
export function isDbProductId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id || ''))
}

/**
 * @param {object} opts
 * @param {boolean} opts.includeUnpublished — admin : voir aussi les masqués
 * @param {boolean} opts.allowStaticFallback — site public : exemples si table vide
 */
export async function fetchShopProducts({ includeUnpublished = false, allowStaticFallback = true } = {}) {
  if (!isSupabaseConfigured) {
    if (allowStaticFallback && !includeUnpublished) {
      return SHOP_PRODUCTS.map(mapStaticProduct)
    }
    return []
  }

  let query = supabase
    .from('shop_products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!includeUnpublished) {
    query = query.eq('published', true)
    query = query.neq('availability', 'vendu')
    query = query.or('stock.is.null,stock.gt.0')
  }

  const { data, error } = await query
  if (error) throw error

  if (!data?.length) {
    // Exemples uniquement en local sans Supabase — pas sur le site en prod
    if (allowStaticFallback && !includeUnpublished && !isSupabaseConfigured) {
      return SHOP_PRODUCTS.map(mapStaticProduct)
    }
    return []
  }

  return data.map(mapProductRow)
}

export async function fetchShopSettings() {
  const defaults = {
    sumupMerchantCode: '',
    sumupEnabled: false,
    shopEnabled: true,
    mondialRelayFee: 0.5,
    mondialRelayBrand: '',
    pickupEnabled: true,
  }
  if (!isSupabaseConfigured) return defaults

  const { data, error } = await supabase.from('shop_settings').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return defaults

  return {
    sumupMerchantCode: data.sumup_merchant_code || '',
    sumupEnabled: !!data.sumup_enabled,
    shopEnabled: data.shop_enabled !== false,
    mondialRelayFee: data.mondial_relay_fee != null ? Number(data.mondial_relay_fee) : 0.5,
    mondialRelayBrand: data.mondial_relay_brand || '',
    pickupEnabled: data.pickup_enabled !== false,
  }
}

export async function saveShopSettings(patch) {
  const row = {
    id: 1,
    sumup_merchant_code: patch.sumupMerchantCode?.trim() || '',
    sumup_enabled: !!patch.sumupEnabled,
    shop_enabled: patch.shopEnabled !== false,
    mondial_relay_fee: patch.mondialRelayFee != null ? Number(patch.mondialRelayFee) : 0.5,
    mondial_relay_brand: patch.mondialRelayBrand?.trim() || '',
    pickup_enabled: patch.pickupEnabled !== false,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('shop_settings').upsert(row)
  if (error) throw error
}

export async function fetchShopOrders(limit = 50) {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('shop_order_fulfillments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(SHOP_BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(SHOP_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** null = stock illimité (pas de suivi) */
export function getProductStock(product) {
  if (!product || product.stock == null) return null
  const n = Number(product.stock)
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
}

export function canAddToCart(product) {
  if (!product) return false
  if (product.availability === 'vendu') return false
  if (product.availability === 'sur_devis') return false
  if (product.price == null || Number.isNaN(product.price)) return false
  const stock = getProductStock(product)
  if (stock !== null && stock < 1) return false
  return true
}

export function formatPrice(price) {
  if (price === null || price === undefined) return 'Sur devis'
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
  } catch {
    return `${price} €`
  }
}

export function availabilityLabel(a) {
  if (a === 'vendu') return 'Vendu'
  if (a === 'sur_devis') return 'Sur devis'
  if (a === 'sur_commande') return 'Sur commande'
  return 'En stock'
}
