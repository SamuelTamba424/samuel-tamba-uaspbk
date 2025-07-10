<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// API sekarang dikelola oleh src/api/mock.js

const studios = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('/api/studios');
    studios.value = response.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <h1 class="text-4xl font-bold text-gray-800">Studio Musik di Pekanbaru</h1>
      <div class="relative w-full sm:w-auto">
        <input type="text" placeholder="Cari studio..." class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="studio in studios" :key="studio.id" class="bg-white rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer" @click="router.push('/studios/' + studio.id)">
        <div class="relative">
          <img :src="studio.image_url" :alt="studio.name" class="w-full h-56 object-cover bg-gray-200">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-4 left-4">
            <h2 class="text-2xl font-bold text-white tracking-tight">{{ studio.name }}</h2>
            <p class="text-sm text-gray-200 flex items-center mt-1">
              <svg class="w-4 h-4 mr-1.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {{ studio.location }}
            </p>
          </div>
        </div>
        <div class="p-6">
          <div class="flex justify-between items-center">
            <p class="text-lg font-bold text-indigo-600">Rp {{ studio.price_per_hour.toLocaleString('id-ID') }}<span class="font-normal text-gray-500 text-sm">/jam</span></p>
            <div class="flex space-x-2">
              <span v-for="tag in studio.tags" :key="tag" class="px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">{{ tag }}</span>
            </div>
          </div>
          <button class="mt-4 w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 group-hover:bg-indigo-600">
            Lihat Jadwal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
