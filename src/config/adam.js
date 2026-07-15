/** Configuration UI Adam — affichage uniquement, pas de logique agent */

export const ADAM_SESSION_KEY = 'at72_adam_session'

export const adamConfig = {
  name: 'Adam',
  tagline: 'Assistant technique · Allotech72',
  welcomeMessage:
    'Bonjour ! Je suis Adam, assistant Allotech72. Quel problème informatique puis-je vous aider à résoudre ?',
  placeholder: 'Décrivez votre panne ou posez votre question…',
  thinkingLabel: 'Adam réfléchit…',
  maxMessageLength: 4000,
  disclaimer:
    'Adam est une IA · Allotech72 · Diagnostic gratuit',
  quickPrompts: [
    { id: 'slow-pc', label: 'PC lent', text: 'Mon ordinateur est très lent, que puis-je faire ?' },
    { id: 'virus', label: 'Virus / lenteur', text: 'Je pense avoir un virus ou un problème de sécurité.' },
    { id: 'quote', label: 'Demander un devis', text: 'Je souhaite demander un devis pour une intervention.' },
  ],
}
