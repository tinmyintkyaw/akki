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
    port: 3400,
    // workaround for vite dev to work inside devcontainers
    // https://github.com/vitejs/vite/issues/16522
    host: "127.0.0.1",
    hmr: {
      port: 5500,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3300",
        // rewrite: (path) => path.replace("/api", ""),
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
