import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// PERBAIKAN FINAL: Path ini harus huruf kecil semua
import { initMockApi } from './api/mock.js' 

// Panggil fungsi ini SEBELUM aplikasi dibuat
initMockApi();

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
