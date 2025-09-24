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

  // Actions
  async function initialize() {
    isLoading.value = true
    error.value = null

    try {
      // Load business configuration
      await loadBusinessConfig()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize application'
      console.error('App initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadBusinessConfig() {
    try {
      let business = null

      // Try to load from external API first (if configured)
      const apiUrl = (import.meta as any).env?.VITE_API_URL
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/business`)
          if (response.ok) {
            business = await response.json()
          }
        } catch (apiErr) {
          console.warn('Failed to load from API, falling back to static data:', apiErr)
        }
      }

      // Fallback to static data if API not available or failed
      if (!business) {
        const businessData = await import('@/data/business.json')
        business = businessData.default
      }

      if (!business) {
        throw new Error('Business configuration not found')
      }

      currentBusiness.value = business
    } catch (err) {
      throw new Error(`Failed to load business configuration: ${err instanceof Error ? err.message : 'Unknown error'}`)
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


  function toggleMinimized() {
    isMinimized.value = !isMinimized.value
  }

  function setError(message: string) {
    error.value = message
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

    // Actions
    initialize,
    loadBusinessConfig,
    toggleMinimized,
    setError,
    clearError
  }
})