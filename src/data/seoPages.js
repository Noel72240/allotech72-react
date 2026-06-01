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
  { to: '/depannage-informatique-le-mans', label: '🔧 Dépannage informatique Le Mans' },
  { to: '/reparation-ordinateur-le-mans', label: '💻 Réparation PC Le Mans' },
  { to: '/reparateur-telephone-le-mans', label: '📱 Réparateur téléphone Le Mans' },
]

export const SEO_NAV_DROPDOWN_EXTRA = {
  to: '/creation-site-internet-sarthe',
  label: '🌐 Création site & web Sarthe',
}

/** Pages complémentaires : footer + maillage (pas dans le menu principal) */
export const SEO_FOOTER_SECONDARY = [
  { to: '/virus-malwares-depannage-le-mans', label: 'Virus & sécurité PC' },
  { to: '/wifi-reseau-internet-le-mans', label: 'Wi-Fi & réseau' },
]

export const SEO_PATHS_WITH_SIDEBAR = [
  ...SEO_SIDEBAR_LINKS.map((l) => l.to),
  ...SEO_FOOTER_SECONDARY.map((l) => l.to),
]

export function isSeoHubPath(pathname) {
  return SEO_PATHS_WITH_SIDEBAR.includes(pathname)
}
