/** Contexte métier Allotech72 — surchargeable via variables d'environnement */

export interface BusinessContext {
  brand: string
  technician: string
  phone: string
  phoneRaw: string
  address: string
  city: string
  postalCode: string
  department: string
  hours: string
  siteUrl: string
  services: Array<{ title: string; description: string; tags: string[] }>
  communes: string[]
}

function env(key: string, fallback: string): string {
  return (typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined)?.trim() || fallback
}

/** Contexte par défaut Allotech72 (surchargeable via secrets Supabase) */
export function loadBusinessContext(): BusinessContext {
  return {
    brand: env('ADAM_BUSINESS_BRAND', 'Allotech72'),
    technician: env('ADAM_BUSINESS_TECHNICIAN', 'Noël Liebault'),
    phone: env('ADAM_BUSINESS_PHONE', '06 13 89 39 67'),
    phoneRaw: env('ADAM_BUSINESS_PHONE_RAW', '0613893967'),
    address: env('ADAM_BUSINESS_ADDRESS', '7 rue de la Rentière'),
    city: env('ADAM_BUSINESS_CITY', 'Lombron'),
    postalCode: env('ADAM_BUSINESS_POSTAL', '72450'),
    department: env('ADAM_BUSINESS_DEPT', 'Sarthe (72)'),
    hours: env('ADAM_BUSINESS_HOURS', 'Lun – Sam : 8h – 19h'),
    siteUrl: env('ADAM_BUSINESS_SITE_URL', 'https://www.allotech72.fr'),
    services: [
      { title: 'Réparation Ordinateur', description: 'PC Windows ou Mac, portable ou bureau.', tags: ['Windows', 'Mac'] },
      { title: 'Téléphone & Tablette', description: 'Écran, batterie, logiciel.', tags: ['iPhone', 'Android'] },
      { title: 'Suppression Virus', description: 'Nettoyage malwares et sécurisation.', tags: ['Antivirus', 'Malware'] },
      { title: 'Connexion & Réseau', description: 'Wi-Fi, box, réseau lent.', tags: ['Wi-Fi', 'Box'] },
      { title: 'Site Internet & App Mobile', description: 'Sites vitrine, SEO, apps.', tags: ['Site', 'SEO'] },
      { title: 'Cours Informatique', description: 'Initiation à domicile.', tags: ['Débutant', 'Seniors'] },
    ],
    communes: [
      'Lombron', 'Le Mans', 'Allonnes', 'Champagné', 'Montfort-le-Gesnois',
      'Connerré', 'Yvré-l\'Évêque', 'Changé', 'Arnage', 'Mulsanne',
    ],
  }
}

export function buildBusinessBlock(ctx: BusinessContext): string {
  const servicesList = ctx.services
    .map(s => `- ${s.title} : ${s.description}`)
    .join('\n')
  return [
    `Entreprise : ${ctx.brand} — ${ctx.technician}`,
    `Adresse : ${ctx.address}, ${ctx.postalCode} ${ctx.city} (${ctx.department})`,
    `Téléphone : ${ctx.phone}`,
    `Horaires : ${ctx.hours}`,
    `Site : ${ctx.siteUrl}`,
    `Zone d'intervention : ${ctx.communes.join(', ')} et environs.`,
    'Services proposés :',
    servicesList,
  ].join('\n')
}
