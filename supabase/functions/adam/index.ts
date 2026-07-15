import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { runAgent, loadConversationHistory } from '../_shared/adam/agent/orchestrator.ts'
import { corsHeaders, handleOptions } from '../_shared/adam/utils/cors.ts'
import { checkRateLimit } from '../_shared/adam/utils/rate-limit.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return handleOptions(req)
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  try {
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'JSON invalide' }), { status: 400, headers })
    }

    const action = String(body.action || 'chat')

    if (action === 'history') {
      const sessionToken = String(body.sessionToken || '')
      const channel = (body.channel as 'web' | 'at72manager') || 'web'
      const result = await loadConversationHistory(sessionToken, channel)
      return new Response(JSON.stringify(result), { status: 200, headers })
    }

    const sessionToken = String(body.sessionToken || '')
    const message = String(body.message || '')
    const channel = (body.channel as 'web' | 'at72manager') || 'web'
    const pageContext = (body.pageContext as Record<string, unknown>) || {}

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateKey = `${clientIp}:${sessionToken}`
    const rate = await checkRateLimit(supabase, rateKey)
    if (!rate.allowed) {
      return new Response(
        JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans une heure.' }),
        { status: 429, headers },
      )
    }

    const result = await runAgent({ sessionToken, message, channel, pageContext })
    return new Response(JSON.stringify(result), { status: 200, headers })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur interne'
    console.error('adam error:', msg)
    const status = msg.includes('sessionToken') || msg.includes('Message') ? 400 : 500
    return new Response(JSON.stringify({ error: msg }), { status, headers })
  }
})
