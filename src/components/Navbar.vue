<script setup>
import { ref } from 'vue';

const menuOpen = ref(false)
</script>

<template>
  <div class="flex items-center justify-between px-6 py-4 bg-white shadow relative z-50">
    <!-- Logo -->
    <div class="text-2xl font-bold text-indigo-600">
      <img src="../assets/logo-black.png" alt="Eventify Logo" width="200" />
    </div>

    <!-- Desktop Nav -->
    <div class="hidden md:flex space-x-6 items-center text-gray-700 text-lg">
      <router-link
        to="/home"
        class="hover:text-indigo-600 transition duration-200 relative group"
      >
        Home
        <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </router-link>
      <router-link
        to="/events"
        class="hover:text-indigo-600 transition duration-200 relative group"
      >
        Events
        <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </router-link>
      <router-link
        to="/admin"
        class="text-red-600 hover:text-red-700 font-medium relative group"
      >
        Admin Privileges
        <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </router-link>
    </div>

    <!-- Burger Menu Button -->
    <button @click="menuOpen = !menuOpen" class="md:hidden focus:outline-none">
      <svg v-if="!menuOpen" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile Menu -->
    <transition name="fade-slide">
      <div
        v-if="menuOpen"
        class="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden z-40 text-lg animate-pop"
      >
        <router-link
          to="/home"
          class="text-gray-800 hover:text-indigo-600 transition duration-200 relative group"
        >
          Home
          <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </router-link>

        <router-link
          to="/events"
          class="text-gray-800 hover:text-indigo-600 transition duration-200 relative group"
        >
          Events
          <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </router-link>

        <router-link
          to="/admin"
          class="text-red-600 hover:text-red-700 font-medium relative group"
        >
          Admin Privileges
          <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </router-link>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes pop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.25s ease-out;
}
</style>
