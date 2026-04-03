import { fileURLToPath } from 'node:url';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/zerodelay': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
      '/devops-shop': {
        target: 'http://localhost:5175',
        changeOrigin: true,
      },
      '/reformas': {
        target: 'http://localhost:5176',
        changeOrigin: true,
      },
    },
  },
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
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react') || id.includes('react-helmet-async')) {
              return 'vendor-ui';
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
          }
        },
      },
    },
  },
});
