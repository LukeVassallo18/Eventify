import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

import 'primeicons/primeicons.css'
import 'vue-toastification/dist/index.css' // <-- Import toast styles

import Toast, { POSITION } from 'vue-toastification' // <-- Import Toastification

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: 'Vue-Toastification__fade'
})

app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)

app.mount('#app')
