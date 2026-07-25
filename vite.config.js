import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  // En production (GitHub Pages), le site est servi depuis /portfolio/.
  // En dev, on reste à la racine.
  base: command === "build" ? "/portfolio/" : "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
}));
