import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean).pop();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'POST' && path === 'start') {
      return await handleStartConversation(req, supabase);
    } else if (req.method === 'POST' && path === 'message') {
      return await handleSendMessage(req, supabase);
    } else if (req.method === 'GET' && path === 'conversation') {
      return await handleGetConversation(req, supabase, url);
    } else if (req.method === 'GET' && path === 'messages') {
      return await handleGetMessages(req, supabase, url);
    } else if (req.method === 'PUT' && path === 'typing') {
      return await handleTypingIndicator(req, supabase);
    } else if (req.method === 'POST' && path === 'end') {
      return await handleEndConversation(req, supabase);
    } else if (req.method === 'POST' && path === 'feedback') {
      return await handleSubmitFeedback(req, supabase);
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

async function handleStartConversation(req: Request, supabase: any) {
  const body = await req.json();
  const { widget_id, visitor_id, session_id, visitor_info, context } = body;

  if (!widget_id || !visitor_id) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: widget } = await supabase
    .from('widget_configs')
    .select('id, customer_id, routing_rules')
    .eq('id', widget_id)
    .maybeSingle();

  if (!widget) {
    return new Response(
      JSON.stringify({ error: 'Widget not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: existingConv } = await supabase
    .from('conversations')
    .select('*')
    .eq('widget_id', widget_id)
    .eq('visitor_id', visitor_id)
    .in('status', ['queued', 'active'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingConv) {
    return new Response(
      JSON.stringify({ conversation_id: existingConv.id, status: existingConv.status }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: availableAgent } = await supabase
    .from('agents')
    .select('*')
    .eq('customer_id', widget.customer_id)
    .eq('is_active', true)
    .eq('status', 'online')
    .lt('current_chat_count', supabase.raw('max_concurrent_chats'))
    .order('current_chat_count', { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      widget_id,
      customer_id: widget.customer_id,
      visitor_id,
      session_id: session_id || visitor_id,
      assigned_agent_id: availableAgent?.id || null,
      status: availableAgent ? 'active' : 'queued',
      visitor_info: visitor_info || {},
      context: context || {},
      started_at: availableAgent ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create conversation:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create conversation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (availableAgent) {
    await supabase
      .from('agents')
      .update({ current_chat_count: (availableAgent.current_chat_count || 0) + 1 })
      .eq('id', availableAgent.id);
  }

  return new Response(
    JSON.stringify({
      conversation_id: conversation.id,
      status: conversation.status,
      agent: availableAgent ? {
        id: availableAgent.id,
        name: availableAgent.display_name,
        avatar: availableAgent.avatar_url,
      } : null,
    }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSendMessage(req: Request, supabase: any) {
  const body = await req.json();
  const { conversation_id, sender_type, sender_id, sender_name, content, message_type, metadata } = body;

  if (!conversation_id || !sender_type || !content) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id,
      sender_type,
      sender_id,
      sender_name: sender_name || 'Visitor',
      content,
      message_type: message_type || 'text',
      metadata: metadata || {},
      delivered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to send message:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversation_id);

  return new Response(
    JSON.stringify({ message_id: message.id, created_at: message.created_at }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetConversation(req: Request, supabase: any, url: URL) {
  const conversationId = url.searchParams.get('id');

  if (!conversationId) {
    return new Response(
      JSON.stringify({ error: 'Missing conversation ID' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('*, agents(id, display_name, avatar_url, status)')
    .eq('id', conversationId)
    .maybeSingle();

  if (error || !conversation) {
    return new Response(
      JSON.stringify({ error: 'Conversation not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify(conversation),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetMessages(req: Request, supabase: any, url: URL) {
  const conversationId = url.searchParams.get('conversation_id');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const before = url.searchParams.get('before');

  if (!conversationId) {
    return new Response(
      JSON.stringify({ error: 'Missing conversation ID' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data: messages, error } = await query;

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch messages' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ messages: messages || [] }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTypingIndicator(req: Request, supabase: any) {
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleEndConversation(req: Request, supabase: any) {
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
    .select('*, agents(id, current_chat_count)')
    .eq('id', conversation_id)
    .maybeSingle();

  if (!conversation) {
    return new Response(
      JSON.stringify({ error: 'Conversation not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('conversations')
    .update({
      status: 'closed',
      ended_at: new Date().toISOString(),
    })
    .eq('id', conversation_id);

  if (conversation.assigned_agent_id && conversation.agents) {
    const currentCount = conversation.agents.current_chat_count || 0;
    await supabase
      .from('agents')
      .update({ current_chat_count: Math.max(0, currentCount - 1) })
      .eq('id', conversation.assigned_agent_id);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSubmitFeedback(req: Request, supabase: any) {
  const body = await req.json();
  const { conversation_id, rating, comment, nps_score } = body;

  if (!conversation_id) {
    return new Response(
      JSON.stringify({ error: 'Missing conversation ID' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  await supabase
    .from('conversations')
    .update({
      feedback: { rating, comment, nps_score },
    })
    .eq('id', conversation_id);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
