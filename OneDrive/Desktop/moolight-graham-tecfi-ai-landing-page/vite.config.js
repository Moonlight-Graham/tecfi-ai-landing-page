import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    exclude: ['@ethersproject/keccak256']
  },
})

