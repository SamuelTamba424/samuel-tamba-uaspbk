<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<template>
  <header v-if="authStore.isAuthenticated" class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- NAMA SUDAH DIGANTI DI SINI -->
        <RouterLink to="/" class="text-2xl font-bold text-indigo-600">STUDIO BAND</RouterLink>
        <div class="hidden md:flex items-center space-x-4">
          <RouterLink to="/" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Daftar Studio</RouterLink>
          <RouterLink to="/my-bookings" class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Booking Saya</RouterLink>
          <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Logout</button>
        </div>
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-md text-gray-600 hover:bg-gray-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </nav>
    <div v-if="mobileMenuOpen" class="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <RouterLink to="/" @click="mobileMenuOpen = false" class="block text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Daftar Studio</RouterLink>
      <RouterLink to="/my-bookings" @click="mobileMenuOpen = false" class="block text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Booking Saya</RouterLink>
      <button @click="handleLogout" class="w-full text-left block bg-red-500 text-white font-bold px-3 py-2 rounded-md text-base">Logout</button>
    </div>
  </header>

  <main class="container mx-auto p-4 sm:p-6 lg:p-8">
    <RouterView />
  </main>
</template>
