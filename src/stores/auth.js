import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // Fungsi inisialisasi yang lebih aman untuk menangani data yang mungkin rusak
  const initializeUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      // Jika ada data user di localStorage, parse. Jika tidak, kembalikan null.
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Gagal mem-parse data user dari localStorage, data akan dibersihkan.", e);
      localStorage.removeItem('user');
      return null;
    }
  };

  const user = ref(initializeUser());
  const token = ref(localStorage.getItem('token'));
  const error = ref(null);

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value);
  const userId = computed(() => user.value?.id); // Menggunakan optional chaining untuk keamanan

  // --- ACTIONS ---
  async function login(email, password) {
    try {
      const response = await axios.post('/api/login', { email, password });
      const loggedInUser = response.data;
      user.value = loggedInUser;
      token.value = `fake-jwt-token-for-${loggedInUser.id}`;
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token.value);
      error.value = null;
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login gagal';
      return false;
    }
  }

  async function register(credentials) {
    try {
      await axios.post('/api/register', credentials);
      error.value = null;
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Pendaftaran gagal';
      return false;
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.clear()
  }

  return { user, token, error, isAuthenticated, userId, login, register, logout }
})
