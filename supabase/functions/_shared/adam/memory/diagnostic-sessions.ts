import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { DiagnosticOutput } from '../diagnostic/types.ts'

export async function saveDiagnosticSession(
  supabase: SupabaseClient,
  conversationId: string,
  diagnostic: DiagnosticOutput,
  deviceInfo: Record<string, unknown> = {},
) {
  const { data: existing } = await supabase
    .from('adam_diagnostic_sessions')
    .select('id')
    .eq('conversation_id', conversationId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const payload = {
    conversation_id: conversationId,
    state: diagnostic.state,
    probable_causes: diagnostic.probableCauses,
    confidence: diagnostic.overallConfidence,
    escalation_level: diagnostic.escalationLevel,
    device_info: deviceInfo,
    updated_at: new Date().toISOString(),
  }

  if (existing?.id) {
    await supabase.from('adam_diagnostic_sessions').update(payload).eq('id', existing.id)
  } else {
    await supabase.from('adam_diagnostic_sessions').insert(payload)
  }
}

export async function loadLatestDiagnostic(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<Record<string, unknown> | null> {
  const { data } = await supabase
    .from('adam_diagnostic_sessions')
    .select('state, probable_causes, confidence, escalation_level, device_info')
    .eq('conversation_id', conversationId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export function formatDiagnosticForPrompt(diagnostic: DiagnosticOutput): string {
  const lines = [
    `Phase diagnostic : ${diagnostic.state.phase}`,
    `Confiance globale : ${Math.round(diagnostic.overallConfidence * 100)}%`,
    `Niveau d'escalade : ${diagnostic.escalationLevel}`,
  ]

  if (diagnostic.probableCauses.length) {
    lines.push('Causes probables :')
    for (const c of diagnostic.probableCauses.slice(0, 3)) {
      lines.push(`- ${c.label} (${Math.round(c.confidence * 100)}%)`)
    }
  }

  if (diagnostic.nextQuestions.length) {
    lines.push('Questions à poser en priorité :')
    for (const q of diagnostic.nextQuestions) {
      lines.push(`- ${q.question}`)
    }
  }

  if (diagnostic.repairEstimate) {
    const e = diagnostic.repairEstimate
    lines.push(
      `Estimation : ${e.durationMin}-${e.durationMax} min, ${e.priceRangeMin}-${e.priceRangeMax} €, ` +
      `intervention ${e.needsOnSite ? 'sur place' : 'possible à distance'}.`,
    )
  }

  return lines.join('\n')
}
