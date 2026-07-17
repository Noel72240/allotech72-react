import { supabase } from './supabase.js'
import { WEB_CLIENTS } from '../data/clients.js'

export const CLIENTS_IMAGE_BUCKET = 'clients'

export function mapWebClientRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name || '',
    logo: row.logo_url || row.logo || '',
    url: row.url || '',
    sector: row.sector || '',
    sortOrder: row.sort_order ?? 0,
    published: row.published !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function slugifyClient(name) {
  return String(name || 'client')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'client'
}

export async function uploadClientLogo(file, nameHint = 'client') {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const path = `${slugifyClient(nameHint)}_${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(CLIENTS_IMAGE_BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(CLIENTS_IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Admin : tous les clients */
export async function fetchWebClientsAdmin() {
  const { data, error } = await supabase
    .from('web_clients')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapWebClientRow)
}

/** Public : clients publiés + fallback static */
export async function fetchWebClientsPublic() {
  try {
    const { data, error } = await supabase
      .from('web_clients')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw error
    const rows = (data || []).map(mapWebClientRow).filter((c) => c.name)
    if (rows.length) return rows
  } catch {
    // table absente / offline → fallback
  }
  return (WEB_CLIENTS || []).filter((c) => c?.name).map((c) => ({
    id: c.name,
    name: c.name,
    logo: c.logo || '',
    url: c.url || '',
    sector: c.sector || '',
    sortOrder: 0,
    published: true,
  }))
}
