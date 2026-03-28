-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — RLS pour avis + galerie + bucket Storage « galerie »
-- À exécuter dans Supabase → SQL Editor après avoir créé un utilisateur
-- Authentication → Users → Add user (email + mot de passe).
--
-- Effet : lecture publique (site vitrine), écriture réservée aux comptes connectés.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── AVIS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avis_select_public" ON public.avis;
CREATE POLICY "avis_select_public"
  ON public.avis FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "avis_insert_auth" ON public.avis;
CREATE POLICY "avis_insert_auth"
  ON public.avis FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "avis_update_auth" ON public.avis;
CREATE POLICY "avis_update_auth"
  ON public.avis FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "avis_delete_auth" ON public.avis;
CREATE POLICY "avis_delete_auth"
  ON public.avis FOR DELETE
  TO authenticated
  USING (true);

-- ── GALERIE ─────────────────────────────────────────────────────────────────
ALTER TABLE public.galerie ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "galerie_select_public" ON public.galerie;
CREATE POLICY "galerie_select_public"
  ON public.galerie FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "galerie_insert_auth" ON public.galerie;
CREATE POLICY "galerie_insert_auth"
  ON public.galerie FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "galerie_update_auth" ON public.galerie;
CREATE POLICY "galerie_update_auth"
  ON public.galerie FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "galerie_delete_auth" ON public.galerie;
CREATE POLICY "galerie_delete_auth"
  ON public.galerie FOR DELETE
  TO authenticated
  USING (true);

-- ── STORAGE : bucket « galerie » (ajustez le nom si différent) ─────────────
-- Lecture publique des fichiers (URLs getPublicUrl)
DROP POLICY IF EXISTS "galerie_storage_select_public" ON storage.objects;
CREATE POLICY "galerie_storage_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'galerie');

DROP POLICY IF EXISTS "galerie_storage_insert_auth" ON storage.objects;
CREATE POLICY "galerie_storage_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'galerie');

DROP POLICY IF EXISTS "galerie_storage_update_auth" ON storage.objects;
CREATE POLICY "galerie_storage_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'galerie')
  WITH CHECK (bucket_id = 'galerie');

DROP POLICY IF EXISTS "galerie_storage_delete_auth" ON storage.objects;
CREATE POLICY "galerie_storage_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'galerie');
