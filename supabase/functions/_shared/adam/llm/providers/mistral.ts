import type { LLMCompletionParams, LLMCompletionResult, LLMProvider } from '../types.ts'

/** Stub Mistral — implémentation complète en phase ultérieure */
export class MistralProvider implements LLMProvider {
  readonly name = 'mistral' as const
  readonly supportsToolCalling = true
  readonly supportsVision = false
  readonly supportsStreaming = true

  constructor(private _apiKey: string, private _model: string) {}

  async complete(_params: LLMCompletionParams): Promise<LLMCompletionResult> {
    throw new Error('MistralProvider non implémenté — définir ADAM_LLM_PROVIDER=openai ou implémenter ce provider.')
  }
}
