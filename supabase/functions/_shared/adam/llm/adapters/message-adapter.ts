import type { LLMMessage } from '../types.ts'

/** Normalise les messages pour OpenAI Chat Completions API */
export function toOpenAIMessages(messages: LLMMessage[]) {
  return messages.map(m => {
    if (m.role === 'tool') {
      return {
        role: 'tool' as const,
        tool_call_id: m.toolCallId || '',
        content: m.content,
      }
    }
    if (m.role === 'assistant' && m.toolCalls?.length) {
      return {
        role: 'assistant' as const,
        content: m.content || null,
        tool_calls: m.toolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
        })),
      }
    }
    return { role: m.role, content: m.content }
  })
}

/** Stub adaptateurs pour autres providers */
export function toAnthropicMessages(messages: LLMMessage[]) {
  return messages.filter(m => m.role !== 'tool')
}

export function toGoogleMessages(messages: LLMMessage[]) {
  return messages.filter(m => m.role !== 'tool')
}

export function toMistralMessages(messages: LLMMessage[]) {
  return toOpenAIMessages(messages)
}
