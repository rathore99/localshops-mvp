import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: true,       // bind to 0.0.0.0 so mobile on same WiFi can connect
    port: 5173,
    proxy: {
      // All /api calls are forwarded to the Spring Boot backend.
      // Works from both localhost and the network IP — no CORS issues.
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'LocalShops',
        short_name: 'LocalShops',
        description: 'Find local shops and reserve products in your town',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/v1\/shops/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-shops', expiration: { maxAgeSeconds: 300 } }
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
