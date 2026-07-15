import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface ConversationRow {
  id: string
  session_token: string
  channel: string
  status: string
  metadata: Record<string, unknown>
}

export async function getOrCreateConversation(
  supabase: SupabaseClient,
  sessionToken: string,
  channel: string,
  metadata: Record<string, unknown> = {},
): Promise<ConversationRow> {
  const { data: existing } = await supabase
    .from('adam_conversations')
    .select('*')
    .eq('session_token', sessionToken)
    .eq('channel', channel)
    .eq('status', 'active')
    .maybeSingle()

  if (existing) {
    await supabase
      .from('adam_conversations')
      .update({ last_active_at: new Date().toISOString(), metadata })
      .eq('id', existing.id)
    return existing as ConversationRow
  }

  const { data, error } = await supabase
    .from('adam_conversations')
    .insert({
      session_token: sessionToken,
      channel,
      status: 'active',
      metadata,
    })
    .select()
    .single()

  if (error) throw new Error(`Conversation: ${error.message}`)
  return data as ConversationRow
}

export async function closeConversation(supabase: SupabaseClient, conversationId: string) {
  await supabase
    .from('adam_conversations')
    .update({ status: 'closed' })
    .eq('id', conversationId)
}
