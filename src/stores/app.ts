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
    // Check for business parameter in URL query string first
    const urlParams = new URLSearchParams(window.location.search)
    const businessParam = urlParams.get('business')
    
    if (businessParam) {
      return businessParam
    }
    
    // Fallback to extracting business ID from URL path
    const path = window.location.pathname
    const match = path.match(/\/([^\/]+)$/)
    
    // Use environment variable default or 'demo' as final fallback
    const defaultBusiness = import.meta.env.VITE_DEFAULT_BUSINESS || 'demo'
    return match ? match[1] : defaultBusiness
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
      let business = null
      
      // Try to load from external API first (if configured)
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/businesses/${id}`)
          if (response.ok) {
            business = await response.json()
          }
        } catch (apiErr) {
          console.warn('Failed to load from API, falling back to static data:', apiErr)
        }
      }
      
      // Fallback to static data if API not available or failed
      if (!business) {
        const businessData = await import('@/data/businesses.json')
        business = businessData.default.find((b: any) => b.id === id)
        
        // Load demo business if specific business not found
        if (!business) {
          business = businessData.default.find((b: any) => b.id === 'demo')
        }
      }
      
      if (!business) {
        throw new Error(`Business configuration not found for ID: ${id}`)
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