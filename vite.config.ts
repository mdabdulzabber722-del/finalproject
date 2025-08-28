import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: './index.html'
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