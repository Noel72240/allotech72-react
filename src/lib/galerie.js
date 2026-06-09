/** Mode avant/après activé (true par défaut pour les anciennes entrées). */
export function isGalerieAvantApres(photo) {
  return photo?.avant_apres !== false
}

/** Image principale quand le mode avant/après est désactivé. */
export function getGalerieMainImage(photo) {
  return photo?.apres_url || photo?.avant_url || null
}
