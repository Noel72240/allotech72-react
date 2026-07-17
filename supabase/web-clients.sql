-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Clients web (références page d’accueil)
-- À exécuter dans Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.web_clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  logo_url   TEXT NOT NULL DEFAULT '',
  url        TEXT NOT NULL DEFAULT '',
  sector     TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS web_clients_sort_idx
  ON public.web_clients (sort_order ASC, created_at DESC);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.web_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "web_clients_select_public" ON public.web_clients;
CREATE POLICY "web_clients_select_public"
  ON public.web_clients FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "web_clients_select_auth_all" ON public.web_clients;
CREATE POLICY "web_clients_select_auth_all"
  ON public.web_clients FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "web_clients_insert_auth" ON public.web_clients;
CREATE POLICY "web_clients_insert_auth"
  ON public.web_clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "web_clients_update_auth" ON public.web_clients;
CREATE POLICY "web_clients_update_auth"
  ON public.web_clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "web_clients_delete_auth" ON public.web_clients;
CREATE POLICY "web_clients_delete_auth"
  ON public.web_clients FOR DELETE
  TO authenticated
  USING (true);

-- ── STORAGE : bucket « clients » ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('clients', 'clients', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "clients_storage_select_public" ON storage.objects;
CREATE POLICY "clients_storage_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'clients');

DROP POLICY IF EXISTS "clients_storage_insert_auth" ON storage.objects;
CREATE POLICY "clients_storage_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'clients');

DROP POLICY IF EXISTS "clients_storage_update_auth" ON storage.objects;
CREATE POLICY "clients_storage_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'clients')
  WITH CHECK (bucket_id = 'clients');

DROP POLICY IF EXISTS "clients_storage_delete_auth" ON storage.objects;
CREATE POLICY "clients_storage_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'clients');
