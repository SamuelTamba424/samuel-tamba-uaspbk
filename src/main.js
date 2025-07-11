import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initMockApi } from './api/mock.js'

// Panggil fungsi inisialisasi API di sini
initMockApi();

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')