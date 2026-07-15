const ALLOWED = (Deno.env.get('ADAM_ALLOWED_ORIGINS') || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const DEFAULT_ORIGINS = [
  'https://www.allotech72.fr',
  'https://allotech72.fr',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function hostKey(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** Reflète l'origine exacte du navigateur (requis CORS) — gère www vs sans www */
function resolveAllowedOrigin(origin: string, allowed: string[]): string {
  if (!origin) return allowed[0] || '*'
  if (allowed.includes(origin)) return origin

  const originHost = hostKey(origin)
  if (originHost) {
    const sibling = allowed.find(a => hostKey(a) === originHost)
    if (sibling) return origin
  }

  return allowed[0] || '*'
}

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || ''
  const allowed = ALLOWED.length ? ALLOWED : DEFAULT_ORIGINS
  const match = resolveAllowedOrigin(origin, allowed)

  return {
    'Access-Control-Allow-Origin': match,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

export function handleOptions(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) })
}
