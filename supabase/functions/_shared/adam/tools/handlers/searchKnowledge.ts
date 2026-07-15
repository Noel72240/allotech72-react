import type { ToolContext, ToolResult } from '../registry.ts'
import { embedQuery, searchKnowledge } from '../../knowledge/search.ts'

export async function handleSearchKnowledge(
  ctx: ToolContext,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const query = String(args.query || '').trim()
  if (!query) return { ok: false, error: 'query requis' }

  try {
    const embedding = await embedQuery(ctx.llm, query)
    const chunks = await searchKnowledge(ctx.supabase, embedding, 5)
    return {
      ok: true,
      data: {
        results: chunks.map(c => ({
          title: c.title,
          category: c.category,
          content: c.content,
          relevance: c.similarity,
        })),
      },
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
