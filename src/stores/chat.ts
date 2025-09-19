import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatState, AIResponse } from '@/types'
import { useKnowledgeStore } from '@/stores/knowledge'
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
    const knowledgeStore = useKnowledgeStore()
    const appStore = useAppStore()
    const business = appStore.currentBusiness
    const lowerMessage = message.toLowerCase()

    return new Promise((resolve) => {
      setTimeout(() => {
        let response = ''
        let suggestedContent: string[] = []
        let intent = 'general_inquiry'
        let confidence = 0.7

        // Search knowledge base
        if (business) {
          console.log(`Searching knowledge for message: "${message}"`)
          const knowledgeResults = knowledgeStore.searchKnowledge(message)
          console.log(`Knowledge search results:`, knowledgeResults)

          if (knowledgeResults.length > 0) {
            const bestMatch = knowledgeResults[0]

            // Use scraped website content for response
            if (bestMatch.isFromWebsite && bestMatch.scrapedContent?.length > 0) {
              const scrapedInfo = bestMatch.scrapedContent[0]

              // Extract relevant information from scraped content
              const contentSnippet = scrapedInfo.content.substring(0, 300) + '...'

              response = `Based on our current website information: ${contentSnippet}`
              intent = 'website_knowledge'
              confidence = 0.95

              console.log(`Using scraped content for response: ${scrapedInfo.contentType}`)
            } else {
              // Fallback to regular knowledge base
              response = bestMatch.answer
              intent = 'knowledge_base'
              confidence = 0.8

              // Suggest content from knowledge base if available
              if (bestMatch.contentIds && bestMatch.contentIds.length > 0) {
                suggestedContent = bestMatch.contentIds
              }
            }
          }
        }

        // Fallback to pattern-based responses if no knowledge found
        if (!response) {
          console.log(`No knowledge base response found, using pattern-based responses for: "${lowerMessage}"`)
          if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            response = business?.description || 'I\'d be happy to tell you about our services! Let me pull up our company information.'
            intent = 'services_inquiry'
            suggestedContent = [] // Don't suggest content that might not exist
            
            // Try to get scraped services content
            if (business) {
              const servicesContent = knowledgeStore.getContentByType('services')
              if (servicesContent.length > 0) {
                const serviceInfo = servicesContent[0].content.substring(0, 200) + '...'
                response = `Here are our current services: ${serviceInfo}`
                confidence = 0.9
              }
            }
            
          } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            response = 'Let me check our current pricing for you.'
            intent = 'pricing_inquiry'
            suggestedContent = [] // Don't suggest content that might not exist
            
            // Try to get scraped pricing content
            if (business) {
              const pricingContent = knowledgeStore.getContentByType('pricing')
              if (pricingContent.length > 0) {
                const pricingInfo = pricingContent[0].content.substring(0, 200) + '...'
                response = `Here's our current pricing information: ${pricingInfo}`
                confidence = 0.9
              }
            }
            
          } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
            response = 'Let me get our current hours for you.'
            intent = 'hours_inquiry'
            
            // Try to get scraped hours content
            if (business) {
              const hoursContent = knowledgeStore.getContentByType('hours')
              if (hoursContent.length > 0) {
                const hoursInfo = hoursContent[0].content.substring(0, 200)
                response = `Our current hours: ${hoursInfo}`
                confidence = 0.9
              } else if (business.settings.operatingHours?.enabled) {
                // Fallback to configured hours
                response = 'We\'re open Monday through Friday, 9 AM to 5 PM. Please check our website for the most current hours.'
                confidence = 0.7
              }
            }
            
          } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
            response = 'I can help you get in touch with us.'
            intent = 'contact_inquiry'
            
            // Try to get scraped contact content
            if (business) {
              const contactContent = knowledgeStore.getContentByType('contact')
              if (contactContent.length > 0) {
                const contactInfo = contactContent[0].content.substring(0, 200)
                response = `Here's how to reach us: ${contactInfo}`
                confidence = 0.9
              }
            }
            
          } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
            response = 'Let me get our location information for you.'
            intent = 'location_inquiry'
            
            // Try to get scraped contact/location content
            if (business) {
              const locationContent = knowledgeStore.getContentByType('contact')
              if (locationContent.length > 0) {
                response = `Here's our location: ${locationContent[0].content.substring(0, 150)}`
                confidence = 0.9
              }
            }
            
          } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
            response = 'I can help you with scheduling an appointment.'
            intent = 'appointment_inquiry'
            
            // Try to get scraped appointment content
            if (business) {
              const appointmentContent = knowledgeStore.getContentByType('appointments')
              if (appointmentContent.length > 0) {
                response = `Here's information about appointments: ${appointmentContent[0].content.substring(0, 200)}`
                confidence = 0.9
              }
            }
            
          } else {
            // Generic response with business context
            const businessName = business?.name || 'our company'
            response = `I'm here to help you learn about ${businessName}! You can ask me about our services, pricing, hours, location, or how to get in touch with us.`
            intent = 'general_help'
            confidence = 0.5
          }
        }

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
      }, 500 + Math.random() * 800) // Simulate processing time
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