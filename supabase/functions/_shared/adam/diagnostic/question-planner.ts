import type { DiagnosticRule, PlannedQuestion } from './types.ts'

/** Planifie les prochaines questions à poser (priorisées) */
export function planQuestions(
  matchedRules: Array<{ rule: DiagnosticRule; score: number }>,
  answeredIds: Set<string>,
): PlannedQuestion[] {
  const questions: PlannedQuestion[] = []
  const seen = new Set<string>()

  for (const { rule } of matchedRules) {
    for (const q of rule.questions) {
      if (answeredIds.has(q.id) || seen.has(q.id)) continue
      seen.add(q.id)
      questions.push({
        id: q.id,
        question: q.question,
        priority: q.priority,
        reason: q.reason,
      })
    }
  }

  return questions.sort((a, b) => a.priority - b.priority).slice(0, 3)
}

export function extractAnsweredQuestionIds(
  answered: Array<{ question: string; answer: string }>,
): Set<string> {
  return new Set(answered.map((_, i) => `answered-${i}`))
}
