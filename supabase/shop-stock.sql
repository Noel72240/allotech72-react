-- Migration : stock + suivi des commandes payées
-- À exécuter dans Supabase → SQL Editor (après shop.sql)

ALTER TABLE public.shop_products
  ADD COLUMN IF NOT EXISTS stock INT DEFAULT 1;

COMMENT ON COLUMN public.shop_products.stock IS
  'Quantité disponible. NULL = pas de suivi. 0 = épuisé. Marqué vendu après paiement si stock atteint 0.';

CREATE TABLE IF NOT EXISTS public.shop_order_fulfillments (
  checkout_reference TEXT PRIMARY KEY,
  checkout_id        TEXT NOT NULL,
  items              JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_order_fulfillments ENABLE ROW LEVEL SECURITY;
-- Pas de policy publique : lecture/écriture via service role (API Vercel uniquement)
