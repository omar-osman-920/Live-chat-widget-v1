/**
 * Enterprise Live Chat Widget - Standalone Version
 * Version: 2.1.0
 * No external dependencies - Complete implementation in single file
 *
 * Usage: <script src="https://yourcdn.com/widget-standalone.js?id=CUSTOMER_API_KEY"></script>
 */

(function() {
  'use strict';

  if (window.LiveChatWidget && window.LiveChatWidget.initialized) {
    console.warn('[LiveChat] Widget already initialized');
    return;
  }

  const VERSION = '2.1.0';
  const LOAD_TIMEOUT = 10000;
  const RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 2000;

  const script = document.currentScript || document.querySelector('script[src*="widget"]');
  const scriptSrc = script ? script.src : '';
  const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');

  const customerId = urlParams.get('id') || urlParams.get('customer_id') || script?.getAttribute('data-id');
  const widgetId = urlParams.get('widget_id') || script?.getAttribute('data-widget-id');
  const apiUrl = urlParams.get('api_url') || script?.getAttribute('data-api-url') || 'https://cjvqboumfhsjnmyomaji.supabase.co';
  const debug = urlParams.get('debug') === 'true' || script?.getAttribute('data-debug') === 'true';

  let config = null;
  let conversationId = null;
  let isOpen = false;
  let messageSubscription = null;

  function log(...args) {
    if (debug) {
      console.log('[LiveChat]', ...args);
    }
  }

  function error(...args) {
    console.error('[LiveChat]', ...args);
  }

  if (!customerId && !widgetId) {
    error('Missing required parameter: id or widget_id');
    error('Usage: <script src="widget.js?id=YOUR_API_KEY"></script>');
    return;
  }

  function generateVisitorId() {
    const storageKey = 'lcw_visitor_id';
    try {
      let visitorId = localStorage.getItem(storageKey);
      if (visitorId) return visitorId;

      visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(storageKey, visitorId);
      return visitorId;
    } catch (e) {
      return 'v_session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }
  }

  function generateSessionId() {
    const storageKey = 'lcw_session_id';
    try {
      let sessionId = sessionStorage.getItem(storageKey);
      if (sessionId) return sessionId;

      sessionId = 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem(storageKey, sessionId);
      return sessionId;
    } catch (e) {
      return 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    }
  }

  const visitorId = generateVisitorId();
  const sessionId = generateSessionId();

  async function fetchConfig(attempt = 1) {
    const startTime = Date.now();
    log('Fetching configuration (attempt ' + attempt + '/' + RETRY_ATTEMPTS + ')...');

    try {
      const configUrl = `${apiUrl}/functions/v1/widget-config?${widgetId ? 'widget_id=' + widgetId : 'id=' + customerId}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), LOAD_TIMEOUT);

      const response = await fetch(configUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
      }

      config = await response.json();

      const loadTime = Date.now() - startTime;
      log('Configuration loaded in ' + loadTime + 'ms', config);

      if (loadTime > 2000) {
        console.warn('[LiveChat] Configuration load time exceeded 2s target: ' + loadTime + 'ms');
      }

      return config;
    } catch (err) {
      error('Failed to fetch configuration:', err.message);

      if (attempt < RETRY_ATTEMPTS) {
        log('Retrying in ' + RETRY_DELAY + 'ms...');
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchConfig(attempt + 1);
      }

      throw new Error('Failed to load widget configuration after ' + RETRY_ATTEMPTS + ' attempts');
    }
  }

  function injectStyles() {
    if (document.getElementById('livechat-widget-styles')) return;

    const branding = config.branding || {};
    const behavior = config.behavior || {};

    const primaryColor = branding.button_color || branding.primary_color || '#3B82F6';
    const position = behavior.position || 'bottom-right';
    const offsetX = behavior.offset_x || 20;
    const offsetY = behavior.offset_y || 20;
    const zIndex = behavior.z_index || 999999;
    const borderRadius = branding.border_radius || '12px';
    const fontFamily = branding.font_family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const styles = document.createElement('style');
    styles.id = 'livechat-widget-styles';
    styles.textContent = `
      #livechat-widget-root {
        all: initial;
        font-family: ${fontFamily};
      }

      #livechat-widget-root * {
        box-sizing: border-box;
      }

      .lcw-button {
        position: fixed;
        ${position === 'bottom-left' ? 'left' : 'right'}: ${offsetX}px;
        bottom: ${offsetY}px;
        width: 60px;
        height: 60px;
        border-radius: ${branding.widget_shape === 'square' ? '8px' : '50%'};
        background: ${primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: ${zIndex};
      }

      .lcw-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .lcw-button svg {
        width: 28px;
        height: 28px;
        fill: white;
      }

      .lcw-window {
        position: fixed;
        ${position === 'bottom-left' ? 'left' : 'right'}: ${offsetX}px;
        bottom: ${offsetY + 80}px;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 600px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: ${borderRadius};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: ${fontFamily};
        z-index: ${zIndex};
        animation: lcw-slide-in 0.3s ease-out;
      }

      .lcw-window.open {
        display: flex;
      }

      @keyframes lcw-slide-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .lcw-header {
        background: ${primaryColor};
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .lcw-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .lcw-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .lcw-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .lcw-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .lcw-status {
        font-size: 12px;
        opacity: 0.9;
      }

      .lcw-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        font-size: 24px;
        line-height: 1;
      }

      .lcw-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f9fafb;
        display: flex;
        flex-direction: column;
      }

      .lcw-welcome {
        text-align: center;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 8px;
      }

      .lcw-welcome h3 {
        font-size: 20px;
        margin: 0 0 8px 0;
        color: #1a1a1a;
      }

      .lcw-welcome p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }

      .lcw-messages {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .lcw-message {
        max-width: 75%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .lcw-message.visitor {
        align-self: flex-end;
        background: ${primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .lcw-message.agent {
        align-self: flex-start;
        background: white;
        color: #1a1a1a;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .lcw-message.system {
        align-self: center;
        background: #fef3c7;
        color: #92400e;
        font-size: 13px;
        text-align: center;
        max-width: 90%;
      }

      .lcw-footer {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
        background: white;
      }

      .lcw-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        font-family: inherit;
      }

      .lcw-input:focus {
        border-color: ${primaryColor};
        box-shadow: 0 0 0 3px ${primaryColor}20;
      }

      .lcw-send {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${primaryColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .lcw-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lcw-send svg {
        width: 18px;
        height: 18px;
        fill: white;
      }

      @media (max-width: 480px) {
        .lcw-window {
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          border-radius: 0 !important;
        }

        .lcw-button {
          ${position === 'bottom-left' ? 'left' : 'right'}: 16px !important;
          bottom: 16px !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  function createWidget() {
    const root = document.createElement('div');
    root.id = 'livechat-widget-root';

    const button = document.createElement('button');
    button.className = 'lcw-button';
    button.setAttribute('aria-label', 'Open live chat');
    button.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    `;

    const chatWindow = document.createElement('div');
    chatWindow.className = 'lcw-window';
    chatWindow.innerHTML = `
      <div class="lcw-header">
        <div class="lcw-header-content">
          <div class="lcw-avatar">
            ${config.branding?.avatar_url ? `<img src="${config.branding.avatar_url}" alt="Agent" />` : '💬'}
          </div>
          <div>
            <h3 class="lcw-title">${config.behavior?.welcome_message || 'Live Chat'}</h3>
            <p class="lcw-status">${config.agents?.is_online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <button class="lcw-close">&times;</button>
      </div>
      <div class="lcw-body">
        <div class="lcw-welcome">
          <h3>👋 Hello!</h3>
          <p>${config.behavior?.effective_message || 'How can we help you today?'}</p>
        </div>
        <div class="lcw-messages"></div>
      </div>
      <div class="lcw-footer">
        <input type="text" class="lcw-input" placeholder="Type your message..." />
        <button class="lcw-send">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;

    root.appendChild(button);
    root.appendChild(chatWindow);
    document.body.appendChild(root);

    const closeBtn = chatWindow.querySelector('.lcw-close');
    const input = chatWindow.querySelector('.lcw-input');
    const sendBtn = chatWindow.querySelector('.lcw-send');
    const messagesContainer = chatWindow.querySelector('.lcw-messages');

    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    window.LiveChatWidget = {
      root,
      button,
      chatWindow,
      messagesContainer,
      input,
      open: openChat,
      close: closeChat,
      toggle: toggleChat,
      sendMessage: sendMessage,
      initialized: true,
      version: VERSION,
      config: config,
    };

    log('Widget created successfully');
  }

  async function openChat() {
    if (isOpen) return;
    isOpen = true;

    window.LiveChatWidget.chatWindow.classList.add('open');
    window.LiveChatWidget.input.focus();

    if (!conversationId) {
      try {
        log('Starting conversation...');
        const response = await fetch(`${apiUrl}/functions/v1/chat/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widget_id: config.widget_id,
            visitor_id: visitorId,
            session_id: sessionId,
            context: {
              page_url: window.location.href,
              page_title: document.title,
              referrer: document.referrer,
              user_agent: navigator.userAgent,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          conversationId = data.conversation_id;
          log('Conversation started:', conversationId);

          subscribeToMessages();
        }
      } catch (err) {
        error('Failed to start conversation:', err);
      }
    }

    const event = new CustomEvent('livechat:opened', { detail: { conversationId } });
    window.dispatchEvent(event);
  }

  function closeChat() {
    isOpen = false;
    window.LiveChatWidget.chatWindow.classList.remove('open');

    const event = new CustomEvent('livechat:closed');
    window.dispatchEvent(event);
  }

  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  async function sendMessage() {
    const message = window.LiveChatWidget.input.value.trim();
    if (!message || !conversationId) return;

    addMessage('visitor', message);
    window.LiveChatWidget.input.value = '';

    try {
      await fetch(`${apiUrl}/functions/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_type: 'visitor',
          content: message,
        })
      });

      log('Message sent:', message);

      const event = new CustomEvent('livechat:message-sent', { detail: { message } });
      window.dispatchEvent(event);

    } catch (err) {
      error('Failed to send message:', err);
      addMessage('system', 'Failed to send message. Please try again.');
    }
  }

  function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'lcw-message ' + type;
    messageDiv.textContent = text;

    window.LiveChatWidget.messagesContainer.appendChild(messageDiv);
    window.LiveChatWidget.messagesContainer.scrollTop = window.LiveChatWidget.messagesContainer.scrollHeight;

    const event = new CustomEvent('livechat:message-received', { detail: { type, text } });
    window.dispatchEvent(event);
  }

  function subscribeToMessages() {
    if (!conversationId || messageSubscription) return;

    try {
      const ws = new WebSocket(
        `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/realtime/v1/websocket?apikey=${config.api_url.split('//')[1].split('.')[0]}&vsn=1.0.0`
      );

      ws.onopen = () => {
        log('WebSocket connected');
        ws.send(JSON.stringify({
          topic: `realtime:public:messages:conversation_id=eq.${conversationId}`,
          event: 'phx_join',
          payload: {},
          ref: '1'
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'postgres_changes' && data.payload) {
            const record = data.payload.record;
            if (record && record.sender_type === 'agent') {
              addMessage('agent', record.content);
            }
          }
        } catch (err) {
          error('Error processing message:', err);
        }
      };

      ws.onerror = (err) => {
        error('WebSocket error:', err);
      };

      messageSubscription = ws;
    } catch (err) {
      error('Failed to setup WebSocket:', err);
    }
  }

  async function initialize() {
    const startTime = Date.now();
    log('Initializing widget v' + VERSION + '...');

    try {
      await fetchConfig();

      if (!config || !config.widget_id) {
        throw new Error('Invalid configuration received');
      }

      injectStyles();
      createWidget();

      const totalTime = Date.now() - startTime;
      log('Widget initialized in ' + totalTime + 'ms');

      const event = new CustomEvent('livechat:ready', { detail: { version: VERSION, config: config } });
      window.dispatchEvent(event);

      if (config.behavior?.auto_open_enabled && config.behavior?.auto_open_delay > 0) {
        setTimeout(() => {
          openChat();
        }, config.behavior.auto_open_delay);
      }

    } catch (err) {
      error('Initialization failed:', err);

      const fallbackButton = document.createElement('button');
      fallbackButton.className = 'lcw-button';
      fallbackButton.style.opacity = '0.5';
      fallbackButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
      fallbackButton.onclick = () => alert('Chat widget failed to load: ' + err.message + '\n\nPlease contact support.');

      const root = document.createElement('div');
      root.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999;';
      root.appendChild(fallbackButton);
      document.body.appendChild(root);

      const event = new CustomEvent('livechat:error', { detail: { error: err.message } });
      window.dispatchEvent(event);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    setTimeout(initialize, 0);
  }

})();
