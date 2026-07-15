import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface MemoryRow {
  key: string
  value: string
  memory_type: string
  importance: number
}

export async function loadMemories(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<MemoryRow[]> {
  const { data, error } = await supabase
    .from('adam_memories')
    .select('key, value, memory_type, importance')
    .eq('conversation_id', conversationId)
    .order('importance', { ascending: false })
    .limit(20)

  if (error) throw new Error(`Memories: ${error.message}`)
  return (data || []) as MemoryRow[]
}

/** Extraction simple de mémoires depuis le message (sans LLM en phase 1) */
export async function extractMemoriesFromMessage(
  supabase: SupabaseClient,
  conversationId: string,
  message: string,
) {
  const patterns: Array<{ type: string; key: string; regex: RegExp }> = [
    { type: 'device', key: 'device_model', regex: /(?:iphone|samsung|macbook|pc|portable|tablette)\s*[\w\d\s-]*/i },
    { type: 'issue', key: 'main_issue', regex: /(?:problème|panne|souci)\s*(?:de|:)?\s*(.{5,80})/i },
  ]

  for (const p of patterns) {
    const m = message.match(p.regex)
    if (!m) continue
    const value = (m[1] || m[0]).trim().slice(0, 200)
    await supabase.from('adam_memories').upsert(
      {
        conversation_id: conversationId,
        memory_type: p.type,
        key: p.key,
        value,
        importance: 0.7,
      },
      { onConflict: 'conversation_id,key' },
    )
  }
}

export function formatMemoriesForPrompt(memories: MemoryRow[]): string {
  if (!memories.length) return ''
  return memories.map(m => `- [${m.memory_type}] ${m.key}: ${m.value}`).join('\n')
}
