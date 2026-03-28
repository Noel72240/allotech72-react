import { isSupabaseConfigured } from '../lib/supabase.js'

/** Affiché si le build n’a pas reçu VITE_SUPABASE_* (sinon l’app plantait avant tout rendu). */
export default function ConfigBanner() {
  if (isSupabaseConfigured) return null

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg,#8B0000,#c0392b)',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '.85rem',
        lineHeight: 1.5,
        textAlign: 'center',
        fontFamily: "'Outfit',system-ui,sans-serif",
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      <strong>Configuration Supabase manquante.</strong>{' '}
      Dans Vercel → Projet → Settings → Environment Variables, ajoutez{' '}
      <code style={{ background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: 6 }}>
        VITE_SUPABASE_URL
      </code>{' '}
      et{' '}
      <code style={{ background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: 6 }}>
        VITE_SUPABASE_ANON_KEY
      </code>{' '}
      (valeurs du tableau Supabase → Project Settings → API), puis déclenchez un{' '}
      <strong>Redeploy</strong>.
    </div>
  )
}
