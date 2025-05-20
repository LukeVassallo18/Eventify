import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const currentPage = ref(1)
  const itemsPerPage = 3

  const totalPages = computed(() => Math.ceil(events.value.length / itemsPerPage))
  const paginatedEvents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return events.value.slice(start, start + itemsPerPage)
  })

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      console.error('Fetch events error:', err)
    }
  }

  const createOrUpdateEvent = async (eventData, isEditing, editingId) => {
    try {
      if (isEditing) {
        await setDoc(doc(db, 'events', editingId), { ...eventData })
      } else {
        await addDoc(collection(db, 'events'), { ...eventData }) // ← auto-generated ID
      }
      await fetchEvents()
    } catch (err) {
      console.error('Create/Update event error:', err)
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId))
      await fetchEvents()
    } catch (err) {
      console.error('Delete event error:', err)
    }
  }

  return {
    events,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedEvents,
    fetchEvents,
    createOrUpdateEvent,
    deleteEvent,
  }
})
