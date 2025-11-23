import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean).pop();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const anonSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await anonSupabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET' && path === 'widgets') {
      return await handleGetWidgets(req, supabase, user.id);
    } else if (req.method === 'POST' && path === 'widget') {
      return await handleCreateWidget(req, supabase, user.id);
    } else if (req.method === 'PUT' && path === 'widget') {
      return await handleUpdateWidget(req, supabase, user.id);
    } else if (req.method === 'DELETE' && path === 'widget') {
      return await handleDeleteWidget(req, supabase, user.id, url);
    } else if (req.method === 'GET' && path === 'customer') {
      return await handleGetCustomer(req, supabase, user.id);
    } else if (req.method === 'POST' && path === 'refresh-key') {
      return await handleRefreshApiKey(req, supabase, user.id);
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getCustomerFromUser(supabase: any, userId: string) {
  const { data: agent } = await supabase
    .from('agents')
    .select('customer_id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (!agent) {
    return null;
  }

  return { customer_id: agent.customer_id, role: agent.role };
}

async function handleGetWidgets(req: Request, supabase: any, userId: string) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo) {
    return new Response(
      JSON.stringify({ error: 'Customer not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: widgets, error } = await supabase
    .from('widget_configs')
    .select('*')
    .eq('customer_id', userInfo.customer_id)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch widgets' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ widgets: widgets || [] }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleCreateWidget(req: Request, supabase: any, userId: string) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo || userInfo.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const { name, branding, behavior, localization, features, working_hours, routing_rules, allowed_domains } = body;

  if (!name) {
    return new Response(
      JSON.stringify({ error: 'Widget name is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: widget, error } = await supabase
    .from('widget_configs')
    .insert({
      customer_id: userInfo.customer_id,
      name,
      version: '1.0.0',
      branding: branding || undefined,
      behavior: behavior || undefined,
      localization: localization || undefined,
      features: features || undefined,
      working_hours: working_hours || undefined,
      routing_rules: routing_rules || undefined,
      allowed_domains: allowed_domains || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create widget:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create widget' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase.from('audit_logs').insert({
    customer_id: userInfo.customer_id,
    action: 'create_widget',
    resource_type: 'widget_config',
    resource_id: widget.id,
    changes: { name },
  });

  return new Response(
    JSON.stringify({ widget }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleUpdateWidget(req: Request, supabase: any, userId: string) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo || userInfo.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const body = await req.json();
  const { widget_id, ...updates } = body;

  if (!widget_id) {
    return new Response(
      JSON.stringify({ error: 'Widget ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: existing } = await supabase
    .from('widget_configs')
    .select('*')
    .eq('id', widget_id)
    .eq('customer_id', userInfo.customer_id)
    .maybeSingle();

  if (!existing) {
    return new Response(
      JSON.stringify({ error: 'Widget not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const versionParts = (existing.version || '1.0.0').split('.');
  const newVersion = `${versionParts[0]}.${parseInt(versionParts[1]) + 1}.${versionParts[2]}`;

  const { data: widget, error } = await supabase
    .from('widget_configs')
    .update({
      ...updates,
      version: newVersion,
      updated_at: new Date().toISOString(),
    })
    .eq('id', widget_id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update widget:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update widget' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase.from('audit_logs').insert({
    customer_id: userInfo.customer_id,
    action: 'update_widget',
    resource_type: 'widget_config',
    resource_id: widget.id,
    changes: updates,
  });

  return new Response(
    JSON.stringify({ widget }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDeleteWidget(req: Request, supabase: any, userId: string, url: URL) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo || userInfo.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const widgetId = url.searchParams.get('widget_id');

  if (!widgetId) {
    return new Response(
      JSON.stringify({ error: 'Widget ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { error } = await supabase
    .from('widget_configs')
    .delete()
    .eq('id', widgetId)
    .eq('customer_id', userInfo.customer_id);

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete widget' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase.from('audit_logs').insert({
    customer_id: userInfo.customer_id,
    action: 'delete_widget',
    resource_type: 'widget_config',
    resource_id: widgetId,
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetCustomer(req: Request, supabase: any, userId: string) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo) {
    return new Response(
      JSON.stringify({ error: 'Customer not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .select('id, company_name, api_key, plan_tier, max_widgets, max_agents, is_active, created_at')
    .eq('id', userInfo.customer_id)
    .maybeSingle();

  if (error || !customer) {
    return new Response(
      JSON.stringify({ error: 'Customer not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ customer }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleRefreshApiKey(req: Request, supabase: any, userId: string) {
  const userInfo = await getCustomerFromUser(supabase, userId);
  if (!userInfo || userInfo.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const newApiKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const { data: customer, error } = await supabase
    .from('customers')
    .update({ api_key: newApiKey })
    .eq('id', userInfo.customer_id)
    .select('api_key')
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to refresh API key' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase.from('audit_logs').insert({
    customer_id: userInfo.customer_id,
    action: 'refresh_api_key',
    resource_type: 'customer',
    resource_id: userInfo.customer_id,
  });

  return new Response(
    JSON.stringify({ api_key: customer.api_key }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
