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

  var defaultConfig = {
    name: 'Live Chat Widget',
    title: 'Live Chat',
    showStatus: true,
    welcomeHeading: 'Hello! 👋',
    welcomeTagline: 'How can we help you today?',
    color: '#8B5CF6',
    position: 'bottom-right',
    displayPicture: '',
    preChatFormEnabled: false,
    preChatFormFields: [],
    privacyPolicyEnabled: false,
    privacyPolicyUrl: '',
    termsOfUseUrl: '',
    timeoutValue: 5,
    timeoutUnit: 'minutes',
    workingHours: {},
    duringWorkingHoursMessage: 'We are available!',
    afterWorkingHoursMessage: 'We will be back soon!',
  };

  function getSupabaseUrl() {
    var scriptSrc = document.currentScript?.src || '';
    if (scriptSrc.includes('localhost')) {
      return 'http://localhost:5173';
    }
    var url = new URL(scriptSrc);
    return url.origin;
  }

  function isWithinWorkingHours(workingHours) {
    if (!workingHours || Object.keys(workingHours).length === 0) {
      return true;
    }

    var now = new Date();
    var dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var currentDay = dayNames[now.getDay()];
    var dayConfig = workingHours[currentDay];

    if (!dayConfig || !dayConfig.enabled) {
      return false;
    }

    var currentTime = now.getHours() * 60 + now.getMinutes();

    if (dayConfig.slots && dayConfig.slots.length > 0) {
      for (var i = 0; i < dayConfig.slots.length; i++) {
        var slot = dayConfig.slots[i];
        var startParts = slot.start.split(':');
        var endParts = slot.end.split(':');
        var startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        var endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        if (currentTime >= startTime && currentTime <= endTime) {
          return true;
        }
      }
    }

    return false;
  }

  function fetchConfig(callback) {
    var apiUrl = getSupabaseUrl() + '/functions/v1/get-widget-config?widgetId=' + encodeURIComponent(widgetId) + '&language=' + encodeURIComponent(language);

    fetch(apiUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch widget config');
        }
        return response.json();
      })
      .then(function(config) {
        callback(config);
      })
      .catch(function(error) {
        console.warn('Failed to load widget config from API, using default:', error);
        callback(defaultConfig);
      });
  }

  function initWidget(config) {
    var isOpen = false;
    var isMinimized = false;
    var showPreChat = config.preChatFormEnabled && config.preChatFormFields.length > 0;
    var messages = [];
    var inactivityTimer = null;
    var isOnline = isWithinWorkingHours(config.workingHours);

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
        border: 2px solid rgba(255, 255, 255, 0.5);
      }
      .chat-widget-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .chat-widget-header-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .chat-widget-header-info p {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .chat-widget-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .chat-widget-status-dot.online {
        background-color: #10b981;
      }
      .chat-widget-status-dot.offline {
        background-color: #ef4444;
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
        background: #f9fafb;
      }
      .chat-message {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .chat-message.user {
        align-self: flex-end;
        background-color: ${config.color};
        color: white;
        border-bottom-right-radius: 4px;
      }
      .chat-message.agent {
        align-self: flex-start;
        background-color: white;
        color: #1f2937;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      }
      .chat-message.system {
        align-self: center;
        background-color: #fef3c7;
        color: #92400e;
        font-size: 13px;
        padding: 8px 12px;
        max-width: 90%;
        text-align: center;
      }
      .chat-widget-input-area {
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        display: flex;
        gap: 8px;
        background: white;
      }
      .chat-widget-input {
        flex: 1;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        resize: none;
        font-family: inherit;
        min-height: 44px;
        max-height: 120px;
      }
      .chat-widget-input:focus {
        outline: none;
        border-color: ${config.color};
        box-shadow: 0 0 0 3px ${config.color}20;
      }
      .chat-widget-send-button {
        background-color: ${config.color};
        border: none;
        width: 44px;
        height: 44px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: opacity 0.2s;
      }
      .chat-widget-send-button:hover:not(:disabled) {
        opacity: 0.9;
      }
      .chat-widget-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .chat-widget-send-button svg {
        width: 18px;
        height: 18px;
        fill: white;
      }
      .chat-widget-prechat-form {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
        background: white;
      }
      .chat-widget-prechat-form h4 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #111827;
      }
      .chat-widget-prechat-form > p {
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 24px 0;
        line-height: 1.5;
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
        color: #374151;
      }
      .chat-widget-form-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .chat-widget-form-input:focus {
        outline: none;
        border-color: ${config.color};
        box-shadow: 0 0 0 3px ${config.color}20;
      }
      .chat-widget-form-submit {
        width: 100%;
        padding: 12px;
        background-color: ${config.color};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-top: 24px;
        transition: opacity 0.2s;
      }
      .chat-widget-form-submit:hover {
        opacity: 0.9;
      }
      .chat-widget-footer {
        padding: 12px 16px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 11px;
        color: #6b7280;
      }
      .chat-widget-footer a {
        color: ${config.color};
        text-decoration: none;
        margin: 0 4px;
      }
      .chat-widget-footer a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(styles);

    function resetInactivityTimer() {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      if (isOpen && !showPreChat && messages.length > 0) {
        var timeoutMs = config.timeoutValue * 1000;
        if (config.timeoutUnit === 'minutes') {
          timeoutMs = config.timeoutValue * 60 * 1000;
        } else if (config.timeoutUnit === 'hours') {
          timeoutMs = config.timeoutValue * 60 * 60 * 1000;
        }

        inactivityTimer = setTimeout(function() {
          addMessage('This conversation has been closed due to inactivity.', 'system');
        }, timeoutMs);
      }
    }

    function createChatButton() {
      var button = document.createElement('button');
      button.className = 'chat-widget-button';
      button.setAttribute('aria-label', 'Open live chat');
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
        ? '<img src="' + config.displayPicture + '" alt="Support Agent" />'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

      var statusHtml = config.showStatus
        ? '<span class="chat-widget-status-dot ' + (isOnline ? 'online' : 'offline') + '"></span>' + (isOnline ? 'Online' : 'Offline')
        : isOnline ? 'Online' : 'Offline';

      header.innerHTML = `
        <div class="chat-widget-header-left">
          <div class="chat-widget-avatar">
            ${avatarHtml}
          </div>
          <div class="chat-widget-header-info">
            <h3>${config.title}</h3>
            <p>${statusHtml}</p>
          </div>
        </div>
        <div class="chat-widget-header-buttons">
          <button class="chat-widget-header-button minimize-button" aria-label="Minimize chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button class="chat-widget-header-button close-button" aria-label="Close chat">
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

        var welcomeMsg = isOnline ? config.duringWorkingHoursMessage : config.afterWorkingHoursMessage;
        addMessage(config.welcomeTagline, 'agent');
        if (welcomeMsg) {
          addMessage(welcomeMsg, 'agent');
        }
      }

      window.appendChild(header);
      window.appendChild(contentArea);

      if (config.privacyPolicyEnabled && (config.privacyPolicyUrl || config.termsOfUseUrl)) {
        var footer = document.createElement('div');
        footer.className = 'chat-widget-footer';
        var links = [];
        if (config.privacyPolicyUrl) {
          links.push('<a href="' + config.privacyPolicyUrl + '" target="_blank" rel="noopener">Privacy Policy</a>');
        }
        if (config.termsOfUseUrl) {
          links.push('<a href="' + config.termsOfUseUrl + '" target="_blank" rel="noopener">Terms of Use</a>');
        }
        footer.innerHTML = links.join(' • ');
        window.appendChild(footer);
      }

      header.querySelector('.close-button').addEventListener('click', closeChat);
      header.querySelector('.minimize-button').addEventListener('click', toggleMinimize);

      return window;
    }

    function createPreChatForm() {
      var form = document.createElement('form');
      form.className = 'chat-widget-prechat-form';

      var heading = document.createElement('h4');
      heading.textContent = config.welcomeHeading;
      form.appendChild(heading);

      var description = document.createElement('p');
      description.textContent = 'Please fill in the form below to start chatting with us.';
      form.appendChild(description);

      config.preChatFormFields.forEach(function(field) {
        var fieldDiv = document.createElement('div');
        fieldDiv.className = 'chat-widget-form-field';

        var label = document.createElement('label');
        label.className = 'chat-widget-form-label';
        label.textContent = field;
        label.setAttribute('for', 'prechat-' + field);

        var input = document.createElement('input');
        input.type = field === 'email' ? 'email' : (field === 'phone' ? 'tel' : 'text');
        input.className = 'chat-widget-form-input';
        input.name = field;
        input.id = 'prechat-' + field;
        input.required = true;
        input.placeholder = 'Enter your ' + field;

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
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
        <textarea class="chat-widget-input" placeholder="Type your message..." id="chat-input-${widgetId}" rows="1"></textarea>
        <button class="chat-widget-send-button" disabled id="chat-send-${widgetId}" aria-label="Send message">
          <svg viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" stroke="white" stroke-width="2"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="white" stroke-width="2"></polygon>
          </svg>
        </button>
      `;

      setTimeout(function() {
        var input = document.getElementById('chat-input-' + widgetId);
        var sendButton = document.getElementById('chat-send-' + widgetId);

        input.addEventListener('input', function() {
          sendButton.disabled = !input.value.trim();
          input.style.height = 'auto';
          input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.value.trim()) {
              sendMessage();
            }
          }
        });

        input.addEventListener('focus', resetInactivityTimer);
        input.addEventListener('input', resetInactivityTimer);

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

      messages.push({ text: text, sender: sender, timestamp: new Date() });

      if (sender === 'user') {
        resetInactivityTimer();
      }
    }

    function sendMessage() {
      var input = document.getElementById('chat-input-' + widgetId);
      var sendButton = document.getElementById('chat-send-' + widgetId);
      var message = input.value.trim();

      if (!message) return;

      addMessage(message, 'user');
      input.value = '';
      input.style.height = 'auto';
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

      var welcomeMsg = isOnline ? config.duringWorkingHoursMessage : config.afterWorkingHoursMessage;
      addMessage(config.welcomeTagline, 'agent');
      if (welcomeMsg) {
        addMessage(welcomeMsg, 'agent');
      }

      resetInactivityTimer();
    }

    function openChat() {
      isOpen = true;
      var button = container.querySelector('.chat-widget-button');
      var window = container.querySelector('.chat-widget-window');
      button.style.display = 'none';
      window.style.display = 'flex';

      if (!showPreChat) {
        var input = document.getElementById('chat-input-' + widgetId);
        if (input) {
          setTimeout(function() { input.focus(); }, 100);
        }
        resetInactivityTimer();
      }
    }

    function closeChat() {
      isOpen = false;
      var button = container.querySelector('.chat-widget-button');
      var window = container.querySelector('.chat-widget-window');
      button.style.display = 'flex';
      window.style.display = 'none';

      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
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
  }

  fetchConfig(initWidget);
})();
