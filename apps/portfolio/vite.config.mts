import { fileURLToPath } from 'node:url';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sirv from 'sirv';
import { defineConfig, type Plugin } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

function serveStaticAppsPlugin(): Plugin {
  return {
    name: 'serve-static-apps',
    configureServer(server) {
      const appsDir = path.resolve(dirname, '..');
      const servePlague = sirv(path.join(appsDir, 'zeroplague'), { dev: true, single: false });
      const serveAtelier = sirv(path.join(appsDir, 'zeroatelier'), { dev: true, single: false });
      const serveRisk = sirv(path.join(appsDir, 'zerorisk'), { dev: true, single: false });
      const serveNeighnet = sirv(path.join(appsDir, 'NeghNetZ/dist'), { dev: true, single: true });
      const serveJBarrancoDemo = sirv(path.join(appsDir, 'jbarranco-demo/dist'), { dev: true, single: true });

      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/proyectos/jbarranco')) {
          req.url = url.replace(/^\/proyectos\/jbarranco/, '') || '/';
          return serveJBarrancoDemo(req, res, next);
        }
        if (url.startsWith('/proyectos/neighnet')) {
          req.url = url.replace(/^\/proyectos\/neighnet/, '') || '/';
          return serveNeighnet(req, res, next);
        }
        if (url.startsWith('/proyectos/zeroplague')) {
          req.url = url.replace(/^\/proyectos\/zeroplague/, '') || '/';
          return servePlague(req, res, next);
        }
        if (url.startsWith('/proyectos/zeroatelier.html') || url.startsWith('/proyectos/zeroatelier')) {
          req.url = '/';
          return serveAtelier(req, res, next);
        }
        if (url.startsWith('/proyectos/zerorisk.html') || url.startsWith('/proyectos/zerorisk')) {
          req.url = '/';
          return serveRisk(req, res, next);
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // The shared EmailJS configuration is kept in the monorepo root .env.
  envDir: path.resolve(dirname, '../..'),
  plugins: [react(), tailwindcss(), serveStaticAppsPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/zerodelay': {
        target: 'http://localhost:5174',
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
      '@zeroshop': path.resolve(dirname, '../zeroshop/src'),
      '@crypto': path.resolve(dirname, '../crypto'),
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
