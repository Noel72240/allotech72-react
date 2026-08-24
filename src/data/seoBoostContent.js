import config, { fullName } from '../config.js'
import { SEO_LOCAL_CITIES, SEO_ALL_SERVICE_PAGES } from './seoPages.js'

const tel = config.telephone
const brand = config.brand
const prenom = config.prenom

const defaultRelated = (exclude = []) =>
  SEO_ALL_SERVICE_PAGES.filter((p) => !exclude.includes(p.to)).slice(0, 6)

const commonFaqTail = [
  {
    q: `Combien coûte une intervention ${brand} ?`,
    r: `Les tarifs sont transparents et annoncés avant réparation. Diagnostic gratuit, virus dès 25 €, entretien PC 40 € (hors pièces). Devis gratuit au ${tel}. Grille : /tarifs.`,
  },
  {
    q: 'Dans quelles communes intervenez-vous ?',
    r: `${brand} couvre toute la Sarthe (352 communes) : Le Mans, Lombron, Allonnes, Champagné, Montfort-le-Gesnois, Connerré, Yvré-l'Évêque et environs. Appelez pour confirmer le déplacement.`,
  },
  {
    q: 'Quel est le délai d’intervention ?',
    r: `En général sous 24 à 48h. Pour une urgence, contactez ${prenom} au ${tel}.`,
  },
  {
    q: `Depuis quand existe ${brand} ?`,
    r: `${brand} a ouvert en août 2025. ${fullName()} apporte 15 ans de passion informatique et compte déjà plus de 100 clients satisfaits en Sarthe.`,
  },
]

/** Contenu SEO enrichi par page — textes uniques pour éviter le duplicate content */
export const SEO_BOOST = {
  'virus-malwares': {
    topic: 'Virus & malwares Le Mans',
    city: 'Le Mans',
    stag: 'Guide complet',
    paragraphs: [
      `Un PC infecté se reconnaît souvent à des pop-ups, un navigateur détourné, une lenteur soudaine ou des fichiers inaccessibles (ransomware). Sur Le Mans et en Sarthe, ${brand} intervient à domicile pour diagnostiquer la menace, nettoyer le système et sécuriser le poste.`,
      `${fullName()} utilise des outils professionnels de nettoyage, vérifie les points de démarrage, le navigateur et les comptes utilisateurs, puis remet en place les protections essentielles (mises à jour, antivirus léger, bonnes pratiques). Vos données sont traitées avec précaution.`,
      `Si l’infection est trop avancée, une réinstallation Windows propre peut être proposée — toujours après devis et accord. Pour une panne matérielle sans virus, consultez plutôt la réparation PC.`,
    ],
    steps: [
      { t: 'Appel / diagnostic', d: 'Vous décrivez les symptômes — on estime la gravité.' },
      { t: 'Nettoyage sur place', d: 'Analyse, suppression des menaces, contrôle du démarrage.' },
      { t: 'Sécurisation', d: 'Protections + conseils pour éviter la réinfection.' },
    ],
    faq: [
      {
        q: 'Mon PC affiche des publicités partout : est-ce un virus ?',
        r: 'Souvent oui (adware / malware). Un nettoyage + sécurisation du navigateur règle la plupart des cas à domicile.',
      },
      {
        q: 'Que faire en cas de ransomware (fichiers chiffrés) ?',
        r: 'Ne payez pas immédiatement. Contactez-nous : on évalue si une restauration / récupération est possible avant toute décision.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC Le Mans' },
      { to: '/installation-windows-sarthe', label: 'Installation Windows Sarthe' },
      { to: '/recuperation-donnees-sarthe', label: 'Récupération de données' },
      { to: '/depannage-informatique-le-mans', label: 'Dépannage informatique Le Mans' },
    ],
    cta: 'PC infecté à Le Mans ou en Sarthe ?',
  },

  'wifi-reseau': {
    topic: 'Wi-Fi & réseau Le Mans',
    city: 'Le Mans',
    stag: 'Guide complet',
    paragraphs: [
      `Wi-Fi qui coupe, box qui redémarre, fibre qui ne tient pas, imprimante invisible : les pannes réseau sont fréquentes à domicile. ${brand} se déplace sur Le Mans et en Sarthe pour diagnostiquer box, canaux Wi-Fi, coverage et matériel réseau.`,
      `Selon le logement (murs épais, étages, distance box), on optimise le placement, le canal, ou on conseille répéteur / mesh. On configure aussi le partage de fichiers, le CPL et la sécurité du mot de passe Wi-Fi.`,
    ],
    steps: [
      { t: 'Test connexion', d: 'Box, débit, couverture pièce par pièce.' },
      { t: 'Correction', d: 'Réglages, câblage, répéteur ou mesh si besoin.' },
      { t: 'Validation', d: 'Tous les appareils reconnectés et sécurisés.' },
    ],
    faq: [
      {
        q: 'Le Wi-Fi est bon près de la box mais nul à l’étage : que faire ?',
        r: 'Souvent un problème de couverture. On teste, puis on propose répéteur, CPL ou mesh adapté à votre logement.',
      },
      {
        q: 'Intervenez-vous après un changement d’opérateur fibre ?',
        r: 'Oui — configuration de la nouvelle box, Wi-Fi, TV box et appareils du foyer.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/depannage-informatique-le-mans', label: 'Dépannage informatique' },
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC' },
      { to: '/virus-malwares-depannage-le-mans', label: 'Virus & malwares' },
      { to: '/informaticien-domicile-sarthe', label: 'Informaticien à domicile' },
    ],
    cta: 'Internet capricieux à Le Mans ?',
  },

  'depannage-sarthe': {
    topic: 'Dépannage informatique Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `${brand} assure le dépannage informatique à domicile dans tout le département de la Sarthe. Basé à Lombron, ${prenom} intervient pour PC lent, panne au démarrage, virus, Wi-Fi ou téléphone.`,
      `Particularités ou petites entreprises : diagnostic clair, devis avant réparation, déplacement rapide. Zone complète : ${SEO_LOCAL_CITIES.join(', ')} et l’ensemble des 352 communes sartoises.`,
    ],
    steps: [
      { t: 'Contact', d: 'Appel ou formulaire — réponse rapide.' },
      { t: 'Intervention', d: 'À domicile sous 24–48h en moyenne.' },
      { t: 'Réparation', d: 'Devis validé, problème traité, explications.' },
    ],
    faq: [
      {
        q: 'Êtes-vous limité à Le Mans ?',
        r: `Non. ${brand} couvre toute la Sarthe. Le Mans est une zone forte, mais Lombron, Connerré, Montfort, Allonnes et les autres communes sont desservies.`,
      },
      ...commonFaqTail,
    ],
    related: defaultRelated(['/depannage-informatique-sarthe']),
    cta: 'Besoin d’un dépannage en Sarthe ?',
  },

  'informaticien-domicile': {
    topic: 'Informaticien à domicile Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Cherchez un informaticien à domicile en Sarthe ? ${fullName()} se déplace chez vous pour dépanner, installer, sécuriser ou vous former — sans jargon, au juste prix.`,
      `Idéal pour seniors, débutants et indépendants qui préfèrent une intervention humaine sur place plutôt qu’un SAV distant impersonnel.`,
    ],
    steps: [
      { t: 'Prise de RDV', d: `Appelez le ${tel} ou écrivez via le formulaire.` },
      { t: 'Chez vous', d: 'Diagnostic gratuit annoncé, devis avant action.' },
      { t: 'Suivi', d: 'Conseils pour que ça ne se reproduise pas.' },
    ],
    faq: [
      {
        q: 'Proposez-vous de l’assistance à distance ?',
        r: 'Oui quand c’est adapté. Sinon, intervention à domicile sur Le Mans et toute la Sarthe.',
      },
      ...commonFaqTail,
    ],
    related: defaultRelated(['/informaticien-domicile-sarthe']),
    cta: 'Réserver un informaticien à domicile',
  },

  'recuperation-donnees': {
    topic: 'Récupération de données Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Disque dur qui claque, SSD inaccessible, fichiers supprimés, PC qui ne démarre plus : ${brand} tente la récupération de vos photos, documents et dossiers professionnels avant toute opération destructive.`,
      `Plus vous agissez tôt (sans réinstaller Windows à l’aveugle), meilleures sont les chances. Diagnostic honnête : si la récupération est trop incertaine, on vous le dit clairement.`,
    ],
    steps: [
      { t: 'Évaluation', d: 'État du support et chances de récupération.' },
      { t: 'Extraction', d: 'Copie sécurisée des données récupérables.' },
      { t: 'Restitution', d: 'Fichiers sur disque externe ou nouveau PC.' },
    ],
    faq: [
      {
        q: 'Pouvez-vous récupérer un disque qui fait du bruit ?',
        r: 'Parfois partiellement. On évalue sans promettre l’impossible — transparence avant devis.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC' },
      { to: '/depannage-pc-portable-sarthe', label: 'PC portable Sarthe' },
      { to: '/installation-windows-sarthe', label: 'Installation Windows' },
      { to: '/depannage-informatique-le-mans', label: 'Dépannage Le Mans' },
    ],
    cta: 'Données perdues en Sarthe ?',
  },

  'installation-windows': {
    topic: 'Installation Windows Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Réinstallation Windows propre, migration vers un nouveau PC, ou remise à neuf après infection : ${brand} installe Windows à domicile en Sarthe, avec pilotes, mises à jour et configuration de base.`,
      `Sauvegarde de vos données possible avant formatage (selon l’état du disque). Activation licence, comptes utilisateurs et sécurité de départ inclus dans le devis.`,
    ],
    steps: [
      { t: 'Sauvegarde', d: 'Quand c’est possible, on protège vos fichiers.' },
      { t: 'Installation', d: 'Windows + pilotes + mises à jour.' },
      { t: 'Prise en main', d: 'Comptes, antivirus, explications.' },
    ],
    faq: [
      {
        q: 'Faut-il racheter une licence Windows ?',
        r: 'Pas toujours — on vérifie si une licence OEM / digitale est récupérable avant d’en acheter une.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/virus-malwares-depannage-le-mans', label: 'Virus & malwares' },
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC' },
      { to: '/recuperation-donnees-sarthe', label: 'Récupération données' },
      { to: '/maintenance-informatique-sarthe', label: 'Maintenance' },
    ],
    cta: 'Installer Windows à domicile ?',
  },

  'maintenance': {
    topic: 'Maintenance informatique Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Maintenance préventive pour particuliers et TPE en Sarthe : nettoyage, mises à jour, sauvegardes, contrôle antivirus et santé disque. Mieux vaut 1h de prévention qu’une panne le jour J.`,
      `${brand} peut intervenir ponctuellement ou sur un rythme convenu (mensuel / trimestriel) selon votre parc.`,
    ],
    steps: [
      { t: 'Bilan', d: 'État du PC / des postes.' },
      { t: 'Entretien', d: 'Nettoyage, updates, sauvegardes.' },
      { t: 'Rapport', d: 'Ce qui a été fait + alertes.' },
    ],
    faq: [
      {
        q: 'La maintenance est-elle utile pour un seul PC perso ?',
        r: 'Oui — surtout si le PC rame, a 4+ ans, ou stocke des photos / dossiers importants.',
      },
      ...commonFaqTail,
    ],
    related: defaultRelated(['/maintenance-informatique-sarthe']),
    cta: 'Planifier une maintenance en Sarthe',
  },

  'pc-portable': {
    topic: 'Dépannage PC portable Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `PC portable qui ne charge plus, chauffe, a un écran abîmé, un clavier HS ou refuse de démarrer : ${brand} dépanne les portables toutes marques à domicile en Sarthe.`,
      `Diagnostic matériel / logiciel, devis avant changement de pièce, et alternatives (SSD, RAM) pour prolonger la vie de l’appareil.`,
    ],
    steps: [
      { t: 'Diagnostic', d: 'Matériel vs logiciel, devis clair.' },
      { t: 'Réparation', d: 'Sur place ou avec pièce si besoin.' },
      { t: 'Test', d: 'Validation charge, écran, perf.' },
    ],
    faq: [
      {
        q: 'Réparez-vous toutes les marques de portables ?',
        r: 'Oui — HP, Dell, Lenovo, Asus, Acer, Apple (selon modèle), etc. Disponibilité des pièces selon modèle.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation ordinateur Le Mans' },
      { to: '/depannage-informatique-sarthe', label: 'Dépannage Sarthe' },
      { to: '/recuperation-donnees-sarthe', label: 'Récupération données' },
      { to: '/reparateur-telephone-le-mans', label: 'Téléphone & tablettes' },
    ],
    cta: 'PC portable en panne en Sarthe ?',
  },

  'logiciel-sur-mesure': {
    topic: 'Logiciel sur mesure Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Besoin d’un outil métier, d’un petit CRM ou d’un portail client ? ${brand} conçoit des solutions web sur mesure pour artisans et TPE sartoises — simples, maintenables, hébergées proprement.`,
      `De l’audit du besoin au déploiement, avec une approche pragmatique (pas de sur-ingénierie).`,
    ],
    steps: [
      { t: 'Cahier des besoins', d: 'On clarifie le vrai besoin.' },
      { t: 'Prototype', d: 'Validation rapide avant build complet.' },
      { t: 'Livraison', d: 'Mise en ligne + formation courte.' },
    ],
    faq: [
      {
        q: 'Est-ce réservé aux grandes entreprises ?',
        r: 'Non — on vise surtout indépendants et TPE en Sarthe qui ont un besoin concret et un budget maîtrisé.',
      },
      ...commonFaqTail.slice(0, 2),
    ],
    related: [
      { to: '/creation-site-internet-sarthe', label: 'Création site internet' },
      { to: '/services-informatiques-sarthe', label: 'Services informatiques Sarthe' },
      { to: '/maintenance-informatique-sarthe', label: 'Maintenance' },
      { to: '/references', label: 'Références' },
    ],
    cta: 'Parler de votre projet logiciel',
  },

  'services-pilier': {
    topic: 'Services informatiques Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `${brand} est votre interlocuteur informatique local en Sarthe : dépannage, réparation PC & téléphone, réseau, sécurité, création de sites et maintenance. Une seule adresse pour les particuliers et TPE.`,
      `Cette page pilier regroupe nos services. Choisissez le guide qui correspond à votre panne ou besoin pour aller plus loin.`,
    ],
    steps: [
      { t: 'Identifiez le besoin', d: 'Panne, upgrade, site, maintenance…' },
      { t: 'Contactez-nous', d: `Tél. ${tel} ou formulaire.` },
      { t: 'Intervention', d: 'Devis clair, action, suivi.' },
    ],
    faq: [
      {
        q: 'Quels services proposez-vous exactement ?',
        r: 'Dépannage PC/Mac, téléphone, virus, Wi-Fi, récupération données, installation Windows, maintenance, sites vitrine et petits logiciels métier.',
      },
      ...commonFaqTail,
    ],
    related: SEO_ALL_SERVICE_PAGES.filter((p) => p.to !== '/services-informatiques-sarthe').slice(0, 8),
    cta: 'Un besoin informatique en Sarthe ?',
  },

  'reparation-pc': {
    topic: 'Réparation ordinateur Le Mans',
    city: 'Le Mans',
    paragraphs: [
      `Réparation d’ordinateur à domicile sur Le Mans : démarrage impossible, écran, clavier, batterie, surchauffe, upgrade SSD/RAM. ${brand} diagnostique et propose la réparation la plus rentable — souvent moins chère qu’un PC neuf.`,
      `Windows et Mac, portable ou bureau. Devis avant changement de pièce. Zone étendue à toute la Sarthe.`,
    ],
    steps: [
      { t: 'Diagnostic', d: 'Cause précise de la panne.' },
      { t: 'Devis', d: 'Prix annoncé avant réparation.' },
      { t: 'Réparation', d: 'Sur place quand c’est possible.' },
    ],
    faq: [
      {
        q: 'Faut-il toujours changer le PC ?',
        r: 'Non. Beaucoup de pannes se règlent (SSD, RAM, alimentation, nettoyage, réinstall). On compare coût réparation vs remplacement.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/depannage-pc-portable-sarthe', label: 'PC portable Sarthe' },
      { to: '/virus-malwares-depannage-le-mans', label: 'Virus & malwares' },
      { to: '/recuperation-donnees-sarthe', label: 'Récupération données' },
      { to: '/depannage-informatique-le-mans', label: 'Dépannage Le Mans' },
    ],
    cta: 'PC en panne à Le Mans ?',
  },

  'telephone': {
    topic: 'Réparateur téléphone Le Mans',
    city: 'Le Mans',
    paragraphs: [
      `Écran cassé, batterie faible, smartphone lent ou bloqué : ${brand} intervient à domicile sur Le Mans et en Sarthe pour iPhone, Samsung et Android.`,
      `Travail soigné, devis transparent, et conseils d’usage pour prolonger la durée de vie de l’appareil.`,
    ],
    steps: [
      { t: 'Diagnostic', d: 'Écran, batterie, logiciel…' },
      { t: 'Devis', d: 'Avant toute pièce.' },
      { t: 'Réparation', d: 'Intervention soignée à domicile.' },
    ],
    faq: [
      {
        q: 'Réparez-vous les iPhone et Android ?',
        r: 'Oui — iPhone, Samsung, et la plupart des Android. Disponibilité des pièces selon modèle.',
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC' },
      { to: '/depannage-informatique-le-mans', label: 'Dépannage Le Mans' },
      { to: '/informaticien-domicile-sarthe', label: 'Informaticien domicile' },
      { to: '/avis', label: 'Avis clients' },
    ],
    cta: 'Téléphone abîmé à Le Mans ?',
  },

  'creation-site': {
    topic: 'Création site internet Sarthe',
    city: 'Sarthe',
    paragraphs: [
      `Création de site vitrine pour artisans, commerçants et indépendants en Sarthe : design moderne, mobile, SEO local (Le Mans & communes), formulaire de contact et bases analytics.`,
      `${brand} livre un site clair, rapide, et pensé pour générer des appels — pas juste une jolie carte de visite.`,
    ],
    steps: [
      { t: 'Brief', d: 'Votre activité, zone, objectifs.' },
      { t: 'Maquette / build', d: 'Pages essentielles + SEO local.' },
      { t: 'Mise en ligne', d: 'Domaine, HTTPS, formation courte.' },
    ],
    faq: [
      {
        q: 'Combien-vous aussi le référencement local ?',
        r: 'Oui — structure, titres, maillage et bonnes pratiques pour apparaître sur des recherches locales en Sarthe.',
      },
      ...commonFaqTail.slice(0, 2),
    ],
    related: [
      { to: '/creation-logiciel-sur-mesure-sarthe', label: 'Logiciel sur mesure' },
      { to: '/services-informatiques-sarthe', label: 'Services Sarthe' },
      { to: '/references', label: 'Références' },
      { to: '/depannage-informatique-le-mans', label: 'Dépannage Le Mans' },
    ],
    cta: 'Créer votre site en Sarthe',
  },

  'depannage-le-mans': {
    topic: 'Dépannage informatique Le Mans',
    city: 'Le Mans',
    paragraphs: [
      `${brand} est le dépannage informatique à domicile sur Le Mans et la Sarthe : PC, Mac, téléphone, virus, Wi-Fi, données et sites. Ouvert depuis août 2025, ${fullName()} met 15 ans de passion informatique au service de plus de 100 clients déjà satisfaits.`,
      `Cette page concentre nos prestations locales. Utilisez les guides liés pour un sujet précis (virus, Wi-Fi, portable…) et contactez-nous pour un RDV — devis transparent, intervention rapide.`,
    ],
    steps: [
      { t: 'Appel', d: `Réponse au ${tel}.` },
      { t: 'Déplacement', d: '24–48h en moyenne, urgences priorisées.' },
      { t: 'Solution', d: 'Réparation + explications claires.' },
    ],
    faq: [
      {
        q: 'Intervenez-vous le week-end ?',
        r: `Oui selon disponibilité — contactez ${prenom} au ${tel} pour une urgence.`,
      },
      ...commonFaqTail,
    ],
    related: [
      { to: '/virus-malwares-depannage-le-mans', label: 'Virus & malwares' },
      { to: '/wifi-reseau-internet-le-mans', label: 'Wi-Fi & réseau' },
      { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC' },
      { to: '/reparateur-telephone-le-mans', label: 'Téléphone' },
      { to: '/depannage-informatique-sarthe', label: 'Dépannage Sarthe' },
      { to: '/services-informatiques-sarthe', label: 'Tous les services' },
    ],
    cta: 'Technicien informatique à Le Mans',
  },
}

export function getSeoBoost(key) {
  return SEO_BOOST[key] || null
}
