/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: { 
    environment: 'jsdom', 
    setupFiles: ['./tests/setup.tsx'],
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests-e2e/**'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
