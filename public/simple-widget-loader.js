/**
 * Simple AI Receptionist Widget
 * One-line integration for beautiful card-style chat widget
 *
 * Usage:
 * <script src="https://yourhost.com/simple-widget-loader.js"></script>
 * <script>QuantumChat.init({ businessId: 'your-business-id' });</script>
 */

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.QuantumChat) {
    return;
  }

  class SimpleWidget {
    constructor() {
      this.container = null;
      this.iframe = null;
      this.isVisible = false;
      this.config = {
        businessId: 'demo',
        hostUrl: null
      };

      this.handleMessage = this.handleMessage.bind(this);
      this.handleResize = this.handleResize.bind(this);
    }

    init(userConfig = {}) {
      // Merge configuration
      this.config = { ...this.config, ...userConfig };

      // Auto-detect host URL if not provided
      if (!this.config.hostUrl) {
        this.config.hostUrl = this.detectHostUrl();
      }

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.create());
      } else {
        this.create();
      }

      return this;
    }

    create() {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'quantum-simple-widget';
      this.container.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 999999;
        pointer-events: none;
      `;

      // Create iframe
      this.iframe = document.createElement('iframe');
      const widgetUrl = this.buildWidgetUrl();

      this.iframe.src = widgetUrl;
      this.iframe.style.cssText = `
        border: none;
        background: transparent;
        width: 100vw;
        height: 100vh;
        pointer-events: auto;
      `;

      // Security attributes
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
      this.iframe.setAttribute('loading', 'eager');

      // Setup event listeners
      window.addEventListener('message', this.handleMessage);
      window.addEventListener('resize', this.handleResize);

      // Append to DOM
      this.container.appendChild(this.iframe);
      document.body.appendChild(this.container);

      this.isVisible = true;
      console.log('Simple AI Receptionist widget loaded');
    }

    buildWidgetUrl() {
      const baseUrl = `${this.config.hostUrl}/widget`;
      const params = new URLSearchParams();

      params.set('businessId', this.config.businessId);
      params.set('mode', 'simple');
      params.set('parentDomain', window.location.origin);

      return `${baseUrl}?${params.toString()}`;
    }

    handleMessage(event) {
      // Security check
      if (event.origin !== new URL(this.config.hostUrl).origin) {
        return;
      }

      const { data } = event;
      if (!data || data.type !== 'quantum-chat') {
        return;
      }

      switch (data.action) {
        case 'widget-ready':
          console.log('Widget ready');
          break;
        case 'widget-expanded':
          console.log('Widget expanded');
          break;
        case 'widget-minimized':
          console.log('Widget minimized');
          break;
        case 'widget-closed':
          this.hide();
          break;
      }
    }

    handleResize() {
      // Widget handles its own responsive behavior
    }

    detectHostUrl() {
      // Try to detect from script tag
      const scripts = document.getElementsByTagName('script');
      for (let script of scripts) {
        if (script.src && script.src.includes('simple-widget-loader.js')) {
          const url = new URL(script.src);
          return `${url.protocol}//${url.host}`;
        }
      }

      // Fallback to current origin
      return window.location.origin;
    }

    show() {
      if (this.container) {
        this.container.style.display = 'block';
        this.isVisible = true;
      }
    }

    hide() {
      if (this.container) {
        this.container.style.display = 'none';
        this.isVisible = false;
      }
    }

    destroy() {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      window.removeEventListener('message', this.handleMessage);
      window.removeEventListener('resize', this.handleResize);

      this.container = null;
      this.iframe = null;
      this.isVisible = false;
    }

    getStatus() {
      return {
        visible: this.isVisible,
        config: { ...this.config }
      };
    }
  }

  // Create global QuantumChat object
  window.QuantumChat = {
    // Quick initialization
    init: (config) => {
      const widget = new SimpleWidget();
      return widget.init(config);
    },

    // Create instance
    create: () => new SimpleWidget(),

    version: '1.0.0-simple'
  };

  console.log('QuantumChat Simple Widget Loader ready');
})();