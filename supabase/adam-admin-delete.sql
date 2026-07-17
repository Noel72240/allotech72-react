-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — Autoriser la suppression des conversations Adam (admin)
-- À exécuter dans Supabase → SQL Editor si la suppression échoue (policy)
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "adam_conversations_delete_auth" ON public.adam_conversations;
CREATE POLICY "adam_conversations_delete_auth"
  ON public.adam_conversations FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_messages_delete_auth" ON public.adam_messages;
CREATE POLICY "adam_messages_delete_auth"
  ON public.adam_messages FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_memories_delete_auth" ON public.adam_memories;
CREATE POLICY "adam_memories_delete_auth"
  ON public.adam_memories FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_diagnostic_sessions_delete_auth" ON public.adam_diagnostic_sessions;
CREATE POLICY "adam_diagnostic_sessions_delete_auth"
  ON public.adam_diagnostic_sessions FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_tool_logs_delete_auth" ON public.adam_tool_logs;
CREATE POLICY "adam_tool_logs_delete_auth"
  ON public.adam_tool_logs FOR DELETE
  TO authenticated
  USING (true);
