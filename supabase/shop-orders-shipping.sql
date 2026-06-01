-- Commandes boutique : coordonnées client + livraison Mondial Relay
-- Exécuter dans Supabase → SQL Editor (après shop.sql et shop-stock.sql)

ALTER TABLE public.shop_settings
  ADD COLUMN IF NOT EXISTS mondial_relay_fee NUMERIC(10, 2) DEFAULT 0.50,
  ADD COLUMN IF NOT EXISTS mondial_relay_brand TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS pickup_enabled BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.shop_order_fulfillments
  ADD COLUMN IF NOT EXISTS customer JSONB,
  ADD COLUMN IF NOT EXISTS shipping JSONB,
  ADD COLUMN IF NOT EXISTS amounts JSONB,
  ADD COLUMN IF NOT EXISTS items_detail JSONB,
  ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN NOT NULL DEFAULT false;

-- Admin : lire les commandes
DROP POLICY IF EXISTS "shop_fulfillments_select_auth" ON public.shop_order_fulfillments;
CREATE POLICY "shop_fulfillments_select_auth"
  ON public.shop_order_fulfillments FOR SELECT
  TO authenticated
  USING (true);

-- Frais Mondial Relay (test) — exécuter pour appliquer sur la boutique en ligne
UPDATE public.shop_settings SET mondial_relay_fee = 0.50 WHERE id = 1;
