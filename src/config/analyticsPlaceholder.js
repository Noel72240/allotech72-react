/**
 * Futur suivi d’audience (ex. Google Analytics)
 *
 * Quand vous activerez un outil soumis au consentement CNIL :
 * 1. Créer `.env` : VITE_ENABLE_ANALYTICS_COOKIES=true
 * 2. Ne charger le script GA (ou équivalent) que si useCookies().consent?.analytics === true
 * 3. Dans CookieBanner.jsx : passer la ligne « Analytiques » en activable (toggle) au lieu de « Non actifs »
 * 4. Mettre à jour la politique de confidentialité (finalité, durée, désactivation)
 *
 * Tant que VITE_ENABLE_ANALYTICS_COOKIES n’est pas true, aucun cookie de mesure d’audience n’est déposé.
 */
export const ANALYTICS_COOKIES_PLANNED =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_ANALYTICS_COOKIES === 'true'
