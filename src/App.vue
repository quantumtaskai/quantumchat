<template>
  <div id="app" class="font-sans antialiased bg-transparent">
    <!-- Widget Mode -->
    <WidgetApp v-if="isWidgetMode" />

    <!-- Main Receptionist Interface -->
    <ReceptionistApp
      v-else-if="!appStore.isLoading && appStore.currentBusiness"
      :business="appStore.currentBusiness"
    />

    <!-- Loading State -->
    <div v-else-if="appStore.isLoading" class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Loading AI Receptionist...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="appStore.error" class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="text-center max-w-md">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p class="text-gray-600 mb-4">{{ appStore.error }}</p>
        <button
          @click="appStore.initialize()"
          class="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- No Business Configuration -->
    <div v-else class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="text-center max-w-md">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Business Not Found</h2>
        <p class="text-gray-600">Please check the URL or contact support.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import ReceptionistApp from '@/components/layout/ReceptionistApp.vue'
import WidgetApp from '@/components/widget/WidgetApp.vue'

const appStore = useAppStore()

// Check if we're in widget mode based on URL path
const isWidgetMode = computed(() => {
  return window.location.pathname === '/widget' || window.location.pathname.startsWith('/widget/')
})

onMounted(() => {
  // Only initialize app store for main app, not widget mode
  if (!isWidgetMode.value) {
    appStore.initialize()
  }
})
</script>

<style>
.loading-spinner {
  border: 2px solid #f3f4f6;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>