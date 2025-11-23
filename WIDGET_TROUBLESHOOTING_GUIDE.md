# Live Chat Widget Integration - Troubleshooting Guide

## 🔍 Common Issues & Solutions

### Issue #1: Widget Not Appearing At All

#### Possible Causes:
1. **Missing or Incorrect API Key**
2. **CORS/Network Errors**
3. **JavaScript Errors in Console**
4. **Widget Configuration Disabled**
5. **Domain Blocked**

#### Diagnostic Steps:

**Step 1: Enable Debug Mode**
```html
<script src="https://yourcdn.com/widget.js?id=YOUR_API_KEY&debug=true"></script>
```

**Step 2: Check Browser Console**
Open Developer Tools (F12) and look for:
- `[LiveChat]` prefixed messages (if debug enabled)
- Red error messages
- Network errors in the Network tab

**Step 3: Verify API Key**
```javascript
// In console, check if widget initialized
console.log(window.LiveChatWidget);

// Should show object with config, version, etc.
```

**Step 4: Test Configuration API Directly**
```javascript
fetch('https://cjvqboumfhsjnmyomaji.supabase.co/functions/v1/widget-config?id=YOUR_API_KEY')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Expected response should include:
```json
{
  "widget_id": "...",
  "customer_id": "...",
  "branding": {...},
  "behavior": {...},
  "agents": {...}
}
```

#### Solutions:

**Solution A: Invalid API Key**
```html
<!-- WRONG -->
<script src="widget.js?id="></script>

<!-- CORRECT -->
<script src="widget.js?id=abc123def456..."></script>
```

**Solution B: Widget Disabled in Dashboard**
The widget's `is_enabled` flag must be `true` in the database.

**Solution C: Domain Not Whitelisted**
Add your domain to the `allowed_domains` array in widget configuration, or remove domain restrictions entirely.

**Solution D: CORS Issues**
Widget API should have CORS enabled. Check Network tab for:
- `Access-Control-Allow-Origin` header
- Status 200 (not 404 or 500)

---

### Issue #2: Widget Button Appears But Doesn't Work

#### Possible Causes:
1. **Missing widget-full.js File**
2. **Import Path Issues**
3. **JavaScript Module Errors**

#### Diagnostic Steps:

**Check Console for Import Errors:**
```
Failed to load module script: Expected a JavaScript module script but...
```

#### Solution:

The current widget.js tries to import `./widget-full.js` which may not exist. Use the standalone version below instead.

---

### Issue #3: CSS Conflicts / Widget Hidden

#### Possible Causes:
1. **Z-index conflicts**
2. **Site-wide CSS overrides**
3. **Visibility hidden**
4. **Display none**

#### Diagnostic Steps:

**Inspect Element in DevTools:**
```javascript
// Check if button exists in DOM
document.querySelector('.lcw-button');

// Check computed styles
const btn = document.querySelector('.lcw-button');
console.log(window.getComputedStyle(btn).display);
console.log(window.getComputedStyle(btn).visibility);
console.log(window.getComputedStyle(btn).zIndex);
```

#### Solutions:

**Solution A: Increase Z-Index**
The widget uses z-index: 999999 by default. If your site has higher z-indexes, configure it:
```json
{
  "behavior": {
    "z_index": 9999999
  }
}
```

**Solution B: Force Visibility with !important**
Create custom styles:
```html
<style>
  .lcw-button {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
</style>
```

---

### Issue #4: Widget Works on Desktop But Not Mobile

#### Possible Causes:
1. **Viewport issues**
2. **Touch event problems**
3. **Mobile CSS conflicts**

#### Solution:

The widget has responsive CSS at `@media (max-width: 480px)`. Check if your site has conflicting mobile styles.

**Test on mobile:**
```javascript
// Force mobile view in DevTools (Device Toolbar)
// Widget should expand to full screen on mobile
```

---

### Issue #5: Network/Timeout Errors

#### Possible Causes:
1. **Slow API response**
2. **Network firewall blocking**
3. **Ad blocker interference**

#### Diagnostic Steps:

**Check Network Tab:**
- Configuration API call should complete in < 500ms
- Status should be 200
- Response should be valid JSON

#### Solutions:

**Solution A: Increase Timeout**
Modify widget.js line 21:
```javascript
const LOAD_TIMEOUT = 30000; // Increase from 10000 to 30000
```

**Solution B: Test Without Ad Blocker**
Some ad blockers block chat widgets.

**Solution C: Check Firewall/CDN**
Ensure Supabase URLs are accessible from your network.

---

## 🛠️ Standalone Widget (No Dependencies)

If you're having issues with the modular widget, use this standalone version:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat Widget Test</title>
</head>
<body>
  <h1>Test Page</h1>

  <!-- Standalone Widget Script -->
  <script>
    (function() {
      'use strict';

      // Configuration
      const API_KEY = 'YOUR_API_KEY_HERE'; // REPLACE THIS
      const API_URL = 'https://cjvqboumfhsjnmyomaji.supabase.co';
      const DEBUG = true;

      let config = null;
      let conversationId = null;
      let visitorId = localStorage.getItem('lcw_visitor_id') ||
        'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      localStorage.setItem('lcw_visitor_id', visitorId);

      function log(...args) {
        if (DEBUG) console.log('[LiveChat]', ...args);
      }

      function error(...args) {
        console.error('[LiveChat]', ...args);
      }

      async function init() {
        try {
          // Fetch configuration
          log('Fetching configuration...');
          const response = await fetch(`${API_URL}/functions/v1/widget-config?id=${API_KEY}`);

          if (!response.ok) {
            throw new Error('Failed to load configuration: ' + response.status);
          }

          config = await response.json();
          log('Configuration loaded:', config);

          // Create UI
          createWidget();

        } catch (err) {
          error('Initialization failed:', err);
          showErrorUI(err.message);
        }
      }

      function createWidget() {
        // Create container
        const container = document.createElement('div');
        container.id = 'livechat-widget';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999;';

        // Create button
        const button = document.createElement('button');
        button.style.cssText = `
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${config.branding?.primary_color || '#3B82F6'};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        button.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        `;

        button.onclick = () => {
          if (window.style.display === 'none' || !window.style.display) {
            openChat();
          } else {
            closeChat();
          }
        };

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'livechat-window';
        chatWindow.style.cssText = `
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 999999;
        `;

        chatWindow.innerHTML = `
          <div style="background: ${config.branding?.primary_color || '#3B82F6'}; color: white; padding: 20px;">
            <h3 style="margin: 0; font-size: 16px;">${config.behavior?.welcome_message || 'Live Chat'}</h3>
            <button onclick="window.closeChat()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; cursor: pointer; font-size: 24px;">&times;</button>
          </div>
          <div id="messages" style="flex: 1; overflow-y: auto; padding: 20px; background: #f9fafb;"></div>
          <div style="padding: 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">
            <input type="text" id="message-input" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; outline: none;">
            <button onclick="window.sendMessage()" style="padding: 10px 20px; background: ${config.branding?.primary_color || '#3B82F6'}; color: white; border: none; border-radius: 8px; cursor: pointer;">Send</button>
          </div>
        `;

        container.appendChild(button);
        document.body.appendChild(container);
        document.body.appendChild(chatWindow);

        window.chatWindow = chatWindow;
        window.messagesDiv = document.getElementById('messages');
        window.messageInput = document.getElementById('message-input');

        log('Widget created successfully');
      }

      window.openChat = async function() {
        window.chatWindow.style.display = 'flex';

        if (!conversationId) {
          try {
            const response = await fetch(`${API_URL}/functions/v1/chat/start`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                widget_id: config.widget_id,
                visitor_id: visitorId,
                session_id: visitorId,
                context: {
                  page_url: window.location.href,
                  user_agent: navigator.userAgent
                }
              })
            });

            const data = await response.json();
            conversationId = data.conversation_id;
            log('Conversation started:', conversationId);

            addMessage('system', config.behavior?.welcome_message || 'Hello! How can we help?');

          } catch (err) {
            error('Failed to start conversation:', err);
          }
        }
      };

      window.closeChat = function() {
        window.chatWindow.style.display = 'none';
      };

      window.sendMessage = async function() {
        const message = window.messageInput.value.trim();
        if (!message) return;

        addMessage('visitor', message);
        window.messageInput.value = '';

        try {
          await fetch(`${API_URL}/functions/v1/chat/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: conversationId,
              sender_type: 'visitor',
              content: message
            })
          });
        } catch (err) {
          error('Failed to send message:', err);
        }
      };

      function addMessage(type, text) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 12px;
          max-width: 75%;
          ${type === 'visitor'
            ? 'background: ' + (config.branding?.primary_color || '#3B82F6') + '; color: white; margin-left: auto; text-align: right;'
            : 'background: #f0f0f0; color: #1a1a1a;'
          }
        `;
        msgDiv.textContent = text;
        window.messagesDiv.appendChild(msgDiv);
        window.messagesDiv.scrollTop = window.messagesDiv.scrollHeight;
      }

      function showErrorUI(message) {
        const container = document.createElement('div');
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999;';

        const button = document.createElement('button');
        button.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; background: #EF4444; border: none; cursor: pointer; opacity: 0.5;';
        button.innerHTML = '❌';
        button.onclick = () => alert('Chat widget error: ' + message);

        container.appendChild(button);
        document.body.appendChild(container);
      }

      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

    })();
  </script>
</body>
</html>
```

---

## ✅ Testing Checklist

Before deploying the widget, test these scenarios:

### Basic Functionality
- [ ] Widget button appears on page load
- [ ] Clicking button opens chat window
- [ ] Clicking X closes chat window
- [ ] Can type and send messages
- [ ] Messages appear in chat history

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Network Conditions
- [ ] Works on fast connection
- [ ] Works on slow 3G connection
- [ ] Handles API timeout gracefully
- [ ] Retries failed requests

### Edge Cases
- [ ] Multiple page loads (shouldn't duplicate)
- [ ] Back/forward browser navigation
- [ ] Page refresh maintains conversation
- [ ] Works in incognito/private mode
- [ ] No console errors

### Security
- [ ] No sensitive data in console logs
- [ ] API keys not exposed in source
- [ ] CORS headers correct
- [ ] No XSS vulnerabilities

### Mobile Specific
- [ ] Button accessible on mobile
- [ ] Chat expands to full screen on mobile
- [ ] Keyboard doesn't cover input field
- [ ] Touch events work correctly

---

## 🐛 Debug Commands

Run these in browser console to diagnose issues:

```javascript
// Check if widget loaded
window.LiveChatWidget

// Get current configuration
window.LiveChatWidget?.config

// Check visitor ID
localStorage.getItem('lcw_visitor_id')

// Manually open widget
window.LiveChatWidget?.open()

// Test configuration API
fetch('https://cjvqboumfhsjnmyomaji.supabase.co/functions/v1/widget-config?id=YOUR_KEY')
  .then(r => r.json())
  .then(console.log)

// Check for DOM elements
document.getElementById('livechat-widget-container')
document.querySelector('.lcw-button')

// Check computed styles
const btn = document.querySelector('.lcw-button');
if (btn) {
  const styles = window.getComputedStyle(btn);
  console.log({
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    zIndex: styles.zIndex,
    position: styles.position
  });
}

// Test network connectivity
navigator.onLine // Should be true

// Check for ad blockers
// Some ad blockers will block chat widgets
```

---

## 📞 Support

If you've tried all troubleshooting steps and the widget still isn't working:

1. **Collect Debug Information:**
   - Browser version and OS
   - Console errors (screenshot)
   - Network tab errors (screenshot)
   - Your embed code
   - Your domain/URL

2. **Test in Isolation:**
   - Create a blank HTML file with just the widget
   - If it works there but not on your site, it's a conflict

3. **Check Database:**
   - Verify widget is enabled in `widget_configs` table
   - Check `allowed_domains` includes your domain
   - Verify customer account is active

4. **API Health Check:**
   ```bash
   curl https://cjvqboumfhsjnmyomaji.supabase.co/functions/v1/widget-config?id=YOUR_KEY
   ```

---

## 🔧 Quick Fixes

### Fix #1: Widget Not Loading Due to Module Error
Replace the widget.js import line (315) with inline code instead of trying to import widget-full.js

### Fix #2: CORS Error
Add your domain to the widget's `allowed_domains` array in the database

### Fix #3: Button Hidden Behind Other Elements
Increase z-index to 9999999 in widget configuration

### Fix #4: API Key Invalid
Generate new API key from admin dashboard

### Fix #5: Widget Disabled
Set `is_enabled = true` in `widget_configs` table
