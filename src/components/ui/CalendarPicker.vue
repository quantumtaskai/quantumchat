<template>
  <div class="calendar-picker glass-morphism rounded-lg shadow-glass">
    <!-- Calendar Header -->
    <div class="calendar-header flex items-center justify-between p-4 border-b border-white/30">
      <button
        @click="navigateMonth('prev')"
        class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 glass-morphism"
        :disabled="!canNavigatePrev"
      >
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div class="flex items-center space-x-2">
        <h3 class="text-lg font-semibold text-gray-900 modern-typography">
          {{ monthName }} {{ currentYear }}
        </h3>
      </div>

      <button
        @click="navigateMonth('next')"
        class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 glass-morphism"
        :disabled="!canNavigateNext"
      >
        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10.59 12L15 16.41 16.41 15 13.83 12.5 16.41 10 15 8.59z"/>
        </svg>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid p-4">
      <!-- Day Names Header -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="dayName in dayNames"
          :key="dayName"
          class="text-center text-sm font-medium text-gray-500 py-2"
        >
          {{ dayName }}
        </div>
      </div>

      <!-- Date Grid -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(calendarDate, index) in monthData.dates"
          :key="index"
          @click="selectDate(calendarDate)"
          :disabled="!calendarDate.enabled"
          class="h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
          :class="getDateClasses(calendarDate)"
        >
          {{ calendarDate.day }}
        </button>
      </div>
    </div>

    <!-- Time Picker (if time selection enabled) -->
    <div v-if="enableTime" class="time-picker p-4 border-t border-white/30">
      <div class="flex items-center justify-center space-x-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Time:</label>
          <select
            v-model="selectedHour"
            class="px-3 py-1 glass-morphism rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option v-for="hour in availableHours" :key="hour" :value="hour">
              {{ hour.toString().padStart(2, '0') }}
            </option>
          </select>
          <span class="text-gray-500">:</span>
          <select
            v-model="selectedMinute"
            class="px-3 py-1 glass-morphism rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option v-for="minute in availableMinutes" :key="minute" :value="minute">
              {{ minute.toString().padStart(2, '0') }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="calendar-actions p-4 border-t border-white/30">
      <div class="flex justify-end space-x-2">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          :disabled="!selectedDate"
          class="btn-primary"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface CalendarDate {
  day: number
  date: Date
  enabled: boolean
  isToday: boolean
  isSelected: boolean
  inCurrentMonth: boolean
}

interface MonthData {
  dates: CalendarDate[]
  month: number
  year: number
}

interface Props {
  enableTime?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  businessHours?: {
    start: number
    end: number
    availableDays: number[] // 0 = Sunday, 1 = Monday, etc.
  }
}

const props = withDefaults(defineProps<Props>(), {
  enableTime: false,
  businessHours: () => ({
    start: 9,
    end: 17,
    availableDays: [1, 2, 3, 4, 5] // Monday to Friday
  })
})

const emit = defineEmits<{
  dateSelect: [date: Date]
  cancel: []
}>()

// State
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedHour = ref(9)
const selectedMinute = ref(0)

// Computed
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthName = computed(() => {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate.value)
})

const dayNames = computed(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

const canNavigatePrev = computed(() => {
  if (!props.minDate) return true
  const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  return firstOfMonth > props.minDate
})

const canNavigateNext = computed(() => {
  if (!props.maxDate) return true
  const lastOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  return lastOfMonth < props.maxDate
})

const availableHours = computed(() => {
  const hours = []
  for (let h = props.businessHours.start; h <= props.businessHours.end; h++) {
    hours.push(h)
  }
  return hours
})

const availableMinutes = computed(() => [0, 15, 30, 45])

const monthData = computed((): MonthData => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const dates: CalendarDate[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const isInCurrentMonth = date.getMonth() === month
    const isToday = date.getTime() === today.getTime()
    const isSelected = selectedDate.value ? date.getTime() === selectedDate.value.getTime() : false

    let enabled = isInCurrentMonth

    // Check business days
    if (enabled && props.businessHours.availableDays.length > 0) {
      enabled = props.businessHours.availableDays.includes(date.getDay())
    }

    // Check min/max dates
    if (enabled && props.minDate) {
      enabled = date >= props.minDate
    }
    if (enabled && props.maxDate) {
      enabled = date <= props.maxDate
    }

    // Check disabled dates
    if (enabled && props.disabledDates) {
      enabled = !props.disabledDates.some(disabled =>
        disabled.getTime() === date.getTime()
      )
    }

    dates.push({
      day: date.getDate(),
      date: new Date(date),
      enabled,
      isToday,
      isSelected,
      inCurrentMonth: isInCurrentMonth
    })
  }

  return { dates, month, year }
})

// Methods
function navigateMonth(direction: 'prev' | 'next') {
  const newDate = new Date(currentDate.value)
  if (direction === 'prev') {
    newDate.setMonth(newDate.getMonth() - 1)
  } else {
    newDate.setMonth(newDate.getMonth() + 1)
  }
  currentDate.value = newDate
}

function selectDate(calendarDate: CalendarDate) {
  if (!calendarDate.enabled) return
  selectedDate.value = calendarDate.date
}

function getDateClasses(calendarDate: CalendarDate) {
  return {
    'bg-primary-500 text-white shadow-glow-sm': calendarDate.isSelected,
    'bg-primary-100 text-primary-700 hover:bg-primary-200': calendarDate.isToday && !calendarDate.isSelected,
    'text-gray-900 hover:bg-white/20': calendarDate.enabled && calendarDate.inCurrentMonth && !calendarDate.isToday && !calendarDate.isSelected,
    'text-gray-400 cursor-not-allowed': !calendarDate.enabled,
    'text-gray-300': !calendarDate.inCurrentMonth,
    'font-bold': calendarDate.isToday
  }
}

function confirmSelection() {
  if (!selectedDate.value) return

  const finalDate = new Date(selectedDate.value)
  if (props.enableTime) {
    finalDate.setHours(selectedHour.value, selectedMinute.value, 0, 0)
  }

  emit('dateSelect', finalDate)
}

// Initialize
onMounted(() => {
  // Set default time to business hours start
  selectedHour.value = props.businessHours.start
})
</script>