<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const studio = ref(null);
const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const timeSlots = ref(['09:00 - 10:00', '10:00 - 11:00', '13:00 - 14:00', '14:00 - 15:00', '16:00 - 17:00', '19:00 - 20:00', '20:00 - 21:00']);

// --- LOGIKA TANGGAL ---
const availableDates = ref([]);
const selectedDate = ref(null);

const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    availableDates.value = dates;
    selectedDate.value = dates[0];
};

const formatDate = (date) => {
    if (date.toDateString() === new Date().toDateString()) return 'Hari Ini';
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
};

const selectedDateISO = computed(() => selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : '');

const fetchBookingsForDate = async (date) => {
    if (!studio.value) return;
    try {
        const dateString = date.toISOString().split('T')[0];
        const response = await axios.get(`/api/bookings?studioId=${studio.value.id}&date=${dateString}`);
        bookings.value = response.data;
    } catch (e) {
        console.error("Gagal memuat booking untuk tanggal:", date, e);
        bookings.value = [];
    }
};

watch(selectedDate, (newDate) => {
    if (newDate) {
        fetchBookingsForDate(newDate);
        selectedSlot.value = null;
    }
});
// --- AKHIR LOGIKA TANGGAL ---

const selectedSlot = ref(null);
const bookingLoading = ref(false);

// --- LOGIKA MODAL NOTIFIKASI BARU ---
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const bookingSuccess = ref(false);

const closeModal = () => {
  showModal.value = false;
  // Jika booking berhasil, arahkan ke halaman riwayat
  if (bookingSuccess.value) {
    router.push('/my-bookings');
  }
};
// --- AKHIR LOGIKA MODAL ---

const isSlotBooked = (slot) => {
  return bookings.value.some(b => b.time_slot === slot);
};

const confirmBooking = async () => {
  if (!selectedSlot.value) return;
  bookingLoading.value = true;
  try {
    await axios.post('/api/bookings', { studioId: studio.value.id, userId: auth.userId, date: selectedDateISO.value, time_slot: selectedSlot.value });
    
    // Tampilkan modal sukses
    bookingSuccess.value = true;
    modalTitle.value = 'Booking Berhasil!';
    modalMessage.value = `Anda telah berhasil booking ${studio.value.name} pada ${selectedDateISO.value} jam ${selectedSlot.value}.`;
    showModal.value = true;

  } catch (e) {
    // Tampilkan modal gagal
    bookingSuccess.value = false;
    modalTitle.value = 'Booking Gagal';
    modalMessage.value = 'Terjadi kesalahan saat memproses booking Anda. Silakan coba lagi.';
    showModal.value = true;
  } finally {
    bookingLoading.value = false;
  }
};

onMounted(async () => {
  generateDates();
  try {
    const studioId = route.params.id;
    const studioRes = await axios.get(`/api/studios/${studioId}`);
    studio.value = studioRes.data;
    if (selectedDate.value) {
        await fetchBookingsForDate(selectedDate.value);
    }
  } catch (e) {
    error.value = 'Gagal memuat data studio.';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- Modal Notifikasi -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-4 transform transition-all duration-300 scale-100">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="bookingSuccess ? 'bg-green-100' : 'bg-red-100'">
        <svg v-if="bookingSuccess" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <svg v-else class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mt-5">{{ modalTitle }}</h3>
      <p class="text-gray-600 my-4">{{ modalMessage }}</p>
      <button @click="closeModal" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">OK</button>
    </div>
  </div>

  <!-- Konten Halaman Utama -->
  <div v-if="loading" class="text-center p-10"><p>Memuat detail studio...</p></div>
  <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>
  <div v-if="studio" class="space-y-8">
    <div>
      <router-link to="/" class="text-indigo-600 hover:underline mb-4 inline-block">&larr; Kembali ke daftar</router-link>
      <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <img :src="studio.image_url" :alt="studio.name" class="w-full h-auto object-cover rounded-xl bg-gray-200">
          <div class="flex flex-col justify-center">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ studio.name }}</h1>
            <p class="text-gray-500 mt-2">{{ studio.location }}</p>
            <p class="text-2xl font-bold text-indigo-600 my-4">Rp {{ studio.price_per_hour.toLocaleString('id-ID') }} / jam</p>
            <p class="text-gray-700">{{ studio.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Pilih Tanggal</h2>
      <div class="flex space-x-2 overflow-x-auto pb-4 -mx-6 px-6">
        <button v-for="date in availableDates" :key="date.toISOString()" @click="selectedDate = date"
          :class="['px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors', selectedDate && date.toDateString() === selectedDate.toDateString() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
          {{ formatDate(date) }}
        </button>
      </div>

      <h2 class="text-2xl font-bold mb-4 mt-6">Pilih Jadwal ({{ selectedDateISO }})</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <button v-for="slot in timeSlots" :key="slot" @click="selectedSlot = slot" :disabled="isSlotBooked(slot)"
          :class="['p-3 rounded-lg font-semibold transition-colors', isSlotBooked(slot) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-600 hover:text-white', selectedSlot === slot ? 'bg-indigo-600 text-white' : '']">
          {{ slot }}
        </button>
      </div>
      <div v-if="selectedSlot" class="mt-6 text-center">
        <button @click="confirmBooking" :disabled="bookingLoading" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:bg-green-300">
          {{ bookingLoading ? 'Memproses...' : 'Booking Jam ' + selectedSlot }}
        </button>
      </div>
    </div>
  </div>
</template>
