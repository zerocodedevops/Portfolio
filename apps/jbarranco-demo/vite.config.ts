import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/proyectos/jbarranco/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
      "firebase/app": path.resolve(projectRoot, "./src/demo/demoAuth.ts"),
      "firebase/auth": path.resolve(projectRoot, "./src/demo/demoAuth.ts"),
      "firebase/firestore": path.resolve(projectRoot, "./src/demo/demoStore.ts"),
      "@supabase/supabase-js": path.resolve(projectRoot, "./src/demo/demoStorage.ts"),
      "react-hot-toast": path.resolve(projectRoot, "./src/demo/shims/reactHotToast.tsx"),
      "ics": path.resolve(projectRoot, "./src/demo/shims/icsShim.ts"),
      "file-saver": path.resolve(projectRoot, "./src/demo/shims/fileSaverShim.ts"),
      "isomorphic-dompurify": path.resolve(projectRoot, "./src/demo/shims/dompurifyShim.ts"),
    },
  },
  server: {
    port: 5178,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) return "charts";
            if (id.includes("react-big-calendar") || id.includes("date-fns")) return "calendar";
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
