/**
 * Pages SEO locales — source unique pour menu latéral, nav, footer, PageLayout
 */

/** 4 pages principales : menu latéral + priorité référencement */
export const SEO_SIDEBAR_LINKS = [
  { to: '/depannage-informatique-le-mans', label: 'Dépannage informatique' },
  { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC & Mac' },
  { to: '/reparateur-telephone-le-mans', label: 'Téléphone & tablettes' },
  { to: '/creation-site-internet-sarthe', label: 'Création de sites web' },
]

/** Menu principal (dropdown) : 3 entrées + 1 lien « web » pour ne pas surcharger */
export const SEO_NAV_DROPDOWN_PRIMARY = [
  { to: '/depannage-informatique-le-mans', label: 'Dépannage informatique', hint: 'Le Mans' },
  { to: '/reparation-ordinateur-le-mans', label: 'Réparation PC & Mac', hint: 'Le Mans' },
  { to: '/reparateur-telephone-le-mans', label: 'Téléphone & tablettes', hint: 'Le Mans' },
]

export const SEO_NAV_DROPDOWN_EXTRA = {
  to: '/creation-site-internet-sarthe',
  label: 'Création de sites web',
  hint: 'Sarthe',
}

/** Pages complémentaires : footer + maillage (pas dans le menu principal) */
export const SEO_FOOTER_SECONDARY = [
  { to: '/virus-malwares-depannage-le-mans', label: 'Virus & sécurité PC' },
  { to: '/wifi-reseau-internet-le-mans', label: 'Wi-Fi & réseau' },
]

/** Page pilier — référence globale Sarthe */
export const SEO_PILLAR = {
  to: '/services-informatiques-sarthe',
  label: 'Services informatiques Sarthe',
}

/** Nouvelles pages SEO Sarthe (complémentaires, sans remplacer l’existant) */
export const SEO_SARTHE_PAGES = [
  { to: '/depannage-informatique-sarthe', label: 'Dépannage informatique Sarthe' },
  { to: '/informaticien-domicile-sarthe', label: 'Informaticien à domicile Sarthe' },
  { to: '/recuperation-donnees-sarthe', label: 'Récupération de données Sarthe' },
  { to: '/installation-windows-sarthe', label: 'Installation Windows Sarthe' },
  { to: '/maintenance-informatique-sarthe', label: 'Maintenance informatique Sarthe' },
  { to: '/depannage-pc-portable-sarthe', label: 'Dépannage PC portable Sarthe' },
  { to: '/creation-logiciel-sur-mesure-sarthe', label: 'Logiciel sur mesure Sarthe' },
]

/** Liens sidebar — compléments Sarthe (ajoutés sous les 4 pages principales) */
export const SEO_SIDEBAR_EXTRA = [
  SEO_PILLAR,
  ...SEO_SARTHE_PAGES,
]

/** Footer — un seul lien pilier (évite une liste longue dans le pied de page) */
export const SEO_FOOTER_PILLAR = SEO_PILLAR

/** @deprecated Préférer SEO_PILLAR + page pilier pour le maillage footer */
export const SEO_FOOTER_SARTHE = [
  SEO_PILLAR,
  ...SEO_SARTHE_PAGES,
]

/** Toutes les pages services — pour maillage page pilier */
export const SEO_ALL_SERVICE_PAGES = [
  SEO_PILLAR,
  { to: '/depannage-informatique-le-mans', label: 'Dépannage informatique Le Mans' },
  { to: '/depannage-informatique-sarthe', label: 'Dépannage informatique Sarthe' },
  { to: '/reparation-ordinateur-le-mans', label: 'Réparation ordinateur Le Mans' },
  { to: '/depannage-pc-portable-sarthe', label: 'Dépannage PC portable Sarthe' },
  { to: '/reparateur-telephone-le-mans', label: 'Réparateur téléphone Le Mans' },
  { to: '/recuperation-donnees-sarthe', label: 'Récupération de données Sarthe' },
  { to: '/installation-windows-sarthe', label: 'Installation Windows Sarthe' },
  { to: '/virus-malwares-depannage-le-mans', label: 'Virus & malwares Le Mans' },
  { to: '/wifi-reseau-internet-le-mans', label: 'Wi-Fi & réseau Le Mans' },
  { to: '/maintenance-informatique-sarthe', label: 'Maintenance informatique Sarthe' },
  { to: '/informaticien-domicile-sarthe', label: 'Informaticien à domicile Sarthe' },
  { to: '/creation-site-internet-sarthe', label: 'Création site internet Sarthe' },
  { to: '/creation-logiciel-sur-mesure-sarthe', label: 'Logiciel & portail client sur mesure' },
]

/** Villes cibles SEO local (nouvelles pages uniquement) */
export const SEO_LOCAL_CITIES = [
  'Le Mans', 'Lombron', 'Connerré', 'Montfort-le-Gesnois', "Savigné-l'Évêque",
  'Mulsanne', 'Allonnes', 'Bonnétable', 'Bouloire', 'La Suze-sur-Sarthe',
]

export const SEO_PATHS_WITH_SIDEBAR = [
  ...SEO_SIDEBAR_LINKS.map((l) => l.to),
  ...SEO_FOOTER_SECONDARY.map((l) => l.to),
  ...SEO_SIDEBAR_EXTRA.map((l) => l.to),
]

export function isSeoHubPath(pathname) {
  return SEO_PATHS_WITH_SIDEBAR.includes(pathname)
}
