/**
 * Enterprise Live Chat Widget - Bootstrap Loader
 * Version: 2.0.0
 * Size: ~8KB minified
 *
 * This lightweight script loads the full widget dynamically based on
 * configuration fetched from the server in real-time.
 *
 * Usage: <script src="https://yourcdn.com/widget.js?id=CUSTOMER_ID"></script>
 */

(function() {
  'use strict';

  if (window.LiveChatWidget && window.LiveChatWidget.initialized) {
    console.warn('[LiveChat] Widget already initialized');
    return;
  }

  const VERSION = '2.0.0';
  const LOAD_TIMEOUT = 10000;
  const RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 2000;

  const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const scriptSrc = script ? script.src : '';
  const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');

  const customerId = urlParams.get('id') || urlParams.get('customer_id') || script?.getAttribute('data-id');
  const widgetId = urlParams.get('widget_id') || script?.getAttribute('data-widget-id');
  const apiUrl = urlParams.get('api_url') || script?.getAttribute('data-api-url') || 'https://cjvqboumfhsjnmyomaji.supabase.co';
  const debug = urlParams.get('debug') === 'true' || script?.getAttribute('data-debug') === 'true';

  let config = null;
  let widgetInstance = null;
  let loadAttempts = 0;

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

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let deviceType = 'desktop';

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      deviceType = 'mobile';
    }

    return {
      user_agent: ua,
      device_type: deviceType,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

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

  function createWidgetContainer() {
    if (document.getElementById('livechat-widget-container')) {
      return document.getElementById('livechat-widget-container');
    }

    const container = document.createElement('div');
    container.id = 'livechat-widget-container';
    container.setAttribute('data-version', VERSION);
    container.style.cssText = 'position: fixed; z-index: ' + (config.branding?.z_index || 999999) + ';';

    document.body.appendChild(container);
    return container;
  }

  function injectStyles() {
    if (document.getElementById('livechat-widget-styles')) return;

    const branding = config.branding || {};
    const behavior = config.behavior || {};

    const styles = document.createElement('style');
    styles.id = 'livechat-widget-styles';
    styles.textContent = `
      #livechat-widget-container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .lcw-button {
        position: fixed;
        ${behavior.position === 'bottom-left' ? 'left' : 'right'}: ${behavior.offset_x || 20}px;
        bottom: ${behavior.offset_y || 20}px;
        width: 60px;
        height: 60px;
        border-radius: ${branding.widget_shape === 'square' ? '8px' : '50%'};
        background: ${branding.button_color || branding.primary_color || '#3B82F6'};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: ${behavior.z_index || 999999};
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

      .lcw-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #EF4444;
        color: white;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: bold;
        min-width: 18px;
        text-align: center;
      }

      .lcw-window {
        position: fixed;
        ${behavior.position === 'bottom-left' ? 'left' : 'right'}: ${behavior.offset_x || 20}px;
        bottom: ${(behavior.offset_y || 20) + 80}px;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 600px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: ${branding.border_radius || '12px'};
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: ${branding.font_family || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
        z-index: ${behavior.z_index || 999999};
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

      .lcw-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 14px;
        color: #6B7280;
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
          right: 16px !important;
          bottom: 16px !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  function createMinimalUI() {
    const container = createWidgetContainer();
    injectStyles();

    const button = document.createElement('button');
    button.className = 'lcw-button';
    button.setAttribute('aria-label', 'Open live chat');
    button.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    `;

    button.addEventListener('click', () => {
      if (widgetInstance && widgetInstance.toggle) {
        widgetInstance.toggle();
      }
    });

    container.appendChild(button);

    window.LiveChatWidget = window.LiveChatWidget || {};
    window.LiveChatWidget.button = button;
    window.LiveChatWidget.container = container;
  }

  async function loadFullWidget() {
    log('Loading full widget...');

    try {
      const { default: WidgetClass } = await import('./widget-full.js');

      widgetInstance = new WidgetClass({
        config: config,
        visitorId: generateVisitorId(),
        sessionId: generateSessionId(),
        deviceInfo: getDeviceInfo(),
        container: window.LiveChatWidget.container,
        button: window.LiveChatWidget.button,
        debug: debug,
      });

      await widgetInstance.initialize();

      window.LiveChatWidget.instance = widgetInstance;
      window.LiveChatWidget.open = () => widgetInstance.open();
      window.LiveChatWidget.close = () => widgetInstance.close();
      window.LiveChatWidget.toggle = () => widgetInstance.toggle();
      window.LiveChatWidget.sendMessage = (msg) => widgetInstance.sendMessage(msg);
      window.LiveChatWidget.on = (event, callback) => widgetInstance.on(event, callback);
      window.LiveChatWidget.off = (event, callback) => widgetInstance.off(event, callback);

      log('Widget fully loaded and initialized');

      if (config.behavior?.auto_open_enabled && config.behavior?.auto_open_delay > 0) {
        setTimeout(() => {
          widgetInstance.open();
        }, config.behavior.auto_open_delay);
      }

    } catch (err) {
      error('Failed to load full widget:', err);
      throw err;
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

      createMinimalUI();

      loadFullWidget().catch(err => {
        error('Widget loading failed:', err);
      });

      window.LiveChatWidget.initialized = true;
      window.LiveChatWidget.version = VERSION;
      window.LiveChatWidget.config = config;

      const totalTime = Date.now() - startTime;
      log('Widget bootstrap completed in ' + totalTime + 'ms');

      const event = new CustomEvent('livechat:ready', { detail: { version: VERSION, config: config } });
      window.dispatchEvent(event);

    } catch (err) {
      error('Initialization failed:', err);

      const fallbackButton = document.createElement('button');
      fallbackButton.className = 'lcw-button';
      fallbackButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
      fallbackButton.onclick = () => alert('Chat widget failed to load. Please try again later or contact support.');
      fallbackButton.style.opacity = '0.5';

      const container = createWidgetContainer();
      container.appendChild(fallbackButton);

      const event = new CustomEvent('livechat:error', { detail: { error: err.message } });
      window.dispatchEvent(event);
    }
  }

  window.LiveChatWidget = window.LiveChatWidget || {
    queue: [],
    push: function(fn) {
      if (typeof fn === 'function') {
        if (this.initialized && widgetInstance) {
          fn(widgetInstance);
        } else {
          this.queue.push(fn);
        }
      }
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    setTimeout(initialize, 0);
  }

})();
