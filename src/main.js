// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializePaletteStore } from './utils/paletteStore'

const app = createApp(App)
app.use(router)
initializePaletteStore()
app.mount('#app')