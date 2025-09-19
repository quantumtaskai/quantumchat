# AI Receptionist Widget Integration Guide

## Overview

The AI Receptionist Widget is a card-style, embeddable interface that provides intelligent customer support and business information display for any website. Unlike traditional chat bubbles, our widget offers a professional card design with dual-panel functionality.

## Features

- **Card-Style Design**: Professional rectangular widget with rounded corners and shadows
- **Dual-Panel Layout**: Content panel (business info, forms, media) + Chat panel (AI conversation)
- **Mobile Responsive**: Adapts beautifully to mobile devices with slide-up interface
- **Customizable Branding**: Match your business colors and branding
- **Multiple Positions**: Bottom-right, bottom-left, bottom-center, sidebar options
- **Resizable Interface**: Users can adjust widget size for optimal experience
- **Smooth Animations**: Professional transitions and interactions

## Quick Start

### 1. Basic Integration

Add these two script tags to your website:

```html
<!-- Load the widget -->
<script src="https://yourhost.com/widget-loader.js"></script>

<!-- Initialize with your configuration -->
<script>
  QuantumChat.init({
    businessId: 'your-business-id',
    position: 'bottom-right',
    size: 'medium'
  });
</script>
```

### 2. Custom Business Configuration

```html
<script>
  QuantumChat.init({
    businessId: 'your-business-id',
    apiUrl: 'https://api.yourcompany.com',
    position: 'bottom-right',
    size: 'medium',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af'
  });
</script>
```

## Configuration Options

### Widget Appearance

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | string | `'bottom-right'` | Widget position on page |
| `size` | string | `'medium'` | Widget size preset |
| `primaryColor` | string | `'#3b82f6'` | Main brand color |
| `secondaryColor` | string | `'#1e40af'` | Secondary brand color |

#### Position Options
- `'bottom-right'` - Bottom right corner (recommended)
- `'bottom-left'` - Bottom left corner
- `'bottom-center'` - Bottom center
- `'sidebar-right'` - Right side, vertically centered
- `'sidebar-left'` - Left side, vertically centered

#### Size Options
- `'compact'` - 400x300px (ideal for simple sites)
- `'medium'` - 600x400px (recommended for most sites)
- `'large'` - 800x500px (best for content-rich experiences)

### Widget Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowResize` | boolean | `true` | Allow users to resize widget |
| `showPulse` | boolean | `true` | Show attention pulse animation |
| `showOverlay` | boolean | `true` | Show backdrop overlay on mobile |
| `autoExpand` | boolean | `false` | Auto-expand widget after delay |
| `expandDelay` | number | `3000` | Delay before auto-expand (ms) |

### Business Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `businessId` | string | Required | Your business identifier |
| `apiUrl` | string | Optional | Custom API endpoint |

### Integration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hostUrl` | string | Auto-detected | Widget host URL |
| `containerId` | string | `null` | Specific container element ID |

## Event Handlers

Configure event handlers to track widget interactions and integrate with your analytics:

```javascript
QuantumChat.init({
  businessId: 'your-business-id',

  // Event handlers
  onReady: function() {
    console.log('Widget is ready');
    // Track widget load in analytics
  },

  onExpanded: function(data) {
    console.log('Widget expanded', data);
    // Track user engagement
    gtag('event', 'widget_expanded', {
      business: data.business
    });
  },

  onMinimized: function() {
    console.log('Widget minimized');
    // Track user behavior
  },

  onClosed: function() {
    console.log('Widget closed');
    // Track widget dismissal
  },

  onError: function(error) {
    console.error('Widget error', error);
    // Handle errors gracefully
  }
});
```

## Advanced Configuration

### Complete Configuration Example

```javascript
QuantumChat.init({
  // Required
  businessId: 'your-business-id',

  // Widget appearance
  position: 'bottom-right',
  size: 'medium',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',

  // Widget behavior
  allowResize: true,
  showPulse: true,
  showOverlay: true,
  autoExpand: false,
  expandDelay: 3000,

  // Integration options
  apiUrl: 'https://api.yourcompany.com',
  hostUrl: 'https://widget.yourcompany.com',
  containerId: 'chat-widget-container',

  // Event handlers
  onReady: function() {
    console.log('Widget initialized');
  },
  onExpanded: function(data) {
    console.log('Widget expanded', data);
  },
  onMinimized: function() {
    console.log('Widget minimized');
  },
  onClosed: function() {
    console.log('Widget closed');
  },
  onError: function(error) {
    console.error('Widget error', error);
  }
});
```

### Dynamic Configuration Updates

Update widget configuration after initialization:

```javascript
// Get widget instance
const widget = QuantumChat.init({ businessId: 'demo' });

// Update configuration
widget.updateConfig({
  position: 'bottom-left',
  primaryColor: '#10b981'
});

// Control widget visibility
widget.show();
widget.hide();
widget.toggle();

// Get widget status
const status = widget.getStatus();
console.log(status);

// Destroy widget
widget.destroy();
```

## Mobile Experience

The widget automatically adapts to mobile devices:

- **Minimized State**: Compact card at bottom-right
- **Expanded State**: Slide-up interface taking 80% of screen height
- **Navigation**: Toggle between Chat and Content panels
- **Gestures**: Tap outside to dismiss

### Mobile-Specific Styling

```css
/* Override mobile styles if needed */
@media (max-width: 768px) {
  #quantum-chat-widget {
    /* Custom mobile adjustments */
  }
}
```

## Custom Container Integration

Embed the widget in a specific container instead of floating:

```html
<div id="chat-container" style="width: 600px; height: 400px;"></div>

<script>
  QuantumChat.init({
    businessId: 'your-business-id',
    containerId: 'chat-container',
    position: 'static' // Disable floating
  });
</script>
```

## Security Considerations

### Domain Whitelist

The widget automatically validates the parent domain for security. Ensure your domain is properly configured:

```javascript
// The widget automatically passes the parent domain
// No additional configuration needed for basic security
```

### Content Security Policy (CSP)

Add these CSP directives to allow the widget:

```
script-src 'self' 'unsafe-inline' https://yourhost.com;
frame-src https://yourhost.com;
connect-src https://yourhost.com;
```

## Performance Optimization

### Lazy Loading

Load the widget only when needed:

```javascript
// Load widget on user interaction
document.addEventListener('scroll', function() {
  // Load after user scrolls
  if (!window.QuantumChat) {
    loadWidget();
  }
}, { once: true });

function loadWidget() {
  const script = document.createElement('script');
  script.src = 'https://yourhost.com/widget-loader.js';
  script.onload = function() {
    QuantumChat.init({ businessId: 'your-business-id' });
  };
  document.head.appendChild(script);
}
```

### Preload Resources

Improve loading performance:

```html
<!-- Preload widget resources -->
<link rel="preload" href="https://yourhost.com/widget-loader.js" as="script">
<link rel="dns-prefetch" href="https://yourhost.com">
```

## Troubleshooting

### Common Issues

1. **Widget doesn't appear**
   - Check console for JavaScript errors
   - Verify the script URL is correct
   - Ensure businessId is valid

2. **Widget appears but doesn't load content**
   - Check network requests in browser dev tools
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Styling conflicts**
   - Widget uses scoped styles to avoid conflicts
   - Check for CSS that might override widget styles
   - Use browser dev tools to inspect styles

### Debug Mode

Enable debug logging:

```javascript
QuantumChat.init({
  businessId: 'your-business-id',
  debug: true // Enable debug logging
});
```

### Browser Compatibility

Supported browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

For older browsers, include polyfills:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

## Examples

### E-commerce Integration

```javascript
QuantumChat.init({
  businessId: 'ecommerce-store',
  position: 'bottom-right',
  size: 'medium',
  primaryColor: '#059669', // Brand green
  autoExpand: false,

  onExpanded: function() {
    // Track customer service engagement
    gtag('event', 'customer_service_started');
  }
});
```

### SaaS Platform Integration

```javascript
QuantumChat.init({
  businessId: 'saas-platform',
  position: 'sidebar-right',
  size: 'large',
  allowResize: true,
  showPulse: false, // Less intrusive for logged-in users

  onReady: function() {
    // Pass user context if available
    if (window.currentUser) {
      this.setUserContext(window.currentUser);
    }
  }
});
```

### Professional Services

```javascript
QuantumChat.init({
  businessId: 'consulting-firm',
  position: 'bottom-center',
  size: 'medium',
  primaryColor: '#1e40af',
  autoExpand: true,
  expandDelay: 5000, // Give users time to read content

  onClosed: function() {
    // Offer alternative contact methods
    showContactForm();
  }
});
```

## API Reference

### QuantumChat Object

#### Methods

- `init(config)` - Initialize widget with configuration
- `create()` - Create new widget instance

#### Widget Instance Methods

- `show()` - Show the widget
- `hide()` - Hide the widget
- `toggle()` - Toggle widget visibility
- `updateConfig(config)` - Update configuration
- `getStatus()` - Get current widget status
- `destroy()` - Remove widget from page

#### Properties

- `version` - Widget version string

## Support

For questions or issues:

1. Check this documentation
2. Review the demo at `/demo.html`
3. Open an issue in our repository
4. Contact support at support@yourcompany.com

## Changelog

### v1.0.0
- Initial release with card-style widget
- Dual-panel layout support
- Mobile responsive design
- Multiple positioning options
- Custom branding support
- Event handler system