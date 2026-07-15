import type { LLMCompletionParams, LLMCompletionResult, LLMProvider } from '../types.ts'

/** Stub Anthropic — implémentation complète en phase ultérieure */
export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic' as const
  readonly supportsToolCalling = true
  readonly supportsVision = true
  readonly supportsStreaming = true

  constructor(private _apiKey: string, private _model: string) {}

  async complete(_params: LLMCompletionParams): Promise<LLMCompletionResult> {
    throw new Error('AnthropicProvider non implémenté — définir ADAM_LLM_PROVIDER=openai ou implémenter ce provider.')
  }
}
