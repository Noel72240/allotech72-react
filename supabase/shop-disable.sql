-- Désactive la boutique publique (réactivable dans Admin → Boutique)
-- Exécuter une fois dans Supabase → SQL Editor

UPDATE public.shop_settings
SET shop_enabled = false,
    updated_at = now()
WHERE id = 1;
