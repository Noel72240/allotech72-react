-- Annulation de commandes (admin)
-- Exécuter dans Supabase → SQL Editor (après shop-orders-shipping.sql)

ALTER TABLE public.shop_order_fulfillments
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'fulfilled',
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stock_restored BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.shop_order_fulfillments
  DROP CONSTRAINT IF EXISTS shop_order_fulfillments_status_check;

ALTER TABLE public.shop_order_fulfillments
  ADD CONSTRAINT shop_order_fulfillments_status_check
  CHECK (status IN ('fulfilled', 'cancelled'));

DROP POLICY IF EXISTS "shop_fulfillments_update_auth" ON public.shop_order_fulfillments;
CREATE POLICY "shop_fulfillments_update_auth"
  ON public.shop_order_fulfillments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
