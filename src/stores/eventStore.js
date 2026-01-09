import { defineStore } from 'pinia'
import { computed, ref } from "vue";

const STORAGE_KEY = "eventify_events";

export const useEventStore = defineStore("event", () => {
  const events = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 3;

  const totalPages = computed(() =>
    Math.ceil(events.value.length / itemsPerPage)
  );
  const paginatedEvents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return events.value.slice(start, start + itemsPerPage);
  });

  const fetchEvents = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        events.value = JSON.parse(stored).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }
    } catch (err) {
      console.error("Fetch events error:", err);
      events.value = [];
    }
  };

  const saveEvents = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.value));
  };

  const createOrUpdateEvent = (eventData, isEditing, editingId) => {
    try {
      if (isEditing) {
        const index = events.value.findIndex((e) => e.id === editingId);
        if (index !== -1) {
          events.value[index] = { ...events.value[index], ...eventData };
        }
      } else {
        const newEvent = {
          id: Date.now().toString(),
          ...eventData,
        };
        events.value.unshift(newEvent);
      }
      saveEvents();
    } catch (err) {
      console.error("Create/Update event error:", err);
    }
  };

  const deleteEvent = (eventId) => {
    try {
      events.value = events.value.filter((e) => e.id !== eventId);
      saveEvents();
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  return {
    events,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedEvents,
    fetchEvents,
    createOrUpdateEvent,
    deleteEvent,
  };
});
