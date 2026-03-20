import { fileURLToPath } from 'node:url';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@zerovanity': path.resolve(dirname, '../zerovanity/src'),
      '@crypto': path.resolve(dirname, '../crypto'),
      '@ecommerce': path.resolve(dirname, '../ecommerce'),
      '@devops-shop': path.resolve(dirname, '../devops-shop'),
      '@analytics': path.resolve(dirname, '../analytics'),
      '@zerodelay': path.resolve(dirname, '../zerodelay/src'),
      '@zero-chaos': path.resolve(dirname, '../zero-chaos'),
      '@salon': path.resolve(dirname, '../zerovanity/src'),

    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
  },
});
