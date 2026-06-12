import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Daftarkan service worker untuk PWA
// Mode autoUpdate — SW diperbarui otomatis saat ada versi baru
const updateSW = registerSW({
  onNeedRefresh() {
    // Minta user reload untuk memperbarui versi baru
    if (confirm('Versi baru tersedia! Muat ulang untuk memperbarui?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasi siap digunakan secara offline.')
  },
  onRegistered(r) {
    console.log('Service Worker terdaftar:', r)
  },
  onRegisterError(error) {
    console.error('Gagal mendaftarkan Service Worker:', error)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
