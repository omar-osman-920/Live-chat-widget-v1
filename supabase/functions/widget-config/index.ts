import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Api-Key',
  'Cache-Control': 'public, max-age=60, s-maxage=300',
  'CDN-Cache-Control': 'max-age=300',
};

interface ChatWidget {
  id: string;
  name: string;
  active: boolean;
  supported_languages: string[];
  title: any;
  show_status: boolean;
  welcome_heading: any;
  welcome_tagline: any;
  pre_chat_form_enabled: boolean;
  pre_chat_form_fields: string[];
  privacy_policy_enabled: boolean;
  privacy_policy_url: string;
  terms_of_use_url: string;
  timeout_value: number;
  timeout_unit: string;
  working_hours: any;
  during_working_hours_message: any;
  after_working_hours_message: any;
  position: string;
  color: string;
  display_picture: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const widgetId = url.searchParams.get('widget_id') || url.searchParams.get('id');
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';

    if (!widgetId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: widget_id or id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: widget, error: widgetError } = await supabase
      .from('chat_widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('active', true)
      .maybeSingle();

    if (widgetError) {
      console.error('Database error:', widgetError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch widget configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!widget) {
      return new Response(
        JSON.stringify({ error: 'Widget not found or disabled' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isWithinWorkingHours = checkWorkingHours(widget.working_hours);
    const isOnline = true;
    const effectivelyOnline = isOnline && isWithinWorkingHours;

    const defaultLanguage = widget.supported_languages?.[0] || 'English';

    const config = {
      widget_id: widget.id,
      version: '1.0.0',
      api_url: supabaseUrl,
      websocket_url: supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/realtime/v1/websocket',

      branding: {
        primary_color: widget.color,
        button_color: widget.color,
        header_bg_color: widget.color,
        avatar_url: widget.display_picture || '',
        widget_shape: 'rounded',
        border_radius: '12px',
        font_family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },

      behavior: {
        position: widget.position || 'bottom-right',
        offset_x: 20,
        offset_y: 20,
        z_index: 999999,
        welcome_message: widget.title?.[defaultLanguage] || 'Live Chat',
        online_message: widget.during_working_hours_message?.[defaultLanguage] || 'We are available!',
        offline_message: widget.after_working_hours_message?.[defaultLanguage] || 'We will be back soon!',
        effective_message: effectivelyOnline
          ? (widget.during_working_hours_message?.[defaultLanguage] || 'We are available!')
          : (widget.after_working_hours_message?.[defaultLanguage] || 'We will be back soon!'),
        greeting_delay: 2000,
        auto_open_enabled: false,
        auto_open_delay: 0,
        pre_chat_form: {
          enabled: widget.pre_chat_form_enabled || false,
          fields: widget.pre_chat_form_fields || [],
        },
      },

      localization: {
        default_language: defaultLanguage,
        supported_languages: widget.supported_languages || ['English'],
        title: widget.title || {},
        welcome_heading: widget.welcome_heading || {},
        welcome_tagline: widget.welcome_tagline || {},
        during_working_hours_message: widget.during_working_hours_message || {},
        after_working_hours_message: widget.after_working_hours_message || {},
      },

      features: {
        show_status: widget.show_status !== false,
        privacy_policy_enabled: widget.privacy_policy_enabled || false,
        privacy_policy_url: widget.privacy_policy_url || '',
        terms_of_use_url: widget.terms_of_use_url || '',
        emoji_enabled: true,
        file_upload_enabled: false,
        chat_history_enabled: true,
      },

      working_hours: widget.working_hours || {},

      agents: {
        online_count: effectivelyOnline ? 1 : 0,
        is_online: effectivelyOnline,
        available_agents: [],
      },

      timeout: {
        value: widget.timeout_value || 5,
        unit: widget.timeout_unit || 'minutes',
      },

      timestamp: new Date().toISOString(),
      cache_key: `${widget.id}-1.0.0`,
    };

    return new Response(
      JSON.stringify(config),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'ETag': `"${widget.id}-1.0.0"`,
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function checkWorkingHours(workingHours: any): boolean {
  if (!workingHours || Object.keys(workingHours).length === 0) return true;

  const now = new Date();
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDay = days[now.getDay()];

  const schedule = workingHours[currentDay];
  if (!schedule || !schedule.enabled || !schedule.slots || schedule.slots.length === 0) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return schedule.slots.some((slot: any) => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
}
