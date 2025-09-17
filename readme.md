# 🤖 Quantum Chat - AI Voice Chat Widget

A modern, embeddable AI voice chat widget that can be integrated into any website with just one line of code. Features speech-to-text input, AI responses via OpenAI API, and text-to-speech output.

## ✨ Features

- 🎤 **Voice Input** - Natural speech-to-text using Web Speech API
- 🤖 **AI Responses** - Powered by OpenAI GPT for intelligent conversations
- 🔊 **Voice Output** - Text-to-speech for AI responses
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🔧 **Easy Integration** - Single script tag embedding
- 🎨 **Customizable** - Position, styling, and behavior options
- 🔒 **Secure** - API keys stored securely in localStorage

## 🚀 Quick Start

### Option 1: Embeddable Widget (Recommended)

Add this single line to your website:

```html
<script src="https://quantumtaskai.github.io/quantumchat/embed.js"></script>
```

### Option 2: Standalone Application

Visit the hosted version: [https://quantumtaskai.github.io/quantumchat](https://quantumtaskai.github.io/quantumchat)

### Option 3: Widget Only

Use the widget interface: [https://quantumtaskai.github.io/quantumchat/widget.html](https://quantumtaskai.github.io/quantumchat/widget.html)

## 📖 Integration Examples

### Basic Integration
```html
<script src="https://quantumtaskai.github.io/quantumchat/embed.js"></script>
```

### With Configuration
```html
<script>
window.quantumChatConfig = {
    position: 'bottom-left',    // bottom-right, bottom-left, top-right, top-left
    autoOpen: false,           // Auto-open widget on page load
    apiKey: 'your-api-key'     // Pre-configure API key
};
</script>
<script src="https://quantumtaskai.github.io/quantumchat/embed.js"></script>
```

### Programmatic Control
```javascript
// Open the chat widget
QuantumChat.open();

// Send a message programmatically
QuantumChat.sendMessage('Hello from my website!');

// Set API key
QuantumChat.setApiKey('your-openai-api-key');

// Close the widget
QuantumChat.close();
```

### Event Callbacks
```html
<script>
window.quantumChatCallbacks = {
    onOpen: function() {
        console.log('Chat opened');
    },
    onClose: function() {
        console.log('Chat closed');
    },
    onMessageSent: function(message) {
        console.log('User sent:', message);
    },
    onMessageReceived: function(message) {
        console.log('AI replied:', message);
    }
};
</script>
```

## 🛠️ Setup Instructions

1. **Get OpenAI API Key**
   - Sign up at [OpenAI](https://openai.com)
   - Get your API key from the dashboard

2. **Add Script Tag**
   - Copy the embed script
   - Paste it into your website's HTML

3. **Configure (Optional)**
   - Set position, styling, and behavior options

4. **Test & Deploy**
   - Test the widget and deploy to your live website

## 📁 Project Structure

```
quantumchat/
├── index.html          # Full standalone application
├── widget.html         # Embeddable widget interface
├── embed.js            # Widget embedding script
├── demo.html           # Integration examples and demo
└── README.md           # Documentation
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `autoOpen` | boolean | `false` | Auto-open widget on page load |
| `apiKey` | string | `null` | Pre-configure OpenAI API key |
| `theme` | string | `'default'` | Widget theme (future feature) |

## 🎯 API Reference

### QuantumChat Object

| Method | Parameters | Description |
|--------|------------|-------------|
| `open()` | none | Open the chat widget |
| `close()` | none | Close the chat widget |
| `toggle()` | none | Toggle widget open/closed |
| `sendMessage(message)` | string | Send a message programmatically |
| `setApiKey(apiKey)` | string | Set the OpenAI API key |
| `updateConfig(config)` | object | Update widget configuration |

### Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onOpen` | none | Called when widget opens |
| `onClose` | none | Called when widget closes |
| `onMessageSent` | message (string) | Called when user sends a message |
| `onMessageReceived` | message (string) | Called when AI responds |

## 🌐 Browser Support

- Chrome/Edge (Recommended) - Full support
- Firefox - Full support
- Safari - Limited speech recognition support
- Mobile browsers - Touch-optimized interface

## 🔒 Security & Privacy

- API keys are stored locally in the user's browser
- No data is sent to external servers except OpenAI
- All communication is over HTTPS
- Widget runs in isolated iframe for security

## 📱 Mobile Optimization

- Responsive design adapts to screen size
- Touch-friendly interface
- Voice input works on supported mobile browsers
- Optimized chat bubble for mobile viewing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🆘 Support

- [GitHub Issues](https://github.com/quantumtaskai/quantumchat/issues)
- [Live Demo](https://quantumtaskai.github.io/quantumchat/demo.html)
- [Documentation](https://quantumtaskai.github.io/quantumchat)

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT API
- **Speech**: Web Speech API (STT/TTS)
- **Hosting**: GitHub Pages

---

Made with ❤️ by [Quantum Task AI](https://github.com/quantumtaskai)