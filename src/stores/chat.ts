import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatState, AIResponse, BusinessConfig } from '@/types'
import { useAppStore } from '@/stores/app'

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
      } else {
        console.log('Chat: No content suggestions to display')
      }

    } catch (error) {
      console.error('Failed to get AI response:', error)
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant')
    } finally {
      isTyping.value = false
    }
  }

  async function callAIService(message: string): Promise<AIResponse> {
    const appStore = useAppStore()
    const business = appStore.currentBusiness
    const lowerMessage = message.toLowerCase()

    return new Promise((resolve) => {
      setTimeout(() => {
        let response = ''
        let suggestedContentIds: string[] = []
        let intent = 'general_inquiry'
        let confidence = 0.7

        // Search static knowledge base
        if (business?.knowledgeBase) {
          console.log(`Searching static knowledge for message: "${message}"`)
          const searchTerms = lowerMessage.split(' ')

          const knowledgeMatches = business.knowledgeBase.filter(item => {
            const searchableText = [item.question, item.answer, ...item.tags].join(' ').toLowerCase()
            return searchTerms.some(term => searchableText.includes(term))
          }).sort((a, b) => b.priority - a.priority)

          if (knowledgeMatches.length > 0) {
            const bestMatch = knowledgeMatches[0]
            response = bestMatch.answer
            intent = 'knowledge_base'
            confidence = 0.9
            suggestedContentIds = bestMatch.contentIds || []
            console.log(`Using static knowledge base response from: ${bestMatch.id}`)
          }
        }

        // Fallback to pattern-based responses if no knowledge found
        if (!response) {
          console.log(`No knowledge base response found, using pattern-based responses`)
          if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            response = business?.description || 'I\'d be happy to tell you about our services! Let me pull up our company information.'
            intent = 'services_inquiry'
            suggestedContentIds = ['company-brochure']

          } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            response = 'Let me show you our pricing information.'
            intent = 'pricing_inquiry'
            suggestedContentIds = ['pricing-guide']

          } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
            response = 'I can help you get in touch with us.'
            intent = 'contact_inquiry'
            suggestedContentIds = ['contact-form']

          } else if (lowerMessage.includes('demo') || lowerMessage.includes('show') || lowerMessage.includes('see')) {
            response = 'I can show you a demonstration of our technology!'
            intent = 'demo_inquiry'
            suggestedContentIds = ['product-demo']
            confidence = 0.8

          } else {
            // Generic response with business context
            const businessName = business?.name || 'our company'
            response = `I'm here to help you learn about ${businessName}! You can ask me about our services, pricing, or how to get in touch with us.`
            intent = 'general_help'
            confidence = 0.5
          }
        }

        // Convert content IDs to actual ContentItem objects
        const suggestedContent = business?.content.filter(item =>
          suggestedContentIds.includes(item.id)
        ) || []

        console.log(`Final AI response:`, {
          message: response,
          suggestedContent,
          intent,
          confidence
        })

        resolve({
          message: response,
          suggestedContent,
          intent,
          confidence
        })
      }, 500 + Math.random() * 800)
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