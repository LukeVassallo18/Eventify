import { createRouter, createWebHashHistory } from 'vue-router' // changed import
import HomeView from '@/views/HomeView.vue'
import CreateAcc from '@/views/CreateAcc.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/createAcc' },
  { path: '/createAcc', component: CreateAcc },
  { path: '/home', component: HomeView },
  { path: '/admin', component: AdminDashboard }
]

const routeOrder = {
  '/createAcc': 0,
  '/home': 1,
  '/admin': 2
}

const router = createRouter({
  history: createWebHashHistory(), 
  routes,
})

router.beforeEach((to, from, next) => {
  const toOrder = routeOrder[to.path] ?? 0
  const fromOrder = routeOrder[from.path] ?? 0

  to.meta.transitionName = toOrder > fromOrder ? 'slide-left' : 'slide-right'
  next()
})

export default router
