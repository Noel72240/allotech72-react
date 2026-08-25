// ╔══════════════════════════════════════════════════════════╗
// ║         CONFIG CLIENT — À MODIFIER PAR TECHNICIEN        ║
// ║   Remplissez ce fichier et le site se met à jour seul    ║
// ╚══════════════════════════════════════════════════════════╝

import COMMUNES_SARTHE from './data/communes-sarthe.js'

const config = {

  // ── FORMSPREE ─────────────────────────────────────────────
  // 1. Crée un compte gratuit sur https://formspree.io
  // 2. New Form → mets contact@allotech72.fr comme email de destination
  // 3. Copie l'ID du formulaire (ex: "xpwzgkqb") ici
  formspreeId: 'xlgpqnrl',   // ← remplace par ton vrai ID Formspree

  // ── IDENTITÉ ──────────────────────────────────────────────
  brand:       'Allotech72',           // Nom de marque
  prenom:      'Noël',
  nom:         'Liebault',
  siret:       '99006097200017',
  statut:      'Micro-entreprise',

  // ── COORDONNÉES ───────────────────────────────────────────
  telephone:   '06 13 89 39 67',
  telBrut:     '0613893967',           // sans espaces pour le lien tel:
  adresse:     '7 rue de la Rentière',
  codePostal:  '72450',
  ville:       'Lombron',
  departement: 'Sarthe (72)',

  // ── MÉDIATEUR CONSOMMATION (CGV — art. L612-1) ───────────
  // Remplir après adhésion CM2C, SMP, etc. Laisser vide = texte ODR uniquement
  mediateur: {
    nom:     '',   // ex: 'CM2C — Centre de la Médiation de la Consommation'
    url:     '',   // ex: 'https://www.cm2c.net'
    adresse: '',   // ex: '49 rue Ponthieu, 75008 Paris' (selon votre médiateur)
  },

  // ── SEO ───────────────────────────────────────────────────
  // Aligner avec la redirection Vercel + sitemap (www ou apex, un seul choix)
  siteUrl:     'https://www.allotech72.fr',
  // Portail client (espace interventions / compte)
  portalUrl:      'https://portal.allotech72.fr',
  portalRegister: 'https://portal.allotech72.fr/register',
  seoTitle:    'Dépannage informatique Le Mans & Sarthe | Allotech72 — 06 13 89 39 67',
  // Ouverture Allotech72 : août 2025 — 15 ans de passion info + 100+ clients satisfaits
  founded:     '2025-08',
  seoDesc:     'Allotech72 — Noël Liebault : dépannage informatique à domicile Le Mans & Sarthe. Diagnostic gratuit, devis avant réparation, souvent sous 24–48h. PC, téléphone, virus, Wi-Fi. 06 13 89 39 67.',
  seoKeywords: 'dépannage informatique Le Mans, réparation ordinateur Sarthe, dépannage téléphone Lombron, technicien informatique domicile, Allotech72, Noël Liebault, 15 ans expérience',

  // ── RÉSEAUX SOCIAUX ───────────────────────────────────────
  facebook:    'https://www.facebook.com/people/AlloTech72/61578478083963/',
  instagram:   '',                     // laisser vide si pas de compte
  google:      'https://www.google.com/maps/place/Allotech72/data=!4m2!3m1!1s0x421b60d472e65d1d:0xea0ded5aa3f65db5',
  googleReview:'https://search.google.com/local/writereview?cid=16865397153126047157',
  googleMapsId:'0x421b60d472e65d1d:0xea0ded5aa3f65db5',
  allovoisin:  'https://www.allovoisins.com/p/noelliebault-1',
  pagesJaunes: '',                     // coller l’URL Pages Jaunes dès que tu l’as
  presse: [
    {
      label: 'Ouest-France',
      titre: 'À Lombron, il lance son entreprise dédiée au numérique',
      url: 'https://www.ouest-france.fr/economie/commerce/quand-javais-12-ans-je-demontais-deja-des-ordinateurs-a-lombron-il-lance-son-entreprise-dediee-au-numerique-ee8c32e6-9263-11f1-8cd4-b1e73f23a235',
    },
  ],

  // ── SOURCES D'AVIS (regroupés sur le site) ────────────────
  avisSources: [
    { id: 'google',     label: 'Google',      short: 'Google' },
    { id: 'allovoisin', label: 'AlloVoisin',  short: 'AlloVoisin' },
    { id: 'facebook',   label: 'Facebook',    short: 'Facebook' },
    { id: 'pagesjaunes',label: 'Pages Jaunes', short: 'Pages Jaunes' },
  ],

  // ── HORAIRES (source Adam / grille officielle) ────────────
  horaires:    'Lun–Ven 8h–22h · Sam 9h–12h · Dim 9h–17h',
  delai:       'Souvent sous 24–48h',
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '22:00' },
    { days: ['Saturday'], opens: '09:00', closes: '12:00' },
    { days: ['Sunday'], opens: '09:00', closes: '17:00' },
  ],
  // Crédit d’impôt SAP : n’activer QUE après déclaration URSSAF / NOVA
  sap: { enabled: false, label: 'Crédit d’impôt 50 %' },

  // ── STATS HERO ────────────────────────────────────────────
  // avisTotal = total regroupé (Google + AlloVoisin + Facebook + Pages Jaunes + site)
  avisTotal: 52,
  clientsSatisfaits: 100,
  stats: [
    { num: 15, suffix: '', label: 'Ans de passion' },
    { num: 100, suffix: '+', label: 'Clients satisfaits' },
    { num: 52, suffix: '+', label: 'Avis regroupés' },
  ],

  // ── PREUVES CONVERSION (bandeau hero — n’efface pas les stats) ─
  proofs: [
    { label: '15 ans de passion' },
    { label: '100+ clients' },
    { label: 'Diagnostic gratuit' },
    { label: '5★ avis' },
    { label: 'Garantie 30j' },
  ],

  // ── PROMESSE + GARANTIE (unique Allotech72 — pas un clone concurrent) ─
  promesse: {
    titre: 'La promesse Allotech72',
    texte: 'Réparer plutôt que remplacer. Expliquer clairement. Rester joignable et local.',
  },
  garantie: {
    jours: 30,
    titre: 'Garantie Proximité',
    resume: 'Si la même panne traitée revient sous 30 jours, je reviens — sans frais de main-d’œuvre.',
    details: 'Hors panne différente, hors casse accidentelle, hors pièces sous garantie constructeur. Devis toujours validé avant réparation.',
  },
  parcours: [
    { n: '1', titre: 'Vous appelez ou réservez', desc: 'On clarifie le souci en quelques minutes. Devis ou créneau rapidement.' },
    { n: '2', titre: 'Je viens chez vous', desc: 'Diagnostic sur place à domicile en Sarthe — 352 communes.' },
    { n: '3', titre: 'C’est réglé & expliqué', desc: 'Réparation validée, conseils pour éviter que ça se reproduise.' },
  ],
  formules: [
    {
      id: 'coup-de-main',
      nom: 'Coup de main',
      price: 'Diagnostic gratuit',
      badge: 'Simple',
      desc: 'Je viens, j’identifie la panne et je vous dis clairement quoi faire — avant d’engager des frais.',
      points: ['Diagnostic offert', 'Déplacement offert jusqu’à 10 km', 'Devis avant réparation'],
    },
    {
      id: 'remise-en-route',
      nom: 'Remise en route',
      price: 'Dès 25 €',
      badge: 'Le + demandé',
      featured: true,
      desc: 'Réparation complète chez vous : PC, virus, Wi-Fi, téléphone… prix annoncé avant action.',
      points: ['Réparation à domicile', 'Garantie Proximité 30j', 'Pièces seulement si besoin'],
    },
    {
      id: 'tranquillite-locale',
      nom: 'Tranquillité locale',
      price: '40 €',
      badge: 'Prévention',
      desc: 'Nettoyage / entretien PC pour particuliers & indépendants : prévenir plutôt que subir la panne.',
      points: ['Nettoyage complet 40 €', 'Mises à jour & sauvegardes', 'Conseils personnalisés'],
    },
  ],

  // Grille officielle (hors pièces) — alignée sur la knowledge Adam
  tarifsNote: 'Main-d’œuvre hors pièces. Diagnostic gratuit. Devis avant toute réparation. Déplacement offert jusqu’à 10 km, au-delà dès 15 € selon la distance.',
  tarifs: [
    { label: 'Diagnostic (tél. ou sur place)', price: 'Gratuit' },
    { label: 'Déplacement jusqu’à 10 km', price: 'Offert' },
    { label: 'Déplacement au-delà de 10 km', price: 'dès 15 €', note: 'Selon distance' },
    { label: 'Suppression virus / malware', price: 'dès 25 €', to: '/virus-malwares-depannage-le-mans' },
    { label: 'Nettoyage / entretien PC', price: '40 €', to: '/maintenance-informatique-sarthe' },
    { label: 'Réinstallation Windows', price: '50 €', to: '/installation-windows-sarthe' },
    { label: 'Mise à jour BIOS / pilotes', price: '25 €' },
    { label: 'Installation de logiciels (jusqu’à 5)', price: '15 €' },
    { label: 'Ajout / remplacement RAM', price: '15 €' },
    { label: 'Installation SSD (main-d’œuvre)', price: '30 €', to: '/reparation-ordinateur-le-mans' },
    { label: 'Remplacement clavier PC portable', price: '30 €', to: '/depannage-pc-portable-sarthe' },
    { label: 'Montage PC complet', price: '50–100 €', to: '/reparation-ordinateur-le-mans' },
    { label: 'Écran téléphone', price: '30–60 €', note: 'Selon marque / modèle', to: '/reparateur-telephone-le-mans' },
    { label: 'Batterie téléphone', price: '40 €', note: 'Selon marque / modèle', to: '/reparateur-telephone-le-mans' },
    { label: 'Vitre arrière téléphone', price: '30 €', note: 'Selon marque / modèle' },
    { label: 'Connecteur de charge', price: 'dès 20 €', note: 'Selon marque / modèle' },
    { label: 'Config. tablette / WhatsApp', price: '15 €' },
  ],

  faq: [
    {
      q: 'Combien coûte un dépannage informatique à domicile ?',
      r: 'Le diagnostic est gratuit. La main-d’œuvre suit une grille claire (virus dès 25 €, entretien PC 40 €, Windows 50 €…). Pièces en supplément selon le modèle. Devis annoncé avant toute réparation.',
    },
    {
      q: 'Le diagnostic est-il vraiment gratuit ?',
      r: 'Oui. J’évalue le problème par téléphone ou sur place sans frais de diagnostic. Vous ne payez la réparation que si vous validez le devis.',
    },
    {
      q: 'Quelle est la zone d’intervention ?',
      r: 'Toute la Sarthe (352 communes) : Le Mans, Lombron, Allonnes, Champagné, Montfort-le-Gesnois et alentours. Déplacement offert jusqu’à 10 km, au-delà dès 15 €.',
    },
    {
      q: 'Sous combien de temps intervenez-vous ?',
      r: 'En général sous 24 à 48 h. Horaires : lun–ven 8h–22h, sam 9h–12h, dim 9h–17h. Pour une urgence, appelez le 06 13 89 39 67.',
    },
    {
      q: 'Quelle garantie sur les réparations ?',
      r: 'Garantie Proximité 30 jours : si la même panne traitée revient, je reviens sans frais de main-d’œuvre. Hors panne différente, casse accidentelle, ou pièce sous garantie constructeur.',
    },
    {
      q: 'Réparez-vous les Mac aussi bien que les PC ?',
      r: 'Oui : PC Windows, Mac, portables et fixes, toutes marques courantes, plus téléphones et tablettes.',
    },
    {
      q: 'Puis-je déposer mon ordinateur ?',
      r: 'L’intervention à domicile est prioritaire. Un dépôt à Lombron (7 rue de la Rentière) est possible uniquement sur rendez-vous — appelez d’abord pour convenir d’un créneau.',
    },
    {
      q: 'Comment prendre rendez-vous ?',
      r: 'Le plus rapide : appeler le 06 13 89 39 67. Vous pouvez aussi indiquer un créneau sur la page Prendre RDV, je vous confirme rapidement.',
    },
  ],

  // ── PROBLÈMES → SERVICES (matching conversion) ────────────
  problems: [
    {
      ico: '💻',
      title: 'PC lent ou en panne',
      quote: 'Mon PC ne démarre plus…',
      to: '/reparation-ordinateur-le-mans',
      tags: ['Écran noir', 'Lenteur', 'Surchauffe'],
    },
    {
      ico: '🛡️',
      title: 'Virus & sécurité',
      quote: 'Mon PC est infecté…',
      to: '/virus-malwares-depannage-le-mans',
      tags: ['Malware', 'Pop-ups', 'Ransomware'],
    },
    {
      ico: '📶',
      title: 'Internet & Wi-Fi',
      quote: 'Ma connexion ne marche plus…',
      to: '/wifi-reseau-internet-le-mans',
      tags: ['Box', 'Wi-Fi lent', 'Coupures'],
    },
    {
      ico: '📱',
      title: 'Téléphone / tablette',
      quote: 'Écran cassé ou batterie HS…',
      to: '/reparateur-telephone-le-mans',
      tags: ['iPhone', 'Android', 'Batterie'],
    },
    {
      ico: '💾',
      title: 'Données perdues',
      quote: 'J’ai tout perdu…',
      to: '/recuperation-donnees-sarthe',
      tags: ['Disque', 'SSD', 'USB'],
    },
    {
      ico: '🌐',
      title: 'Besoin d’un site web',
      quote: 'Je veux être visible en ligne…',
      to: '/creation-site-internet-sarthe',
      tags: ['Vitrine', 'SEO', 'Sarthe'],
    },
  ],

  // ── SERVICES ──────────────────────────────────────────────
  services: [
    {
      icon: '🖥️',
      titre: 'Réparation Ordinateur',
      desc: 'PC Windows ou Mac, portable ou bureau — panne matérielle, lenteur, écran, clavier, démarrage impossible. Diagnostic précis et réparation efficace.',
      tags: ['Windows', 'Mac', 'Montage PC'],
      priceFrom: '20€',
      to: '/reparation-ordinateur-le-mans',
    },
    {
      icon: '📱',
      titre: 'Téléphone & Tablette',
      desc: 'Écran cassé, batterie défaillante, logiciel bloqué — intervention soigneuse sur toutes marques.',
      tags: ['iPhone', 'Android', 'Tablette'],
      priceFrom: 'Devis',
      to: '/reparateur-telephone-le-mans',
    },
    {
      icon: '🛡️',
      titre: 'Suppression Virus',
      desc: 'Nettoyage complet des malwares, sécurisation et conseils de prévention pour votre ordinateur.',
      tags: ['Antivirus', 'Malware', 'Optimisation'],
      priceFrom: '20€',
      to: '/virus-malwares-depannage-le-mans',
    },
    {
      icon: '📶',
      titre: 'Connexion & Réseau',
      desc: 'Wi-Fi instable, box mal configurée, réseau lent — résolution des problèmes de connexion.',
      tags: ['Wi-Fi', 'Box', 'Réseau'],
      priceFrom: '20€',
      to: '/wifi-reseau-internet-le-mans',
    },
    {
      icon: '🌐',
      titre: 'Site Internet & App Mobile',
      desc: 'Création de sites vitrine modernes, référencement SEO, et applications mobiles Android/iOS pour développer votre présence en ligne.',
      tags: ['Site vitrine', 'SEO', 'App mobile'],
      priceFrom: 'Sur devis',
      to: '/creation-site-internet-sarthe',
    },
    {
      icon: '🎓',
      titre: 'Cours Informatique',
      desc: "Débutants bienvenus ! Apprentissage à votre rythme, ordinateur, tablette ou smartphone.",
      tags: ['Débutant', 'Seniors', 'Domicile'],
      priceFrom: 'Sur devis',
      to: '/#contact',
    },
  ],

  // ── ZONE D'INTERVENTION (352 communes — geo.api.gouv.fr) ──
  communes: COMMUNES_SARTHE,

  // ── AVIS CLIENTS ──────────────────────────────────────────
  avis: [
    { initiales: 'JH', nom: 'Johanna H.', type: 'Montage PC + Dépannage', texte: "Le montage est propre, bien organisé et tout fonctionne à merveille. J'ai aussi demandé un dépannage sur mon ancien ordinateur qui ne s'allumait plus : le problème a été trouvé rapidement. Le technicien est passionné, sérieux et très clair. Je recommande vivement Allotech72 !" },
    { initiales: 'FL', nom: 'Florian L.', type: 'Réparation ordinateur', texte: "Au top du top, très sérieux, très pédagogique. Réparation effectuée sans baisser les bras malgré toutes les complications. Je recommande les yeux fermés. Merci mille fois ! 😄" },
    { initiales: 'LT', nom: 'Laetitia T.', type: 'Changement clavier PC portable', texte: "Très contente ! Très réactif, rapide, sérieux, soigneux — 59 € pour un changement de clavier sur PC portable (clavier + MO + déplacement, 1h30 de travail). Plus que raisonnable. Un grand merci 😁" },
    { initiales: 'SI', nom: 'Sophie I.', type: 'Dépannage informatique', texte: "Merci merci merci. Réparateur super, je recommande +++. Je ne peux pas mettre plus de 5 étoiles, dommage j'en aurais mis plus ! Qualité-prix imbattable !" },
    { initiales: 'YY', nom: 'Yaya', type: 'Urgence informatique', texte: "Encore merci Noël. Conscience professionnelle, compétences au pluriel et grande adaptabilité à mon urgence. Ravie de voir qu'humain et professionnalisme se distinguent encore dans notre société." },
    { initiales: 'ON', nom: 'Olivier N.', type: 'Dépannage informatique', texte: "Super réparateur, qui a sauvé mon ordinateur très rapidement, alors que j'étais persuadé que j'allais perdre tout mon travail. Je recommande !" },
    { initiales: 'MI', nom: 'Mabire I.', type: "Changement écran iPhone", texte: "Personne très professionnelle, ponctuelle et sympathique. L'écran de mon iPhone a été changé rapidement, travail soigné et de qualité. Je recommande sans hésiter." },
    { initiales: 'RB', nom: 'Romain B.', type: 'Assistance informatique', texte: "Professionnel, disponible, et à l'écoute de ses clients. Des conseils clairs et des solutions adaptées à chacun et à chaque besoin." },
    { initiales: 'NR', nom: 'Nicole R.', type: 'Intervention à domicile', texte: "Très heureux de vous avoir connu Noël. Intervention rapide, à notre écoute, de bons conseils et travail sérieux. Bonne réussite à vous !" },
    { initiales: 'TR', nom: 'Theo R.', type: 'PC Gamer', texte: "Il m'a dépanné suite à une panne de PC gamer, il sait ce qu'il fait, connaît bien son domaine, très professionnel. Je conseille !!!!" },
    { initiales: 'PR', nom: 'Patricia R.', type: 'Dépannage', texte: "Très gentil, ponctuel, agréable à discuter et surtout très professionnel, avec un tarif compétitif." },
    { initiales: 'VD', nom: 'Véronique D.', type: 'Cours informatique', texte: "Problème résolu, très satisfaite. Personne compétente, honnête, à l'écoute. Je recommande vivement." },
  ],

  // ── TYPING PHRASES (hero) ─────────────────────────────────
  typingPhrases: [
    'Réparation PC & Mac',
    'Dépannage téléphone',
    'Création site internet',
    'Application mobile',
    'Suppression de virus',
    'Cours informatique',
  ],

  // ── NOUVEAUTÉS (carousel accueil) ─────────────────────────
  // Géré en priorité depuis Admin → Page accueil (3 emplacements).
  // Ci-dessous : contenu de secours si Supabase n’est pas configuré ou si aucune slide active.
  newsSlides: [
    {
      image: '/og-image.jpg',
      kicker: 'Nouveauté',
      title: 'Boutique en ligne',
      text: 'Ajoutez au panier et payez en ligne. Livraison ou retrait près du Mans.',
      cta: 'Voir la boutique',
      link: '/boutique',
    },
    {
      image: '/og-image.png',
      kicker: 'Info',
      title: 'Intervention rapide à domicile',
      text: 'Diagnostic clair, devis transparent, déplacement rapide — 7j/7.',
      cta: 'Demander un devis',
      link: '/#contact',
    },
  ],

  // ── OPTIONS FORMULAIRE ────────────────────────────────────
  formOptions: [
    'Réparation ordinateur',
    'Dépannage téléphone / tablette',
    'Création site internet vitrine',
    'Application mobile',
    'Problème connexion / Wi-Fi',
    'Suppression virus',
    'Cours informatique',
    'Montage PC',
    'Autre',
  ],

  // ── HÉBERGEUR (mentions légales LCEN) ────────────────────
  // Vercel Inc. — adresse utilisée dans les CGU / arbitrage (vercel.com/legal/terms)
  hebergeur: {
    nom:        'Vercel Inc.',
    forme:      'Société de droit américain (Delaware)',
    adresse:    '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    url:        'https://vercel.com',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },

}

/** Domaine nu sans www — pour contact@… dans les mentions légales */
export function siteDomainForEmail() {
  return config.siteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

/** Nom complet du responsable / éditeur — source unique */
export function fullName() {
  return `${config.prenom} ${config.nom}`.trim()
}

/** Liens pour laisser un avis — Google en premier (pack Maps) */
export function reviewLinks() {
  return [
    {
      id: 'google',
      label: 'Google',
      hint: 'Le plus utile pour être trouvé au Mans',
      href: config.googleReview || config.google,
      featured: true,
    },
    {
      id: 'allovoisin',
      label: 'AlloVoisin',
      hint: 'Profil local déjà bien noté',
      href: config.allovoisin,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      hint: 'Un mot sur la page Allotech72',
      href: config.facebook,
    },
    {
      id: 'pagesjaunes',
      label: 'Pages Jaunes',
      hint: 'Annuaire',
      href: config.pagesJaunes,
    },
  ].filter((s) => s.href)
}

export default config
