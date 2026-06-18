/** Outils informatiques gratuits — page /outils */
export const OUTILS_CATEGORIES = [
  { id: 'all',        label: 'Tous' },
  { id: 'diagnostic', label: 'Diagnostic PC' },
  { id: 'securite',   label: 'Sécurité & nettoyage' },
  { id: 'sauvegarde', label: 'Sauvegarde & récupération' },
  { id: 'distance',   label: 'Assistance à distance' },
]

export const OUTILS = [
  {
    id: 'cpu-z',
    name: 'CPU-Z',
    icon: '🔲',
    category: 'diagnostic',
    description: 'Permet d\'obtenir des informations détaillées sur le processeur, la mémoire RAM et la carte mère.',
    url: 'https://www.cpuid.com/softwares/cpu-z.html',
  },
  {
    id: 'hwmonitor',
    name: 'HWMonitor',
    icon: '🌡️',
    category: 'diagnostic',
    description: 'Permet de surveiller les températures, tensions et ventilateurs du PC.',
    url: 'https://www.cpuid.com/softwares/hwmonitor.html',
  },
  {
    id: 'crystaldiskinfo',
    name: 'CrystalDiskInfo',
    icon: '💾',
    category: 'diagnostic',
    description: 'Permet de vérifier l\'état de santé des SSD et disques durs.',
    url: 'https://crystalmark.info/en/software/crystaldiskinfo/',
  },
  {
    id: 'crystaldiskmark',
    name: 'CrystalDiskMark',
    icon: '📊',
    category: 'diagnostic',
    description: 'Permet de tester les performances réelles des SSD et disques durs.',
    url: 'https://crystalmark.info/en/software/crystaldiskmark/',
  },
  {
    id: 'malwarebytes',
    name: 'Malwarebytes',
    icon: '🛡️',
    category: 'securite',
    description: 'Détecte et supprime les logiciels malveillants.',
    url: 'https://www.malwarebytes.com',
  },
  {
    id: 'adwcleaner',
    name: 'AdwCleaner',
    icon: '🧹',
    category: 'securite',
    description: 'Supprime les adwares, barres publicitaires et programmes indésirables.',
    url: 'https://www.malwarebytes.com/adwcleaner',
  },
  {
    id: 'bleachbit',
    name: 'BleachBit',
    icon: '🗑️',
    category: 'securite',
    description: 'Nettoie les fichiers inutiles et libère de l\'espace disque.',
    url: 'https://www.bleachbit.org',
  },
  {
    id: 'recuva',
    name: 'Recuva',
    icon: '♻️',
    category: 'sauvegarde',
    description: 'Permet de récupérer des fichiers supprimés accidentellement.',
    url: 'https://www.ccleaner.com/recuva',
  },
  {
    id: 'macrium',
    name: 'Macrium Reflect',
    icon: '💿',
    category: 'sauvegarde',
    description: 'Permet de créer une image complète du système et de sauvegarder ses données.',
    url: 'https://www.macrium.com/reflectfree',
  },
  {
    id: 'anydesk',
    name: 'AnyDesk',
    icon: '🖥️',
    category: 'distance',
    featured: true,
    recommended: true,
    description: 'Permet à ALLOTECH72 de prendre la main à distance sur votre ordinateur afin de diagnostiquer et résoudre rapidement certains problèmes sans déplacement.',
    features: ['Assistance rapide', 'Connexion sécurisée', 'Compatible Windows', 'Compatible Mac', 'Compatible Linux', 'Très simple à utiliser'],
    url: 'https://anydesk.com/fr',
  },
]

export const OUTILS_FAQ = [
  {
    q: 'Quel logiciel utiliser pour tester mon disque dur ?',
    a: 'CrystalDiskMark permet de mesurer les performances de lecture/écriture de votre disque dur ou SSD. Pour l\'état de santé (usure, secteurs défectueux), utilisez CrystalDiskInfo. Les deux sont gratuits et recommandés par ALLOTECH72.',
  },
  {
    q: 'Comment vérifier la santé de mon SSD ?',
    a: 'Téléchargez CrystalDiskInfo : il affiche l\'état SMART du disque (Bon, Prudent, Mauvais). Un SSD en bon état affiche généralement « Bon » en vert. En cas de doute, contactez ALLOTECH72 au 06 13 89 39 67.',
  },
  {
    q: 'Comment nettoyer mon ordinateur gratuitement ?',
    a: 'BleachBit supprime les fichiers temporaires et libère de l\'espace. AdwCleaner élimine les barres publicitaires et programmes indésirables. Pour un nettoyage complet, ALLOTECH72 peut intervenir à domicile ou à distance.',
  },
  {
    q: 'Quel logiciel pour supprimer un virus ?',
    a: 'Malwarebytes est efficace contre les malwares, ransomwares et logiciels espions. AdwCleaner complète le nettoyage des adwares. En cas d\'infection persistante, faites appel à ALLOTECH72 pour un dépannage professionnel.',
  },
  {
    q: 'Comment obtenir une assistance informatique à distance ?',
    a: 'Téléchargez AnyDesk sur votre ordinateur, installez-le puis contactez ALLOTECH72 au 06 13 89 39 67 ou via le formulaire de contact. Je vous communique mon identifiant AnyDesk pour une prise en main sécurisée.',
  },
  {
    q: 'Comment ALLOTECH72 intervient à distance ?',
    a: 'Après installation d\'AnyDesk, vous me communiquez votre code de session (9 chiffres). Je me connecte avec votre accord pour diagnostiquer messagerie, virus, Windows, imprimantes ou bureautique — sans déplacement, rapidement.',
  },
]

export const REMOTE_SERVICES = [
  'Messagerie',
  'Installation de logiciels',
  'Nettoyage PC',
  'Suppression de virus',
  'Configuration Windows',
  'Imprimantes',
  'Assistance bureautique',
]

export const ALLOTECH_SERVICES = [
  'Dépannage informatique',
  'Réparation PC',
  'Installation Windows',
  'Nettoyage et optimisation',
  'Récupération de données',
  'Réparation de téléphones',
  'Assistance numérique',
]
