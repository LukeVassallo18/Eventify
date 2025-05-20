<template>
  <transition :name="$route.meta.transitionName || 'slide-left'" mode="out-in">
    <RouterView />
  </transition>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    userStore.setUser(JSON.parse(userData))
  }
})
</script>
