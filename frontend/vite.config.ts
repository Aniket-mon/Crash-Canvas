import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  base: '/',
  plugins: [react()],
  publicDir: 'public',
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
}));
