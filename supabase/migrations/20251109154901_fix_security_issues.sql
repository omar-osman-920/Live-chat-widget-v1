/*
  # Fix Security Issues

  1. Performance Optimization
    - Add index on `chat_widget_websites.widget_id` foreign key
    - This improves query performance for joins and lookups

  2. Security Enhancement
    - Drop and recreate `update_updated_at_column` function with secure search_path
    - Set search_path to empty string to prevent search path injection attacks
    - This ensures the function only uses fully qualified object names

  ## Details

  ### Missing Index
  The foreign key `chat_widget_websites_widget_id_fkey` needs a covering index
  to optimize queries that join or filter on the widget_id column.

  ### Search Path Security
  Functions without an explicit search_path can be vulnerable to search path
  injection attacks. Setting an empty or fixed search_path prevents malicious
  users from exploiting the function by manipulating the search path.
*/

-- Add index on foreign key for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_widget_websites_widget_id 
  ON chat_widget_websites(widget_id);

-- Drop the existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger since we dropped the function with CASCADE
DROP TRIGGER IF EXISTS update_chat_widgets_updated_at ON chat_widgets;
CREATE TRIGGER update_chat_widgets_updated_at
    BEFORE UPDATE ON chat_widgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
