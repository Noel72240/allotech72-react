import type { DiagnosticInput, DiagnosticOutput, RecommendedAction } from './types.ts'
import { buildInitialState } from './symptom-analyzer.ts'
import { matchRules, rankCauses, getOverallConfidence } from './cause-ranker.ts'
import { planQuestions, extractAnsweredQuestionIds } from './question-planner.ts'
import { estimateRepair, resolveEscalation } from './repair-estimator.ts'
import { advancePhase } from './state-machine.ts'

/** Point d'entrée du moteur diagnostic — 100% indépendant du LLM */
export function runDiagnostic(input: DiagnosticInput): DiagnosticOutput {
  const state = buildInitialState(input)
  const text = [input.message, ...state.symptoms].join(' ')

  const matchedRules = matchRules(state.symptoms)
  const probableCauses = rankCauses(matchedRules)
  const overallConfidence = getOverallConfidence(probableCauses)

  const answeredIds = extractAnsweredQuestionIds(state.answeredQuestions)
  const nextQuestions = planQuestions(matchedRules, answeredIds)

  const escalationLevel = resolveEscalation(matchedRules, text)
  const repairEstimate = probableCauses.length
    ? estimateRepair(matchedRules, probableCauses)
    : undefined

  const phase = advancePhase(state, overallConfidence, escalationLevel)
  state.phase = phase

  const recommendedActions = buildRecommendedActions(escalationLevel, repairEstimate?.needsOnSite)

  return {
    state,
    probableCauses,
    nextQuestions,
    repairEstimate,
    recommendedActions,
    escalationLevel,
    overallConfidence,
  }
}

function buildRecommendedActions(
  escalation: string,
  needsOnSite?: boolean,
): RecommendedAction[] {
  const actions: RecommendedAction[] = []

  if (escalation === 'urgent') {
    actions.push({
      type: 'urgent',
      label: 'Contactez Allotech72 immédiatement',
      description: 'Éteignez l\'appareil et appelez un technicien sans attendre.',
    })
    return actions
  }

  if (needsOnSite !== false) {
    actions.push({
      type: 'contact',
      label: 'Demander une intervention à domicile',
      description: 'Devis gratuit — intervention sur Le Mans et Sarthe.',
    })
  } else {
    actions.push({
      type: 'remote',
      label: 'Assistance à distance possible',
      description: 'Certaines pannes peuvent être résolues par téléphone ou visio.',
    })
  }

  actions.push({
    type: 'self_help',
    label: 'Essayer les étapes de dépannage simples',
    description: 'Redémarrage, vérification câbles, test sur un autre appareil.',
  })

  return actions
}

export type { DiagnosticInput, DiagnosticOutput } from './types.ts'
