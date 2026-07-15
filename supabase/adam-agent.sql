-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Adam Agent IA
-- Mémoire persistante + base de connaissances RAG (pgvector) + diagnostic
-- Exécuter dans Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS vector;

-- ── Conversations ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token   TEXT NOT NULL,
  channel         TEXT NOT NULL DEFAULT 'web'
    CHECK (channel IN ('web', 'at72manager', 'api')),
  status          TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'closed', 'archived')),
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS adam_conversations_active_session_idx
  ON public.adam_conversations (session_token, channel)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS adam_conversations_session_idx
  ON public.adam_conversations (session_token);

CREATE INDEX IF NOT EXISTS adam_conversations_last_active_idx
  ON public.adam_conversations (last_active_at DESC);

-- ── Messages ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES public.adam_conversations(id) ON DELETE CASCADE,
  role             TEXT NOT NULL
    CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content          TEXT NOT NULL DEFAULT '',
  tool_calls       JSONB,
  tool_results     JSONB,
  openai_meta      JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_messages_conversation_idx
  ON public.adam_messages (conversation_id, created_at);

-- ── Mémoires consolidées ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_memories (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES public.adam_conversations(id) ON DELETE CASCADE,
  memory_type      TEXT NOT NULL DEFAULT 'fact'
    CHECK (memory_type IN ('fact', 'preference', 'issue', 'device', 'summary')),
  key              TEXT NOT NULL DEFAULT '',
  value            TEXT NOT NULL DEFAULT '',
  importance       NUMERIC(3, 2) NOT NULL DEFAULT 0.5
    CHECK (importance >= 0 AND importance <= 1),
  embedding        vector(1536),
  expires_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_memories_conversation_idx
  ON public.adam_memories (conversation_id);

CREATE INDEX IF NOT EXISTS adam_memories_type_idx
  ON public.adam_memories (memory_type);

-- ── Base de connaissances (documents) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_knowledge_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT NOT NULL
    CHECK (category IN ('faq', 'guide', 'device', 'pricing', 'service', 'procedure', 'news', 'technical')),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  source      TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual', 'config_sync', 'actu', 'admin')),
  source_ref  TEXT DEFAULT '',
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  published   BOOLEAN NOT NULL DEFAULT true,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_knowledge_documents_category_idx
  ON public.adam_knowledge_documents (category);

CREATE INDEX IF NOT EXISTS adam_knowledge_documents_published_idx
  ON public.adam_knowledge_documents (published);

-- ── Chunks RAG + embeddings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_knowledge_chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID NOT NULL REFERENCES public.adam_knowledge_documents(id) ON DELETE CASCADE,
  chunk_index  INT NOT NULL DEFAULT 0,
  content      TEXT NOT NULL,
  embedding    vector(1536),
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_knowledge_chunks_document_idx
  ON public.adam_knowledge_chunks (document_id, chunk_index);

-- Index vectoriel HNSW (créer après extension vector)
CREATE INDEX IF NOT EXISTS adam_knowledge_chunks_embedding_idx
  ON public.adam_knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);

CREATE UNIQUE INDEX IF NOT EXISTS adam_memories_conversation_key_idx
  ON public.adam_memories (conversation_id, key);

-- ── Logs outils ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_tool_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID REFERENCES public.adam_conversations(id) ON DELETE SET NULL,
  tool_name        TEXT NOT NULL,
  input            JSONB NOT NULL DEFAULT '{}'::jsonb,
  output           JSONB,
  success          BOOLEAN NOT NULL DEFAULT true,
  duration_ms      INT,
  error            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_tool_logs_conversation_idx
  ON public.adam_tool_logs (conversation_id, created_at DESC);

-- ── Sessions diagnostic ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_diagnostic_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES public.adam_conversations(id) ON DELETE CASCADE,
  state            JSONB NOT NULL DEFAULT '{}'::jsonb,
  probable_causes  JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence       NUMERIC(3, 2) NOT NULL DEFAULT 0
    CHECK (confidence >= 0 AND confidence <= 1),
  escalation_level TEXT NOT NULL DEFAULT 'self_help'
    CHECK (escalation_level IN ('self_help', 'remote', 'on_site', 'urgent')),
  device_info      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS adam_diagnostic_sessions_conversation_idx
  ON public.adam_diagnostic_sessions (conversation_id, updated_at DESC);

-- ── Rate limiting ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adam_rate_limits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash     TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count        INT NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS adam_rate_limits_key_window_idx
  ON public.adam_rate_limits (key_hash, window_start);

-- ── RLS : accès direct interdit (Edge Functions = service role) ─────────────
ALTER TABLE public.adam_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_tool_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adam_rate_limits ENABLE ROW LEVEL SECURITY;

-- Aucune policy publique : les Edge Functions utilisent SUPABASE_SERVICE_ROLE_KEY

-- ── Recherche vectorielle RAG ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.adam_search_knowledge(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  category text,
  title text,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id,
    c.document_id,
    c.content,
    d.category,
    d.title,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.adam_knowledge_chunks c
  JOIN public.adam_knowledge_documents d ON d.id = c.document_id
  WHERE d.published = true
    AND c.embedding IS NOT NULL
    AND (filter_category IS NULL OR d.category = filter_category)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;
