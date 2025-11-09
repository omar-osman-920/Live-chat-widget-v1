(function() {
  'use strict';

  var widgetId = document.currentScript?.getAttribute('data-widget-id');
  var language = document.currentScript?.getAttribute('data-language') || 'english';

  if (!widgetId) {
    console.error('Widget ID is required');
    return;
  }

  var container = document.createElement('div');
  container.id = 'live-chat-widget-' + widgetId;
  document.body.appendChild(container);

  var mockConfigs = {
    '1': {
      name: 'Main Support Widget',
      title: 'Live Chat',
      welcomeHeading: 'Hello! 👋',
      welcomeTagline: 'How can we help you today?',
      color: '#3B82F6',
      position: 'bottom-right',
      preChatFormEnabled: false,
      preChatFormFields: []
    },
    '2': {
      name: 'Sales Chat Widget',
      title: 'Sales Support',
      welcomeHeading: 'Hi there! 👋',
      welcomeTagline: 'Interested in our products? Let us help!',
      color: '#10B981',
      position: 'bottom-right',
      preChatFormEnabled: true,
      preChatFormFields: ['name', 'email', 'company']
    },
    '3': {
      name: 'Beta Test Widget',
      title: 'Beta Support',
      welcomeHeading: 'Welcome! 🎉',
      welcomeTagline: 'Thanks for testing our beta!',
      color: '#8B5CF6',
      position: 'bottom-left',
      preChatFormEnabled: false,
      preChatFormFields: []
    }
  };

  var config;
  try {
    var storedConfig = localStorage.getItem('widget-' + widgetId);
    if (storedConfig) {
      var parsedConfig = JSON.parse(storedConfig);
      var langTitle = parsedConfig.title?.[language.charAt(0).toUpperCase() + language.slice(1)] || parsedConfig.title?.['English'] || 'Live Chat';
      var langWelcomeHeading = parsedConfig.welcomeHeading?.[language.charAt(0).toUpperCase() + language.slice(1)] || parsedConfig.welcomeHeading?.['English'] || 'Hello! 👋';
      var langWelcomeTagline = parsedConfig.welcomeTagline?.[language.charAt(0).toUpperCase() + language.slice(1)] || parsedConfig.welcomeTagline?.['English'] || 'How can we help you today?';

      config = {
        name: parsedConfig.name || 'Live Chat Widget',
        title: langTitle,
        welcomeHeading: langWelcomeHeading,
        welcomeTagline: langWelcomeTagline,
        color: parsedConfig.color || '#8B5CF6',
        position: parsedConfig.position || 'bottom-right',
        displayPicture: parsedConfig.displayPicture || '',
        preChatFormEnabled: parsedConfig.preChatFormEnabled || false,
        preChatFormFields: parsedConfig.preChatFormFields || []
      };
    } else {
      config = mockConfigs[widgetId] || {
        name: 'Live Chat Widget',
        title: 'Live Chat',
        welcomeHeading: 'Hello! 👋',
        welcomeTagline: 'How can we help you today?',
        color: '#8B5CF6',
        position: 'bottom-right',
        preChatFormEnabled: false,
        preChatFormFields: []
      };
    }
  } catch (e) {
    config = mockConfigs[widgetId] || {
      name: 'Live Chat Widget',
      title: 'Live Chat',
      welcomeHeading: 'Hello! 👋',
      welcomeTagline: 'How can we help you today?',
      color: '#8B5CF6',
      position: 'bottom-right',
      preChatFormEnabled: false,
      preChatFormFields: []
    };
  }

  var styles = document.createElement('style');
  styles.textContent = `
    .chat-widget-button {
      position: fixed;
      bottom: 20px;
      ${config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      z-index: 9999;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: ${config.color};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    .chat-widget-button:hover {
      transform: scale(1.1);
    }
    .chat-widget-button svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    .chat-widget-window {
      position: fixed;
      bottom: 20px;
      ${config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      z-index: 9999;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s;
    }
    .chat-widget-window.minimized {
      height: 64px;
    }
    .chat-widget-header {
      background-color: ${config.color};
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chat-widget-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .chat-widget-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .chat-widget-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .chat-widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    .chat-widget-header p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }
    .chat-widget-header-buttons {
      display: flex;
      gap: 8px;
    }
    .chat-widget-header-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.2s;
    }
    .chat-widget-header-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    .chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-message {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
    }
    .chat-message.user {
      align-self: flex-end;
      background-color: ${config.color};
      color: white;
    }
    .chat-message.agent {
      align-self: flex-start;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .chat-widget-input-area {
      border-top: 1px solid #e5e7eb;
      padding: 16px;
      display: flex;
      gap: 8px;
    }
    .chat-widget-input {
      flex: 1;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      resize: none;
      font-family: inherit;
      min-height: 44px;
      max-height: 120px;
    }
    .chat-widget-input:focus {
      outline: none;
      border-color: ${config.color};
    }
    .chat-widget-send-button {
      background-color: ${config.color};
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chat-widget-send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .chat-widget-send-button svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
    .chat-widget-prechat-form {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    .chat-widget-prechat-form h4 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    .chat-widget-prechat-form p {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 24px 0;
    }
    .chat-widget-form-field {
      margin-bottom: 16px;
    }
    .chat-widget-form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      text-transform: capitalize;
    }
    .chat-widget-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }
    .chat-widget-form-input:focus {
      outline: none;
      border-color: ${config.color};
    }
    .chat-widget-form-submit {
      width: 100%;
      padding: 12px;
      background-color: ${config.color};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 24px;
    }
  `;
  document.head.appendChild(styles);

  var isOpen = false;
  var isMinimized = false;
  var showPreChat = config.preChatFormEnabled && config.preChatFormFields.length > 0;
  var messages = [];

  function createChatButton() {
    var button = document.createElement('button');
    button.className = 'chat-widget-button';
    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
    button.addEventListener('click', openChat);
    return button;
  }

  function createChatWindow() {
    var window = document.createElement('div');
    window.className = 'chat-widget-window';
    window.style.display = 'none';

    var header = document.createElement('div');
    header.className = 'chat-widget-header';
    var avatarHtml = config.displayPicture
      ? '<img src="' + config.displayPicture + '" alt="Agent" style="width: 100%; height: 100%; object-fit: cover;" />'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

    header.innerHTML = `
      <div class="chat-widget-header-left">
        <div class="chat-widget-avatar">
          ${avatarHtml}
        </div>
        <div>
          <h3>${config.title}</h3>
          <p>Online</p>
        </div>
      </div>
      <div class="chat-widget-header-buttons">
        <button class="chat-widget-header-button minimize-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 14 10 14 10 20"></polyline>
            <polyline points="20 10 14 10 14 4"></polyline>
            <line x1="14" y1="10" x2="21" y2="3"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
        <button class="chat-widget-header-button close-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    var contentArea = document.createElement('div');
    contentArea.className = 'chat-widget-content';
    contentArea.style.flex = '1';
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    contentArea.style.overflow = 'hidden';

    if (showPreChat) {
      contentArea.appendChild(createPreChatForm());
    } else {
      var messagesArea = createMessagesArea();
      var inputArea = createInputArea();
      contentArea.appendChild(messagesArea);
      contentArea.appendChild(inputArea);
      addMessage(config.welcomeTagline, 'agent');
    }

    window.appendChild(header);
    window.appendChild(contentArea);

    header.querySelector('.close-button').addEventListener('click', closeChat);
    header.querySelector('.minimize-button').addEventListener('click', toggleMinimize);

    return window;
  }

  function createPreChatForm() {
    var form = document.createElement('form');
    form.className = 'chat-widget-prechat-form';
    form.innerHTML = `
      <h4>${config.welcomeHeading}</h4>
      <p>Please fill in the form below to start chatting with us.</p>
    `;

    config.preChatFormFields.forEach(function(field) {
      var fieldDiv = document.createElement('div');
      fieldDiv.className = 'chat-widget-form-field';
      fieldDiv.innerHTML = `
        <label class="chat-widget-form-label">${field}</label>
        <input type="text" class="chat-widget-form-input" name="${field}" required />
      `;
      form.appendChild(fieldDiv);
    });

    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'chat-widget-form-submit';
    submitButton.textContent = 'Start Chat';
    form.appendChild(submitButton);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      startChat();
    });

    return form;
  }

  function createMessagesArea() {
    var messagesArea = document.createElement('div');
    messagesArea.className = 'chat-widget-messages';
    messagesArea.id = 'chat-messages-' + widgetId;
    return messagesArea;
  }

  function createInputArea() {
    var inputArea = document.createElement('div');
    inputArea.className = 'chat-widget-input-area';
    inputArea.innerHTML = `
      <textarea class="chat-widget-input" placeholder="Type your message..." id="chat-input-${widgetId}"></textarea>
      <button class="chat-widget-send-button" disabled id="chat-send-${widgetId}">
        <svg viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    `;

    setTimeout(function() {
      var input = document.getElementById('chat-input-' + widgetId);
      var sendButton = document.getElementById('chat-send-' + widgetId);

      input.addEventListener('input', function() {
        sendButton.disabled = !input.value.trim();
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (input.value.trim()) {
            sendMessage();
          }
        }
      });

      sendButton.addEventListener('click', sendMessage);
    }, 0);

    return inputArea;
  }

  function addMessage(text, sender) {
    var messagesArea = document.getElementById('chat-messages-' + widgetId);
    if (!messagesArea) return;

    var messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + sender;
    messageDiv.textContent = text;
    messagesArea.appendChild(messageDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    messages.push({ text: text, sender: sender });
  }

  function sendMessage() {
    var input = document.getElementById('chat-input-' + widgetId);
    var sendButton = document.getElementById('chat-send-' + widgetId);
    var message = input.value.trim();

    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    sendButton.disabled = true;

    setTimeout(function() {
      addMessage('Thank you for your message. An agent will be with you shortly.', 'agent');
    }, 1000);
  }

  function startChat() {
    showPreChat = false;
    var window = container.querySelector('.chat-widget-window');
    var contentArea = window.querySelector('.chat-widget-content');
    contentArea.innerHTML = '';

    var messagesArea = createMessagesArea();
    var inputArea = createInputArea();
    contentArea.appendChild(messagesArea);
    contentArea.appendChild(inputArea);

    addMessage(config.welcomeTagline, 'agent');
  }

  function openChat() {
    isOpen = true;
    var button = container.querySelector('.chat-widget-button');
    var window = container.querySelector('.chat-widget-window');
    button.style.display = 'none';
    window.style.display = 'flex';
  }

  function closeChat() {
    isOpen = false;
    var button = container.querySelector('.chat-widget-button');
    var window = container.querySelector('.chat-widget-window');
    button.style.display = 'flex';
    window.style.display = 'none';
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    var window = container.querySelector('.chat-widget-window');
    if (isMinimized) {
      window.classList.add('minimized');
    } else {
      window.classList.remove('minimized');
    }
  }

  var button = createChatButton();
  var window = createChatWindow();
  container.appendChild(button);
  container.appendChild(window);
})();
