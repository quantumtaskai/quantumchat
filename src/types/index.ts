// Message types
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  contentType?: string
  attachments?: ContentItem[]
}

// Content types
export interface ContentItem {
  id: string
  type: 'pdf' | 'video' | 'image' | 'form' | 'calculator' | 'booking'
  title: string
  description?: string
  url?: string
  data?: any
  tags: string[]
  category: string
}

// Business configuration
export interface BusinessConfig {
  id: string
  name: string
  description: string
  industry: string
  branding: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    font?: string
  }
  content: ContentItem[]
  knowledgeBase: KnowledgeItem[]
  settings: {
    welcomeMessage: string
    aiPersonality: string
    enableVoice: boolean
    enableLeadCapture: boolean
    operatingHours?: {
      enabled: boolean
      timezone: string
      hours: { [key: string]: { open: string; close: string } }
    }
  }
}

// Knowledge base
export interface KnowledgeItem {
  id: string
  question: string
  answer: string
  tags: string[]
  contentIds?: string[]
  priority: number
}

// User interaction types
export interface UserInteraction {
  sessionId: string
  messages: Message[]
  contentViewed: string[]
  leadData?: LeadData
  timestamp: Date
  businessId: string
}

// Lead capture
export interface LeadData {
  name?: string
  email?: string
  phone?: string
  company?: string
  interest?: string
  notes?: string
  status: 'new' | 'qualified' | 'contacted' | 'converted'
}

// Chat state
export interface ChatState {
  messages: Message[]
  isTyping: boolean
  isListening: boolean
  currentContent: ContentItem | null
  sessionId: string
}

// Content display state
export interface ContentState {
  currentItem: ContentItem | null
  history: ContentItem[]
  isLoading: boolean
}

// AI response with content suggestion
export interface AIResponse {
  message: string
  suggestedContent?: ContentItem[]
  intent?: string
  confidence?: number
  followUpQuestions?: string[]
}

// Analytics events
export interface AnalyticsEvent {
  type: 'message_sent' | 'content_viewed' | 'lead_captured' | 'session_started' | 'session_ended'
  data: any
  timestamp: Date
  sessionId: string
  businessId: string
}

// Voice synthesis options
export interface VoiceOptions {
  rate: number
  pitch: number
  volume: number
  voice?: SpeechSynthesisVoice
}

// Application state
export interface AppState {
  isMinimized: boolean
  currentBusiness: BusinessConfig | null
  isLoading: boolean
  error: string | null
}