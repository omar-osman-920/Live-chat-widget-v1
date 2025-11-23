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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST' && path === 'presence') {
      return await handleUpdatePresence(req, supabase, user.id);
    } else if (req.method === 'GET' && path === 'conversations') {
      return await handleGetConversations(req, supabase, url);
    } else if (req.method === 'POST' && path === 'assign') {
      return await handleAssignConversation(req, supabase, user.id);
    } else if (req.method === 'POST' && path === 'unassign') {
      return await handleUnassignConversation(req, supabase, user.id);
    } else if (req.method === 'GET' && path === 'stats') {
      return await handleGetStats(req, supabase, user.id);
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

async function handleUpdatePresence(req: Request, supabase: any, userId: string) {
  const body = await req.json();
  const { status, socket_id } = body;

  if (!status || !['online', 'away', 'offline'].includes(status)) {
    return new Response(
      JSON.stringify({ error: 'Invalid status' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!agent) {
    return new Response(
      JSON.stringify({ error: 'Agent not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('agents')
    .update({
      status,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', agent.id);

  if (status === 'online' && socket_id) {
    await supabase
      .from('agent_sessions')
      .upsert({
        agent_id: agent.id,
        status: 'online',
        socket_id,
        last_heartbeat: new Date().toISOString(),
        connected_at: new Date().toISOString(),
      });
  } else if (status === 'offline') {
    await supabase
      .from('agent_sessions')
      .update({
        status: 'offline',
        disconnected_at: new Date().toISOString(),
      })
      .eq('agent_id', agent.id)
      .is('disconnected_at', null);
  }

  return new Response(
    JSON.stringify({ success: true, status }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetConversations(req: Request, supabase: any, url: URL) {
  const status = url.searchParams.get('status') || 'active';
  const limit = parseInt(url.searchParams.get('limit') || '20');

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*, messages(content, created_at, sender_type)')
    .eq('status', status)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversations' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ conversations: conversations || [] }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleAssignConversation(req: Request, supabase: any, userId: string) {
  const body = await req.json();
  const { conversation_id } = body;

  if (!conversation_id) {
    return new Response(
      JSON.stringify({ error: 'Missing conversation ID' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!agent) {
    return new Response(
      JSON.stringify({ error: 'Agent not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('conversations')
    .update({
      assigned_agent_id: agent.id,
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .eq('id', conversation_id);

  await supabase
    .from('agents')
    .update({
      current_chat_count: (agent.current_chat_count || 0) + 1,
    })
    .eq('id', agent.id);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleUnassignConversation(req: Request, supabase: any, userId: string) {
  const body = await req.json();
  const { conversation_id } = body;

  if (!conversation_id) {
    return new Response(
      JSON.stringify({ error: 'Missing conversation ID' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, agents(user_id, current_chat_count)')
    .eq('id', conversation_id)
    .maybeSingle();

  if (!conversation || !conversation.agents || conversation.agents.user_id !== userId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized or conversation not found' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('conversations')
    .update({
      assigned_agent_id: null,
      status: 'queued',
    })
    .eq('id', conversation_id);

  await supabase
    .from('agents')
    .update({
      current_chat_count: Math.max(0, (conversation.agents.current_chat_count || 0) - 1),
    })
    .eq('id', conversation.assigned_agent_id);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetStats(req: Request, supabase: any, userId: string) {
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!agent) {
    return new Response(
      JSON.stringify({ error: 'Agent not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { count: activeChats } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('assigned_agent_id', agent.id)
    .eq('status', 'active');

  const { count: queuedChats } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', agent.customer_id)
    .eq('status', 'queued');

  return new Response(
    JSON.stringify({
      active_chats: activeChats || 0,
      queued_chats: queuedChats || 0,
      max_concurrent: agent.max_concurrent_chats,
      current_count: agent.current_chat_count,
      status: agent.status,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
