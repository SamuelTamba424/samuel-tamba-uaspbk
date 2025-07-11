<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';
import axios from 'axios';

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const auth = useAuthStore();

// --- State untuk Modal Konfirmasi Delete ---
const showDeleteModal = ref(false);
const bookingToDelete = ref(null);
const deleteLoading = ref(false);

const openDeleteModal = (booking) => {
  bookingToDelete.value = booking;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  bookingToDelete.value = null;
};

const handleDeleteBooking = async () => {
  if (!bookingToDelete.value) return;
  deleteLoading.value = true;
  try {
    // Memanggil endpoint DELETE
    await axios.delete(`/api/bookings/${bookingToDelete.value.id}`);
    
    // Hapus booking dari daftar di UI secara langsung agar tampilan update
    bookings.value = bookings.value.filter(b => b.id !== bookingToDelete.value.id);
    closeDeleteModal();
  } catch (e) {
    console.error("Gagal membatalkan booking:", e);
    alert("Gagal membatalkan booking. Silakan coba lagi.");
  } finally {
    deleteLoading.value = false;
  }
};
// --- Akhir State Modal ---

onMounted(async () => {
  if (!auth.userId) {
    error.value = "Sesi tidak valid. Silakan login kembali.";
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
  <!-- Modal Konfirmasi Delete -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-4">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mt-5">Batalkan Booking?</h3>
      <p class="text-gray-600 my-4">Apakah Anda yakin ingin membatalkan booking untuk <strong>{{ bookingToDelete?.studioName }}</strong> pada jam <strong>{{ bookingToDelete?.time_slot }}</strong>? Tindakan ini tidak dapat diurungkan.</p>
      <div class="flex justify-center gap-4 mt-6">
        <button @click="closeDeleteModal" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">Tidak</button>
        <button @click="handleDeleteBooking" :disabled="deleteLoading" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-red-400">
          {{ deleteLoading ? 'Menghapus...' : 'Ya, Batalkan' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Konten Halaman Utama -->
  <div class="animate-fade-in">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Riwayat Booking</h1>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>
    <div v-if="!loading && bookings.length === 0" class="text-center bg-white p-12 rounded-2xl shadow-md">
      <h3 class="mt-4 text-xl font-semibold text-gray-900">Belum Ada Riwayat</h3>
      <p class="mt-2 text-gray-500">Anda belum pernah melakukan booking.</p>
      <RouterLink to="/" class="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-700">Cari Studio</RouterLink>
    </div>
    <div v-else class="space-y-5">
      <div v-for="booking in bookings" :key="booking.id" class="bg-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg p-3">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
        </div>
        <div class="flex-grow">
          <p class="font-bold text-xl text-gray-900">{{ booking.studioName }}</p>
          <p class="text-sm text-gray-500">{{ new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) }}</p>
        </div>
        <div class="w-full sm:w-auto text-left sm:text-right flex items-center gap-4">
          <p class="font-bold text-lg text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{{ booking.time_slot }}</p>
          <!-- Tombol Batalkan (Ikon Tempat Sampah) -->
          <button @click="openDeleteModal(booking)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
