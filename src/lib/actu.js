import { slugifyProductRef } from './shop.js'
import { supabase } from './supabase.js'

export const ACTU_MIN_CHARS = 500
export const ACTU_MAX_CHARS = 1000
export const ACTU_IMAGE_BUCKET = 'actu'

export function slugifyActu(title) {
  return slugifyProductRef(title) || 'actualite'
}

export function resolveUniqueActuSlug({ slug, title, actuId, posts }) {
  const base = slug?.trim() || slugifyActu(title) || 'actualite'
  const taken = new Set(
    (posts || [])
      .filter(p => p.id !== actuId)
      .map(p => (p.slug || '').trim())
  )
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export function mapActuRow(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title || '',
    excerpt: row.excerpt || '',
    body: row.body || '',
    imageUrl: row.image_url || '',
    published: row.published !== false,
    publishedAt: row.published_at || row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function buildActuExcerpt(body, max = 180) {
  const text = String(body || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}

export function formatActuDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function actuReadingMinutes(body) {
  const words = String(body || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function actuCharStatus(len) {
  if (len < ACTU_MIN_CHARS) return { ok: false, label: `${len} / ${ACTU_MIN_CHARS} min.`, color: '#FFB800' }
  if (len > ACTU_MAX_CHARS) return { ok: false, label: `${len} / ${ACTU_MAX_CHARS} max.`, color: '#ff6b6b' }
  return { ok: true, label: `${len} caractères — idéal SEO`, color: 'var(--g)' }
}

export async function uploadActuImage(file, slugHint = 'actu') {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const safe = slugifyActu(slugHint) || 'actu'
  const path = `${safe}_${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(ACTU_IMAGE_BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(ACTU_IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
