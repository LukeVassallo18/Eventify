<template>
  <div>
    <Navbar />
    
    <section class="min-h-screen bg-gray-100 py-12 px-6 md:px-20">
      <h1 class="text-4xl font-bold text-gray-800 mb-12 text-center">All Events</h1>

      <!-- Events Grid -->
      <div class="max-w-7xl mx-auto">
        <div v-if="events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div
            v-for="event in events"
            :key="event.id"
            class="rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 bg-white border border-gray-200"
          >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-indigo-600 mb-1">{{ event.title }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ formatDate(event.date) }}</p>
              <p class="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3">{{ event.description }}</p>
              <div class="mt-4 flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ event.guests?.length || 0 }} attending</span>
                <button
                  @click="openModal(event)"
                  class="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Events Message -->
        <div v-else class="text-center py-20">
          <p class="text-xl text-gray-500">No events found. Check back later!</p>
        </div>
      </div>

      <!-- Modal -->
      <transition name="fade-slide">
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div class="bg-white p-8 rounded-lg w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              @click="closeModal" 
              class="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>

            <h3 class="text-2xl font-bold text-indigo-600 mb-2">{{ selectedEvent?.title }}</h3>
            <p class="text-sm text-gray-500 mb-4">📅 {{ formatDate(selectedEvent?.date) }}</p>
            <p class="text-gray-700 mb-6">{{ selectedEvent?.description }}</p>

            <!-- Guests Section -->
            <div v-if="filteredGuests.length > 0" class="mb-6 pb-6 border-b">
              <h4 class="font-semibold text-lg mb-3">👥 Guests Attending ({{ filteredGuests.length }})</h4>
              <ul class="space-y-2">
                <li v-for="(guest, index) in filteredGuests" :key="index" class="text-sm text-gray-700">
                  ✓ {{ guest }}
                </li>
              </ul>
            </div>

            <!-- RSVP Button -->
            <button
              @click="rsvp"
              :disabled="hasRSVPed"
              :class="[
                'w-full py-3 rounded-lg font-semibold transition',
                hasRSVPed 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              ]"
            >
              {{ hasRSVPed ? '✓ Already RSVP\'d' : 'RSVP to Event' }}
            </button>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { useEventStore } from '@/stores/eventStore'
import { computed, onMounted, ref } from 'vue'

const eventStore = useEventStore()

// State
const showModal = ref(false)
const selectedEvent = ref(null)
const userEmail = ref(localStorage.getItem('rsvp_email') || '')

// Computed
const events = computed(() => eventStore.events)

const hasRSVPed = computed(() => {
  if (!userEmail.value) return false
  return selectedEvent.value?.guests?.includes(userEmail.value)
})

const filteredGuests = computed(() =>
  (selectedEvent.value?.guests || []).filter(guest => guest && guest !== 'user@example.com')
)

// Methods
const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const openModal = (event) => {
  selectedEvent.value = { ...event }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedEvent.value = null
}

const rsvp = () => {
  if (!selectedEvent.value) return

  let email = userEmail.value
  if (!email) {
    email = prompt('Please enter your email to RSVP:')
    if (!email) return
    userEmail.value = email
    localStorage.setItem('rsvp_email', email)
  }

  const eventIndex = eventStore.events.findIndex(e => e.id === selectedEvent.value.id)
  if (eventIndex !== -1) {
    if (!eventStore.events[eventIndex].guests) {
      eventStore.events[eventIndex].guests = []
    }
    if (!eventStore.events[eventIndex].guests.includes(email)) {
      eventStore.events[eventIndex].guests.push(email)
      const STORAGE_KEY = 'eventify_events'
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventStore.events))
      selectedEvent.value = { ...eventStore.events[eventIndex] }
    }
  }
}

// Lifecycle
onMounted(() => {
  if (eventStore.events.length === 0) {
    eventStore.fetchEvents()
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
