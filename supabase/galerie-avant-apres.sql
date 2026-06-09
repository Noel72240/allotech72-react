-- Galerie : activer/désactiver le mode avant-après par photo
ALTER TABLE public.galerie
  ADD COLUMN IF NOT EXISTS avant_apres BOOLEAN NOT NULL DEFAULT true;
