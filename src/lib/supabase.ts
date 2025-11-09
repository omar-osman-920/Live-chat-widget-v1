import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatWidget {
  id: string;
  name: string;
  active: boolean;
  supported_languages: string[];
  title: Record<string, string>;
  show_status: boolean;
  welcome_heading: Record<string, string>;
  welcome_tagline: Record<string, string>;
  pre_chat_form_enabled: boolean;
  pre_chat_form_fields: string[];
  privacy_policy_enabled: boolean;
  privacy_policy_url: string;
  terms_of_use_url: string;
  timeout_value: number;
  timeout_unit: string;
  working_hours: Record<string, any>;
  during_working_hours_message: Record<string, string>;
  after_working_hours_message: Record<string, string>;
  position: string;
  color: string;
  display_picture: string;
  created_at: string;
  updated_at: string;
}

export interface ChatWidgetWebsite {
  id: string;
  widget_id: string;
  website_url: string;
  created_at: string;
}
