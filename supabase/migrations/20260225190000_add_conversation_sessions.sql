/*
  Add conversation session table for managing user conversation IDs.
*/

CREATE TABLE IF NOT EXISTS conversation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id text NOT NULL,
  last_prompt text DEFAULT '',
  last_result text DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (conversation_id, created_by)
);

ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversation sessions"
  ON conversation_sessions FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert own conversation sessions"
  ON conversation_sessions FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own conversation sessions"
  ON conversation_sessions FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own conversation sessions"
  ON conversation_sessions FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE INDEX IF NOT EXISTS idx_conversation_sessions_created_by ON conversation_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_conversation_id ON conversation_sessions(conversation_id);
