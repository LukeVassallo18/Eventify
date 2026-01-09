// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    role: '', // 'admin' or 'user'
    profilePicture: '', // <- added
  }),
  actions: {
    setUser(userData) {
      this.email = userData.email
      this.role = userData.role
      this.profilePicture = userData.profilePicture || ''
    },
    clearUser() {
      this.email = ''
      this.role = ''
      this.profilePicture = ''
    }
  }
})
