/** Catalogue location matériel — Allotech72 (Sarthe / Le Mans)
 * Les articles viennent de Supabase (admin → Location).
 * LOCATION_ITEMS reste vide volontairement (pas d’exemples affichés sur le site).
 */

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

/** Plus d’exemples statiques : uniquement ce qui est ajouté dans l’admin. */
export const LOCATION_ITEMS = []

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
