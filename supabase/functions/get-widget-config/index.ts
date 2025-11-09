import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const widgetId = url.searchParams.get('widgetId');
    const language = url.searchParams.get('language') || 'english';

    if (!widgetId) {
      return new Response(
        JSON.stringify({ error: 'Widget ID is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: widget, error } = await supabase
      .from('chat_widgets')
      .select('*')
      .eq('id', widgetId)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch widget' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!widget) {
      return new Response(
        JSON.stringify({ error: 'Widget not found' }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!widget.active) {
      return new Response(
        JSON.stringify({ error: 'Widget is not active' }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const langKey = language.charAt(0).toUpperCase() + language.slice(1);

    const config = {
      id: widget.id,
      name: widget.name,
      active: widget.active,
      supportedLanguages: widget.supported_languages || ['English'],
      title: widget.title?.[langKey] || widget.title?.['English'] || 'Live Chat',
      showStatus: widget.show_status !== false,
      welcomeHeading: widget.welcome_heading?.[langKey] || widget.welcome_heading?.['English'] || 'Hello! 👋',
      welcomeTagline: widget.welcome_tagline?.[langKey] || widget.welcome_tagline?.['English'] || 'How can we help you today?',
      preChatFormEnabled: widget.pre_chat_form_enabled || false,
      preChatFormFields: widget.pre_chat_form_fields || [],
      privacyPolicyEnabled: widget.privacy_policy_enabled || false,
      privacyPolicyUrl: widget.privacy_policy_url || '',
      termsOfUseUrl: widget.terms_of_use_url || '',
      timeoutValue: widget.timeout_value || 5,
      timeoutUnit: widget.timeout_unit || 'minutes',
      workingHours: widget.working_hours || {},
      duringWorkingHoursMessage: widget.during_working_hours_message?.[langKey] || widget.during_working_hours_message?.['English'] || 'We are available!',
      afterWorkingHoursMessage: widget.after_working_hours_message?.[langKey] || widget.after_working_hours_message?.['English'] || 'We will be back soon!',
      color: widget.color || '#8B5CF6',
      position: widget.position || 'bottom-right',
      displayPicture: widget.display_picture || '',
    };

    return new Response(
      JSON.stringify(config),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
