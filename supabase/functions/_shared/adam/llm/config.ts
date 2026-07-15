import type { LLMConfig, LLMProviderName } from './types.ts'

export function loadLLMConfig(): LLMConfig {
  const provider = (Deno.env.get('ADAM_LLM_PROVIDER')?.trim() || 'openai') as LLMProviderName
  const model = Deno.env.get('ADAM_LLM_MODEL')?.trim() || 'gpt-4o'
  const embeddingModel = Deno.env.get('ADAM_LLM_EMBEDDING_MODEL')?.trim() || 'text-embedding-3-small'

  const keyMap: Record<LLMProviderName, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_AI_API_KEY',
    mistral: 'MISTRAL_API_KEY',
  }

  return {
    provider,
    model,
    embeddingModel,
    apiKey: Deno.env.get(keyMap[provider])?.trim(),
  }
}

export function getMaxToolIterations(): number {
  return Number(Deno.env.get('ADAM_MAX_TOOL_ITERATIONS') || '5')
}

export function getRagTopK(): number {
  return Number(Deno.env.get('ADAM_RAG_TOP_K') || '5')
}

export function getDiagnosticConfidenceThreshold(): number {
  return Number(Deno.env.get('ADAM_DIAGNOSTIC_CONFIDENCE_THRESHOLD') || '0.7')
}
