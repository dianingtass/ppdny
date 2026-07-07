import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCommonjs(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-splash-512x512.png', 'apple-splash.png'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        // Naikkan batas dari 2 MB → 4 MB untuk menangani chunk besar
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https?:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'SIM-Tren',
        short_name: 'SIM-Tren',
        description: "Aplikasi manajemen dan layanan kesehatan Pondok Pesantren Darun'naim Yapia",
        lang: 'id',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f0fdf4',
        theme_color: '#15803d',
        orientation: 'portrait-primary',
        categories: ['education', 'health', 'utilities'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-splash-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Login',
            short_name: 'Login',
            description: 'Masuk ke akun Anda',
            url: '/login',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Buka dashboard utama',
            url: '/santri',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
        ],
      },
    }),
  ],

  optimizeDeps: {
    include: ['quill'],
  },

  esbuild: {
    pure: ['console.log', 'console.warn', 'console.error', 'console.debug', 'console.info'],
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Naikkan warning limit agar tidak spam pesan chunk besar
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Code splitting manual: pisahkan vendor besar ke chunk tersendiri
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Chart library
          'vendor-recharts': ['recharts'],
          // PDF & canvas (paling besar)
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas-pro'],
          // Rich text editor
          'vendor-quill': ['quill', 'react-quill', 'react-quilljs'],
          // Icons
          'vendor-lucide': ['lucide-react'],
          // HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
  },
})