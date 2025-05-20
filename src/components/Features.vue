<template>
  <div class="bg-gray-300 py-16 px-6 md:px-20" style="padding-top: 20px;">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Why Use Eventify?</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-lg sm:px-10"
      >
        <div class="relative z-10 flex flex-col items-center text-center space-y-5">
          <!-- Central icon circle -->
          <div
            class="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-600"
          >
            <i :class="feature.icon" class="text-white text-2xl"></i>
          </div>

          <!-- Hover pulse circle -->
          <div
            class="absolute top-10 left-1/2 -translate-x-1/2 z-0 h-40 w-40 rounded-full bg-indigo-500 opacity-30 scale-0 group-hover:scale-[4] transition-transform duration-800"
          ></div>

          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-indigo-700">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 group-hover:text-gray-700 text-sm">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const features = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('/features.json') 
    features.value = response.data.features 
  } catch (error) {
    console.error('Failed to fetch features:', error)
  }
})
</script>
