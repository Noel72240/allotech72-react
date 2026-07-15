import type { LLMToolCall, LLMToolDefinition } from '../types.ts'

/** Convertit les tools Adam → format OpenAI Chat Completions */
export function toOpenAITools(tools: LLMToolDefinition[]) {
  return tools.map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }))
}

/** Parse les tool_calls OpenAI → format interne Adam */
export function parseOpenAIToolCalls(raw: unknown): LLMToolCall[] {
  if (!Array.isArray(raw)) return []
  return raw.map((tc: Record<string, unknown>) => {
    const fn = tc.function as Record<string, unknown> | undefined
    let args: Record<string, unknown> = {}
    try {
      args = JSON.parse(String(fn?.arguments || '{}'))
    } catch {
      args = {}
    }
    return {
      id: String(tc.id || crypto.randomUUID()),
      name: String(fn?.name || ''),
      arguments: args,
    }
  })
}

/** Stub : Anthropic tool format (phase ultérieure) */
export function toAnthropicTools(tools: LLMToolDefinition[]) {
  return tools.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters,
  }))
}

/** Stub : Google function calling format */
export function toGoogleTools(tools: LLMToolDefinition[]) {
  return tools.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }))
}

/** Stub : Mistral tool format */
export function toMistralTools(tools: LLMToolDefinition[]) {
  return toOpenAITools(tools)
}
