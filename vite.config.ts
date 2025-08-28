import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: parseInt(process.env.PORT || '4173'),
    host: '0.0.0.0'
  }
})