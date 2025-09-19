/**
 * AI Receptionist Widget - Card on Page, Popup in Iframe
 * Perfect integration with zero iframe issues for the card
 */

(function() {
  'use strict';

  // Only create widget once
  if (window.QuantumChatLoaded) return;
  window.QuantumChatLoaded = true;

  // Auto-detect host URL
  function getHostUrl() {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('widget-loader.js')) {
        const url = new URL(script.src);
        return `${url.protocol}//${url.host}`;
      }
    }
    return window.location.origin;
  }

  // Card HTML template with inline CSS (standalone)
  function getCardHTML(businessName) {
    return `
      <div id="quantum-chat-card" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 280px;
        height: 180px;
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 35%, #7c3aed 100%);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 10px 40px rgba(59, 130, 246, 0.25);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        z-index: 999999;
        font-family: 'Inter', system-ui, sans-serif;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: transform 0.3s ease;
      ">
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          position: relative;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.09 0 2.14-.18 3.12-.5l5.88 1.92-1.92-5.88c.32-.98.5-2.03.5-3.12 0-5.52-4.48-10-10-10z"/>
            </svg>
          </div>
          <div style="color: white; text-align: center;">
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">${businessName || 'AI Assistant'}</div>
            <div style="font-size: 13px; opacity: 0.9;">Need help? Click to chat</div>
          </div>
          <div style="
            position: absolute;
            top: -12px;
            right: -12px;
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        </div>
      </div>

      <style>
        #quantum-chat-card:hover {
          transform: scale(1.05);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      </style>

    `;
  }

  // Create simple card that opens iframe popup
  function createCard() {
    const hostUrl = getHostUrl();

    // Insert card HTML
    document.body.insertAdjacentHTML('beforeend', getCardHTML('Quantum Tech Solutions'));

    // Add simple click handler
    const card = document.getElementById('quantum-chat-card');
    card.addEventListener('click', function() {
      openPopup(hostUrl);
    });

    console.log('✨ AI Receptionist card loaded');
  }

  // Simple popup function
  function openPopup(hostUrl) {
    // Clear transform and hide card
    const card = document.getElementById('quantum-chat-card');
    card.style.transform = '';
    card.style.display = 'none';

    // Create simple iframe popup
    const iframe = document.createElement('iframe');
    iframe.id = 'quantum-chat-popup';
    iframe.src = `${hostUrl}/widget?mode=simple&auto=true`;
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      z-index: 999999;
    `;

    document.body.appendChild(iframe);

    // Handle close message
    window.addEventListener('message', function(event) {
      if (event.data?.type === 'quantum-chat' && event.data?.action === 'widget-minimized') {
        iframe.remove();
        card.style.display = 'flex';
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCard);
  } else {
    createCard();
  }

  // Global reference
  window.QuantumChat = {
    version: '3.0.0-hybrid',
    loaded: true,
    showCard: function() {
      const card = document.getElementById('quantum-chat-card');
      if (card) card.style.display = 'flex';
    },
    hideCard: function() {
      const card = document.getElementById('quantum-chat-card');
      if (card) card.style.display = 'none';
    }
  };

})();