import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import { writeFileSync } from "fs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && screenGraphPlugin(),
    {
      name: "nojekyll",
      writeBundle() {
        writeFileSync("dist/.nojekyll", "");
      },
    },
  ].filter(Boolean),
  publicDir: "./static",
  base: "/Crash-Canvas/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
}));
