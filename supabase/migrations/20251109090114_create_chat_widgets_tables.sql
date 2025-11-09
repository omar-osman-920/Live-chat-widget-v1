/*
  # Create Chat Widgets System

  1. New Tables
    - `chat_widgets`
      - `id` (uuid, primary key)
      - `name` (text) - Widget name
      - `active` (boolean) - Whether widget is enabled
      - `supported_languages` (text[]) - Array of supported languages
      - `title` (jsonb) - Widget title per language
      - `show_status` (boolean) - Show online/offline status
      - `welcome_heading` (jsonb) - Welcome heading per language
      - `welcome_tagline` (jsonb) - Welcome tagline per language
      - `pre_chat_form_enabled` (boolean)
      - `pre_chat_form_fields` (text[]) - Array of form field names
      - `privacy_policy_enabled` (boolean)
      - `privacy_policy_url` (text)
      - `terms_of_use_url` (text)
      - `timeout_value` (integer)
      - `timeout_unit` (text) - seconds/minutes/hours
      - `working_hours` (jsonb) - Working hours configuration
      - `during_working_hours_message` (jsonb) - Message per language
      - `after_working_hours_message` (jsonb) - Message per language
      - `position` (text) - bottom-left/bottom-right
      - `color` (text) - Widget color
      - `display_picture` (text) - URL to avatar image
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `chat_widget_websites`
      - `id` (uuid, primary key)
      - `widget_id` (uuid, foreign key to chat_widgets)
      - `website_url` (text) - Linked website URL
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their widgets
*/

CREATE TABLE IF NOT EXISTS chat_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  active boolean DEFAULT true,
  supported_languages text[] DEFAULT ARRAY['English'],
  title jsonb DEFAULT '{"English": "Live Chat"}'::jsonb,
  show_status boolean DEFAULT true,
  welcome_heading jsonb DEFAULT '{"English": "Hello! 👋"}'::jsonb,
  welcome_tagline jsonb DEFAULT '{"English": "How can we help you today?"}'::jsonb,
  pre_chat_form_enabled boolean DEFAULT false,
  pre_chat_form_fields text[] DEFAULT ARRAY[]::text[],
  privacy_policy_enabled boolean DEFAULT false,
  privacy_policy_url text DEFAULT '',
  terms_of_use_url text DEFAULT '',
  timeout_value integer DEFAULT 5,
  timeout_unit text DEFAULT 'minutes',
  working_hours jsonb DEFAULT '{}'::jsonb,
  during_working_hours_message jsonb DEFAULT '{"English": "We are available!"}'::jsonb,
  after_working_hours_message jsonb DEFAULT '{"English": "We will be back soon!"}'::jsonb,
  position text DEFAULT 'bottom-right',
  color text DEFAULT '#8B5CF6',
  display_picture text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_widget_websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES chat_widgets(id) ON DELETE CASCADE,
  website_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_widget_websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all widgets"
  ON chat_widgets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert widgets"
  ON chat_widgets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update widgets"
  ON chat_widgets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete widgets"
  ON chat_widgets FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can view widget websites"
  ON chat_widget_websites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert widget websites"
  ON chat_widget_websites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update widget websites"
  ON chat_widget_websites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete widget websites"
  ON chat_widget_websites FOR DELETE
  TO authenticated
  USING (true);