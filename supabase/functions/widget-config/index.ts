import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Api-Key',
  'Cache-Control': 'public, max-age=60, s-maxage=300',
  'CDN-Cache-Control': 'max-age=300',
};

interface WidgetConfig {
  id: string;
  name: string;
  version: string;
  is_enabled: boolean;
  branding: any;
  behavior: any;
  localization: any;
  features: any;
  working_hours: any;
  routing_rules: any;
  allowed_domains: string[];
  blocked_domains: string[];
}

interface Agent {
  id: string;
  display_name: string;
  avatar_url: string;
  status: string;
  departments: string[];
  skills: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const customerId = url.searchParams.get('id') || url.searchParams.get('customer_id');
    const widgetId = url.searchParams.get('widget_id');
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';

    if (!customerId && !widgetId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: id or widget_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('widget_configs')
      .select('*, customer_id')
      .eq('is_enabled', true)
      .limit(1);

    if (widgetId) {
      query = query.eq('id', widgetId);
    } else {
      const { data: customer } = await supabase
        .from('customers')
        .select('id, is_active, rate_limit_per_minute')
        .eq('api_key', customerId)
        .eq('is_active', true)
        .maybeSingle();

      if (!customer) {
        return new Response(
          JSON.stringify({ error: 'Invalid customer ID or inactive account' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      query = query.eq('customer_id', customer.id);
    }

    const { data: widget, error: widgetError } = await query.maybeSingle();

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

    const originDomain = origin.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (widget.blocked_domains && widget.blocked_domains.includes(originDomain)) {
      return new Response(
        JSON.stringify({ error: 'Domain is blocked' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (widget.allowed_domains && widget.allowed_domains.length > 0) {
      const isAllowed = widget.allowed_domains.some((domain: string) => {
        if (domain.startsWith('*.')) {
          const baseDomain = domain.substring(2);
          return originDomain.endsWith(baseDomain);
        }
        return originDomain === domain;
      });

      if (!isAllowed) {
        return new Response(
          JSON.stringify({ error: 'Domain not allowed' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data: agents } = await supabase
      .from('agents')
      .select('id, display_name, avatar_url, status, departments, skills')
      .eq('customer_id', widget.customer_id)
      .eq('is_active', true)
      .order('status', { ascending: false });

    const onlineAgents = agents?.filter((a: Agent) => a.status === 'online') || [];
    const isOnline = onlineAgents.length > 0;

    const isWithinWorkingHours = checkWorkingHours(widget.working_hours);
    const effectivelyOnline = isOnline && (!widget.working_hours?.enabled || isWithinWorkingHours);

    const config = {
      widget_id: widget.id,
      customer_id: widget.customer_id,
      version: widget.version,
      cdn_url: `${supabaseUrl}/storage/v1/object/public/widget-assets`,
      websocket_url: supabaseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/realtime/v1/websocket',
      api_url: supabaseUrl,
      
      branding: widget.branding,
      behavior: {
        ...widget.behavior,
        effective_message: effectivelyOnline 
          ? widget.behavior.online_message 
          : widget.behavior.offline_message,
      },
      localization: widget.localization,
      features: widget.features,
      
      agents: {
        online_count: onlineAgents.length,
        is_online: effectivelyOnline,
        available_agents: onlineAgents.map((a: Agent) => ({
          id: a.id,
          name: a.display_name,
          avatar: a.avatar_url,
          departments: a.departments,
        })),
      },
      
      routing: widget.routing_rules,
      
      timestamp: new Date().toISOString(),
      cache_key: `${widget.id}-${widget.version}`,
    };

    await supabase.from('api_rate_limits').upsert({
      customer_id: widget.customer_id,
      endpoint: '/widget-config',
      request_count: 1,
      window_start: new Date(),
      last_request_at: new Date(),
    }, {
      onConflict: 'customer_id,endpoint,window_start',
    });

    return new Response(
      JSON.stringify(config),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'ETag': `"${widget.id}-${widget.version}"`,
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
  if (!workingHours?.enabled) return true;

  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()];
  
  const schedule = workingHours.schedule?.[currentDay];
  if (!schedule || schedule.length === 0) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return schedule.some((slot: any) => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
}
