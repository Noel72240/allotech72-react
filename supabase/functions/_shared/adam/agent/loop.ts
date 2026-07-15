import type { LLMMessage, LLMProvider } from '../llm/types.ts'
import type { AdamTool, ToolContext } from '../tools/registry.ts'
import { runTool } from '../tools/runner.ts'
import { getMaxToolIterations } from '../llm/config.ts'

export interface AgentLoopResult {
  content: string
  toolCallsExecuted: Array<{ name: string; result: unknown }>
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
}

/** Boucle agent avec tool calling — indépendante du provider via LLMProvider */
export async function runAgentLoop(
  llm: LLMProvider,
  initialMessages: LLMMessage[],
  tools: AdamTool[],
  toolCtx: ToolContext,
  toolDefinitions: ReturnType<typeof import('../tools/registry.ts').toLLMDefinitions>,
): Promise<AgentLoopResult> {
  const messages: LLMMessage[] = [...initialMessages]
  const toolCallsExecuted: Array<{ name: string; result: unknown }> = []
  let totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
  const maxIter = getMaxToolIterations()

  for (let i = 0; i < maxIter; i++) {
    const result = await llm.complete({
      messages,
      tools: toolDefinitions.length ? toolDefinitions : undefined,
      temperature: 0.4,
      maxTokens: 1500,
    })

    if (result.usage) {
      totalUsage.promptTokens += result.usage.promptTokens
      totalUsage.completionTokens += result.usage.completionTokens
      totalUsage.totalTokens += result.usage.totalTokens
    }

    if (result.finishReason === 'error') {
      const errDetail = (result.raw as Record<string, unknown>)?.error
      throw new Error(String(errDetail || 'Erreur LLM'))
    }

    if (result.toolCalls.length === 0) {
      return {
        content: result.content || 'Je suis désolé, je n\'ai pas pu formuler une réponse. Pouvez-vous reformuler ?',
        toolCallsExecuted,
        usage: totalUsage.totalTokens ? totalUsage : undefined,
      }
    }

    messages.push({
      role: 'assistant',
      content: result.content || '',
      toolCalls: result.toolCalls,
    })

    for (const call of result.toolCalls) {
      const toolResult = await runTool(tools, toolCtx, call)
      toolCallsExecuted.push({ name: call.name, result: toolResult })

      messages.push({
        role: 'tool',
        content: JSON.stringify(toolResult),
        toolCallId: call.id,
        name: call.name,
      })
    }
  }

  return {
    content: 'J\'ai analysé votre demande en profondeur. Souhaitez-vous que je vous mette en relation avec un technicien Allotech72 ?',
    toolCallsExecuted,
    usage: totalUsage.totalTokens ? totalUsage : undefined,
  }
}
