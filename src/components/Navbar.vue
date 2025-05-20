<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'

const menuOpen = ref(false)
const router = useRouter()

const userStore = useUserStore()
const isAdmin = computed(() => userStore.role === 'admin')
const profilePicture = computed(() => userStore.profilePicture)
const userEmail = computed(() => userStore.email)

const logout = () => {
  userStore.clearUser()
  localStorage.removeItem('user')
  router.push('/createAcc')
}
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
        v-if="isAdmin"
        to="/admin"
        class="text-red-600 hover:text-red-700 font-medium relative group"
      >
        Admin Privileges
        <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
      </router-link>

      <Button
        label="Log Out"
        @click="logout"
        class="p-button-sm p-button-text p-button-secondary text-lg transition hover:scale-105"
      />

      <!-- Profile Picture with Tooltip (Desktop Only) -->
      <div v-if="profilePicture" class="relative group ml-2">
        <img
          :src="profilePicture"
          alt="Profile"
          class="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
        />
        <span
          class="absolute top-full left-1/3 transform -translate-x-2/3 mt-2 px-3 py-2 text-sm text-white bg-black rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
        >
          {{ userEmail }}
        </span>
      </div>
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
          v-if="isAdmin"
          to="/admin"
          class="text-red-600 hover:text-red-700 font-medium relative group"
        >
          Admin Privileges
          <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </router-link>
        <Button label="Log Out" @click="logout" class="p-button-sm p-button-text p-button-secondary text-lg" />
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
