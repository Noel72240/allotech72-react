import type { LLMCompletionParams, LLMCompletionResult, LLMProvider } from '../types.ts'

/** Stub Google Gemini — implémentation complète en phase ultérieure */
export class GoogleProvider implements LLMProvider {
  readonly name = 'google' as const
  readonly supportsToolCalling = true
  readonly supportsVision = true
  readonly supportsStreaming = true

  constructor(private _apiKey: string, private _model: string) {}

  async complete(_params: LLMCompletionParams): Promise<LLMCompletionResult> {
    throw new Error('GoogleProvider non implémenté — définir ADAM_LLM_PROVIDER=openai ou implémenter ce provider.')
  }
}
