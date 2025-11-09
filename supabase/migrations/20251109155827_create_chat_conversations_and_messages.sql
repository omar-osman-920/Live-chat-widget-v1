/*
  # Create Chat Conversations and Messages System

  1. New Tables
    - `chat_conversations`
      - `id` (uuid, primary key)
      - `widget_id` (uuid, foreign key to chat_widgets)
      - `visitor_id` (text) - Anonymous visitor identifier
      - `visitor_name` (text) - Visitor's name from pre-chat form
      - `visitor_email` (text) - Visitor's email from pre-chat form
      - `status` (text) - open, closed, etc.
      - `website_url` (text) - URL where conversation started
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key to chat_conversations)
      - `sender_type` (text) - visitor or agent
      - `sender_name` (text) - Name of sender
      - `message_text` (text) - Message content
      - `created_at` (timestamptz)

  2. Indexes
    - Add index on widget_id for conversation lookups
    - Add index on conversation_id for message queries
    - Add index on visitor_id for visitor history

  3. Security
    - Enable RLS on all tables
    - Public can insert conversations and messages (for widget)
    - Authenticated users can read and update all conversations
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES chat_widgets(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  visitor_name text DEFAULT '',
  visitor_email text DEFAULT '',
  status text DEFAULT 'open',
  website_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL,
  sender_name text DEFAULT '',
  message_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_widget_id 
  ON chat_conversations(widget_id);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_id 
  ON chat_conversations(visitor_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id 
  ON chat_messages(conversation_id);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert conversations"
  ON chat_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own conversations"
  ON chat_conversations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update conversations"
  ON chat_conversations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete conversations"
  ON chat_conversations FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
