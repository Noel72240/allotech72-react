import type { PersonaBundle } from '../persona/index.ts'
import type { DiagnosticOutput } from '../diagnostic/types.ts'
import type { KnowledgeChunk } from '../knowledge/search.ts'
import { formatDiagnosticForPrompt } from '../memory/diagnostic-sessions.ts'
import { formatMemoriesForPrompt, type MemoryRow } from '../memory/memories.ts'
import { formatKnowledgeForPrompt } from '../knowledge/search.ts'

export interface ContextInput {
  persona: PersonaBundle
  diagnostic: DiagnosticOutput
  knowledge: KnowledgeChunk[]
  memories: MemoryRow[]
  history: Array<{ role: string; content: string }>
}

export function buildSystemContext(input: ContextInput): string {
  const sections = [input.persona.systemPrompt]

  const memBlock = formatMemoriesForPrompt(input.memories)
  if (memBlock) {
    sections.push('\n## Mémoires client (cette conversation)\n' + memBlock)
  }

  const diagBlock = formatDiagnosticForPrompt(input.diagnostic)
  sections.push('\n## Analyse diagnostic (moteur métier)\n' + diagBlock)

  const kbBlock = formatKnowledgeForPrompt(input.knowledge)
  if (kbBlock) {
    sections.push('\n## Base de connaissances pertinente\n' + kbBlock)
  }

  sections.push(
    '\n## Instructions finales',
    'Utilise les outils searchKnowledge et runDiagnostic quand c\'est pertinent.',
    'Base tes réponses sur l\'analyse diagnostic et la base de connaissances.',
    'Propose toujours une action concrète (étape simple, appel, ou formulaire contact).',
  )

  return sections.join('\n')
}

export function buildLLMMessages(
  systemContext: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
) {
  return [
    { role: 'system' as const, content: systemContext },
    ...history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user' as const, content: userMessage },
  ]
}
