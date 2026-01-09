import AdminDashboard from "@/views/AdminDashboard.vue";
import EventsPage from "@/views/EventsPage.vue";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHashHistory } from "vue-router"; // changed import

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomeView },
  { path: "/events", component: EventsPage },
  { path: "/admin", component: AdminDashboard },
];

const routeOrder = {
  "/home": 0,
  "/events": 1,
  "/admin": 2,
};

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const toOrder = routeOrder[to.path] ?? 0;
  const fromOrder = routeOrder[from.path] ?? 0;

  to.meta.transitionName = toOrder > fromOrder ? "slide-left" : "slide-right";
  next();
});

export default router;
