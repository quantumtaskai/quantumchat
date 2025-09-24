<template>
  <div class="booking-widget h-full flex flex-col glass-morphism">
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-lg mx-auto">
        <div class="text-center mb-6">
          <div class="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center animate-float">
            <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2 modern-typography">{{ content.title }}</h2>
          <p class="text-gray-600">{{ content.description }}</p>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center justify-center mb-6">
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                   :class="currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'">
                1
              </div>
              <span class="ml-2 text-sm" :class="currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'">Service</span>
            </div>
            <div class="w-8 h-0.5" :class="currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200'"></div>
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                   :class="currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'">
                2
              </div>
              <span class="ml-2 text-sm" :class="currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'">Date & Time</span>
            </div>
            <div class="w-8 h-0.5" :class="currentStep >= 3 ? 'bg-primary-500' : 'bg-gray-200'"></div>
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                   :class="currentStep >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'">
                3
              </div>
              <span class="ml-2 text-sm" :class="currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'">Contact</span>
            </div>
          </div>
        </div>

        <!-- Step 1: Service Selection -->
        <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <div class="grid gap-3">
              <button
                v-for="service in services"
                :key="service.id"
                @click="selectService(service)"
                class="p-4 text-left glass-morphism rounded-lg hover:bg-white/90 transition-all duration-200 hover-lift"
                :class="selectedService?.id === service.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
                    <p class="text-sm text-gray-600">{{ service.duration }} minutes</p>
                    <p class="text-sm text-primary-600 font-medium">${{ service.price }}</p>
                  </div>
                  <div v-if="selectedService?.id === service.id" class="text-primary-500">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <button
            @click="nextStep"
            :disabled="!selectedService"
            class="w-full btn-primary"
          >
            Continue to Date & Time
          </button>
        </div>

        <!-- Step 2: Calendar Selection -->
        <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
          <CalendarPicker
            :enable-time="true"
            :min-date="minDate"
            :max-date="maxDate"
            :business-hours="businessHours"
            @date-select="selectDateTime"
            @cancel="prevStep"
          />
        </div>

        <!-- Step 3: Contact Information -->
        <div v-if="currentStep === 3" class="space-y-4 animate-fade-in">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                v-model="contactInfo.name"
                type="text"
                required
                class="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                v-model="contactInfo.email"
                type="email"
                required
                class="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                v-model="contactInfo.phone"
                type="tel"
                class="input-field"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                v-model="contactInfo.notes"
                rows="3"
                class="input-field resize-none"
                placeholder="Any special requirements or questions?"
              ></textarea>
            </div>
          </div>

          <!-- Booking Summary -->
          <div v-if="selectedService && selectedDateTime" class="glass-morphism p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Appointment Summary</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Service:</span>
                <span class="font-medium">{{ selectedService.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Duration:</span>
                <span class="font-medium">{{ selectedService.duration }} minutes</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date & Time:</span>
                <span class="font-medium">{{ formatDateTime(selectedDateTime) }}</span>
              </div>
              <div v-if="selectedService.price > 0" class="flex justify-between">
                <span class="text-gray-600">Price:</span>
                <span class="font-medium text-primary-600">${{ selectedService.price }}</span>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="prevStep"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 glass-morphism hover:bg-white/90 transition-all duration-200"
            >
              Back
            </button>
            <button
              @click="bookAppointment"
              :disabled="!canBook || isBooking"
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isBooking">Booking...</span>
              <span v-else>Book Appointment</span>
            </button>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mt-4 p-4 glass-morphism rounded-lg border-2 border-green-200 animate-fade-in">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <div>
              <p class="text-green-800 font-medium">Appointment Booked Successfully!</p>
              <p class="text-green-700 text-sm">We'll send you a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContentItem, BusinessConfig } from '@/types'
import CalendarPicker from '@/components/ui/CalendarPicker.vue'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

interface Props {
  content: ContentItem
  business: BusinessConfig
}

const props = defineProps<Props>()

// State
const currentStep = ref(1)
const selectedService = ref<Service | null>(null)
const selectedDateTime = ref<Date | null>(null)
const isBooking = ref(false)
const showSuccess = ref(false)

const contactInfo = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

// Services data
const services = computed((): Service[] => {
  return props.content.data?.services || [
    {
      id: 'consultation',
      name: 'AI Strategy Consultation',
      duration: 60,
      price: 150,
      description: 'Discuss your AI implementation strategy'
    },
    {
      id: 'demo',
      name: 'Product Demo',
      duration: 30,
      price: 0,
      description: 'See our quantum computing solutions in action'
    },
    {
      id: 'technical',
      name: 'Technical Deep Dive',
      duration: 90,
      price: 250,
      description: 'In-depth technical discussion with our engineers'
    },
    {
      id: 'training',
      name: 'Team Training Session',
      duration: 120,
      price: 500,
      description: 'Comprehensive training for your team'
    }
  ]
})

// Calendar configuration
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
})

const maxDate = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60) // 60 days from now
  return maxDate
})

const businessHours = computed(() => ({
  start: 9,
  end: 17,
  availableDays: [1, 2, 3, 4, 5] // Monday to Friday
}))

const canBook = computed(() => {
  return selectedService.value &&
         selectedDateTime.value &&
         contactInfo.value.name &&
         contactInfo.value.email
})

// Methods
function selectService(service: Service) {
  selectedService.value = service
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function selectDateTime(date: Date) {
  selectedDateTime.value = date
  nextStep()
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

async function bookAppointment() {
  if (!canBook.value) return

  isBooking.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    showSuccess.value = true

    // Reset form after success
    setTimeout(() => {
      currentStep.value = 1
      selectedService.value = null
      selectedDateTime.value = null
      showSuccess.value = false
      contactInfo.value = {
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
    }, 3000)

  } catch (error) {
    console.error('Booking failed:', error)
  } finally {
    isBooking.value = false
  }
}
</script>