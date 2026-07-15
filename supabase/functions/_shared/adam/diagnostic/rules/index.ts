import type { DiagnosticRule } from './types.ts'

export const bootIssuesRule: DiagnosticRule = {
  id: 'boot-issues',
  category: 'hardware',
  keywords: [
    'démarre pas', 'demarre pas', 'ne démarre', 'ne demarre', 'écran noir', 'ecran noir',
    'bloqué au démarrage', 'bloque au demarrage', 'bios', 'allume pas', 's\'allume pas',
    's allume pas', 'planté au logo', 'plante au logo', 'boot', 'démarrage', 'demarrage',
  ],
  causes: [
    { id: 'psu-failure', label: 'Alimentation défectueuse', weight: 0.7, evidence: 'Aucun bruit ventilateur, LED éteinte' },
    { id: 'ram-issue', label: 'Barrette RAM mal insérée ou défectueuse', weight: 0.65, evidence: 'Bips au démarrage, redémarrages aléatoires' },
    { id: 'disk-failure', label: 'Disque dur / SSD défaillant', weight: 0.75, evidence: 'Blocage sur logo Windows, bruit clic disque' },
    { id: 'os-corrupt', label: 'Système Windows corrompu', weight: 0.8, evidence: 'Écran bleu au démarrage, boucle de redémarrage' },
    { id: 'display-cable', label: 'Câble écran ou carte graphique', weight: 0.55, evidence: 'PC semble démarrer (ventilateurs) mais écran noir' },
  ],
  questions: [
    { id: 'q-led', question: 'Voyez-vous des LED ou entendez-vous le ventilateur quand vous appuyez sur le bouton power ?', priority: 1, reason: 'Distinguer panne alimentation vs écran' },
    { id: 'q-recent', question: 'Avez-vous installé un logiciel ou une mise à jour juste avant le problème ?', priority: 2, reason: 'Oriente vers corruption OS' },
    { id: 'q-beeps', question: 'Entendez-vous des bips au démarrage ?', priority: 3, reason: 'Code erreur BIOS / RAM' },
  ],
  estimate: { complexity: 'medium', durationMin: 30, durationMax: 120, priceRangeMin: 49, priceRangeMax: 120, needsOnSite: true },
  escalation: 'on_site',
}

export const networkIssuesRule: DiagnosticRule = {
  id: 'network-issues',
  category: 'network',
  keywords: [
    'wifi', 'wi-fi', 'wi fi', 'internet', 'connexion', 'réseau', 'reseau', 'box', 'débit', 'debit',
    'lent', 'déconnecte', 'deconnecte', 'pas de réseau', 'pas de reseau', 'câble', 'cable', 'ethernet',
  ],
  causes: [
    { id: 'router-reboot', label: 'Box/routeur à redémarrer', weight: 0.85, evidence: 'Problème intermittent, tous appareils affectés' },
    { id: 'wifi-driver', label: 'Pilote Wi-Fi obsolète ou corrompu', weight: 0.7, evidence: 'Un seul PC affecté, câble ethernet fonctionne' },
    { id: 'dns-issue', label: 'Problème DNS ou configuration IP', weight: 0.65, evidence: 'Connecté mais sites inaccessibles' },
    { id: 'interference', label: 'Interférences Wi-Fi ou mauvais canal', weight: 0.6, evidence: 'Signal faible, déconnexions aléatoires' },
    { id: 'isp-outage', label: 'Panne opérateur / ligne', weight: 0.5, evidence: 'Box orange/rouge, voisins aussi impactés' },
  ],
  questions: [
    { id: 'q-all-devices', question: 'Le problème concerne-t-il tous vos appareils ou un seul ?', priority: 1, reason: 'Box vs appareil local' },
    { id: 'q-ethernet', question: 'Avez-vous testé avec un câble Ethernet directement sur la box ?', priority: 2, reason: 'Isoler Wi-Fi vs ligne' },
    { id: 'q-when', question: 'Le problème est-il constant ou intermittent ?', priority: 3, reason: 'Interférences vs panne matérielle' },
  ],
  estimate: { complexity: 'low', durationMin: 20, durationMax: 60, priceRangeMin: 39, priceRangeMax: 79, needsOnSite: false },
  escalation: 'remote',
}

export const malwareRule: DiagnosticRule = {
  id: 'malware',
  category: 'malware',
  keywords: [
    'virus', 'malware', 'lent', 'lenteur', 'lenteur', 'pub', 'pop-up', 'popup', 'ransomware',
    'crypté', 'chiffré', 'antivirus', 'infecté', 'infecte', 'spyware', 'trojan', 'cheval de troie',
    'navigateur', 'redirection', 'arnaque',
  ],
  causes: [
    { id: 'adware', label: 'Adware / logiciels indésirables (PUP)', weight: 0.8, evidence: 'Pop-ups, barres d\'outils, lenteur navigateur' },
    { id: 'trojan', label: 'Trojan ou backdoor', weight: 0.65, evidence: 'Activité réseau suspecte, comptes compromis' },
    { id: 'resource-hog', label: 'Processus gourmand (minage, malware)', weight: 0.7, evidence: 'CPU/RAM à 100% au repos' },
    { id: 'fake-av', label: 'Fausse alerte antivirus (scareware)', weight: 0.75, evidence: 'Messages alarmistes demandant paiement' },
    { id: 'legitimate-slow', label: 'Lenteur légitime (disque plein, vieux HDD)', weight: 0.6, evidence: 'Pas de pop-ups, disque quasi plein' },
  ],
  questions: [
    { id: 'q-symptoms', question: 'Voyez-vous des messages d\'alerte ou des fenêtres pop-up inhabituelles ?', priority: 1, reason: 'Type de malware' },
    { id: 'q-recent-dl', question: 'Avez-vous téléchargé ou installé quelque chose récemment ?', priority: 2, reason: 'Vecteur d\'infection' },
    { id: 'q-backup', question: 'Avez-vous une sauvegarde récente de vos fichiers importants ?', priority: 3, reason: 'Sécurité avant nettoyage' },
  ],
  estimate: { complexity: 'medium', durationMin: 45, durationMax: 120, priceRangeMin: 59, priceRangeMax: 99, needsOnSite: true },
  escalation: 'on_site',
}

export const hardwareRule: DiagnosticRule = {
  id: 'hardware',
  category: 'hardware',
  keywords: [
    'écran', 'ecran', 'cassé', 'casse', 'batterie', 'surchauffe', 'chauffe', 'bruit', 'ventilateur',
    'clavier', 'touchpad', 'trackpad', 'disque dur', 'ssd', 'fumée', 'fumee', 'odeur', 'gonflé',
    'gonfle', 'blue screen', 'écran bleu', 'ecran bleu', 'bsod',
  ],
  causes: [
    { id: 'screen-damage', label: 'Dalle ou dalle LCD/OLED endommagée', weight: 0.85, evidence: 'Fissures, taches, lignes à l\'écran' },
    { id: 'battery-fail', label: 'Batterie usée ou gonflée', weight: 0.8, evidence: 'Autonomie nulle, déconnexion alimentation' },
    { id: 'overheating', label: 'Surchauffe (poussière, pâte thermique)', weight: 0.75, evidence: 'Extinction aléatoire, ventilateur bruyant' },
    { id: 'hdd-fail', label: 'Disque dur en fin de vie', weight: 0.7, evidence: 'Bruits clics, lenteur extrême, BSOD' },
    { id: 'keyboard-fail', label: 'Clavier défectueux (liquide ou usure)', weight: 0.65, evidence: 'Touches non réactives après renversement' },
  ],
  questions: [
    { id: 'q-visible', question: 'Y a-t-il un dommage visible (fissure, gonflement, odeur de brûlé) ?', priority: 1, reason: 'Urgence sécurité' },
    { id: 'q-when-start', question: 'Quand le problème a-t-il commencé ? Après un choc ou une chute ?', priority: 2, reason: 'Cause traumatique' },
    { id: 'q-warranty', question: 'L\'appareil est-il encore sous garantie constructeur ?', priority: 4, reason: 'Orientation SAV' },
  ],
  estimate: { complexity: 'high', durationMin: 60, durationMax: 180, priceRangeMin: 59, priceRangeMax: 200, needsOnSite: true },
  escalation: 'on_site',
}

export const mobileRule: DiagnosticRule = {
  id: 'mobile',
  category: 'mobile',
  keywords: [
    'iphone', 'android', 'samsung', 'téléphone', 'telephone', 'smartphone', 'mobile', 'tablette',
    'ipad', 'écran tactile', 'ecran tactile', 'ne charge pas', 'charge pas', 'apple', 'xiaomi',
    'huawei', 'oppo',
  ],
  causes: [
    { id: 'screen-replace', label: 'Écran ou vitre à remplacer', weight: 0.85, evidence: 'Fissures, tactile partiellement mort' },
    { id: 'battery-replace', label: 'Batterie à remplacer', weight: 0.8, evidence: 'Ne tient plus la charge, s\'éteint à 30%' },
    { id: 'charge-port', label: 'Connecteur de charge endommagé', weight: 0.7, evidence: 'Charge intermittente, câble bouge' },
    { id: 'software-lock', label: 'Blocage logiciel / mise à jour', weight: 0.65, evidence: 'Bloqué sur logo Apple/Android' },
    { id: 'water-damage', label: 'Dommage liquide', weight: 0.75, evidence: 'Contact eau récent, taches écran' },
  ],
  questions: [
    { id: 'q-model', question: 'Quel est le modèle exact de votre téléphone ou tablette ?', priority: 1, reason: 'Pièces et tarifs' },
    { id: 'q-drop', question: 'L\'appareil est-il tombé ou a-t-il été en contact avec un liquide ?', priority: 2, reason: 'Dommage physique' },
    { id: 'q-backup-m', question: 'Vos photos et contacts sont-ils sauvegardés (cloud) ?', priority: 3, reason: 'Avant réparation' },
  ],
  estimate: { complexity: 'medium', durationMin: 30, durationMax: 90, priceRangeMin: 49, priceRangeMax: 150, needsOnSite: false },
  escalation: 'on_site',
}

export const ALL_DIAGNOSTIC_RULES: DiagnosticRule[] = [
  bootIssuesRule,
  networkIssuesRule,
  malwareRule,
  hardwareRule,
  mobileRule,
]

export function getRuleById(id: string): DiagnosticRule | undefined {
  return ALL_DIAGNOSTIC_RULES.find(r => r.id === id)
}
