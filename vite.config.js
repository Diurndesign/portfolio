import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(() => ({
  // Le site est servi à la racine du domaine (Vercel).
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  // Site multi-pages statique : l'accueil (one-page) + la landing SEO locale.
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        creationNice: resolve(root, "creation-site-internet-nice.html"),
      },
    },
  },
}));
