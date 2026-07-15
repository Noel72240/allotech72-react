import type { DiagnosticPhase, DiagnosticState, EscalationLevel } from './types.ts'
import { getDiagnosticConfidenceThreshold } from '../llm/config.ts'

/** Machine à états du diagnostic */
export function advancePhase(
  state: DiagnosticState,
  overallConfidence: number,
  escalation: EscalationLevel,
): DiagnosticPhase {
  if (escalation === 'urgent') return 'escalate'
  if (state.phase === 'intake') return 'triage'
  if (overallConfidence >= getDiagnosticConfidenceThreshold()) return 'estimate'
  if (state.answeredQuestions.length >= 2) return 'hypothesis'
  return 'clarify'
}

export function nextPhaseLabel(phase: DiagnosticPhase): string {
  const labels: Record<DiagnosticPhase, string> = {
    intake: 'Collecte des symptômes',
    triage: 'Tri initial',
    hypothesis: 'Hypothèses en cours',
    clarify: 'Questions de clarification',
    estimate: 'Estimation',
    resolve: 'Résolution proposée',
    escalate: 'Escalade urgente',
  }
  return labels[phase] || phase
}
