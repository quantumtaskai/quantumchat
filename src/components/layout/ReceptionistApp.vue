<template>
  <div class="receptionist-app h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <div 
      class="header flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm"
      :style="{ backgroundColor: business.branding.primaryColor }"
    >
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.09 0 2.14-.18 3.12-.5l5.88 1.92-1.92-5.88c.32-.98.5-2.03.5-3.12 0-5.52-4.48-10-10-10z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-semibold text-white">{{ business.name }}</h1>
          <p class="text-sm text-white/80">AI Assistant</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Minimize Button -->
        <button
          @click="appStore.toggleMinimized()"
          class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Minimize"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        
        <!-- Close Button -->
        <button
          @click="closeReceptionist"
          class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Close"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Content Panel (Left) -->
      <div 
        class="content-panel bg-white border-r border-gray-200 transition-all duration-300 ease-in-out custom-scrollbar overflow-y-auto"
        :class="contentPanelClasses"
        :style="contentPanelStyle"
      >
        <ContentPanel :business="business" />
      </div>

      <!-- Resize Handle -->
      <div 
        v-if="!isMobile"
        class="resize-handle w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors"
        @mousedown="startResize"
      ></div>

      <!-- Chat Panel (Right) -->
      <div 
        class="chat-panel flex-1 flex flex-col bg-gray-50 min-w-0"
        :class="chatPanelClasses"
      >
        <ChatPanel :business="business" />
      </div>
    </div>

    <!-- Mobile Toggle Buttons -->
    <div v-if="isMobile" class="mobile-toggle-bar flex bg-white border-t border-gray-200">
      <button
        @click="showChatOnMobile = true"
        class="flex-1 py-3 text-center font-medium transition-colors"
        :class="showChatOnMobile ? 'text-blue-600 bg-blue-50' : 'text-gray-600'"
      >
        <svg class="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.09 0 2.14-.18 3.12-.5l5.88 1.92-1.92-5.88c.32-.98.5-2.03.5-3.12 0-5.52-4.48-10-10-10z"/>
        </svg>
        Chat
      </button>
      <button
        @click="showChatOnMobile = false"
        class="flex-1 py-3 text-center font-medium transition-colors"
        :class="!showChatOnMobile ? 'text-blue-600 bg-blue-50' : 'text-gray-600'"
      >
        <svg class="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Content
      </button>
    </div>

    <!-- Minimized State -->
    <Transition name="slide-up">
      <div v-if="appStore.isMinimized" class="minimized-bar bg-white border-t border-gray-200 p-4">
        <button
          @click="appStore.toggleMinimized()"
          class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.09 0 2.14-.18 3.12-.5l5.88 1.92-1.92-5.88c.32-.98.5-2.03.5-3.12 0-5.52-4.48-10-10-10z"/>
          </svg>
          <span>{{ business.name }} Assistant</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useChatStore } from '@/stores/chat'
import { useContentStore } from '@/stores/content'
import type { BusinessConfig } from '@/types'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import ContentPanel from '@/components/content/ContentPanel.vue'

interface Props {
  business: BusinessConfig
}

const props = defineProps<Props>()

const appStore = useAppStore()
const chatStore = useChatStore()
const contentStore = useContentStore()

// Responsive state
const isMobile = ref(false)
const showChatOnMobile = ref(true)

// Panel sizing - 70% for content, 30% for chat
const contentPanelWidth = ref(0) // Will be calculated based on window size
const isResizing = ref(false)

// Computed classes for panels
const contentPanelClasses = computed(() => {
  if (isMobile.value) {
    return {
      'absolute inset-0 z-10': !showChatOnMobile.value,
      'hidden': showChatOnMobile.value
    }
  }
  
  return {}
})

const contentPanelStyle = computed(() => {
  if (isMobile.value) {
    return {}
  }
  
  return {
    width: `${contentPanelWidth.value}px`
  }
})

const chatPanelClasses = computed(() => {
  if (isMobile.value) {
    return {
      'absolute inset-0 z-10': showChatOnMobile.value,
      'hidden': !showChatOnMobile.value
    }
  }
  
  return {}
})

// Resize functionality
function startResize(event: MouseEvent) {
  isResizing.value = true
  const startX = event.clientX
  const startWidth = contentPanelWidth.value

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing.value) return
    
    const diff = e.clientX - startX
    const newWidth = Math.max(300, Math.min(600, startWidth + diff))
    contentPanelWidth.value = newWidth
  }

  function handleMouseUp() {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Check if mobile
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

function handleResize() {
  checkMobile()
  // Update content panel width to maintain 70% ratio with min/max bounds
  if (!isMobile.value) {
    const targetWidth = window.innerWidth * 0.7
    contentPanelWidth.value = Math.min(1000, Math.max(400, targetWidth))
  }
}

function closeReceptionist() {
  // For embedded version, this would close the widget
  // For standalone, this could redirect or show a close message
  window.parent?.postMessage({ type: 'quantum-chat', action: 'widget-closed' }, '*')
}

onMounted(() => {
  checkMobile()
  handleResize() // Initialize panel width
  window.addEventListener('resize', handleResize)
  
  // Initialize welcome message
  chatStore.addWelcomeMessage(props.business.settings.welcomeMessage)
  
  // Setup content suggestion listener
  contentStore.setupContentSuggestionListener()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.receptionist-app {
  max-height: 100vh;
}

.resize-handle {
  user-select: none;
}

.resize-handle:hover {
  background-color: #3b82f6;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .content-panel,
  .chat-panel {
    width: 100% !important;
  }
}

/* Panel transitions */
.content-panel {
  transition: width 0.3s ease-in-out;
}

/* Minimized state animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>