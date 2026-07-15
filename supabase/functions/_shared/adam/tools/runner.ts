import type { AdamTool, ToolContext, ToolResult } from './registry.ts'
import type { LLMToolCall } from '../llm/types.ts'
import { handleSearchKnowledge } from './handlers/searchKnowledge.ts'
import { handleRunDiagnostic } from './handlers/runDiagnostic.ts'
import { stubTool } from './registry.ts'

export function buildToolRegistry(): AdamTool[] {
  return [
    {
      name: 'searchKnowledge',
      description: 'Recherche dans la base de connaissances Allotech72 (FAQ, guides, tarifs, services, procédures).',
      enabled: true,
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Requête de recherche' },
          category: { type: 'string', description: 'Catégorie optionnelle: faq, guide, pricing, service, etc.' },
        },
        required: ['query'],
      },
      handler: handleSearchKnowledge,
    },
    {
      name: 'runDiagnostic',
      description: 'Analyse structurée des symptômes informatiques : causes probables, confiance, questions suivantes, estimation.',
      enabled: true,
      parameters: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Description du problème par le client' },
          symptoms: { type: 'array', items: { type: 'string' }, description: 'Liste de symptômes' },
        },
        required: ['message'],
      },
      handler: handleRunDiagnostic,
    },
    stubTool('getRepairPrice', 'Obtenir une fourchette tarifaire pour une réparation.', {
      type: 'object',
      properties: { serviceType: { type: 'string' }, deviceType: { type: 'string' } },
      required: ['serviceType'],
    }),
    stubTool('createQuote', 'Créer un devis client.', {
      type: 'object',
      properties: { customerName: { type: 'string' }, description: { type: 'string' } },
      required: ['description'],
    }),
    stubTool('createAppointment', 'Proposer un rendez-vous intervention.', {
      type: 'object',
      properties: { date: { type: 'string' }, timeSlot: { type: 'string' } },
      required: ['date'],
    }),
    stubTool('checkStock', 'Vérifier le stock boutique Allotech72.', {
      type: 'object',
      properties: { productQuery: { type: 'string' } },
      required: ['productQuery'],
    }),
    stubTool('findCompatiblePart', 'Trouver une pièce compatible.', {
      type: 'object',
      properties: { deviceModel: { type: 'string' }, partType: { type: 'string' } },
      required: ['deviceModel', 'partType'],
    }),
    stubTool('createCustomer', 'Créer une fiche client (staff).', {
      type: 'object',
      properties: { name: { type: 'string' }, phone: { type: 'string' }, email: { type: 'string' } },
      required: ['name'],
    }),
    stubTool('sendEmail', 'Envoyer un e-mail au client ou au technicien.', {
      type: 'object',
      properties: { to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } },
      required: ['to', 'subject', 'body'],
    }),
  ]
}

export async function runTool(
  registry: AdamTool[],
  ctx: ToolContext,
  call: LLMToolCall,
): Promise<ToolResult> {
  const tool = registry.find(t => t.name === call.name)
  if (!tool) return { ok: false, error: `Outil inconnu: ${call.name}` }
  if (!tool.enabled) return tool.handler(ctx, call.arguments)

  const start = Date.now()
  try {
    const result = await tool.handler(ctx, call.arguments)
    await logToolCall(ctx, call.name, call.arguments, result, true, Date.now() - start)
    return result
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    await logToolCall(ctx, call.name, call.arguments, { error: err }, false, Date.now() - start, err)
    return { ok: false, error: err }
  }
}

async function logToolCall(
  ctx: ToolContext,
  toolName: string,
  input: unknown,
  output: unknown,
  success: boolean,
  durationMs: number,
  error?: string,
) {
  await ctx.supabase.from('adam_tool_logs').insert({
    conversation_id: ctx.conversationId,
    tool_name: toolName,
    input,
    output,
    success,
    duration_ms: durationMs,
    error: error || null,
  })
}

export function getToolByName(registry: AdamTool[], name: string): AdamTool | undefined {
  return registry.find(t => t.name === name)
}
