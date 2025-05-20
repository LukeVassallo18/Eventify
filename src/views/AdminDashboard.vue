<template>
  <div>
    <Navbar />

    <!-- Confirmation Modal -->
    <transition name="slide-modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{{ selectedEvent?.title }}</strong>?
          </p>
          <div class="flex justify-center space-x-4">
            <button class="px-5 py-2 text-base rounded bg-gray-300 hover:bg-gray-400 transition" @click="cancelDelete">
              Cancel
            </button>
            <button class="px-5 py-2 text-base rounded bg-red-600 text-white hover:bg-red-700 transition" @click="confirmDelete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Guests Modal -->
    <transition name="fade-slide">
      <div v-if="showGuestsModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button
          @click="closeGuestsModal"
          class="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

          <h3 class="text-xl font-bold text-indigo-600 mb-2">Guests Attending</h3>
          <p class="text-sm text-gray-600 mb-4">{{ guestEvent?.title }}</p>

          <div v-if="filteredGuests.length > 0">
            <ul class="space-y-2">
              <li v-for="(guest, index) in filteredGuests" :key="index" class="flex justify-between items-center border-b pb-2">
                <span class="text-sm text-gray-700">{{ guest }}</span>
                <button
                  @click="removeGuest(guest)"
                  class="text-sm px-3 py-1 text-red-600 hover:underline font-medium"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>
          <p v-else class="text-sm text-gray-400">No guests yet.</p>
        </div>
      </div>
    </transition>

    <section class="min-h-screen bg-gray-300 py-10 px-6 text-black">
      <h1 class="text-3xl font-bold text-indigo-600 text-center mb-10">Admin Dashboard</h1>

      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        <!-- Event Form -->
        <div class="bg-white p-6 md:w-1/2 w-full rounded-lg shadow-md">
          <transition name="fade-slide" mode="out-in">
            <form :key="isEditing" @submit.prevent="submitEvent" class="space-y-6">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Event Title</label>
                <input
                  v-model="title"
                  type="text"
                  @blur="titleBlur"
                  :class="['w-full border p-3 rounded-lg transition', titleMeta.touched && titleError ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="titleMeta.touched && titleError" class="text-sm text-red-600 mt-1">{{ titleError }}</p>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Event Date</label>
                <input
                  v-model="date"
                  type="date"
                  @blur="dateBlur"
                  :class="['w-full border p-3 rounded-lg transition', dateMeta.touched && dateError ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="dateMeta.touched && dateError" class="text-sm text-red-600 mt-1">{{ dateError }}</p>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  v-model="description"
                  rows="4"
                  @blur="descriptionBlur"
                  :class="['w-full border p-3 rounded-lg transition', descriptionMeta.touched && descriptionError ? 'border-red-500' : 'border-gray-300']"
                />
                <p v-if="descriptionMeta.touched && descriptionError" class="text-sm text-red-600 mt-1">{{ descriptionError }}</p>
              </div>

              <button
                type="submit"
                :disabled="!meta.valid"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isEditing ? 'Update Event' : 'Create Event' }}
              </button>

              <button
                v-if="isEditing"
                type="button"
                @click="cancelEdit"
                class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg mt-2"
              >
                Cancel Edit
              </button>
            </form>
          </transition>
        </div>

        <!-- Events List -->
        <div class="md:w-1/2 w-full">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-calendar text-indigo-500 text-xl"></i>
            All Events — Page {{ currentPage }}
          </h2>

          <div v-if="paginatedEvents.length === 0" class="text-gray-500 text-center py-8">
            No events are scheduled.
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="event in paginatedEvents"
              :key="event.id"
              :class="[
                'bg-gradient-to-br from-white to-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg shadow hover:shadow-md transition transform hover:scale-[1.01]',
                (deletingEventId === event.id || animatingEventId === event.id) ? 'animate-pulse bg-indigo-200' : ''
              ]"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-bold text-indigo-700">
                    <i class="pi pi-star-fill text-yellow-400 mr-2"></i>{{ event.title }}
                  </h3>
                  <p class="text-sm text-gray-500"><i class="pi pi-clock mr-1"></i>{{ event.date }}</p>
                  <p class="text-gray-700 mt-2 text-sm">{{ event.description }}</p>
                </div>
                <div class="flex gap-2 mt-1">
                  <button
                    class="text-blue-600 hover:text-blue-800 transition text-base px-3 py-1"
                    @click="startEdit(event)"
                    title="Edit"
                  >
                    <i class="pi pi-pencil text-lg"></i>
                  </button>
                  <button
                    class="text-red-600 hover:text-red-800 transition text-base px-3 py-1"
                    @click="promptDelete(event)"
                    :disabled="deletingEventId === event.id"
                    title="Delete"
                  >
                    <i class="pi pi-trash text-lg"></i>
                  </button>
                  <button
                    class="text-indigo-600 hover:text-indigo-800 transition text-base px-3 py-1"
                    @click="openGuestsModal(event)"
                    title="Guests Attending"
                  >
                    <i class="pi pi-users mr-1 text-lg"></i> Guests
                  </button>
                </div>

              </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="events.length >= itemsPerPage" class="flex flex-col items-center gap-2 mt-6">
              <div class="text-sm text-gray-400">Page {{ currentPage }} of {{ totalPages }}</div>
              <div class="flex gap-4">
                <button class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-white hover:text-gray-900 transition duration-300 disabled:opacity-50" :disabled="currentPage === 1" @click="eventStore.currentPage--">
                  Previous
                </button>
                <button class="px-4 py-2 rounded bg-gray-700 text-white hover:bg-white hover:text-gray-900 transition duration-300 disabled:opacity-50" :disabled="currentPage === totalPages" @click="eventStore.currentPage++">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref, computed, onMounted, nextTick } from 'vue' // <-- add nextTick
import { useEventStore } from '@/stores/eventStore'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '@/firebase'

const eventStore = useEventStore()
const toast = useToast()

const isEditing = ref(false)
const editingEventId = ref(null)
const showModal = ref(false)
const selectedEvent = ref(null)
const deletingEventId = ref(null)

const showGuestsModal = ref(false)
const guestEvent = ref(null)

const paginatedEvents = computed(() => eventStore.paginatedEvents)
const currentPage = computed(() => eventStore.currentPage)
const totalPages = computed(() => eventStore.totalPages)
const itemsPerPage = computed(() => eventStore.itemsPerPage)
const events = computed(() => eventStore.events)

const schema = yup.object({
  title: yup.string().trim().min(1).required('Title is required'),
  date: yup.string().required('Date is required'),
  description: yup.string().trim().min(1).required('Description is required')
})

const { handleSubmit, resetForm, meta } = useForm({ validationSchema: schema })

const { value: title, errorMessage: titleError, meta: titleMeta, handleBlur: titleBlur } = useField('title')
const { value: date, errorMessage: dateError, meta: dateMeta, handleBlur: dateBlur } = useField('date')
const { value: description, errorMessage: descriptionError, meta: descriptionMeta, handleBlur: descriptionBlur } = useField('description')

const animatingEventId = ref(null)

const submitEvent = handleSubmit(async (values) => {
  let affectedId = editingEventId.value
  if (!isEditing.value) {
    // Creating: get the new event's ID after creation
    affectedId = await eventStore.createOrUpdateEvent(values, false, null)
    await nextTick() // Wait for DOM update after adding
  } else {
    await eventStore.createOrUpdateEvent(values, true, editingEventId.value)
  }
  toast.success(isEditing.value ? 'Event updated successfully!' : 'Event created successfully!')

  // Animate the affected event card
  if (affectedId) {
    animatingEventId.value = affectedId
    setTimeout(() => {
      animatingEventId.value = null
    }, 3000)
  }

  resetForm()
  isEditing.value = false
  editingEventId.value = null
})

const cancelEdit = () => {
  resetForm()
  isEditing.value = false
  editingEventId.value = null
}

const startEdit = (e) => {
  title.value = e.title
  date.value = e.date
  description.value = e.description
  isEditing.value = true
  editingEventId.value = e.id

  // Animate the card being edited
  animatingEventId.value = e.id
  setTimeout(() => {
    animatingEventId.value = null
  }, 3000)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const promptDelete = (e) => {
  selectedEvent.value = e
  showModal.value = true
}

const cancelDelete = () => {
  selectedEvent.value = null
  showModal.value = false
}

const confirmDelete = async () => {
  showModal.value = false
  deletingEventId.value = selectedEvent.value.id
  toast.success('Event deleted successfully!')
  setTimeout(async () => {
    await eventStore.deleteEvent(selectedEvent.value.id)
    selectedEvent.value = null
    deletingEventId.value = null
  }, 3000)
}

// Guests modal logic
const openGuestsModal = (event) => {
  guestEvent.value = JSON.parse(JSON.stringify(event))
  showGuestsModal.value = true
}

const closeGuestsModal = () => {
  guestEvent.value = null
  showGuestsModal.value = false
}

const filteredGuests = computed(() =>
  (guestEvent.value?.guests || []).filter(
    guest => guest && guest !== 'user@example.com'
  )
)

const removeGuest = async (email) => {
  if (!guestEvent.value) return

  const eventRef = doc(db, 'events', guestEvent.value.id)
  await updateDoc(eventRef, {
    guests: arrayRemove(email)
  })

  await eventStore.fetchEvents()

  const updated = eventStore.events.find(e => e.id === guestEvent.value.id)
  guestEvent.value = JSON.parse(JSON.stringify(updated))

  toast.success(`Guest "${email}" has been removed.`)
}

onMounted(eventStore.fetchEvents)
</script>

<style scoped>
@keyframes slide-modal-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-modal-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-50%);
    opacity: 0;
  }
}
.slide-modal-enter-active {
  animation: slide-modal-in 0.3s ease-out;
}
.slide-modal-leave-active {
  animation: slide-modal-out 0.3s ease-in;
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
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

input,
textarea {
  transition: border-color 0.2s ease;
}

button {
  font-size: 1rem;
}

</style>
