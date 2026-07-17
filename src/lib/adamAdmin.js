import { supabase } from './supabase.js'

/** Lecture admin des conversations Adam (auth Supabase requise + RLS adam-admin-rls.sql) */

export async function fetchAdamStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [convRes, msgRes, activeRes] = await Promise.all([
    supabase.from('adam_conversations').select('id', { count: 'exact', head: true }),
    supabase.from('adam_messages').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('adam_conversations').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  return {
    totalConversations: convRes.count ?? 0,
    messagesToday: msgRes.count ?? 0,
    activeConversations: activeRes.count ?? 0,
  }
}

export async function fetchAdamConversations(limit = 30) {
  const { data, error } = await supabase
    .from('adam_conversations')
    .select('id, session_token, channel, status, metadata, last_active_at, created_at')
    .order('last_active_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchAdamMessages(conversationId) {
  const { data, error } = await supabase
    .from('adam_messages')
    .select('id, role, content, created_at, openai_meta')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchAdamDiagnostic(conversationId) {
  const { data, error } = await supabase
    .from('adam_diagnostic_sessions')
    .select('confidence, escalation_level, probable_causes, device_info, updated_at')
    .eq('conversation_id', conversationId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function fetchAdamMemories(conversationId) {
  const { data, error } = await supabase
    .from('adam_memories')
    .select('memory_type, key, value, importance')
    .eq('conversation_id', conversationId)
    .order('importance', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function archiveAdamConversation(conversationId) {
  const { error } = await supabase
    .from('adam_conversations')
    .update({ status: 'archived' })
    .eq('id', conversationId)

  if (error) throw new Error(error.message)
}

/** Supprime une conversation (+ messages / mémoires / diagnostics en cascade) */
export async function deleteAdamConversation(conversationId) {
  const { error } = await supabase
    .from('adam_conversations')
    .delete()
    .eq('id', conversationId)

  if (error) throw new Error(error.message)
}

/** Supprime plusieurs conversations d’un coup */
export async function deleteAdamConversations(conversationIds) {
  const ids = [...new Set((conversationIds || []).filter(Boolean))]
  if (!ids.length) return 0

  const { data, error } = await supabase
    .from('adam_conversations')
    .delete()
    .in('id', ids)
    .select('id')

  if (error) throw new Error(error.message)
  return data?.length ?? 0
}

/** Supprime toutes les conversations archivées */
export async function deleteArchivedAdamConversations() {
  const { data, error } = await supabase
    .from('adam_conversations')
    .delete()
    .eq('status', 'archived')
    .select('id')

  if (error) throw new Error(error.message)
  return data?.length ?? 0
}

export function formatAdamDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncateSessionToken(token) {
  if (!token) return '—'
  return `${token.slice(0, 8)}…`
}
