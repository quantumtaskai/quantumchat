/**
 * Ultra-Simple AI Receptionist Widget
 * Just include this script and get a beautiful chat widget!
 *
 * Usage:
 * <script src="https://yourhost.com/widget-loader.js"></script>
 *
 * That's it! Widget loads automatically.
 */

(function() {
  'use strict';

  // Auto-detect host URL from script tag
  function detectHostUrl() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('widget-loader.js')) {
        const url = new URL(script.src);
        return `${url.protocol}//${url.host}`;
      }
    }
    return window.location.origin;
  }

  // Create the widget
  function createWidget() {
    // Create container that covers the whole page (for positioning)
    const container = document.createElement('div');
    container.id = 'quantum-auto-widget';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      pointer-events: none;
    `;

    // Create iframe for the widget
    const iframe = document.createElement('iframe');
    const hostUrl = detectHostUrl();
    const widgetUrl = `${hostUrl}/widget?mode=simple&auto=true`;

    iframe.src = widgetUrl;
    iframe.style.cssText = `
      border: none;
      background: transparent;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `;

    // Security
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

    // Handle messages from widget
    window.addEventListener('message', function(event) {
      if (event.origin !== new URL(hostUrl).origin) return;

      const { data } = event;
      if (data && data.type === 'quantum-chat') {
        switch (data.action) {
          case 'widget-ready':
            console.log('🤖 AI Receptionist ready');
            break;
          case 'widget-expanded':
            console.log('💬 Chat started');
            break;
        }
      }
    });

    // Add to page
    container.appendChild(iframe);
    document.body.appendChild(container);

    console.log('✨ AI Receptionist widget auto-loaded');
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  // Expose minimal global for compatibility (if needed)
  window.QuantumChat = {
    version: '3.0.0-auto',
    loaded: true
  };

})();