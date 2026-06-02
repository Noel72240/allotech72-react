-- Carousel « Les nouveautés Allotech72 » (accueil) — 3 emplacements
-- Exécuter dans Supabase → SQL Editor

ALTER TABLE public.shop_settings
  ADD COLUMN IF NOT EXISTS home_news JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.shop_settings.home_news IS
  'Tableau JSON (max 3) : { image, kicker, title, text, cta, link, enabled }';
