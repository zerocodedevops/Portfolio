import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/proyectos/neighnet/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
      '@services': path.resolve(projectRoot, './src/services'),
    }
  },
  server: {
    port: 5174,
    strictPort: false,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react')) {
            return 'react-vendor';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
