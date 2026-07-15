import { isSupabaseConfigured } from './supabase.js'
import { ADAM_SESSION_KEY } from '../config/adam.js'

/** Client Adam — interface unique front ↔ Edge Function (aucune logique agent) */

function resolveSupabaseUrl() {
  const raw =
    import.meta.env.VITE_SUPABASE_URL?.trim() ||
    import.meta.env.URL_SUPABASE_VITE?.trim()
  if (!raw) return ''
  return raw.replace(/\.supabase\.com(\/?|$)/i, '.supabase.co$1')
}

function getAnonKey() {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''
}

function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(ADAM_SESSION_KEY)
    if (!id) {
      id = generateSessionId()
      localStorage.setItem(ADAM_SESSION_KEY, id)
    }
    return id
  } catch {
    return generateSessionId()
  }
}

export function resetSessionId() {
  try {
    const id = generateSessionId()
    localStorage.setItem(ADAM_SESSION_KEY, id)
    return id
  } catch {
    return generateSessionId()
  }
}

export function isAdamAvailable() {
  return isSupabaseConfigured
}

async function invokeAdam(body) {
  const supabaseUrl = resolveSupabaseUrl()
  const anonKey = getAnonKey()
  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase non configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
  }

  const url = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/adam`

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(
      'Impossible de joindre Adam. Vérifiez que l’Edge Function « adam » est déployée sur le même projet Supabase que le site.',
    )
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const detail = data?.error || data?.message || `HTTP ${res.status}`
    throw new Error(detail)
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}

/**
 * @param {{ text: string, pageContext?: object }} params
 */
export async function sendMessage({ text, pageContext = {} }) {
  if (!isSupabaseConfigured) {
    throw new Error('Adam n\'est pas disponible (Supabase non configuré).')
  }

  const sessionToken = getOrCreateSessionId()
  return invokeAdam({
    action: 'chat',
    sessionToken,
    message: text.trim(),
    channel: 'web',
    pageContext: {
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...pageContext,
    },
  })
}

/** Recharge l'historique persistant depuis Supabase */
export async function loadConversation() {
  if (!isSupabaseConfigured) return { messages: [] }

  try {
    const sessionToken = getOrCreateSessionId()
    const data = await invokeAdam({ action: 'history', sessionToken, channel: 'web' })
    return { messages: data.messages || [] }
  } catch {
    return { messages: [] }
  }
}
