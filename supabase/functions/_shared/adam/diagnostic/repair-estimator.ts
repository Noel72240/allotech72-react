import type { DiagnosticRule, EscalationLevel, RankedCause, RepairEstimate } from './types.ts'

const DEFAULT_ESTIMATE: RepairEstimate = {
  complexity: 'medium',
  durationMin: 30,
  durationMax: 90,
  priceRangeMin: 49,
  priceRangeMax: 120,
  needsOnSite: true,
  notes: 'Estimation indicative — devis gratuit sur place.',
}

/** Estime durée, complexité et fourchette tarifaire */
export function estimateRepair(
  matchedRules: Array<{ rule: DiagnosticRule; score: number }>,
  causes: RankedCause[],
): RepairEstimate {
  const topRule = matchedRules[0]?.rule
  if (!topRule?.estimate) return DEFAULT_ESTIMATE

  const e = topRule.estimate
  let priceMin = e.priceRangeMin
  let priceMax = e.priceRangeMax

  const topCause = causes[0]
  if (topCause?.confidence > 0.85 && topCause.category === 'hardware') {
    priceMax = Math.round(priceMax * 1.2)
  }

  return {
    complexity: e.complexity,
    durationMin: e.durationMin,
    durationMax: e.durationMax,
    priceRangeMin: priceMin,
    priceRangeMax: priceMax,
    needsOnSite: e.needsOnSite,
    notes: e.notes || DEFAULT_ESTIMATE.notes,
  }
}

export function resolveEscalation(
  matchedRules: Array<{ rule: DiagnosticRule; score: number }>,
  text: string,
): EscalationLevel {
  const urgentKeywords = ['fumée', 'fumee', 'brûlé', 'brule', 'gonflé', 'gonfle', 'étincelle', 'odeur']
  if (urgentKeywords.some(k => text.toLowerCase().includes(k))) return 'urgent'

  const topRule = matchedRules[0]?.rule
  return topRule?.escalation || 'self_help'
}
