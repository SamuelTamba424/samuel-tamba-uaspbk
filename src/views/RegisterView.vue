<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

// --- State untuk Modal Notifikasi ---
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
// --- Akhir State Modal ---

const authStore = useAuthStore();
const router = useRouter();

const closeModal = () => {
  showModal.value = false;
  // Arahkan ke halaman login setelah modal ditutup
  router.push('/login');
};

const doRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = 'Semua kolom harus diisi.';
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  try {
    const success = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    if (success) {
      // Ganti alert() dengan menampilkan modal
      modalTitle.value = 'Pendaftaran Berhasil!';
      modalMessage.value = 'Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.';
      showModal.value = true;
    } else {
      errorMsg.value = authStore.error || 'Pendaftaran gagal.';
    }
  } catch (err) {
    errorMsg.value = err.message || 'Terjadi kesalahan.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- Modal Notifikasi -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-4 transform transition-all duration-300 scale-100">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mt-5">{{ modalTitle }}</h3>
      <p class="text-gray-600 my-4">{{ modalMessage }}</p>
      <button @click="closeModal" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">Login Sekarang</button>
    </div>
  </div>

  <!-- Konten Halaman Registrasi -->
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-600">
    <div class="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800">Daftar Akun Baru</h1>
        <p class="mt-2 text-gray-600">Gabung dengan STUDIO BAND</p>
      </div>
      <form @submit.prevent="doRegister" class="space-y-6">
        <div class="relative">
          <input v-model="name" type="text" id="name" required class="peer w-full px-4 py-3 text-gray-800 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-transparent" placeholder="Nama Lengkap">
          <label for="name" class="absolute left-4 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Nama Lengkap</label>
        </div>
        <div class="relative">
          <input v-model="email" type="email" id="email" required class="peer w-full px-4 py-3 text-gray-800 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-transparent" placeholder="Email">
          <label for="email" class="absolute left-4 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email</label>
        </div>
        <div class="relative">
          <input v-model="password" type="password" id="password" required class="peer w-full px-4 py-3 text-gray-800 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-transparent" placeholder="Password">
          <label for="password" class="absolute left-4 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
        </div>
        <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
        <div>
          <button type="submit" :disabled="loading" class="w-full py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <span>{{ loading ? 'Mendaftar...' : 'Daftar' }}</span>
          </button>
        </div>
      </form>
      <div class="text-center text-sm">
        <span class="text-gray-600">Sudah punya akun? </span>
        <RouterLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login di sini</RouterLink>
      </div>
    </div>
  </div>
</template>
