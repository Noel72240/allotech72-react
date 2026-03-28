import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** False sur Vercel si les variables VITE_* ne sont pas définies au build → sinon écran noir. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Valeurs factices uniquement pour que createClient ne lève pas d’exception au chargement du bundle.
// Les appels API échoueront tant que les vraies variables ne sont pas configurées sur Vercel.
const safeUrl =
  supabaseUrl ||
  'https://xxxxxxxxxxxx.supabase.co'
const safeKey =
  supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIn0.invalid-placeholder'

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
