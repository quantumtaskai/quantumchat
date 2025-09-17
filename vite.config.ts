import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          utils: ['@headlessui/vue'],
        },
      },
    },
    // Optimize for production deployment
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external connections for Docker
    allowedHosts: [
      'localhost',
      'chat.netcoptech.com',
      '127.0.0.1',
      'app' // Docker service name
    ],
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      'chat.netcoptech.com',
      '127.0.0.1',
      'app' // Docker service name
    ],
  },
  // Environment variable configuration
  envPrefix: ['VITE_'],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})