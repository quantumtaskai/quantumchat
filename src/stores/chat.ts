import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatState, AIResponse } from '@/types'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<Message[]>([])
  const isTyping = ref(false)
  const isListening = ref(false)
  const sessionId = ref(generateSessionId())

  // Getters
  const chatState = computed<ChatState>(() => ({
    messages: messages.value,
    isTyping: isTyping.value,
    isListening: isListening.value,
    currentContent: null,
    sessionId: sessionId.value
  }))

  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1] || null
  })

  const userMessages = computed(() => {
    return messages.value.filter(m => m.role === 'user')
  })

  const assistantMessages = computed(() => {
    return messages.value.filter(m => m.role === 'assistant')
  })

  // Actions
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function addMessage(content: string, role: 'user' | 'assistant' | 'system', contentType?: string) {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      role,
      timestamp: new Date(),
      contentType
    }
    
    messages.value.push(message)
    return message
  }

  function addWelcomeMessage(welcomeText: string) {
    if (messages.value.length === 0) {
      addMessage(welcomeText, 'assistant')
    }
  }

  async function sendMessage(content: string): Promise<void> {
    // Add user message
    addMessage(content, 'user')
    
    // Set typing indicator
    isTyping.value = true
    
    try {
      // Call AI service
      const response = await callAIService(content)
      
      // Add AI response
      addMessage(response.message, 'assistant')
      
      // Handle content suggestions
      if (response.suggestedContent && response.suggestedContent.length > 0) {
        console.log('Chat: Suggesting content:', response.suggestedContent)
        // Emit event for content panel to show suggested content
        window.dispatchEvent(new CustomEvent('ai-suggest-content', {
          detail: {
            contentIds: response.suggestedContent,
            intent: response.intent
          }
        }))
      }
      
    } catch (error) {
      console.error('Failed to get AI response:', error)
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant')
    } finally {
      isTyping.value = false
    }
  }

  async function callAIService(message: string): Promise<AIResponse> {
    // For now, simulate smart AI response with content suggestions
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerMessage = message.toLowerCase()
        
        // Smart content suggestions based on message
        let suggestedContent = []
        let response = ''
        
        if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
          response = 'I\'d be happy to show you our services! Let me pull up our company overview for you.'
          suggestedContent = ['company-brochure']
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
          response = 'Great question! Let me show you our pricing information.'
          suggestedContent = ['pricing-guide']
        } else if (lowerMessage.includes('demo') || lowerMessage.includes('show me') || lowerMessage.includes('see')) {
          response = 'I have a perfect demonstration for you! Let me show you our product demo.'
          suggestedContent = ['product-demo']
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('touch')) {
          response = 'I can help you get in touch with our team. Let me pull up our contact form.'
          suggestedContent = ['contact-form']
        } else if (lowerMessage.includes('case') || lowerMessage.includes('example') || lowerMessage.includes('success')) {
          response = 'I\'d love to show you some of our success stories! Here are our case studies.'
          suggestedContent = ['case-studies']
        } else {
          response = 'I\'m here to help! You can ask me about our services, pricing, see a demo, or get in touch with our team.'
        }
        
        resolve({
          message: response,
          suggestedContent: suggestedContent,
          intent: 'content_suggestion',
          confidence: 0.9
        })
      }, 800 + Math.random() * 1200) // Simulate network delay
    })
  }

  function setTyping(typing: boolean) {
    isTyping.value = typing
  }

  function setListening(listening: boolean) {
    isListening.value = listening
  }

  function clearMessages() {
    messages.value = []
  }

  function getConversationContext(): string {
    return messages.value
      .slice(-10) // Last 10 messages for context
      .map(m => `${m.role}: ${m.content}`)
      .join('\n')
  }

  return {
    // State
    messages,
    isTyping,
    isListening,
    sessionId,
    
    // Getters
    chatState,
    lastMessage,
    userMessages,
    assistantMessages,
    
    // Actions
    addMessage,
    addWelcomeMessage,
    sendMessage,
    setTyping,
    setListening,
    clearMessages,
    getConversationContext
  }
})