(function() {
    'use strict';
    
    // Configuration
    const WIDGET_URL = 'https://quantumtaskai.github.io/quantumchat/widget.html';
    const WIDGET_ID = 'quantum-chat-widget-iframe';
    
    // Prevent multiple loads
    if (window.quantumChatLoaded) {
        console.warn('Quantum Chat Widget is already loaded');
        return;
    }
    window.quantumChatLoaded = true;
    
    // Widget configuration (can be customized)
    const defaultConfig = {
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'default',
        autoOpen: false,
        apiKey: null,
        customCSS: null
    };
    
    // Merge user config with defaults
    const config = Object.assign({}, defaultConfig, window.quantumChatConfig || {});
    
    // Create and inject widget
    function createWidget() {
        // Create iframe container
        const iframe = document.createElement('iframe');
        iframe.id = WIDGET_ID;
        iframe.src = WIDGET_URL;
        iframe.style.cssText = `
            position: fixed !important;
            bottom: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            background: transparent !important;
            z-index: 999999 !important;
            pointer-events: none !important;
        `;
        
        // Allow iframe content to capture pointer events
        iframe.onload = function() {
            iframe.style.pointerEvents = 'auto';
        };
        
        // Set position based on config
        switch (config.position) {
            case 'bottom-left':
                iframe.style.left = '0 !important';
                iframe.style.right = 'auto !important';
                break;
            case 'top-right':
                iframe.style.top = '0 !important';
                iframe.style.bottom = 'auto !important';
                break;
            case 'top-left':
                iframe.style.top = '0 !important';
                iframe.style.bottom = 'auto !important';
                iframe.style.left = '0 !important';
                iframe.style.right = 'auto !important';
                break;
            default:
                // bottom-right (default)
                break;
        }
        
        // Inject into page
        document.body.appendChild(iframe);
        
        // Setup communication with iframe
        setupCommunication(iframe);
        
        return iframe;
    }
    
    // Setup communication between parent and iframe
    function setupCommunication(iframe) {
        // Listen for messages from iframe
        window.addEventListener('message', function(event) {
            // Verify origin for security
            if (event.origin !== 'https://quantumtaskai.github.io') {
                return;
            }
            
            const data = event.data;
            if (data.type === 'quantum-chat') {
                switch (data.action) {
                    case 'widget-ready':
                        // Widget is ready, send configuration
                        iframe.contentWindow.postMessage({
                            type: 'quantum-chat-config',
                            config: config
                        }, '*');
                        break;
                    case 'widget-opened':
                        // Widget was opened
                        if (window.quantumChatCallbacks && window.quantumChatCallbacks.onOpen) {
                            window.quantumChatCallbacks.onOpen();
                        }
                        break;
                    case 'widget-closed':
                        // Widget was closed
                        if (window.quantumChatCallbacks && window.quantumChatCallbacks.onClose) {
                            window.quantumChatCallbacks.onClose();
                        }
                        break;
                    case 'message-sent':
                        // User sent a message
                        if (window.quantumChatCallbacks && window.quantumChatCallbacks.onMessageSent) {
                            window.quantumChatCallbacks.onMessageSent(data.message);
                        }
                        break;
                    case 'message-received':
                        // AI response received
                        if (window.quantumChatCallbacks && window.quantumChatCallbacks.onMessageReceived) {
                            window.quantumChatCallbacks.onMessageReceived(data.message);
                        }
                        break;
                }
            }
        });
    }
    
    // Public API
    window.QuantumChat = {
        // Open the widget
        open: function() {
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-command',
                    action: 'open'
                }, '*');
            }
        },
        
        // Close the widget
        close: function() {
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-command',
                    action: 'close'
                }, '*');
            }
        },
        
        // Toggle the widget
        toggle: function() {
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-command',
                    action: 'toggle'
                }, '*');
            }
        },
        
        // Send a message programmatically
        sendMessage: function(message) {
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe && message) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-command',
                    action: 'send-message',
                    message: message
                }, '*');
            }
        },
        
        // Set API key
        setApiKey: function(apiKey) {
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe && apiKey) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-command',
                    action: 'set-api-key',
                    apiKey: apiKey
                }, '*');
            }
        },
        
        // Update configuration
        updateConfig: function(newConfig) {
            Object.assign(config, newConfig);
            const iframe = document.getElementById(WIDGET_ID);
            if (iframe) {
                iframe.contentWindow.postMessage({
                    type: 'quantum-chat-config',
                    config: config
                }, '*');
            }
        }
    };
    
    // Initialize widget when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createWidget);
        } else {
            createWidget();
        }
    }
    
    // Start initialization
    init();
    
    // Expose configuration function for users
    window.quantumChatConfig = window.quantumChatConfig || {};
    
})();

// Usage examples (commented out):
/*
// Basic usage - just include the script:
<script src="https://quantumtaskai.github.io/quantumchat/embed.js"></script>

// With configuration:
<script>
window.quantumChatConfig = {
    position: 'bottom-left',
    autoOpen: false,
    apiKey: 'your-api-key-here'
};
</script>
<script src="https://quantumtaskai.github.io/quantumchat/embed.js"></script>

// With callbacks:
<script>
window.quantumChatCallbacks = {
    onOpen: function() {
        console.log('Chat widget opened');
    },
    onClose: function() {
        console.log('Chat widget closed');
    },
    onMessageSent: function(message) {
        console.log('User sent:', message);
    },
    onMessageReceived: function(message) {
        console.log('AI replied:', message);
    }
};
</script>

// Programmatic control:
<script>
// Open widget
QuantumChat.open();

// Send a message
QuantumChat.sendMessage('Hello from the website!');

// Set API key
QuantumChat.setApiKey('your-api-key');
</script>
*/