import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { assemblePersona } from '../persona/index.ts'
import { createLLMProvider } from '../llm/factory.ts'
import { runDiagnostic } from '../diagnostic/engine.ts'
import { getOrCreateConversation } from '../memory/conversations.ts'
import { loadRecentMessages, saveMessage } from '../memory/messages.ts'
import { loadMemories, extractMemoriesFromMessage } from '../memory/memories.ts'
import { saveDiagnosticSession, loadLatestDiagnostic } from '../memory/diagnostic-sessions.ts'
import { embedQuery, searchKnowledge } from '../knowledge/search.ts'
import { buildSystemContext, buildLLMMessages } from './context-builder.ts'
import { runAgentLoop } from './loop.ts'
import { buildToolRegistry, toLLMDefinitions } from '../tools/registry.ts'
import type { DiagnosticState } from '../diagnostic/types.ts'

export interface AgentRunInput {
  sessionToken: string
  message: string
  channel?: 'web' | 'at72manager' | 'api'
  pageContext?: Record<string, unknown>
}

export interface SuggestedAction {
  type: 'phone' | 'link' | 'contact'
  label: string
  value: string
}

export interface AgentRunOutput {
  reply: string
  conversationId: string
  sessionToken: string
  suggestedActions: SuggestedAction[]
  diagnostic?: {
    confidence: number
    escalationLevel: string
    topCause?: string
  }
}

function createServiceClient() {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(url, key)
}

function isValidSessionToken(token: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)
}

export async function runAgent(input: AgentRunInput): Promise<AgentRunOutput> {
  const sessionToken = input.sessionToken?.trim()
  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw new Error('sessionToken invalide (UUID v4 requis)')
  }

  const message = input.message?.trim()
  if (!message || message.length > 4000) {
    throw new Error('Message invalide ou trop long')
  }

  const channel = input.channel || 'web'
  const supabase = createServiceClient()
  const llm = createLLMProvider()
  const persona = assemblePersona({ channel, locale: 'fr' })

  const conversation = await getOrCreateConversation(
    supabase,
    sessionToken,
    channel,
    { pageContext: input.pageContext || {} },
  )

  const [history, memories, prevDiagRow] = await Promise.all([
    loadRecentMessages(supabase, conversation.id, 20),
    loadMemories(supabase, conversation.id),
    loadLatestDiagnostic(supabase, conversation.id),
  ])

  const prevState = prevDiagRow?.state as DiagnosticState | undefined

  let knowledgeChunks: Awaited<ReturnType<typeof searchKnowledge>> = []
  try {
    const embedding = await embedQuery(llm, message)
    knowledgeChunks = await searchKnowledge(supabase, embedding)
  } catch {
    // RAG optionnel si pas de chunks indexés
  }

  const diagnostic = runDiagnostic({
    message,
    history: prevState || undefined,
    memories: memories.map(m => ({
      key: m.key,
      value: m.value,
      memoryType: m.memory_type,
    })),
    knowledgeHints: knowledgeChunks.map(c => ({
      content: c.content,
      category: c.category,
      title: c.title,
    })),
  })

  await saveDiagnosticSession(supabase, conversation.id, diagnostic, diagnostic.state.device || {})

  const systemContext = buildSystemContext({
    persona,
    diagnostic,
    knowledge: knowledgeChunks,
    memories,
    history,
  })

  const llmMessages = buildLLMMessages(
    systemContext,
    history,
    message,
  )

  const tools = buildToolRegistry()
  const toolCtx = {
    conversationId: conversation.id,
    sessionToken,
    channel,
    supabase,
    llm,
  }

  await saveMessage(supabase, conversation.id, 'user', message)

  const loopResult = await runAgentLoop(
    llm,
    llmMessages,
    tools,
    toolCtx,
    toLLMDefinitions(tools),
  )

  await saveMessage(supabase, conversation.id, 'assistant', loopResult.content, {
    openai_meta: { usage: loopResult.usage, tools: loopResult.toolCallsExecuted },
  })

  await extractMemoriesFromMessage(supabase, conversation.id, message)

  const suggestedActions = buildSuggestedActions(persona.business.phoneRaw, persona.business.siteUrl, diagnostic)

  return {
    reply: loopResult.content,
    conversationId: conversation.id,
    sessionToken,
    suggestedActions,
    diagnostic: {
      confidence: diagnostic.overallConfidence,
      escalationLevel: diagnostic.escalationLevel,
      topCause: diagnostic.probableCauses[0]?.label,
    },
  }
}

function buildSuggestedActions(
  phoneRaw: string,
  siteUrl: string,
  diagnostic: ReturnType<typeof runDiagnostic>,
): SuggestedAction[] {
  const actions: SuggestedAction[] = [
    { type: 'phone', label: 'Appeler Allotech72', value: `tel:${phoneRaw}` },
    { type: 'contact', label: 'Demander un devis gratuit', value: `${siteUrl}/#contact` },
  ]

  if (diagnostic.escalationLevel === 'urgent') {
    actions.unshift({
      type: 'phone',
      label: 'Urgence — Appeler maintenant',
      value: `tel:${phoneRaw}`,
    })
  }

  return actions
}

/** Charge l'historique pour affichage front */
export async function loadConversationHistory(sessionToken: string, channel = 'web') {
  if (!isValidSessionToken(sessionToken)) return { messages: [] }

  const supabase = createServiceClient()
  const { data: conv } = await supabase
    .from('adam_conversations')
    .select('id')
    .eq('session_token', sessionToken)
    .eq('channel', channel)
    .eq('status', 'active')
    .maybeSingle()

  if (!conv) return { messages: [] }

  const messages = await loadRecentMessages(supabase, conv.id, 50)
  return {
    messages: messages.map(m => ({ role: m.role, content: m.content, createdAt: m.created_at })),
  }
}
