import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { LLMProvider } from '../llm/types.ts'
import type { LLMToolDefinition } from '../llm/types.ts'

export interface ToolContext {
  conversationId: string
  sessionToken: string
  channel: 'web' | 'at72manager' | 'api'
  supabase: SupabaseClient
  llm: LLMProvider
}

export interface ToolResult {
  ok: boolean
  data?: unknown
  error?: string
  message?: string
}

export interface AdamTool {
  name: string
  description: string
  parameters: Record<string, unknown>
  enabled: boolean
  requiredRole?: 'public' | 'staff'
  handler: (ctx: ToolContext, args: Record<string, unknown>) => Promise<ToolResult>
}

export function stubTool(name: string, description: string, parameters: Record<string, unknown>): AdamTool {
  return {
    name,
    description,
    parameters,
    enabled: false,
    handler: async () => ({
      ok: false,
      message: `L'outil « ${name} » sera disponible prochainement.`,
    }),
  }
}

export function toLLMDefinitions(tools: AdamTool[]): LLMToolDefinition[] {
  return tools.filter(t => t.enabled).map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }))
}
