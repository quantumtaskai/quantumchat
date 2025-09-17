import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BusinessConfig, AppState } from '@/types'

export const useAppStore = defineStore('app', () => {
  // State
  const isMinimized = ref(false)
  const currentBusiness = ref<BusinessConfig | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const appState = computed<AppState>(() => ({
    isMinimized: isMinimized.value,
    currentBusiness: currentBusiness.value,
    isLoading: isLoading.value,
    error: error.value
  }))

  const businessId = computed(() => {
    // Extract business ID from URL path
    const path = window.location.pathname
    const match = path.match(/\/([^\/]+)$/)
    return match ? match[1] : 'demo'
  })

  // Actions
  async function initialize() {
    isLoading.value = true
    error.value = null
    
    try {
      // Load business configuration
      await loadBusinessConfig(businessId.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize application'
      console.error('App initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadBusinessConfig(id: string) {
    try {
      // For now, load from static data
      // In production, this would fetch from an API
      const businessData = await import('@/data/businesses.json')
      const business = businessData.default.find((b: any) => b.id === id)
      
      if (!business) {
        // Load demo business if specific business not found
        currentBusiness.value = businessData.default.find((b: any) => b.id === 'demo') || null
      } else {
        currentBusiness.value = business
      }
      
      if (!currentBusiness.value) {
        throw new Error(`Business configuration not found for ID: ${id}`)
      }
    } catch (err) {
      throw new Error('Failed to load business configuration')
    }
  }

  function toggleMinimized() {
    isMinimized.value = !isMinimized.value
  }

  function setError(errorMessage: string) {
    error.value = errorMessage
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    isMinimized,
    currentBusiness,
    isLoading,
    error,
    
    // Getters
    appState,
    businessId,
    
    // Actions
    initialize,
    loadBusinessConfig,
    toggleMinimized,
    setError,
    clearError
  }
})