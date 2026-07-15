import { supabase, isSupabaseConfigured } from './supabase.js'
import { ADAM_SESSION_KEY } from '../config/adam.js'

/** Client Adam — interface unique front ↔ Edge Function (aucune logique agent) */

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

/**
 * @param {{ text: string, pageContext?: object }} params
 * @returns {Promise<{ reply: string, suggestedActions?: Array, diagnostic?: object, conversationId?: string }>}
 */
export async function sendMessage({ text, pageContext = {} }) {
  if (!isSupabaseConfigured) {
    throw new Error('Adam n\'est pas disponible (Supabase non configuré).')
  }

  const sessionToken = getOrCreateSessionId()
  const { data, error } = await supabase.functions.invoke('adam', {
    body: {
      action: 'chat',
      sessionToken,
      message: text.trim(),
      channel: 'web',
      pageContext: {
        path: typeof window !== 'undefined' ? window.location.pathname : '/',
        ...pageContext,
      },
    },
  })

  if (error) {
    throw new Error(error.message || 'Erreur de communication avec Adam.')
  }
  if (data?.error) {
    throw new Error(data.error)
  }
  return data
}

/** Recharge l'historique persistant depuis Supabase */
export async function loadConversation() {
  if (!isSupabaseConfigured) return { messages: [] }

  const sessionToken = getOrCreateSessionId()
  const { data, error } = await supabase.functions.invoke('adam', {
    body: { action: 'history', sessionToken, channel: 'web' },
  })

  if (error || data?.error) return { messages: [] }
  return { messages: data.messages || [] }
}
