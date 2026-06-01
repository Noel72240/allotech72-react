// Catalogue "Vente" (neuf & occasion)
// Objectif: simple à maintenir (1 fichier) + prêt pour un futur backoffice

export const SHOP_CATEGORIES = [
  // Neuf
  { id: 'informatique', label: 'Informatique', section: 'neuf' },
  { id: 'telephonie', label: 'Téléphonie', section: 'neuf' },
  { id: 'accessoires-telephonie', label: 'Accessoires téléphoniques', section: 'neuf' },
  { id: 'cables', label: 'Câbles', section: 'neuf' },

  // Occasion (catégories larges)
  { id: 'pc-occasion', label: "PC d'occasion", section: 'occasion' },
  { id: 'ecrans-occasion', label: "Écrans d'occasion", section: 'occasion' },
  { id: 'pieces-occasion', label: "Pièces d'occasion", section: 'occasion' },
]

/**
 * Structure produit (minimaliste)
 * - id: unique
 * - title: nom court
 * - section: "neuf" | "occasion"
 * - categoryId: doit exister dans SHOP_CATEGORIES
 * - price: nombre (euros) ou null si sur devis
 * - condition: pour l'occasion
 * - highlights: 2-5 points max
 * - availability: "en_stock" | "sur_commande" | "sur_devis" | "vendu"
 * - image: chemin public optionnel (ex: "/images/vente/...")
 */
export const SHOP_PRODUCTS = [
  // EXEMPLES — à remplacer par tes produits réels
  {
    id: 'oc-pc-001',
    title: "PC d'occasion — i5 / 16Go / SSD 512Go",
    section: 'occasion',
    categoryId: 'pc-occasion',
    price: 249,
    condition: 'Très bon état',
    highlights: ['Windows 11 installé', 'SSD 512Go', 'Idéal bureautique / web'],
    availability: 'en_stock',
    image: '',
  },
  {
    id: 'oc-screen-001',
    title: "Écran 24\" Full HD (occasion)",
    section: 'occasion',
    categoryId: 'ecrans-occasion',
    price: 79,
    condition: 'Bon état',
    highlights: ['1920×1080', 'HDMI', 'Testé & nettoyé'],
    availability: 'en_stock',
    image: '',
  },
  {
    id: 'nw-cable-001',
    title: 'Câble USB‑C (neuf) — 1m',
    section: 'neuf',
    categoryId: 'cables',
    price: 9.9,
    condition: '',
    highlights: ['Charge + données', 'Compatible Android / iPhone USB‑C', 'Solide'],
    availability: 'en_stock',
    image: '',
  },
]

export function getShopCategories(section) {
  return SHOP_CATEGORIES.filter(c => c.section === section)
}

export function getShopProducts({ section, categoryId } = {}) {
  return SHOP_PRODUCTS
    .filter(p => (section ? p.section === section : true))
    .filter(p => (categoryId ? p.categoryId === categoryId : true))
}

export function getCategoryById(id) {
  return SHOP_CATEGORIES.find(c => c.id === id) || null
}

