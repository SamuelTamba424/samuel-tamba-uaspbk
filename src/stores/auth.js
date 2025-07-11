import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const token = ref(localStorage.getItem('token'));
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const userId = computed(() => user.value?.id);

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

  async function updateProfile(newUserData) {
    if (!userId.value) return false;
    try {
      const response = await axios.put(`/api/users/${userId.value}`, newUserData);
      const updatedUser = response.data;
      user.value = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error("Gagal update profil:", err);
      return false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return { user, token, error, isAuthenticated, userId, login, register, logout, updateProfile }
})