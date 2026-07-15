import type { ToolContext, ToolResult } from '../registry.ts'
import { runDiagnostic } from '../../diagnostic/engine.ts'
import { loadMemories } from '../../memory/memories.ts'
import { saveDiagnosticSession } from '../../memory/diagnostic-sessions.ts'

export async function handleRunDiagnostic(
  ctx: ToolContext,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const message = String(args.message || '').trim()
  if (!message) return { ok: false, error: 'message requis' }

  const symptoms = Array.isArray(args.symptoms)
    ? args.symptoms.map(String)
    : undefined

  const memories = await loadMemories(ctx.supabase, ctx.conversationId)

  const output = runDiagnostic({
    message,
    symptoms,
    memories: memories.map(m => ({
      key: m.key,
      value: m.value,
      memoryType: m.memory_type,
    })),
  })

  await saveDiagnosticSession(
    ctx.supabase,
    ctx.conversationId,
    output,
    output.state.device || {},
  )

  return {
    ok: true,
    data: {
      phase: output.state.phase,
      probableCauses: output.probableCauses,
      nextQuestions: output.nextQuestions,
      repairEstimate: output.repairEstimate,
      escalationLevel: output.escalationLevel,
      overallConfidence: output.overallConfidence,
      recommendedActions: output.recommendedActions,
    },
  }
}
