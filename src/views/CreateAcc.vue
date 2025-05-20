<template>
  <div>
    <div
      v-if="toastVisible"
      :class="`fixed top-4 right-4 z-50 text-white px-6 py-3 rounded shadow-lg animate-slide-in ${toastColor}`"
    >
    <div
  v-if="toastVisible"
  :class="`fixed top-4 right-4 z-50 text-white px-6 py-3 rounded shadow-lg animate-slide-in ${toastColor}`"
>
  <div class="flex items-center space-x-3">
    <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <span>{{ toastMessage }}</span>
  </div>
</div>

      {{ toastMessage }}
    </div>


    <!-- Registration Form -->
    <section class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div class="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-8">
        <div class="flex justify-center mb-6">
          <img src="../assets/logo-white.png" alt="Logo" width="200" />
        </div>

       <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
  {{ isLogin ? 'Login to your account' : 'Create an account' }}
</h1>

<form @submit.prevent="onSubmit" class="space-y-5">
  <!-- Profile Picture Upload -->
<div v-if="!isLogin" class="flex flex-col items-center mb-4">
  <label for="profilePicInput" class="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-indigo-500 cursor-pointer hover:opacity-80">
    <img
      v-if="profilePreview"
      :src="profilePreview"
      alt="Profile preview"
      class="object-cover w-full h-full"
    />
    <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-sm">
      Upload
    </div>
    <input
      id="profilePicInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageUpload"
    />
  </label>
  <span class="text-sm text-white mt-2">Profile Picture</span>
</div>

  <div>
    <label for="email" class="block text-sm font-medium text-white mb-1">Email</label>
    <input v-model="email" type="email" id="email" class="input" placeholder="name@email.com" />
    <span class="text-red-500 text-sm">{{ emailError }}</span>
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-white mb-1">Password</label>
    <input v-model="password" type="password" id="password" class="input" placeholder="••••••••" />
    <span class="text-red-500 text-sm">{{ passwordError }}</span>
  </div>

  <div class="flex space-x-4 pt-4">
    <button
      type="submit"
      v-if="!isLogin"
      class="w-1/2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
    >
      Register
    </button>
    <button
      type="submit"
      v-if="isLogin"
      class="w-1/2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
    >
      Login
    </button>
    <button
      type="button"
      @click="toggleForm"
      class="w-1/2 border border-indigo-600 text-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-600 hover:text-white transition"
    >
      {{ isLogin ? 'Register' : 'Login' }}
    </button>
  </div>
</form>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { getDocs, collection, setDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthFormStore } from '@/stores/authForm'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formStore = useAuthFormStore()
const isLogin = computed(() => formStore.isLogin)
const toggleForm = formStore.toggleForm
const router = useRouter()

const toastVisible = ref(false)
const toastMessage = ref('')
const toastColor = ref('bg-green-500')
const loading = ref(false)

const { handleSubmit } = useForm()
const { value: email, errorMessage: emailError } = useField('email', yup.string().required().email())
const { value: password, errorMessage: passwordError } = useField('password', yup.string().required().min(6))

const profilePicFile = ref(null)
const profilePreview = ref(null)

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    profilePicFile.value = file
    profilePreview.value = URL.createObjectURL(file)
  }
}

const showToast = (message, color = 'bg-green-500', redirect = false) => {
  toastMessage.value = message
  toastColor.value = color
  toastVisible.value = true
  loading.value = true

  setTimeout(() => {
    toastVisible.value = false
    loading.value = false
    if (redirect) router.push('/home')
  }, 3000)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const snapshot = await getDocs(collection(db, 'users'))

    if (isLogin.value) {
      const match = snapshot.docs.find(doc => {
        const data = doc.data()
        return data.email === values.email && data.password === values.password
      })

      if (match) {
        const data = match.data()

        const userPayload = {
          email: data.email,
          role: data.role,
          profilePicture: data.profilePicture || ''
        }

        userStore.setUser(userPayload)
        localStorage.setItem('user', JSON.stringify(userPayload))

        showToast('Login successful!', 'bg-green-500', true)
      } else {
        showToast('Invalid email or password.', 'bg-red-500')
        email.value = ''
        password.value = ''
      }
    } else {
      const exists = snapshot.docs.some(doc => doc.data().email === values.email)
      if (exists) {
        showToast('Email already registered.', 'bg-yellow-500')
        return
      }

      let profilePicBase64 = ''
      if (profilePicFile.value) {
        const reader = new FileReader()
        profilePicBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(profilePicFile.value)
        })
      }

      const userId = `user${snapshot.size + 1}`
      await setDoc(doc(db, 'users', userId), {
        email: values.email,
        password: values.password,
        role: 'user',
        profilePicture: profilePicBase64
      })

      showToast('Account created successfully!', 'bg-green-500', true)
    }
  } catch (err) {
    console.error('Auth error:', err)
    showToast('An error occurred.', 'bg-red-500')
  }
})
</script>


<style scoped>


@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(50%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}
</style>
