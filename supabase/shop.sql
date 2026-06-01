-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Boutique (vente neuf / occasion)
-- Exécuter dans Supabase → SQL Editor
-- Créer aussi un bucket Storage public « vente » (comme « galerie »)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.shop_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE,
  title         TEXT NOT NULL,
  section       TEXT NOT NULL CHECK (section IN ('neuf', 'occasion')),
  category_id   TEXT NOT NULL,
  price         NUMERIC(10, 2),
  condition     TEXT DEFAULT '',
  highlights    JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability  TEXT NOT NULL DEFAULT 'en_stock'
    CHECK (availability IN ('en_stock', 'sur_commande', 'sur_devis', 'vendu')),
  stock         INT DEFAULT 1,
  image_url     TEXT DEFAULT '',
  published     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_products_section_idx ON public.shop_products (section);
CREATE INDEX IF NOT EXISTS shop_products_category_idx ON public.shop_products (category_id);
CREATE INDEX IF NOT EXISTS shop_products_published_idx ON public.shop_products (published);

CREATE TABLE IF NOT EXISTS public.shop_settings (
  id                   INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  sumup_merchant_code  TEXT DEFAULT '',
  sumup_enabled        BOOLEAN NOT NULL DEFAULT false,
  shop_enabled         BOOLEAN NOT NULL DEFAULT true,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.shop_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.shop_order_fulfillments (
  checkout_reference TEXT PRIMARY KEY,
  checkout_id        TEXT NOT NULL,
  items              JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_order_fulfillments ENABLE ROW LEVEL SECURITY;

-- ── RLS shop_products ─────────────────────────────────────────────────────
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_products_select_public" ON public.shop_products;
CREATE POLICY "shop_products_select_public"
  ON public.shop_products FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "shop_products_select_auth_all" ON public.shop_products;
CREATE POLICY "shop_products_select_auth_all"
  ON public.shop_products FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "shop_products_insert_auth" ON public.shop_products;
CREATE POLICY "shop_products_insert_auth"
  ON public.shop_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "shop_products_update_auth" ON public.shop_products;
CREATE POLICY "shop_products_update_auth"
  ON public.shop_products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "shop_products_delete_auth" ON public.shop_products;
CREATE POLICY "shop_products_delete_auth"
  ON public.shop_products FOR DELETE
  TO authenticated
  USING (true);

-- ── RLS shop_settings ─────────────────────────────────────────────────────
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_settings_select_public" ON public.shop_settings;
CREATE POLICY "shop_settings_select_public"
  ON public.shop_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "shop_settings_update_auth" ON public.shop_settings;
CREATE POLICY "shop_settings_update_auth"
  ON public.shop_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "shop_settings_insert_auth" ON public.shop_settings;
CREATE POLICY "shop_settings_insert_auth"
  ON public.shop_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── STORAGE : bucket « vente » ────────────────────────────────────────────
DROP POLICY IF EXISTS "vente_storage_select_public" ON storage.objects;
CREATE POLICY "vente_storage_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'vente');

DROP POLICY IF EXISTS "vente_storage_insert_auth" ON storage.objects;
CREATE POLICY "vente_storage_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vente');

DROP POLICY IF EXISTS "vente_storage_update_auth" ON storage.objects;
CREATE POLICY "vente_storage_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vente')
  WITH CHECK (bucket_id = 'vente');

DROP POLICY IF EXISTS "vente_storage_delete_auth" ON storage.objects;
CREATE POLICY "vente_storage_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vente');
