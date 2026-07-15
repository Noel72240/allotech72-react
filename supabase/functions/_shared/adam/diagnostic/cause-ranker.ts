import type { DiagnosticRule, RankedCause } from './types.ts'
import { ALL_DIAGNOSTIC_RULES } from './rules/index.ts'

/** Score les règles métier selon les symptômes — sans LLM */
export function matchRules(symptoms: string[]): Array<{ rule: DiagnosticRule; score: number }> {
  const text = symptoms.join(' ').toLowerCase()
  const matches: Array<{ rule: DiagnosticRule; score: number }> = []

  for (const rule of ALL_DIAGNOSTIC_RULES) {
    let score = 0
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) score += 1
    }
    if (score > 0) matches.push({ rule, score })
  }

  return matches.sort((a, b) => b.score - a.score)
}

/** Classe les causes probables avec niveau de confiance */
export function rankCauses(
  matchedRules: Array<{ rule: DiagnosticRule; score: number }>,
): RankedCause[] {
  const causeMap = new Map<string, RankedCause>()

  for (const { rule, score } of matchedRules) {
    const ruleBoost = Math.min(score / 3, 1)
    for (const cause of rule.causes) {
      const confidence = Math.min(cause.weight * (0.5 + ruleBoost * 0.5), 0.98)
      const existing = causeMap.get(cause.id)
      if (!existing || existing.confidence < confidence) {
        causeMap.set(cause.id, {
          id: cause.id,
          label: cause.label,
          confidence: Math.round(confidence * 100) / 100,
          evidence: cause.evidence ? [cause.evidence] : [],
          category: rule.category,
        })
      }
    }
  }

  return [...causeMap.values()].sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

export function getOverallConfidence(causes: RankedCause[]): number {
  if (!causes.length) return 0
  return causes[0].confidence
}
