import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudioListView from '../views/StudioListView.vue'
import StudioDetailView from '../views/StudioDetailView.vue'
import MyBookingsView from '../views/MyBookingsView.vue'
import EditProfileView from '../views/EditProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/', name: 'home', component: StudioListView, meta: { requiresAuth: true } },
    { path: '/studios/:id', name: 'studio-detail', component: StudioDetailView, meta: { requiresAuth: true } },
    { path: '/my-bookings', name: 'my-bookings', component: MyBookingsView, meta: { requiresAuth: true } },
    { path: '/profile/edit', name: 'profile-edit', component: EditProfileView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
