import type { LLMConfig, LLMProvider } from './types.ts'
import { loadLLMConfig } from './config.ts'
import { OpenAIProvider } from './providers/openai.ts'
import { AnthropicProvider } from './providers/anthropic.ts'
import { GoogleProvider } from './providers/google.ts'
import { MistralProvider } from './providers/mistral.ts'

export function createLLMProvider(config?: Partial<LLMConfig>): LLMProvider {
  const cfg = { ...loadLLMConfig(), ...config }

  if (!cfg.apiKey) {
    throw new Error(`Clé API manquante pour le provider ${cfg.provider}`)
  }

  switch (cfg.provider) {
    case 'openai':
      return new OpenAIProvider(cfg.apiKey, cfg.model, cfg.embeddingModel || 'text-embedding-3-small')
    case 'anthropic':
      return new AnthropicProvider(cfg.apiKey, cfg.model)
    case 'google':
      return new GoogleProvider(cfg.apiKey, cfg.model)
    case 'mistral':
      return new MistralProvider(cfg.apiKey, cfg.model)
    default:
      throw new Error(`Provider LLM inconnu : ${cfg.provider}`)
  }
}

export { loadLLMConfig } from './config.ts'
export type { LLMProvider, LLMConfig, LLMMessage, LLMCompletionParams, LLMCompletionResult, LLMToolDefinition, LLMToolCall } from './types.ts'
