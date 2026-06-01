-- Bannières défilantes page boutique (jusqu'à 3 slides)
-- Exécuter dans Supabase → SQL Editor

ALTER TABLE public.shop_settings
  ADD COLUMN IF NOT EXISTS banners JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.shop_settings.banners IS
  'Tableau JSON (max 3) : { image, link, alt, enabled }';
