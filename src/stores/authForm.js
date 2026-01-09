import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthFormStore = defineStore('authForm', () => {
  const isLogin = ref(false)
  const toggleForm = () => {
    isLogin.value = !isLogin.value
  }

  return {
    isLogin,
    toggleForm,
  }
})
