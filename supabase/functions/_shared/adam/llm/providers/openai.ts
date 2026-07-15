import type { LLMCompletionParams, LLMCompletionResult, LLMProvider } from '../types.ts'
import { toOpenAIMessages } from '../adapters/message-adapter.ts'
import { parseOpenAIToolCalls, toOpenAITools } from '../adapters/tool-adapter.ts'

export class OpenAIProvider implements LLMProvider {
  readonly name = 'openai' as const
  readonly supportsToolCalling = true
  readonly supportsVision = true
  readonly supportsStreaming = true

  constructor(
    private apiKey: string,
    private model: string,
    private embeddingModel: string,
  ) {}

  async complete(params: LLMCompletionParams): Promise<LLMCompletionResult> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages: toOpenAIMessages(params.messages),
      temperature: params.temperature ?? 0.4,
      max_tokens: params.maxTokens ?? 1500,
    }

    if (params.tools?.length) {
      body.tools = toOpenAITools(params.tools)
      body.tool_choice = 'auto'
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errMsg = (data as Record<string, unknown>)?.error
        ? JSON.stringify((data as Record<string, unknown>).error)
        : `OpenAI HTTP ${res.status}`
      return {
        content: null,
        toolCalls: [],
        finishReason: 'error',
        model: this.model,
        provider: 'openai',
        raw: { error: errMsg },
      }
    }

    const choice = (data as Record<string, unknown>).choices as Array<Record<string, unknown>> | undefined
    const first = choice?.[0]
    const message = first?.message as Record<string, unknown> | undefined
    const toolCalls = parseOpenAIToolCalls(message?.tool_calls)
    const finish = String(first?.finish_reason || 'stop')

    return {
      content: message?.content ? String(message.content) : null,
      toolCalls,
      finishReason: toolCalls.length ? 'tool_calls' : (finish === 'length' ? 'length' : 'stop'),
      usage: parseUsage(data),
      model: String((data as Record<string, unknown>).model || this.model),
      provider: 'openai',
      raw: data,
    }
  }

  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.embeddingModel, input: texts }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(`OpenAI embeddings error: ${JSON.stringify(data)}`)

    const items = (data as Record<string, unknown>).data as Array<{ embedding: number[] }>
    return items.map(i => i.embedding)
  }
}

function parseUsage(data: unknown) {
  const u = (data as Record<string, unknown>)?.usage as Record<string, number> | undefined
  if (!u) return undefined
  return {
    promptTokens: u.prompt_tokens || 0,
    completionTokens: u.completion_tokens || 0,
    totalTokens: u.total_tokens || 0,
  }
}
