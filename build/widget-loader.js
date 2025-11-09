(function() {
  'use strict';

  if (window.LiveChatWidget) {
    console.warn('LiveChatWidget already loaded');
    return;
  }

  const script = document.currentScript;
  const widgetId = script.getAttribute('data-widget-id');
  const language = script.getAttribute('data-language') || 'english';
  const apiUrl = script.getAttribute('data-api-url');
  const anonKey = script.getAttribute('data-anon-key');

  if (!widgetId) {
    console.error('LiveChatWidget: data-widget-id attribute is required');
    return;
  }

  if (!apiUrl) {
    console.error('LiveChatWidget: data-api-url attribute is required');
    return;
  }

  if (!anonKey) {
    console.error('LiveChatWidget: data-anon-key attribute is required');
    return;
  }

  function generateVisitorId() {
    const stored = localStorage.getItem('lcw_visitor_id');
    if (stored) return stored;

    const id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('lcw_visitor_id', id);
    return id;
  }

  const visitorId = generateVisitorId();
  let currentConversationId = null;
  let widgetConfig = null;
  let isOpen = false;
  let messagesSubscription = null;

  async function fetchWidgetConfig() {
    try {
      const response = await fetch(
        `${apiUrl}/functions/v1/get-widget-config?widgetId=${widgetId}&language=${language}`,
        {
          headers: {
            'Authorization': `Bearer ${anonKey}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load widget configuration');
      }

      return await response.json();
    } catch (error) {
      console.error('LiveChatWidget: Failed to fetch config', error);
      return null;
    }
  }

  async function createConversation() {
    try {
      const response = await fetch(`${apiUrl}/rest/v1/chat_conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          widget_id: widgetId,
          visitor_id: visitorId,
          website_url: window.location.href,
          status: 'open'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const data = await response.json();
      return data[0].id;
    } catch (error) {
      console.error('LiveChatWidget: Failed to create conversation', error);
      return null;
    }
  }

  async function sendMessage(messageText, senderType = 'visitor', senderName = 'Visitor') {
    if (!currentConversationId) {
      currentConversationId = await createConversation();
      if (!currentConversationId) return false;
      subscribeToMessages();
    }

    try {
      const response = await fetch(`${apiUrl}/rest/v1/chat_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          conversation_id: currentConversationId,
          sender_type: senderType,
          sender_name: senderName,
          message_text: messageText
        })
      });

      return response.ok;
    } catch (error) {
      console.error('LiveChatWidget: Failed to send message', error);
      return false;
    }
  }

  function subscribeToMessages() {
    if (!currentConversationId || messagesSubscription) return;

    const ws = new WebSocket(
      `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/realtime/v1/websocket?apikey=${anonKey}&vsn=1.0.0`
    );

    ws.onopen = () => {
      ws.send(JSON.stringify({
        topic: `realtime:public:chat_messages:conversation_id=eq.${currentConversationId}`,
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
            addMessageToUI(record.message_text, 'agent');
          }
        }
      } catch (error) {
        console.error('LiveChatWidget: Error processing message', error);
      }
    };

    messagesSubscription = ws;
  }

  function addMessageToUI(text, sender) {
    const messagesContainer = document.getElementById('lcw-messages');
    if (!messagesContainer) return;

    const messageEl = document.createElement('div');
    messageEl.className = `lcw-message ${sender}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function createWidgetUI() {
    const container = document.createElement('div');
    container.id = 'live-chat-widget-root';
    container.style.cssText = `
      position: fixed;
      ${widgetConfig.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      bottom: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    `;

    const isRTL = language === 'arabic';

    container.innerHTML = `
      <style>
        #live-chat-widget-root * {
          box-sizing: border-box;
        }
        .lcw-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${widgetConfig.color};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .lcw-button:hover {
          transform: scale(1.05);
        }
        .lcw-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        .lcw-window {
          position: absolute;
          bottom: 80px;
          ${widgetConfig.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 120px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        .lcw-window.open {
          display: flex;
        }
        .lcw-header {
          background: ${widgetConfig.color};
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
          background: rgba(255,255,255,0.3);
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
        .lcw-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        .lcw-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .lcw-welcome {
          text-align: center;
          margin-bottom: 20px;
        }
        .lcw-welcome h3 {
          font-size: 24px;
          margin: 0 0 8px 0;
          color: #1a1a1a;
        }
        .lcw-welcome p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .lcw-messages {
          flex: 1;
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
          background: ${widgetConfig.color};
          color: white;
          border-bottom-right-radius: 4px;
        }
        .lcw-message.agent {
          align-self: flex-start;
          background: #f0f0f0;
          color: #1a1a1a;
          border-bottom-left-radius: 4px;
        }
        .lcw-footer {
          padding: 16px;
          border-top: 1px solid #e5e5e5;
          display: flex;
          gap: 8px;
        }
        .lcw-input {
          flex: 1;
          border: 1px solid #e5e5e5;
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
        }
        .lcw-input:focus {
          border-color: ${widgetConfig.color};
        }
        .lcw-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${widgetConfig.color};
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
      </style>

      <button class="lcw-button" id="lcw-toggle-btn">
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>

      <div class="lcw-window" id="lcw-window" dir="${isRTL ? 'rtl' : 'ltr'}">
        <div class="lcw-header">
          <div class="lcw-header-content">
            <div class="lcw-avatar">
              ${widgetConfig.displayPicture ? `<img src="${widgetConfig.displayPicture}" alt="Support" />` : '💬'}
            </div>
            <div>
              <h3 class="lcw-title">${widgetConfig.title || 'Live Chat'}</h3>
            </div>
          </div>
          <button class="lcw-close" id="lcw-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="lcw-body">
          <div class="lcw-welcome">
            <h3>${widgetConfig.welcomeHeading || 'Hello! 👋'}</h3>
            <p>${widgetConfig.welcomeTagline || 'How can we help you today?'}</p>
          </div>
          <div class="lcw-messages" id="lcw-messages"></div>
        </div>

        <div class="lcw-footer">
          <input
            type="text"
            class="lcw-input"
            id="lcw-input"
            placeholder="${language === 'arabic' ? 'اكتب رسالتك...' : 'Type your message...'}"
          />
          <button class="lcw-send" id="lcw-send-btn">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const toggleBtn = document.getElementById('lcw-toggle-btn');
    const closeBtn = document.getElementById('lcw-close-btn');
    const windowEl = document.getElementById('lcw-window');
    const input = document.getElementById('lcw-input');
    const sendBtn = document.getElementById('lcw-send-btn');

    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      windowEl.classList.toggle('open', isOpen);
      if (isOpen) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      isOpen = false;
      windowEl.classList.remove('open');
    });

    async function handleSendMessage() {
      const message = input.value.trim();
      if (!message) return;

      addMessageToUI(message, 'visitor');
      input.value = '';
      sendBtn.disabled = true;

      await sendMessage(message, 'visitor', 'Visitor');
      sendBtn.disabled = false;
    }

    sendBtn.addEventListener('click', handleSendMessage);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });
  }

  async function init() {
    widgetConfig = await fetchWidgetConfig();
    if (!widgetConfig) {
      console.error('LiveChatWidget: Failed to load widget');
      return;
    }

    if (!widgetConfig.active) {
      console.warn('LiveChatWidget: Widget is not active');
      return;
    }

    createWidgetUI();
  }

  window.LiveChatWidget = {
    open: () => {
      isOpen = true;
      const windowEl = document.getElementById('lcw-window');
      if (windowEl) windowEl.classList.add('open');
    },
    close: () => {
      isOpen = false;
      const windowEl = document.getElementById('lcw-window');
      if (windowEl) windowEl.classList.remove('open');
    },
    sendMessage: sendMessage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
