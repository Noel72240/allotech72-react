/** Types du module diagnostic — indépendants du LLM */

export type DiagnosticPhase = 'intake' | 'triage' | 'hypothesis' | 'clarify' | 'estimate' | 'resolve' | 'escalate'
export type EscalationLevel = 'self_help' | 'remote' | 'on_site' | 'urgent'
export type CauseCategory = 'hardware' | 'software' | 'network' | 'malware' | 'mobile' | 'unknown'

export interface DeviceInfo {
  type?: 'pc' | 'laptop' | 'mac' | 'phone' | 'tablet' | 'other'
  brand?: string
  model?: string
  os?: string
}

export interface MemoryFact {
  key: string
  value: string
  memoryType?: string
}

export interface KnowledgeHint {
  content: string
  category?: string
  title?: string
}

export interface DiagnosticState {
  phase: DiagnosticPhase
  symptoms: string[]
  answeredQuestions: Array<{ question: string; answer: string }>
  device?: DeviceInfo
}

export interface RankedCause {
  id: string
  label: string
  confidence: number
  evidence: string[]
  category: CauseCategory
}

export interface PlannedQuestion {
  id: string
  question: string
  priority: number
  reason: string
}

export interface RepairEstimate {
  complexity: 'low' | 'medium' | 'high'
  durationMin: number
  durationMax: number
  priceRangeMin: number
  priceRangeMax: number
  needsOnSite: boolean
  notes: string
}

export interface RecommendedAction {
  type: 'self_help' | 'remote' | 'contact' | 'urgent'
  label: string
  description: string
}

export interface DiagnosticInput {
  message: string
  symptoms?: string[]
  device?: DeviceInfo
  history?: DiagnosticState | null
  memories?: MemoryFact[]
  knowledgeHints?: KnowledgeHint[]
}

export interface DiagnosticOutput {
  state: DiagnosticState
  probableCauses: RankedCause[]
  nextQuestions: PlannedQuestion[]
  repairEstimate?: RepairEstimate
  recommendedActions: RecommendedAction[]
  escalationLevel: EscalationLevel
  overallConfidence: number
}

export interface DiagnosticRule {
  id: string
  category: CauseCategory
  keywords: string[]
  causes: Array<{ id: string; label: string; weight: number; evidence: string }>
  questions: Array<{ id: string; question: string; priority: number; reason: string }>
  estimate?: Omit<RepairEstimate, 'notes'> & { notes?: string }
  escalation?: EscalationLevel
}
