// ╔══════════════════════════════════════════════════════════╗
// ║         CONFIG CLIENT — À MODIFIER PAR TECHNICIEN        ║
// ║   Remplissez ce fichier et le site se met à jour seul    ║
// ╚══════════════════════════════════════════════════════════╝

const config = {

  // ── FORMSPREE ─────────────────────────────────────────────
  // 1. Crée un compte gratuit sur https://formspree.io
  // 2. New Form → mets contact@allotech72.fr comme email de destination
  // 3. Copie l'ID du formulaire (ex: "xpwzgkqb") ici
  // ⚠️  OBLIGATOIRE — sans cet ID le formulaire de contact ne fonctionne pas !
  formspreeId: 'xlgpqnrl',   // ← REMPLACE par ton vrai ID Formspree (ex: 'xpwzgkqb')

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

  // ── SEO ───────────────────────────────────────────────────
  siteUrl:     'https://allotech72.fr',
  seoTitle:    'Dépannage Informatique Le Mans & Sarthe | Allotech72 – Noël Liebault',
  seoDesc:     'Allotech72 : dépannage informatique à domicile sur Le Mans, Lombron, Allonnes, Champagné, Montfort-le-Gesnois et tout le secteur Sarthe. Réparation PC, téléphone, tablette, création de sites internet et applications mobiles. Intervention rapide – 06 13 89 39 67.',
  seoKeywords: 'dépannage informatique Le Mans, réparation ordinateur Sarthe, dépannage téléphone Lombron, technicien informatique domicile, Allotech72, Noël Liebault',

  // ── RÉSEAUX SOCIAUX ───────────────────────────────────────
  facebook:    'https://www.facebook.com/people/AlloTech72/61578478083963/',
  instagram:   'allotech72',                     // ← À remplir si tu crées un compte Instagram
  google:      'https://share.google/O51xGPMb44UZPJEK8',                     // ← URL fiche Google My Business (ex: https://g.page/allotech72) — IMPORTANT pour le SEO local
  googleMapsId:'',                     // ← ID Google My Business pour l'intégration carte

  // ── HORAIRES ──────────────────────────────────────────────
  horaires:    'Lun – Sam : 8h – 19h',

  // ── STATS HERO ────────────────────────────────────────────
  stats: [
    { num: 32, suffix: '+', label: 'Avis Google' },
    { num: null, label: 'Note moyenne', fixed: '5★' },
    { num: 20, suffix: '+', label: 'Communes' },
  ],

  // ── SERVICES ──────────────────────────────────────────────
  services: [
    {
      icon: '🖥️',
      titre: 'Réparation Ordinateur',
      desc: 'PC Windows ou Mac, portable ou bureau — panne matérielle, lenteur, écran, clavier, démarrage impossible. Diagnostic précis et réparation efficace.',
      tags: ['Windows', 'Mac', 'Montage PC'],
    },
    {
      icon: '📱',
      titre: 'Téléphone & Tablette',
      desc: 'Écran cassé, batterie défaillante, logiciel bloqué — intervention soigneuse sur toutes marques.',
      tags: ['iPhone', 'Android', 'Tablette'],
    },
    {
      icon: '🛡️',
      titre: 'Suppression Virus',
      desc: 'Nettoyage complet des malwares, sécurisation et conseils de prévention pour votre ordinateur.',
      tags: ['Antivirus', 'Malware', 'Optimisation'],
    },
    {
      icon: '📶',
      titre: 'Connexion & Réseau',
      desc: 'Wi-Fi instable, box mal configurée, réseau lent — résolution des problèmes de connexion.',
      tags: ['Wi-Fi', 'Box', 'Réseau'],
    },
    {
      icon: '🌐',
      titre: 'Site Internet & App Mobile',
      desc: 'Création de sites vitrine modernes, référencement SEO, et applications mobiles Android/iOS pour développer votre présence en ligne.',
      tags: ['Site vitrine', 'SEO', 'App mobile'],
    },
    {
      icon: '🎓',
      titre: 'Cours Informatique',
      desc: "Débutants bienvenus ! Apprentissage à votre rythme, ordinateur, tablette ou smartphone.",
      tags: ['Débutant', 'Seniors', 'Domicile'],
    },
  ],

  // ── ZONE D'INTERVENTION ───────────────────────────────────
  communes: [
    'Lombron', 'Le Mans', 'Allonnes', 'Champagné',
    'Montfort-le-Gesnois', 'Connerré', "Yvré-l'Évêque",
    'Changé', 'Saint-Mars-la-Brière', 'Rouillon', 'Arnage',
    'Mulsanne', "Parigné-l'Évêque", 'Fatines', 'Surfonds',
    'Soulitré', 'Saint-Célerin', 'Sceaux-sur-Huisne',
    'Tuffé-Val-de-la-Chéronne', '…et environs',
  ],

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

  // ── HÉBERGEUR (mentions légales) ──────────────────────────
  // ⚠️  OBLIGATOIRE légalement (LCEN) — à compléter avec les infos de ton hébergeur
  // Exemple o2switch : nom:'o2switch', adresse:'222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand', url:'https://www.o2switch.fr'
  hebergeur: {
    nom:     'Vercel Inc.',       // ← Nom de l'hébergeur
    adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',       // ← Adresse postale de l'hébergeur
    url:     'https://vercel.com',       // ← Site web de l'hébergeur
  },

}
export default config
