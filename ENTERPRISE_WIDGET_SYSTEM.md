# Enterprise Live Chat Widget System - Complete Documentation

## System Architecture Overview

This is a production-ready, enterprise-grade live chat widget system built with a dynamic injection architecture. The system follows a two-stage loading process for optimal performance and flexibility.

### Architecture Diagram

```
┌─────────────────┐
│  Customer Site  │
└────────┬────────┘
         │
         │ 1. Loads bootstrap (~8KB)
         ├───────────────────────────────┐
         │                               │
         v                               v
┌─────────────────┐           ┌──────────────────┐
│  widget.js      │           │ Configuration    │
│  Bootstrap      │<──────────│ API              │
│  Loader         │  2. Fetch │ /widget-config   │
└────────┬────────┘   config  └──────────────────┘
         │
         │ 3. Dynamically loads full widget
         v
┌─────────────────┐
│  widget-full.js │──────┐
│  Complete UI    │      │
│  & Logic        │      │
└─────────────────┘      │
         │               │
         │               │ 4. Real-time messaging
         v               v
┌─────────────────┐  ┌──────────────────┐
│  Chat API       │  │  WebSocket/      │
│  /chat/*        │  │  Realtime API    │
└─────────────────┘  └──────────────────┘
         │
         v
┌─────────────────────────────────────────┐
│  Supabase Database                      │
│  - Customers, Widgets, Agents           │
│  - Conversations, Messages              │
│  - Analytics, Audit Logs                │
└─────────────────────────────────────────┘
```

---

## 1. Database Schema

### Tables Overview

#### customers
Main customer accounts that own widgets
- **Primary Key**: id (uuid)
- **Unique Keys**: api_key
- **Key Fields**: company_name, api_key, api_secret, plan_tier, max_widgets, max_agents, rate_limit_per_minute, is_active

#### widget_configs
Comprehensive widget configuration storage
- **Primary Key**: id (uuid)
- **Foreign Keys**: customer_id → customers(id)
- **JSONB Fields**:
  - `branding`: Colors, fonts, logos, widget shape
  - `behavior`: Position, auto-open, messages, timeouts
  - `localization`: Languages and custom text
  - `features`: File upload, chatbot, integrations
  - `working_hours`: Schedule configuration
  - `routing_rules`: Agent assignment logic
- **Arrays**: allowed_domains, blocked_domains

#### agents
Support agents handling conversations
- **Primary Key**: id (uuid)
- **Foreign Keys**: customer_id, user_id (auth.users)
- **Key Fields**: display_name, email, avatar_url, role, status, max_concurrent_chats, departments, skills

#### conversations
Chat conversations with full context
- **Primary Key**: id (uuid)
- **Foreign Keys**: widget_id, customer_id, assigned_agent_id
- **Status**: queued, active, resolved, closed
- **JSONB Fields**:
  - `visitor_info`: Name, email, phone, custom fields
  - `context`: Page URL, referrer, device info, location
  - `feedback`: Rating, comment, NPS score
- **Metrics**: wait_time, first_response_time, resolution_time

#### messages
All chat messages with rich content support
- **Primary Key**: id (uuid)
- **Foreign Key**: conversation_id
- **Message Types**: text, file, image, card, form
- **Sender Types**: visitor, agent, bot, system
- **JSONB**: metadata (files, cards, forms)

#### agent_sessions
Real-time agent presence tracking
- **Primary Key**: id (uuid)
- **Foreign Key**: agent_id
- **Tracks**: socket_id, status, heartbeat, connect/disconnect times

#### widget_analytics
Daily metrics and performance data
- **Primary Key**: id (uuid)
- **Foreign Key**: widget_id
- **JSONB**: metrics (visitors, conversations, response times, satisfaction)

#### api_rate_limits
API usage tracking and rate limiting
- **Composite Key**: customer_id, endpoint, window_start

#### audit_logs
Configuration changes and security audit trail
- **Primary Key**: id (uuid)
- **Tracks**: action, resource_type, resource_id, changes, ip_address

### Indexes

All foreign keys indexed for performance:
- widget_configs(customer_id)
- conversations(widget_id, customer_id, visitor_id, assigned_agent_id)
- messages(conversation_id, created_at)
- Partial indexes on active records

---

## 2. API Endpoints

### A. Configuration API

**Endpoint**: `GET /functions/v1/widget-config`

**Purpose**: Fetch complete widget configuration dynamically

**Query Parameters**:
- `id` or `customer_id` - Customer's API key
- `widget_id` - Specific widget ID (optional)

**Response** (< 500ms target):
```json
{
  "widget_id": "uuid",
  "customer_id": "uuid",
  "version": "1.2.3",
  "cdn_url": "https://...",
  "websocket_url": "wss://...",
  "api_url": "https://...",
  "branding": {
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "font_family": "system-ui",
    "widget_shape": "rounded",
    "logo_url": "https://..."
  },
  "behavior": {
    "position": "bottom-right",
    "offset_x": 20,
    "offset_y": 20,
    "auto_open_enabled": false,
    "welcome_message": "Hello!",
    "effective_message": "We are online!"
  },
  "localization": {
    "default_language": "en",
    "supported_languages": ["en", "es"],
    "custom_text_overrides": {}
  },
  "features": {
    "file_upload_enabled": true,
    "max_file_size": 10485760,
    "emoji_enabled": true,
    "chatbot_enabled": false
  },
  "agents": {
    "online_count": 3,
    "is_online": true,
    "available_agents": [...]
  },
  "routing": {...},
  "timestamp": "2025-01-01T00:00:00Z",
  "cache_key": "uuid-1.2.3"
}
```

**Features**:
- Domain whitelist/blacklist enforcement
- Working hours calculation
- Agent availability check
- ETag support for caching
- CORS enabled
- CDN-friendly headers

---

### B. Chat API

**Base**: `/functions/v1/chat`

#### POST /chat/start
Start a new conversation

**Body**:
```json
{
  "widget_id": "uuid",
  "visitor_id": "v_...",
  "session_id": "s_...",
  "visitor_info": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "context": {
    "page_url": "https://...",
    "user_agent": "...",
    "device_type": "desktop"
  }
}
```

**Response**:
```json
{
  "conversation_id": "uuid",
  "status": "active",
  "agent": {
    "id": "uuid",
    "name": "Agent Name",
    "avatar": "https://..."
  }
}
```

#### POST /chat/message
Send a message

**Body**:
```json
{
  "conversation_id": "uuid",
  "sender_type": "visitor",
  "content": "Hello, I need help",
  "message_type": "text",
  "metadata": {}
}
```

#### GET /chat/messages
Fetch conversation history

**Query**: `conversation_id`, `limit`, `before`

#### POST /chat/end
End a conversation

#### POST /chat/feedback
Submit conversation feedback

---

### C. Agent API

**Base**: `/functions/v1/agent` (Requires JWT authentication)

#### POST /agent/presence
Update agent online status

**Body**:
```json
{
  "status": "online",
  "socket_id": "conn_..."
}
```

#### GET /agent/conversations
Get assigned/queued conversations

#### POST /agent/assign
Assign conversation to current agent

#### POST /agent/unassign
Return conversation to queue

#### GET /agent/stats
Get agent statistics

---

### D. Admin Configuration API

**Base**: `/functions/v1/admin-config` (Requires JWT authentication + admin role)

#### GET /admin-config/widgets
List all customer widgets

#### POST /admin-config/widget
Create new widget

#### PUT /admin-config/widget
Update widget configuration (auto-increments version)

#### DELETE /admin-config/widget
Delete widget

#### GET /admin-config/customer
Get customer account details

#### POST /admin-config/refresh-key
Generate new API key

---

## 3. Bootstrap Script (widget.js)

### Key Features

**Size**: ~8KB minified
**Load Time**: < 2 seconds globally
**Retry Logic**: 3 attempts with 2s delay
**Timeout**: 10 seconds per request

### Loading Sequence

1. **Parse Parameters**: Extract customer ID from script src
2. **Generate IDs**: Create/retrieve visitor_id and session_id
3. **Fetch Configuration**: GET /widget-config with retry logic
4. **Validate**: Check configuration validity
5. **Inject Minimal UI**: Create button immediately
6. **Load Full Widget**: Dynamic import of widget-full.js
7. **Initialize**: Set up event listeners and API

### Usage

```html
<!-- Simple embedding -->
<script src="https://yourcdn.com/widget.js?id=CUSTOMER_API_KEY"></script>

<!-- With specific widget -->
<script src="https://yourcdn.com/widget.js?widget_id=WIDGET_UUID"></script>

<!-- With debug mode -->
<script src="https://yourcdn.com/widget.js?id=KEY&debug=true"></script>
```

### Global API

```javascript
// Available after loading
window.LiveChatWidget.open();
window.LiveChatWidget.close();
window.LiveChatWidget.toggle();
window.LiveChatWidget.sendMessage("Hello");

// Event listeners
window.LiveChatWidget.on('ready', (widget) => {
  console.log('Widget ready', widget);
});

window.LiveChatWidget.on('message', (msg) => {
  console.log('New message', msg);
});

// Events
// 'livechat:ready' - Widget initialized
// 'livechat:error' - Initialization failed
// 'livechat:opened' - Widget opened
// 'livechat:closed' - Widget closed
// 'livechat:message' - New message received
```

---

## 4. Real-Time Infrastructure

### WebSocket Connection

**URL**: `wss://[PROJECT].supabase.co/realtime/v1/websocket`

**Authentication**: Anon key + visitor session

### Channels

1. **Messages Channel**:
   - Topic: `public:messages:conversation_id=eq.{id}`
   - Receives: New messages from agents
   - Sends: Typing indicators

2. **Presence Channel**:
   - Topic: `public:agent_sessions`
   - Tracks: Agent online/offline status
   - Updates: Real-time availability

### Message Flow

```
Visitor → Chat API → Database → Realtime → Agent Dashboard
Agent → Chat API → Database → Realtime → Visitor Widget
```

---

## 5. Security & Performance

### Security Features

1. **Authentication**:
   - Public endpoints: API key validation
   - Admin endpoints: JWT + role checking
   - Agent endpoints: JWT authentication

2. **RLS Policies**:
   - Public: INSERT on conversations/messages
   - Authenticated: Full CRUD on own data
   - Row-level security on all tables

3. **Rate Limiting**:
   - Tracked in api_rate_limits table
   - Per-customer limits
   - Configurable thresholds

4. **Domain Restrictions**:
   - Whitelist: Only allowed domains
   - Blacklist: Blocked domains
   - Wildcard support: *.example.com

5. **Audit Logging**:
   - All configuration changes
   - IP address tracking
   - User agent logging

### Performance Optimizations

1. **Caching**:
   - ETag support on config API
   - CDN-friendly headers
   - Cache-Control: 60s client, 300s CDN

2. **Indexes**:
   - All foreign keys indexed
   - Partial indexes on active records
   - Composite indexes for queries

3. **Query Optimization**:
   - Limited result sets
   - Efficient JOINs
   - Aggregation at database level

4. **Asset Delivery**:
   - Versioned files
   - Compression (gzip/brotli)
   - CDN distribution

---

## 6. Deployment Strategy

### Development Environment

```bash
# Supabase local development
supabase start
supabase db reset

# Test migrations
supabase db migrate up

# Test edge functions locally
supabase functions serve widget-config
```

### Staging Environment

```bash
# Deploy to staging
supabase link --project-ref staging-project
supabase db push
supabase functions deploy

# Test with staging URL
<script src="https://staging.supabase.co/.../widget.js?id=TEST_KEY"></script>
```

### Production Deployment

```bash
# Deploy migrations
supabase db push --linked

# Deploy all edge functions
supabase functions deploy widget-config
supabase functions deploy chat
supabase functions deploy agent
supabase functions deploy admin-config

# Verify deployment
curl https://PROJECT.supabase.co/functions/v1/widget-config?id=KEY
```

### CDN Setup

1. **Upload Assets**:
   ```bash
   # Upload to Supabase Storage
   supabase storage create-bucket widget-assets --public
   supabase storage upload widget-assets widget.js
   supabase storage upload widget-assets widget-full.js
   ```

2. **Configure CDN**:
   - CloudFlare/Fastly in front of Supabase
   - Cache widget.js for 1 hour
   - Cache static assets for 1 year
   - Purge on version change

---

## 7. Monitoring & Analytics

### Key Metrics

1. **Performance**:
   - Config API response time (target: < 500ms)
   - Bootstrap load time (target: < 2s)
   - Widget initialization time
   - Message delivery latency

2. **Usage**:
   - Active conversations
   - Messages per day
   - Agent utilization
   - Visitor-to-conversation rate

3. **Quality**:
   - First response time
   - Resolution time
   - Satisfaction ratings
   - Agent performance

### Monitoring Tools

```sql
-- Daily analytics aggregation
SELECT
  widget_id,
  COUNT(DISTINCT visitor_id) as visitors,
  COUNT(*) as conversations,
  AVG(first_response_time_seconds) as avg_response,
  AVG((feedback->>'rating')::int) as avg_rating
FROM conversations
WHERE created_at >= CURRENT_DATE
GROUP BY widget_id;

-- Active conversations
SELECT
  w.name as widget_name,
  COUNT(*) as active_count
FROM conversations c
JOIN widget_configs w ON w.id = c.widget_id
WHERE c.status = 'active'
GROUP BY w.id, w.name;

-- Agent performance
SELECT
  a.display_name,
  a.current_chat_count,
  a.max_concurrent_chats,
  a.status
FROM agents a
WHERE a.is_active = true
ORDER BY a.current_chat_count DESC;
```

---

## 8. Troubleshooting

### Common Issues

1. **Widget not loading**:
   - Check API key validity
   - Verify domain whitelist
   - Check browser console for errors
   - Enable debug mode: `?debug=true`

2. **Messages not sending**:
   - Verify conversation status
   - Check WebSocket connection
   - Confirm agent availability
   - Review RLS policies

3. **Slow performance**:
   - Check database indexes
   - Review query plans
   - Monitor Supabase metrics
   - Verify CDN caching

4. **Authentication errors**:
   - Validate JWT tokens
   - Check agent permissions
   - Review RLS policies
   - Verify user-agent mapping

### Debug Commands

```javascript
// In browser console
LiveChatWidget.config; // View configuration
LiveChatWidget.instance; // Access widget instance
LiveChatWidget.debug = true; // Enable logging

// Test API directly
fetch('https://PROJECT.supabase.co/functions/v1/widget-config?id=KEY')
  .then(r => r.json())
  .then(console.log);
```

---

## 9. GDPR & Privacy Compliance

### Features

1. **Consent Management**:
   - Optional GDPR consent checkbox
   - Custom consent text
   - Timestamp recording

2. **Data Privacy**:
   - IP address hashing (not storing raw IPs)
   - Anonymous visitor IDs
   - Data retention policies

3. **User Rights**:
   - Data export API
   - Conversation deletion
   - Account anonymization

### Implementation

```javascript
// GDPR consent check
if (config.features.gdpr_consent_required) {
  // Show consent dialog before starting chat
  showConsentDialog(config.features.gdpr_text);
}

// Store consent
{
  "visitor_info": {
    "consent_given": true,
    "consent_timestamp": "2025-01-01T00:00:00Z"
  }
}
```

---

## 10. Scaling Considerations

### Horizontal Scaling

- **Supabase**: Managed PostgreSQL clustering
- **Edge Functions**: Automatic scaling with Deno Deploy
- **WebSockets**: Supabase Realtime scales automatically

### Database Optimization

- **Partitioning**: Partition messages by date
- **Archiving**: Move old conversations to cold storage
- **Cleanup**: Regular purge of expired sessions

### Caching Strategy

- **Config API**: 60s browser, 300s CDN
- **Static Assets**: 1 year with versioning
- **Message History**: Redis cache for hot data

---

## 11. Example Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to My Site</h1>

  <!-- Live Chat Widget -->
  <script>
    // Optional: Pre-configure widget
    window.LiveChatWidget = window.LiveChatWidget || {};
    window.LiveChatWidget.queue = window.LiveChatWidget.queue || [];

    // Auto-open after 5 seconds
    window.LiveChatWidget.queue.push(function(widget) {
      setTimeout(() => widget.open(), 5000);
    });

    // Track custom events
    window.LiveChatWidget.queue.push(function(widget) {
      widget.on('message', function(msg) {
        gtag('event', 'chat_message', {
          conversation_id: msg.conversation_id
        });
      });
    });
  </script>

  <!-- Load widget (place before </body>) -->
  <script
    src="https://cjvqboumfhsjnmyomaji.supabase.co/storage/v1/object/public/widget-assets/widget.js?id=YOUR_API_KEY"
    async
  ></script>
</body>
</html>
```

---

## API Response Time Targets

- **Config API**: < 500ms (p95)
- **Chat Start**: < 1000ms (p95)
- **Send Message**: < 300ms (p95)
- **Agent APIs**: < 500ms (p95)
- **Bootstrap Load**: < 2000ms globally

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS 13+, Android 8+
- ES6+ required (no IE11)

---

**System Version**: 2.0.0
**Last Updated**: 2025-01-23
**License**: Enterprise License
