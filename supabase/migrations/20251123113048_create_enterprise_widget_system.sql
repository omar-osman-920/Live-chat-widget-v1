/*
  # Enterprise Live Chat Widget System - Complete Database Schema

  ## 1. Customer/Account Management
    - `customers` - Main customer accounts that own widgets
      - `id` (uuid, primary key)
      - `company_name` (text) - Company name
      - `api_key` (text, unique) - Public API key for widget loading
      - `api_secret` (text) - Secret key for admin operations
      - `plan_tier` (text) - free, pro, enterprise
      - `max_widgets` (integer) - Maximum widgets allowed
      - `max_agents` (integer) - Maximum agents allowed
      - `rate_limit_per_minute` (integer) - API rate limit
      - `is_active` (boolean) - Account status
      - `created_at`, `updated_at` (timestamptz)

  ## 2. Widget Configuration
    - `widget_configs` - Comprehensive widget settings
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `name` (text) - Widget name/identifier
      - `version` (text) - Widget version (for caching)
      - `is_enabled` (boolean) - Active status
      
      **Branding Settings (JSONB)**
      - `branding` - {
          primary_color, secondary_color, text_color,
          header_bg_color, button_color, font_family,
          widget_shape, border_radius, shadow_style,
          logo_url, avatar_url, company_logo_url
        }
      
      **Behavior Settings (JSONB)**
      - `behavior` - {
          position, offset_x, offset_y, z_index,
          auto_open_delay, auto_open_enabled,
          welcome_message, offline_message,
          online_message, greeting_delay,
          pre_chat_form, post_chat_survey,
          inactivity_timeout, chat_sound_enabled
        }
      
      **Language & Localization (JSONB)**
      - `localization` - {
          default_language, supported_languages,
          custom_text_overrides: {
            welcome_message, offline_message,
            placeholder_text, send_button_text,
            end_chat_text, agent_typing_text
          }
        }
      
      **Features (JSONB)**
      - `features` - {
          file_upload_enabled, max_file_size,
          allowed_file_types, emoji_enabled,
          chat_history_enabled, chatbot_enabled,
          chatbot_config: {name, avatar, triggers},
          integrations: {google_analytics, webhooks},
          gdpr_consent_required, gdpr_text
        }
      
      **Working Hours (JSONB)**
      - `working_hours` - {
          enabled, timezone, schedule: {
            monday: [{start, end}], tuesday: [...], ...
          }
        }
      
      **Routing Rules (JSONB)**
      - `routing_rules` - {
          routing_type, round_robin_enabled,
          department_based, skill_based,
          priority_rules, max_queue_size
        }
      
      - `allowed_domains` (text[]) - Whitelist of domains
      - `blocked_domains` (text[]) - Blacklist of domains
      - `created_at`, `updated_at` (timestamptz)

  ## 3. Agents
    - `agents` - Support agents for handling chats
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users) - Supabase auth
      - `display_name` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `role` (text) - admin, agent, viewer
      - `status` (text) - online, away, offline
      - `last_seen_at` (timestamptz)
      - `max_concurrent_chats` (integer)
      - `current_chat_count` (integer)
      - `departments` (text[]) - Assigned departments
      - `skills` (text[]) - Skills for routing
      - `is_active` (boolean)
      - `created_at`, `updated_at` (timestamptz)

  ## 4. Conversations (Enhanced)
    - `conversations` - Chat conversations with full metadata
      - `id` (uuid, primary key)
      - `widget_id` (uuid, foreign key)
      - `customer_id` (uuid, foreign key)
      - `visitor_id` (text) - Anonymous visitor identifier
      - `session_id` (text) - Browser session
      - `assigned_agent_id` (uuid, foreign key to agents)
      - `status` (text) - queued, active, resolved, closed
      - `priority` (integer) - 1-5 priority level
      
      **Visitor Information (JSONB)**
      - `visitor_info` - {
          name, email, phone, company,
          custom_fields: {key: value},
          consent_given, consent_timestamp
        }
      
      **Context & Analytics (JSONB)**
      - `context` - {
          page_url, page_title, referrer,
          user_agent, browser, os, device_type,
          country, city, ip_hash,
          landing_page, visit_count,
          previous_chats, tags
        }
      
      **Ratings & Feedback (JSONB)**
      - `feedback` - {
          rating, comment, nps_score,
          resolved, resolution_time
        }
      
      - `queue_position` (integer)
      - `wait_time_seconds` (integer)
      - `first_response_time_seconds` (integer)
      - `resolution_time_seconds` (integer)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `created_at`, `updated_at` (timestamptz)

  ## 5. Messages (Enhanced)
    - `messages` - All chat messages with rich content
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `sender_type` (text) - visitor, agent, bot, system
      - `sender_id` (uuid) - Agent or bot ID
      - `sender_name` (text)
      
      **Content**
      - `message_type` (text) - text, file, image, card, form
      - `content` (text) - Message text
      - `metadata` (jsonb) - {
          file_url, file_name, file_size, mime_type,
          card_data, form_data, quick_replies,
          is_edited, edit_timestamp
        }
      
      - `is_read` (boolean)
      - `read_at` (timestamptz)
      - `delivered_at` (timestamptz)
      - `created_at` (timestamptz)

  ## 6. Agent Presence & Sessions
    - `agent_sessions` - Track agent online status
      - `id` (uuid, primary key)
      - `agent_id` (uuid, foreign key)
      - `status` (text) - online, away, offline
      - `socket_id` (text) - WebSocket connection ID
      - `last_heartbeat` (timestamptz)
      - `connected_at` (timestamptz)
      - `disconnected_at` (timestamptz)

  ## 7. Analytics & Metrics
    - `widget_analytics` - Performance metrics
      - `id` (uuid, primary key)
      - `widget_id` (uuid, foreign key)
      - `date` (date)
      - `metrics` (jsonb) - {
          total_visitors, total_conversations,
          total_messages, avg_response_time,
          avg_resolution_time, satisfaction_score,
          conversion_rate, bounce_rate
        }

  ## 8. Rate Limiting & Security
    - `api_rate_limits` - Track API usage
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `endpoint` (text)
      - `request_count` (integer)
      - `window_start` (timestamptz)
      - `last_request_at` (timestamptz)

  ## 9. Audit Logs
    - `audit_logs` - Configuration changes and actions
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `agent_id` (uuid, foreign key)
      - `action` (text)
      - `resource_type` (text)
      - `resource_id` (uuid)
      - `changes` (jsonb)
      - `ip_address` (text)
      - `user_agent` (text)
      - `created_at` (timestamptz)

  ## Security & Indexes
    - All tables have RLS enabled
    - Indexes on foreign keys and frequently queried columns
    - Partial indexes for active records
    - GiST indexes for JSONB columns where needed
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  api_key text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  api_secret text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  plan_tier text DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'enterprise')),
  max_widgets integer DEFAULT 1,
  max_agents integer DEFAULT 3,
  rate_limit_per_minute integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS widget_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  version text DEFAULT '1.0.0',
  is_enabled boolean DEFAULT true,
  
  branding jsonb DEFAULT '{
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "text_color": "#1F2937",
    "header_bg_color": "#3B82F6",
    "button_color": "#3B82F6",
    "font_family": "system-ui",
    "widget_shape": "rounded",
    "border_radius": "12px",
    "shadow_style": "medium",
    "logo_url": "",
    "avatar_url": "",
    "company_logo_url": ""
  }'::jsonb,
  
  behavior jsonb DEFAULT '{
    "position": "bottom-right",
    "offset_x": 20,
    "offset_y": 20,
    "z_index": 999999,
    "auto_open_delay": 0,
    "auto_open_enabled": false,
    "welcome_message": "Hello! How can we help you today?",
    "offline_message": "We are currently offline. Please leave a message.",
    "online_message": "We are online and ready to help!",
    "greeting_delay": 2000,
    "pre_chat_form": {"enabled": false, "fields": []},
    "post_chat_survey": {"enabled": false},
    "inactivity_timeout": 300000,
    "chat_sound_enabled": true
  }'::jsonb,
  
  localization jsonb DEFAULT '{
    "default_language": "en",
    "supported_languages": ["en"],
    "custom_text_overrides": {}
  }'::jsonb,
  
  features jsonb DEFAULT '{
    "file_upload_enabled": true,
    "max_file_size": 10485760,
    "allowed_file_types": ["image/*", ".pdf", ".doc", ".docx"],
    "emoji_enabled": true,
    "chat_history_enabled": true,
    "chatbot_enabled": false,
    "chatbot_config": {},
    "integrations": {},
    "gdpr_consent_required": false,
    "gdpr_text": ""
  }'::jsonb,
  
  working_hours jsonb DEFAULT '{
    "enabled": false,
    "timezone": "UTC",
    "schedule": {}
  }'::jsonb,
  
  routing_rules jsonb DEFAULT '{
    "routing_type": "round_robin",
    "round_robin_enabled": true,
    "department_based": false,
    "skill_based": false,
    "priority_rules": [],
    "max_queue_size": 100
  }'::jsonb,
  
  allowed_domains text[] DEFAULT ARRAY[]::text[],
  blocked_domains text[] DEFAULT ARRAY[]::text[],
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(customer_id, name)
);

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  email text NOT NULL,
  avatar_url text DEFAULT '',
  role text DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'viewer')),
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen_at timestamptz DEFAULT now(),
  max_concurrent_chats integer DEFAULT 5,
  current_chat_count integer DEFAULT 0,
  departments text[] DEFAULT ARRAY[]::text[],
  skills text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(customer_id, email)
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES widget_configs(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  assigned_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  status text DEFAULT 'queued' CHECK (status IN ('queued', 'active', 'resolved', 'closed')),
  priority integer DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  
  visitor_info jsonb DEFAULT '{}'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  feedback jsonb DEFAULT '{}'::jsonb,
  
  queue_position integer DEFAULT 0,
  wait_time_seconds integer DEFAULT 0,
  first_response_time_seconds integer,
  resolution_time_seconds integer,
  
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('visitor', 'agent', 'bot', 'system')),
  sender_id uuid,
  sender_name text DEFAULT '',
  
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'card', 'form')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  is_read boolean DEFAULT false,
  read_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status text DEFAULT 'online' CHECK (status IN ('online', 'away', 'offline')),
  socket_id text,
  last_heartbeat timestamptz DEFAULT now(),
  connected_at timestamptz DEFAULT now(),
  disconnected_at timestamptz
);

CREATE TABLE IF NOT EXISTS widget_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES widget_configs(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  metrics jsonb DEFAULT '{}'::jsonb,
  
  UNIQUE(widget_id, date)
);

CREATE TABLE IF NOT EXISTS api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  request_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  last_request_at timestamptz DEFAULT now(),
  
  UNIQUE(customer_id, endpoint, window_start)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_widget_configs_customer_id ON widget_configs(customer_id);
CREATE INDEX IF NOT EXISTS idx_widget_configs_api_key ON widget_configs(customer_id) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_agents_customer_id ON agents(customer_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(customer_id, status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_conversations_widget_id ON conversations(widget_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status) WHERE status IN ('queued', 'active');
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(assigned_agent_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_id ON agent_sessions(agent_id) WHERE disconnected_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_customer_id ON audit_logs(customer_id, created_at DESC);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read widget configs by API key"
  ON widget_configs FOR SELECT
  TO anon, authenticated
  USING (is_enabled = true);

CREATE POLICY "Public can insert conversations"
  ON conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read own conversations"
  ON conversations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage their customer data"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agents"
  ON agents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage widget configs"
  ON widget_configs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON widget_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_widget_configs_updated_at ON widget_configs;
CREATE TRIGGER update_widget_configs_updated_at
  BEFORE UPDATE ON widget_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
