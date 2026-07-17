-- ═══════════════════════════════════════════════════════════════════════════
-- Allotech72 — RLS admin pour tables Adam
-- À exécuter après adam-agent.sql (lecture réservée aux comptes authentifiés)
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "adam_conversations_select_auth" ON public.adam_conversations;
CREATE POLICY "adam_conversations_select_auth"
  ON public.adam_conversations FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_conversations_update_auth" ON public.adam_conversations;
CREATE POLICY "adam_conversations_update_auth"
  ON public.adam_conversations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "adam_conversations_delete_auth" ON public.adam_conversations;
CREATE POLICY "adam_conversations_delete_auth"
  ON public.adam_conversations FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_messages_select_auth" ON public.adam_messages;
CREATE POLICY "adam_messages_select_auth"
  ON public.adam_messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_messages_delete_auth" ON public.adam_messages;
CREATE POLICY "adam_messages_delete_auth"
  ON public.adam_messages FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_memories_select_auth" ON public.adam_memories;
CREATE POLICY "adam_memories_select_auth"
  ON public.adam_memories FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_memories_delete_auth" ON public.adam_memories;
CREATE POLICY "adam_memories_delete_auth"
  ON public.adam_memories FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_diagnostic_sessions_select_auth" ON public.adam_diagnostic_sessions;
CREATE POLICY "adam_diagnostic_sessions_select_auth"
  ON public.adam_diagnostic_sessions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_diagnostic_sessions_delete_auth" ON public.adam_diagnostic_sessions;
CREATE POLICY "adam_diagnostic_sessions_delete_auth"
  ON public.adam_diagnostic_sessions FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_tool_logs_select_auth" ON public.adam_tool_logs;
CREATE POLICY "adam_tool_logs_select_auth"
  ON public.adam_tool_logs FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_tool_logs_delete_auth" ON public.adam_tool_logs;
CREATE POLICY "adam_tool_logs_delete_auth"
  ON public.adam_tool_logs FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_knowledge_documents_select_auth" ON public.adam_knowledge_documents;
CREATE POLICY "adam_knowledge_documents_select_auth"
  ON public.adam_knowledge_documents FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "adam_knowledge_chunks_select_auth" ON public.adam_knowledge_chunks;
CREATE POLICY "adam_knowledge_chunks_select_auth"
  ON public.adam_knowledge_chunks FOR SELECT
  TO authenticated
  USING (true);
