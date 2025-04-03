import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inject from '@rollup/plugin-inject';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
    commonjs(), // <- add this line
  ],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      events: 'events/',
      buffer: 'buffer/',
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
  },
});
