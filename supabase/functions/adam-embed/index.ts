import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createLLMProvider } from '../_shared/adam/llm/factory.ts'
import { ingestDocument } from '../_shared/adam/knowledge/search.ts'
import { corsHeaders, handleOptions } from '../_shared/adam/utils/cors.ts'

/** Indexation RAG — protégée par secret admin ou JWT staff */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return handleOptions(req)
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  const embedSecret = Deno.env.get('ADAM_EMBED_SECRET')?.trim()
  const headerSecret = req.headers.get('x-adam-embed-secret')?.trim() || ''
  const authHeader = req.headers.get('Authorization') || ''
  const bearer = authHeader.replace(/^Bearer\s+/i, '')
  const provided = headerSecret || bearer

  if (embedSecret && provided !== embedSecret) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401, headers })
  }

  try {
    const body = await req.json()
    const documents = Array.isArray(body.documents) ? body.documents : [body]

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const llm = createLLMProvider()

    const results = []
    for (const doc of documents) {
      const result = await ingestDocument(supabase, llm, {
        category: String(doc.category || 'faq'),
        title: String(doc.title || 'Sans titre'),
        slug: String(doc.slug || `doc-${Date.now()}`),
        source: String(doc.source || 'manual'),
        sourceRef: doc.sourceRef ? String(doc.sourceRef) : '',
        content: String(doc.content || ''),
        metadata: doc.metadata || {},
      })
      results.push(result)
    }

    return new Response(JSON.stringify({ ok: true, indexed: results }), { status: 200, headers })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur indexation'
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers })
  }
})
