/**
 * Fallback local (si Supabase / table web_clients pas encore créée).
 * En production, gérer les clients depuis /admin → onglet « Clients web ».
 */

export const WEB_CLIENTS = []

/** Afficher la section même sans clients (message d’attente) */
export const WEB_CLIENTS_SHOW_EMPTY = true
