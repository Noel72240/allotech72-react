/** Types communs pour l'abstraction LLM multi-fournisseur */

export type LLMProviderName = 'openai' | 'anthropic' | 'google' | 'mistral'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  toolCallId?: string
  name?: string
  toolCalls?: LLMToolCall[]
}

export interface LLMToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface LLMToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export interface LLMCompletionParams {
  messages: LLMMessage[]
  tools?: LLMToolDefinition[]
  temperature?: number
  maxTokens?: number
}

export interface LLMCompletionResult {
  content: string | null
  toolCalls: LLMToolCall[]
  finishReason: 'stop' | 'tool_calls' | 'length' | 'error'
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
  model: string
  provider: LLMProviderName
  raw?: unknown
}

export interface LLMProvider {
  readonly name: LLMProviderName
  readonly supportsToolCalling: boolean
  readonly supportsVision: boolean
  readonly supportsStreaming: boolean
  complete(params: LLMCompletionParams): Promise<LLMCompletionResult>
  embed?(texts: string[]): Promise<number[][]>
}

export interface LLMConfig {
  provider: LLMProviderName
  model: string
  embeddingModel?: string
  apiKey?: string
}
