import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss() as unknown as PluginOption,
    reactRouter() as unknown as PluginOption,
    // tsconfigPaths() is causing warnings in Vite 6, but we'll keep it for now if needed
    tsconfigPaths() as unknown as PluginOption,
  ],
  base: "/reformas/",
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5176,
    host: "127.0.0.1",
    strictPort: true,
  },
  ssr: {
    noExternal: ["react-hook-form", "@hookform/resolvers"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Keep React/Framer together. Split only truly big independent libs.
            if (id.includes("firebase") || id.includes("supabase")) {
              return "vendor-firebase";
            }
          }
        },
      },
    },
  },
});
