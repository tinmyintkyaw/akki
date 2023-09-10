import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/client",
  },
  server: {
    port: 3000,
    hmr: {
      port: 5500,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3300",
        changeOrigin: true,
      },
      "/editor": {
        target: "http://localhost:3300",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/client"),
    },
  },
});
