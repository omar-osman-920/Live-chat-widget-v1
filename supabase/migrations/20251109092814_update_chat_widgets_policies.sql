/*
  # Update Chat Widgets Policies for Public Access

  1. Changes
    - Drop existing policies that require authentication
    - Add new policies that allow public (anon) access
    - This allows users to create and view widgets without authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all widgets" ON chat_widgets;
DROP POLICY IF EXISTS "Users can insert widgets" ON chat_widgets;
DROP POLICY IF EXISTS "Users can update widgets" ON chat_widgets;
DROP POLICY IF EXISTS "Users can delete widgets" ON chat_widgets;
DROP POLICY IF EXISTS "Users can view widget websites" ON chat_widget_websites;
DROP POLICY IF EXISTS "Users can insert widget websites" ON chat_widget_websites;
DROP POLICY IF EXISTS "Users can update widget websites" ON chat_widget_websites;
DROP POLICY IF EXISTS "Users can delete widget websites" ON chat_widget_websites;

-- Create new policies allowing public access
CREATE POLICY "Anyone can view widgets"
  ON chat_widgets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert widgets"
  ON chat_widgets FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update widgets"
  ON chat_widgets FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete widgets"
  ON chat_widgets FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can view widget websites"
  ON chat_widget_websites FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert widget websites"
  ON chat_widget_websites FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update widget websites"
  ON chat_widget_websites FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete widget websites"
  ON chat_widget_websites FOR DELETE
  TO public
  USING (true);