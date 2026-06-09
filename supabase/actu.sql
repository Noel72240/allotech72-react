-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Table « actu » (actualités hebdomadaires SEO)
-- À exécuter dans Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.actu (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL,
  image_url    TEXT NOT NULL DEFAULT '',
  published    BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Si la table existait déjà sans image :
ALTER TABLE public.actu ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS actu_published_at_idx ON public.actu (published_at DESC);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.actu ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "actu_select_public" ON public.actu;
CREATE POLICY "actu_select_public"
  ON public.actu FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "actu_select_auth_all" ON public.actu;
CREATE POLICY "actu_select_auth_all"
  ON public.actu FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "actu_insert_auth" ON public.actu;
CREATE POLICY "actu_insert_auth"
  ON public.actu FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "actu_update_auth" ON public.actu;
CREATE POLICY "actu_update_auth"
  ON public.actu FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "actu_delete_auth" ON public.actu;
CREATE POLICY "actu_delete_auth"
  ON public.actu FOR DELETE
  TO authenticated
  USING (true);

-- ── STORAGE : bucket « actu » (public, créer dans Storage si besoin) ───────
INSERT INTO storage.buckets (id, name, public)
VALUES ('actu', 'actu', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "actu_storage_select_public" ON storage.objects;
CREATE POLICY "actu_storage_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'actu');

DROP POLICY IF EXISTS "actu_storage_insert_auth" ON storage.objects;
CREATE POLICY "actu_storage_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'actu');

DROP POLICY IF EXISTS "actu_storage_update_auth" ON storage.objects;
CREATE POLICY "actu_storage_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'actu')
  WITH CHECK (bucket_id = 'actu');

DROP POLICY IF EXISTS "actu_storage_delete_auth" ON storage.objects;
CREATE POLICY "actu_storage_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'actu');
