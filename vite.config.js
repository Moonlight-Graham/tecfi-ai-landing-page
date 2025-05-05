import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Polyfill Node.js core modules like 'buffer'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser'
    },
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
});

