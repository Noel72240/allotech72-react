-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Location de matériel
-- Exécuter dans Supabase → SQL Editor
-- Réutilise le bucket Storage public « vente » (même que la boutique)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.location_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  category_id   TEXT NOT NULL,
  price_day     NUMERIC(10, 2),
  price_week    NUMERIC(10, 2),
  condition     TEXT DEFAULT '',
  highlights    JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability  TEXT NOT NULL DEFAULT 'dispo'
    CHECK (availability IN ('dispo', 'sur_demande', 'indispo')),
  image_url     TEXT DEFAULT '',
  published     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS location_items_category_idx ON public.location_items (category_id);
CREATE INDEX IF NOT EXISTS location_items_published_idx ON public.location_items (published);
CREATE INDEX IF NOT EXISTS location_items_sort_idx ON public.location_items (sort_order);

ALTER TABLE public.location_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "location_items_select_public" ON public.location_items;
CREATE POLICY "location_items_select_public"
  ON public.location_items FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "location_items_select_auth_all" ON public.location_items;
CREATE POLICY "location_items_select_auth_all"
  ON public.location_items FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "location_items_insert_auth" ON public.location_items;
CREATE POLICY "location_items_insert_auth"
  ON public.location_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "location_items_update_auth" ON public.location_items;
CREATE POLICY "location_items_update_auth"
  ON public.location_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "location_items_delete_auth" ON public.location_items;
CREATE POLICY "location_items_delete_auth"
  ON public.location_items FOR DELETE
  TO authenticated
  USING (true);
