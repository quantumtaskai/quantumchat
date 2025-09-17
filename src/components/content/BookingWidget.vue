<template>
  <div class="booking-widget h-full flex flex-col bg-white">
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-6">
          <div class="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ content.title }}</h2>
          <p class="text-gray-600">{{ content.description }}</p>
        </div>

        <div class="space-y-4">
          <!-- Service Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Select Service
            </label>
            <select v-model="selectedService" class="input-field">
              <option value="">Choose a service</option>
              <option v-for="service in services" :key="service" :value="service">
                {{ service }}
              </option>
            </select>
          </div>

          <!-- Date Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date
            </label>
            <input
              v-model="selectedDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="input-field"
            />
          </div>

          <!-- Time Selection -->
          <div v-if="selectedDate">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Available Times
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="time in availableTimes"
                :key="time"
                @click="selectedTime = time"
                class="p-2 text-sm border rounded-lg transition-colors"
                :class="selectedTime === time 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'"
              >
                {{ time }}
              </button>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-3">
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
          <div v-if="selectedService && selectedDate && selectedTime" class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">Booking Summary</h3>
            <div class="text-sm space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-600">Service:</span>
                <span class="font-medium">{{ selectedService }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">{{ formatDate(selectedDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Time:</span>
                <span class="font-medium">{{ selectedTime }}</span>
              </div>
            </div>
          </div>

          <button
            @click="bookAppointment"
            :disabled="!canBook || isBooking"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isBooking">Booking Appointment...</span>
            <span v-else>Book Appointment</span>
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <div>
              <p class="text-green-800 font-medium">Appointment Booked!</p>
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

interface Props {
  content: ContentItem
  business: BusinessConfig
}

const props = defineProps<Props>()

const selectedService = ref('')
const selectedDate = ref('')
const selectedTime = ref('')
const isBooking = ref(false)
const showSuccess = ref(false)

const contactInfo = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

const services = computed(() => {
  return props.content.data?.services || [
    'General Consultation',
    'Technical Support',
    'Product Demo',
    'Training Session'
  ]
})

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60) // 60 days from now
  return maxDate.toISOString().split('T')[0]
})

const availableTimes = computed(() => {
  // Generate available time slots (9 AM to 5 PM)
  const times = []
  for (let hour = 9; hour < 17; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`)
    times.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return times
})

const canBook = computed(() => {
  return selectedService.value && 
         selectedDate.value && 
         selectedTime.value && 
         contactInfo.value.name && 
         contactInfo.value.email
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function bookAppointment() {
  if (!canBook.value) return

  isBooking.value = true

  try {
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 1500))

    const bookingData = {
      service: selectedService.value,
      date: selectedDate.value,
      time: selectedTime.value,
      contact: contactInfo.value,
      business: props.business.id
    }

    // Track booking event
    window.dispatchEvent(new CustomEvent('analytics-event', {
      detail: {
        type: 'appointment_booked',
        data: bookingData
      }
    }))

    showSuccess.value = true

    // Reset form after success
    setTimeout(() => {
      selectedService.value = ''
      selectedDate.value = ''
      selectedTime.value = ''
      contactInfo.value = {
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Booking error:', error)
  } finally {
    isBooking.value = false
  }
}
</script>