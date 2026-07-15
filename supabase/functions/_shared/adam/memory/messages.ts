import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface MessageRow {
  id: string
  role: string
  content: string
  tool_calls?: unknown
  tool_results?: unknown
  created_at: string
}

export async function loadRecentMessages(
  supabase: SupabaseClient,
  conversationId: string,
  limit = 20,
): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from('adam_messages')
    .select('id, role, content, tool_calls, tool_results, created_at')
    .eq('conversation_id', conversationId)
    .in('role', ['user', 'assistant'])
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`Messages: ${error.message}`)
  return (data || []) as MessageRow[]
}

export async function saveMessage(
  supabase: SupabaseClient,
  conversationId: string,
  role: string,
  content: string,
  extras: {
    tool_calls?: unknown
    tool_results?: unknown
    openai_meta?: unknown
  } = {},
) {
  const { error } = await supabase.from('adam_messages').insert({
    conversation_id: conversationId,
    role,
    content,
    tool_calls: extras.tool_calls || null,
    tool_results: extras.tool_results || null,
    openai_meta: extras.openai_meta || null,
  })
  if (error) throw new Error(`Save message: ${error.message}`)
}
