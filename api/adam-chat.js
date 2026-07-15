/**
 * Proxy Adam → Edge Function Supabase (côté serveur Vercel, clés jamais exposées au client).
 * Variables Vercel : VITE_SUPABASE_URL (ou SUPABASE_URL), VITE_SUPABASE_ANON_KEY
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const supabaseUrl = rawUrl.replace(/\.supabase\.com(\/?|$)/i, '.supabase.co$1')
  const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()

  if (!supabaseUrl || !anonKey) {
    return res.status(503).json({
      error: 'Adam non configuré sur Vercel',
      hint: 'Définissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
    })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'JSON invalide' })
  }

  const fnUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/adam`

  try {
    const fnRes = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify(body),
    })

    const data = await fnRes.json().catch(() => ({}))
    return res.status(fnRes.status).json(data)
  } catch (e) {
    return res.status(502).json({
      error: 'Impossible de joindre la Edge Function adam',
      detail: e?.message || String(e),
    })
  }
}
