import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ].filter(Boolean),
  publicDir: "./public",
  base: "/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
}));
