import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {target: 'https://api-ppdny.vercel.app/', changeOrigin: true},
      '/foto-profil': {target: 'http://localhost:3000', changeOrigin: true},
      '/uploads': {target: 'http://localhost:3000', changeOrigin: true},
      '/payments': {target: 'http://localhost:3000', changeOrigin: true}
    }
  }
})