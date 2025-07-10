<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';
import axios from 'axios';

// API sekarang dikelola oleh src/api/mock.js

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const auth = useAuthStore();

onMounted(async () => {
  if (!auth.userId) {
    error.value = "User tidak ditemukan.";
    loading.value = false;
    return;
  }
  try {
    const response = await axios.get(`/api/bookings?userId=${auth.userId}`);
    bookings.value = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    error.value = "Gagal memuat riwayat booking.";
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="animate-fade-in">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Riwayat Booking</h1>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>
    <div v-if="!loading && bookings.length === 0" class="text-center bg-white p-12 rounded-2xl shadow-md">
      <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
      </svg>
      <h3 class="mt-4 text-xl font-semibold text-gray-900">Belum Ada Riwayat</h3>
      <p class="mt-2 text-gray-500">Anda belum pernah melakukan booking. Ayo cari studio favoritmu!</p>
      <RouterLink to="/" class="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors">
        Cari Studio
      </RouterLink>
    </div>
    <div v-else class="space-y-5">
      <div v-for="booking in bookings" :key="booking.id" class="bg-white p-5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg p-3">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        </div>
        <div class="flex-grow">
          <p class="font-bold text-xl text-gray-900">{{ booking.studioName }}</p>
          <p class="text-sm text-gray-500">{{ booking.studioLocation }}</p>
        </div>
        <div class="w-full sm:w-auto text-left sm:text-right">
          <p class="font-semibold text-gray-800">{{ new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          <p class="font-bold text-lg text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mt-1">{{ booking.time_slot }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
