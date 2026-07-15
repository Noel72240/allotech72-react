import type { DiagnosticInput, DiagnosticState } from './types.ts'

/** Normalise et extrait les symptômes d'un message utilisateur */
export function analyzeSymptoms(input: DiagnosticInput): string[] {
  const text = (input.message || '').toLowerCase()
  const existing = input.symptoms || input.history?.symptoms || []
  const fromHistory = existing.map(s => s.toLowerCase().trim()).filter(Boolean)

  if (fromHistory.length && text.length < 10) return fromHistory

  const sentences = text
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3)

  const combined = [...new Set([...fromHistory, ...sentences])]
  return combined.length ? combined : [text.trim()].filter(Boolean)
}

/** Détecte le type d'appareil depuis le texte et les mémoires */
export function detectDevice(input: DiagnosticInput): DiagnosticInput['device'] {
  if (input.device) return input.device
  if (input.history?.device) return input.history.device

  const text = (input.message || '').toLowerCase()
  const memDevice = input.memories?.find(m => m.memoryType === 'device' || m.key === 'device')
  if (memDevice) {
    return { type: 'other', model: memDevice.value }
  }

  if (/iphone|android|samsung|smartphone|téléphone|telephone/.test(text)) return { type: 'phone' }
  if (/tablette|ipad/.test(text)) return { type: 'tablet' }
  if (/mac|macbook|imac/.test(text)) return { type: 'mac' }
  if (/portable|laptop|pc portable/.test(text)) return { type: 'laptop' }
  if (/ordinateur|pc|windows/.test(text)) return { type: 'pc' }
  return undefined
}

export function buildInitialState(input: DiagnosticInput): DiagnosticState {
  return {
    phase: 'intake',
    symptoms: analyzeSymptoms(input),
    answeredQuestions: input.history?.answeredQuestions || [],
    device: detectDevice(input),
  }
}
