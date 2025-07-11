<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const loading = ref(false);
const successMessage = ref('');

// Isi form dengan data pengguna saat ini saat komponen dimuat
onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name;
    email.value = authStore.user.email;
  }
});

const handleUpdateProfile = async () => {
  loading.value = true;
  successMessage.value = '';
  try {
    const success = await authStore.updateProfile({ name: name.value });
    if (success) {
      successMessage.value = 'Profil berhasil diperbarui!';
    }
  } catch (error) {
    console.error('Gagal memperbarui profil:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Edit Profil</h1>
    <div class="bg-white p-8 rounded-2xl shadow-lg">
      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <div class="relative">
          <input v-model="name" type="text" id="name" required class="peer w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-transparent" placeholder="Nama Lengkap">
          <label for="name" class="absolute left-4 -top-3.5 text-gray-600 text-sm bg-white px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Nama Lengkap</label>
        </div>
        <div class="relative">
          <input v-model="email" type="email" id="email" disabled class="peer w-full px-4 py-3 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" placeholder="Email">
          <label for="email" class="absolute left-4 -top-3.5 text-gray-500 text-sm bg-gray-100 px-1">Email (tidak bisa diubah)</label>
        </div>
        
        <div v-if="successMessage" class="text-green-600 bg-green-100 p-3 rounded-lg text-center">
          {{ successMessage }}
        </div>

        <div class="flex justify-end gap-4">
          <button @click="router.push('/')" type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
            Kembali
          </button>
          <button type="submit" :disabled="loading" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-indigo-400">
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
