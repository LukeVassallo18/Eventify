<template>
  <div class="py-12 px-6 md:px-20 bg-gray-100" id="upcoming-events">
    <h2 class="text-3xl font-bold text-gray-800 mb-10 text-center">Upcoming Events</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="event in events"
        :key="event.id"
        class="rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 bg-white border border-gray-200"
      >
        <div class="p-6">
          <h3 class="text-xl font-semibold text-indigo-600 mb-1">{{ event.title }}</h3>
          <p class="text-sm text-gray-500">{{ event.date }}</p>
          <p class="text-gray-600 mt-2 text-sm leading-relaxed">{{ event.description }}</p>
          <button
            @click="openModal(event)"
            class="mt-4 bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0  flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button @click="closeModal" class="absolute top-3 right-4 text-gray-400 hover:text-black text-xl">
          &times;
        </button>
        <h3 class="text-xl font-bold text-indigo-600 mb-2">{{ selectedEvent?.title }}</h3>
        <p class="text-sm text-gray-500">{{ selectedEvent?.date }}</p>
        <p class="text-gray-700 mt-2 text-sm">{{ selectedEvent?.description }}</p>

        <div v-if="filteredGuests.length > 0" class="mt-4">
          <h4 class="font-semibold">Guests Attending:</h4>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-2">
            <li v-for="(guest, index) in filteredGuests" :key="index">{{ guest }}</li>
          </ul>
        </div>


        <button
          @click="rsvp"
          :disabled="hasRSVPed"
          class="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {{ hasRSVPed ? 'Already RSVP’d' : 'RSVP' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import { useUserStore } from '@/stores/user'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/firebase'

// Stores
const eventStore = useEventStore()
const userStore = useUserStore()

// Events
const events = computed(() => eventStore.events)

// Modal state
const showModal = ref(false)
const selectedEvent = ref(null)

// Get logged-in user email from store
const userEmail = computed(() => userStore.email)

// Open modal
const openModal = (event) => {
  selectedEvent.value = { ...event }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  selectedEvent.value = null
}

// Check if user already RSVP'd
const hasRSVPed = computed(() =>
  selectedEvent.value?.guests?.includes(userEmail.value)
)

// RSVP logic
const rsvp = async () => {
  if (!selectedEvent.value || !userEmail.value) {
    alert('You must be logged in to RSVP.')
    return
  }

  const eventRef = doc(db, 'events', selectedEvent.value.id)
  await updateDoc(eventRef, {
    guests: arrayUnion(userEmail.value)
  })

  await eventStore.fetchEvents()

  const updated = eventStore.events.find(e => e.id === selectedEvent.value.id)
  selectedEvent.value = { ...updated }
}

const filteredGuests = computed(() =>
  (selectedEvent.value?.guests || []).filter(
    guest => guest && guest !== 'user@example.com'
  )
)


// Initial fetch
onMounted(() => {
  if (eventStore.events.length === 0) {
    eventStore.fetchEvents()
  }
})
</script>
