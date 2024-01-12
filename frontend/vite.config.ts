import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000,
    hmr: {
      port: 5500,
    },
    proxy: {
      "/api/search": {
        target: "http://localhost:7700",
        rewrite: (path) => path.replace("/api/search", ""),
      },
      "/api": {
        target: "http://localhost:3300",
        rewrite: (path) => path.replace("/api", ""),
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
