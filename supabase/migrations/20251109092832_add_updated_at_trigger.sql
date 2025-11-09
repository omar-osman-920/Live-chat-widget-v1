/*
  # Add Updated At Trigger

  1. Changes
    - Create function to automatically update updated_at timestamp
    - Add trigger to chat_widgets table
*/

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to chat_widgets table
DROP TRIGGER IF EXISTS update_chat_widgets_updated_at ON chat_widgets;
CREATE TRIGGER update_chat_widgets_updated_at
    BEFORE UPDATE ON chat_widgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();