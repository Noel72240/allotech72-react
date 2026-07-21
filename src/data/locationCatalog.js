/** Catalogue location matériel — Allotech72 (Sarthe / Le Mans) */

export const LOCATION_CATEGORIES = [
  { id: 'all', label: 'Tout voir' },
  { id: 'pc', label: 'PC & portables' },
  { id: 'ecrans', label: 'Écrans' },
  { id: 'video', label: 'Vidéo & projection' },
  { id: 'reseau', label: 'Réseau & Wi-Fi' },
  { id: 'accessoires', label: 'Accessoires' },
]

/**
 * @typedef {object} LocationItem
 * @property {string} id
 * @property {string} title
 * @property {string} categoryId
 * @property {number|null} priceDay — € / jour (null = sur devis)
 * @property {number|null} [priceWeek] — € / semaine
 * @property {string[]} highlights
 * @property {'dispo'|'sur_demande'|'indispo'} availability
 * @property {string} [image]
 * @property {string} [condition]
 */

export const LOCATION_ITEMS = [
  {
    id: 'loc-pc-bureau',
    title: 'PC portable bureautique',
    categoryId: 'pc',
    priceDay: 25,
    priceWeek: 99,
    highlights: ['Windows 11', 'SSD', 'Idéal formation / stage / remplacement'],
    availability: 'dispo',
    condition: 'Testé & prêt',
    image: '',
  },
  {
    id: 'loc-pc-perf',
    title: 'PC portable performant',
    categoryId: 'pc',
    priceDay: 45,
    priceWeek: 179,
    highlights: ['16 Go RAM+', 'SSD rapide', 'Montage, CAO légère, multi-onglets'],
    availability: 'sur_demande',
    condition: 'Sur réservation',
    image: '',
  },
  {
    id: 'loc-ecran-24',
    title: 'Écran 24" Full HD',
    categoryId: 'ecrans',
    priceDay: 12,
    priceWeek: 45,
    highlights: ['HDMI', 'Pied réglable', 'Bureau / formation'],
    availability: 'dispo',
    image: '',
  },
  {
    id: 'loc-ecran-27',
    title: 'Écran 27" Full HD / QHD',
    categoryId: 'ecrans',
    priceDay: 18,
    priceWeek: 69,
    highlights: ['Grand format', 'HDMI / DisplayPort', 'Idéal atelier'],
    availability: 'sur_demande',
    image: '',
  },
  {
    id: 'loc-projecteur',
    title: 'Vidéoprojecteur + écran',
    categoryId: 'video',
    priceDay: 55,
    priceWeek: 199,
    highlights: ['HDMI', 'Écran de projection', 'Réunion, mariage, formation'],
    availability: 'sur_demande',
    condition: 'Sur devis selon durée',
    image: '',
  },
  {
    id: 'loc-routeur',
    title: 'Routeur Wi-Fi / point d’accès',
    categoryId: 'reseau',
    priceDay: 15,
    priceWeek: 55,
    highlights: ['Réseau temporaire', 'Salon, chantier, événement', 'Config simple'],
    availability: 'dispo',
    image: '',
  },
  {
    id: 'loc-switch',
    title: 'Switch réseau 8 ports',
    categoryId: 'reseau',
    priceDay: 10,
    priceWeek: 35,
    highlights: ['Gigabit', 'Plug & play', 'Bureau temporaire'],
    availability: 'dispo',
    image: '',
  },
  {
    id: 'loc-clavier-souris',
    title: 'Kit clavier + souris',
    categoryId: 'accessoires',
    priceDay: 5,
    priceWeek: 18,
    highlights: ['USB ou sans fil', 'Complément PC en location'],
    availability: 'dispo',
    image: '',
  },
  {
    id: 'loc-dock',
    title: 'Station d’accueil USB-C',
    categoryId: 'accessoires',
    priceDay: 12,
    priceWeek: 42,
    highlights: ['HDMI', 'USB', 'Charge (selon modèle)'],
    availability: 'sur_demande',
    image: '',
  },
]

export function getLocationItems(categoryId = 'all') {
  if (!categoryId || categoryId === 'all') return LOCATION_ITEMS
  return LOCATION_ITEMS.filter(i => i.categoryId === categoryId)
}

export function formatLocationPrice(item) {
  if (item.priceDay == null) return 'Sur devis'
  const day = Number(item.priceDay)
  const dayTxt = Number.isInteger(day) ? `${day}€` : `${day.toFixed(2).replace('.', ',')}€`
  if (item.priceWeek != null) {
    const week = Number(item.priceWeek)
    const weekTxt = Number.isInteger(week) ? `${week}€` : `${week.toFixed(2).replace('.', ',')}€`
    return `${dayTxt}/j · ${weekTxt}/sem`
  }
  return `dès ${dayTxt}/jour`
}

export function locationAvailabilityLabel(status) {
  if (status === 'indispo') return 'Indisponible'
  if (status === 'sur_demande') return 'Sur demande'
  return 'Disponible'
}
