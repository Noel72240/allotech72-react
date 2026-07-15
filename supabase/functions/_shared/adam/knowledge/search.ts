import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { LLMProvider } from '../llm/types.ts'
import { getRagTopK } from '../llm/config.ts'

export interface KnowledgeChunk {
  id: string
  content: string
  category: string
  title: string
  similarity: number
}

export async function embedQuery(llm: LLMProvider, query: string): Promise<number[]> {
  if (!llm.embed) throw new Error('Provider ne supporte pas les embeddings')
  const vectors = await llm.embed([query])
  return vectors[0]
}

export async function searchKnowledge(
  supabase: SupabaseClient,
  embedding: number[],
  topK?: number,
): Promise<KnowledgeChunk[]> {
  const k = topK ?? getRagTopK()
  const { data, error } = await supabase.rpc('adam_search_knowledge', {
    query_embedding: embedding,
    match_count: k,
    filter_category: null,
  })

  if (error) {
    console.warn('RAG search failed:', error.message)
    return []
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    content: String(row.content),
    category: String(row.category || ''),
    title: String(row.title || ''),
    similarity: Number(row.similarity || 0),
  }))
}

export function formatKnowledgeForPrompt(chunks: KnowledgeChunk[]): string {
  if (!chunks.length) return ''
  return chunks
    .map(c => `[${c.category}] ${c.title}\n${c.content}`)
    .join('\n\n---\n\n')
}

/** Indexation d'un document en chunks (adam-embed) */
export async function ingestDocument(
  supabase: SupabaseClient,
  llm: LLMProvider,
  doc: {
    category: string
    title: string
    slug: string
    source: string
    sourceRef?: string
    content: string
    metadata?: Record<string, unknown>
  },
): Promise<{ documentId: string; chunks: number }> {
  const { data: docRow, error: docErr } = await supabase
    .from('adam_knowledge_documents')
    .upsert(
      {
        category: doc.category,
        title: doc.title,
        slug: doc.slug,
        source: doc.source,
        source_ref: doc.sourceRef || '',
        metadata: doc.metadata || {},
        published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' },
    )
    .select('id')
    .single()

  if (docErr) throw new Error(docErr.message)
  const documentId = docRow.id as string

  await supabase.from('adam_knowledge_chunks').delete().eq('document_id', documentId)

  const chunks = chunkText(doc.content, 800)
  if (!llm.embed) throw new Error('Embeddings non supportés')

  const embeddings = await llm.embed(chunks)

  const rows = chunks.map((content, i) => ({
    document_id: documentId,
    chunk_index: i,
    content,
    embedding: embeddings[i],
    metadata: { chunk_index: i },
  }))

  const { error: chunkErr } = await supabase.from('adam_knowledge_chunks').insert(rows)
  if (chunkErr) throw new Error(chunkErr.message)

  return { documentId, chunks: chunks.length }
}

function chunkText(text: string, maxLen: number): string[] {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  const chunks: string[] = []
  let current = ''

  for (const p of paragraphs) {
    if ((current + '\n\n' + p).length > maxLen && current) {
      chunks.push(current.trim())
      current = p
    } else {
      current = current ? current + '\n\n' + p : p
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks.length ? chunks : [text.slice(0, maxLen)]
}
