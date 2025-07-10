<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, RouterLink } from 'vue-router'; // Impor RouterLink

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const doLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  if (!email.value || !password.value) {
      errorMsg.value = 'Email dan password tidak boleh kosong.';
      loading.value = false;
      return;
  }
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push('/');
  } else {
    // Mengambil pesan error dari store
    errorMsg.value = authStore.error || 'Email atau password salah.';
  }
  loading.value = false;
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div class="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800">STUDIO BAND</h1>
        <p class="mt-2 text-gray-600">Selamat Datang Kembali!</p>
      </div>
      <form @submit.prevent="doLogin" class="space-y-6">
        <div class="relative">
          <input v-model="email" type="email" id="email" required class="peer w-full px-4 py-3 text-gray-800 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent" placeholder="Email">
          <label for="email" class="absolute left-4 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email</label>
        </div>
        <div class="relative">
          <input v-model="password" type="password" id="password" required class="peer w-full px-4 py-3 text-gray-800 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent" placeholder="Password">
          <label for="password" class="absolute left-4 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
        </div>
        <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
        <div>
          <button type="submit" :disabled="loading" class="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Memproses...' : 'Login' }}</span>
          </button>
        </div>
      </form>
      <!-- Link ke Halaman Registrasi -->
      <div class="text-center text-sm">
        <span class="text-gray-600">Belum punya akun? </span>
        <RouterLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Daftar sekarang</RouterLink>
      </div>
    </div>
  </div>
</template>
