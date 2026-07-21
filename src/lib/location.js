import { supabase, isSupabaseConfigured } from './supabase.js'
import {
  LOCATION_CATEGORIES,
  LOCATION_ITEMS,
  formatLocationPrice,
  locationAvailabilityLabel,
} from '../data/locationCatalog.js'
import { SHOP_BUCKET } from './shop.js'

export {
  LOCATION_CATEGORIES,
  formatLocationPrice,
  locationAvailabilityLabel,
}

export function mapLocationRow(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    categoryId: row.category_id,
    priceDay: row.price_day != null ? Number(row.price_day) : null,
    priceWeek: row.price_week != null ? Number(row.price_week) : null,
    condition: row.condition || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    availability: row.availability || 'dispo',
    image: row.image_url || '',
    published: row.published !== false,
    sortOrder: row.sort_order ?? 0,
  }
}

export function mapLocationToRow(item) {
  return {
    title: item.title?.trim(),
    category_id: item.categoryId,
    price_day: item.priceDay === '' || item.priceDay == null ? null : Number(item.priceDay),
    price_week: item.priceWeek === '' || item.priceWeek == null ? null : Number(item.priceWeek),
    condition: item.condition?.trim() || '',
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    availability: item.availability || 'dispo',
    image_url: item.image || '',
    published: item.published !== false,
    sort_order: Number(item.sortOrder) || 0,
  }
}

function mapStaticItem(item) {
  return {
    id: item.id,
    title: item.title,
    categoryId: item.categoryId,
    priceDay: item.priceDay != null ? Number(item.priceDay) : null,
    priceWeek: item.priceWeek != null ? Number(item.priceWeek) : null,
    condition: item.condition || '',
    highlights: item.highlights || [],
    availability: item.availability || 'dispo',
    image: item.image || '',
    published: true,
    sortOrder: 0,
  }
}

export function isDbLocationId(id) {
  return typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id)
}

export function formatLocationDbError(message) {
  const msg = String(message || '')
  if (msg.includes('relation') && msg.includes('location_items')) {
    return 'Table location_items introuvable. Exécute supabase/location.sql dans le SQL Editor Supabase.'
  }
  return msg
}

/**
 * Lit le catalogue Location.
 * Avec Supabase : uniquement les lignes en base (liste vide = page vide).
 * Sans Supabase (local) : fallback éventuel sur LOCATION_ITEMS (actuellement vide).
 */
export async function fetchLocationItems({
  includeUnpublished = false,
  allowStaticFallback = false,
} = {}) {
  if (!isSupabaseConfigured) {
    if (allowStaticFallback && !includeUnpublished) {
      return LOCATION_ITEMS.map(mapStaticItem)
    }
    return []
  }

  let query = supabase
    .from('location_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!includeUnpublished) {
    query = query.eq('published', true)
    query = query.neq('availability', 'indispo')
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []).map(mapLocationRow)
}

export async function uploadLocationImage(file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `location/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(SHOP_BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(SHOP_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function filterLocationItems(items, categoryId = 'all') {
  if (!categoryId || categoryId === 'all') return items
  return items.filter(i => i.categoryId === categoryId)
}
