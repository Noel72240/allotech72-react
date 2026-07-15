import { buildPersonaBlock, PERSONA_VERSION } from './persona.ts'
import { buildRulesBlock } from './rules.ts'
import { buildStyleBlock, type StyleOptions } from './style.ts'
import { buildBusinessBlock, loadBusinessContext, type BusinessContext } from './business.ts'
import { buildEthicsBlock } from './ethics.ts'

export { PERSONA_VERSION, loadBusinessContext, type BusinessContext, type StyleOptions }

export interface PersonaBundle {
  systemPrompt: string
  version: string
  business: BusinessContext
}

export interface AssemblePersonaOptions extends StyleOptions {}

/** Assemble la personnalité complète d'Adam pour le prompt système */
export function assemblePersona(options: AssemblePersonaOptions): PersonaBundle {
  const business = loadBusinessContext()
  const sections = [
    buildPersonaBlock(),
    '',
    '## Contexte entreprise',
    buildBusinessBlock(business),
    '',
    '## Règles comportementales',
    buildRulesBlock(),
    '',
    '## Style',
    buildStyleBlock(options),
    '',
    '## Éthique et limites',
    buildEthicsBlock(),
  ]

  return {
    systemPrompt: sections.join('\n'),
    version: PERSONA_VERSION,
    business,
  }
}
