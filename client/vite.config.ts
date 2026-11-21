import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  server: {
    proxy: {
      // 1. Proxy Better Auth & Hono API routes
      "/api": {
        target: "http://localhost:3300",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
