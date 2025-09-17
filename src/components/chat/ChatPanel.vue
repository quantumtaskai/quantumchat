<template>
  <div class="chat-panel flex flex-col h-full bg-gray-50">
    <!-- Messages Area -->
    <div 
      ref="messagesContainer"
      class="messages-area flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
    >
      <TransitionGroup name="message" tag="div">
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          class="message-wrapper"
        >
          <MessageBubble :message="message" :business="business" />
        </div>
      </TransitionGroup>
      
      <!-- Typing Indicator -->
      <div v-if="chatStore.isTyping" class="flex justify-start">
        <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-xs shadow-sm">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.09 0 2.14-.18 3.12-.5l5.88 1.92-1.92-5.88c.32-.98.5-2.03.5-3.12 0-5.52-4.48-10-10-10z"/>
              </svg>
            </div>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <div v-if="showQuickActions" class="quick-actions px-4 py-2">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="action in quickActions"
          :key="action.id"
          @click="sendQuickAction(action.message)"
          class="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area bg-white border-t border-gray-200 p-4">
      <!-- Voice Status -->
      <div v-if="chatStore.isListening" class="mb-3">
        <div class="flex items-center justify-center space-x-2 text-sm text-blue-600">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listening... Speak now</span>
        </div>
      </div>

      <!-- Input Row -->
      <div class="flex items-end space-x-3">
        <!-- Voice Button -->
        <button
          @click="toggleVoiceInput"
          :disabled="!voiceSupported"
          class="flex-shrink-0 p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="voiceButtonClasses"
          :title="voiceButtonTitle"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path v-if="!chatStore.isListening" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path v-if="!chatStore.isListening" d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <path v-if="!chatStore.isListening" d="M12 19v3"/>
            <path v-if="!chatStore.isListening" d="M8 23h8"/>
            <path v-if="chatStore.isListening" d="M6 6h12v12H6z"/>
          </svg>
        </button>

        <!-- Text Input -->
        <div class="flex-1 relative">
          <textarea
            ref="textInput"
            v-model="inputMessage"
            @keydown="handleKeyDown"
            @input="handleInput"
            placeholder="Type your message or use the microphone..."
            rows="1"
            class="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'pr-12': inputMessage.trim() }"
            :disabled="chatStore.isTyping"
          ></textarea>
          
          <!-- Character Count -->
          <div 
            v-if="inputMessage.length > 200"
            class="absolute bottom-1 right-3 text-xs text-gray-400"
          >
            {{ inputMessage.length }}/500
          </div>
        </div>

        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!canSend"
          class="flex-shrink-0 p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="sendButtonClasses"
          title="Send message"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <!-- Status Text -->
      <div class="mt-2 text-xs text-gray-500 text-center">
        {{ statusText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useVoice } from '@/composables/useVoice'
import type { BusinessConfig } from '@/types'
import MessageBubble from './MessageBubble.vue'

interface Props {
  business: BusinessConfig
}

const props = defineProps<Props>()

const chatStore = useChatStore()
const { 
  isSupported: voiceSupported, 
  isListening, 
  startListening, 
  stopListening,
  speak
} = useVoice()

// Refs
const messagesContainer = ref<HTMLElement>()
const textInput = ref<HTMLTextAreaElement>()

// State
const inputMessage = ref('')
const showQuickActions = ref(true)

// Quick action suggestions
const quickActions = computed(() => [
  { id: 'services', label: 'What services do you offer?', message: 'What services do you offer?' },
  { id: 'pricing', label: 'Pricing information', message: 'Can you show me your pricing?' },
  { id: 'contact', label: 'How to contact you', message: 'How can I get in touch?' },
  { id: 'demo', label: 'Request demo', message: 'Can I see a demo?' },
])

// Computed properties
const canSend = computed(() => {
  return inputMessage.value.trim().length > 0 && 
         inputMessage.value.length <= 500 && 
         !chatStore.isTyping
})

const voiceButtonClasses = computed(() => ({
  'bg-red-500 text-white shadow-lg': chatStore.isListening,
  'bg-blue-500 text-white hover:bg-blue-600': !chatStore.isListening && voiceSupported.value,
  'bg-gray-300 text-gray-500 cursor-not-allowed': !voiceSupported.value,
  'animate-pulse': chatStore.isListening
}))

const sendButtonClasses = computed(() => ({
  'bg-blue-500 text-white hover:bg-blue-600': canSend.value,
  'bg-gray-300 text-gray-500 cursor-not-allowed': !canSend.value
}))

const voiceButtonTitle = computed(() => {
  if (!voiceSupported.value) return 'Voice input not supported'
  return chatStore.isListening ? 'Stop listening' : 'Start voice input'
})

const statusText = computed(() => {
  if (chatStore.isTyping) return 'AI is typing...'
  if (chatStore.isListening) return 'Listening for your voice...'
  if (!voiceSupported.value) return 'Voice input not available in this browser'
  return `Powered by ${props.business.name} AI Assistant`
})

// Methods
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function handleInput() {
  autoResizeTextarea()
  hideQuickActionsAfterTyping()
}

function autoResizeTextarea() {
  if (textInput.value) {
    textInput.value.style.height = 'auto'
    textInput.value.style.height = Math.min(textInput.value.scrollHeight, 120) + 'px'
  }
}

function hideQuickActionsAfterTyping() {
  if (inputMessage.value.trim().length > 0) {
    showQuickActions.value = false
  } else if (chatStore.messages.length <= 1) {
    showQuickActions.value = true
  }
}

async function sendMessage() {
  if (!canSend.value) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''
  autoResizeTextarea()
  
  await chatStore.sendMessage(message)
  
  // Speak the AI response if voice is enabled
  if (props.business.settings.enableVoice) {
    const lastMessage = chatStore.lastMessage
    if (lastMessage && lastMessage.role === 'assistant') {
      speak(lastMessage.content)
    }
  }
  
  scrollToBottom()
}

function sendQuickAction(message: string) {
  inputMessage.value = message
  sendMessage()
  showQuickActions.value = false
}

async function toggleVoiceInput() {
  if (!voiceSupported.value) return

  if (chatStore.isListening) {
    stopListening()
  } else {
    try {
      const transcript = await startListening()
      if (transcript) {
        inputMessage.value = transcript
        autoResizeTextarea()
        // Auto-send after voice input
        setTimeout(() => {
          if (inputMessage.value.trim()) {
            sendMessage()
          }
        }, 500)
      }
    } catch (error) {
      console.error('Voice input error:', error)
    }
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

// Sync listening state
watch(isListening, (newValue) => {
  chatStore.setListening(newValue)
})

onMounted(() => {
  scrollToBottom()
  
  // Focus input after mount
  nextTick(() => {
    textInput.value?.focus()
  })
})

onUnmounted(() => {
  if (chatStore.isListening) {
    stopListening()
  }
})
</script>

<style scoped>
/* Message animations */
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-move {
  transition: transform 0.3s ease;
}

/* Textarea auto-resize */
textarea {
  min-height: 48px;
  max-height: 120px;
  overflow-y: auto;
}

/* Custom scrollbar for messages */
.messages-area {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Quick actions fade in */
.quick-actions {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>