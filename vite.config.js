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
        creationCannes: resolve(root, "creation-site-internet-cannes.html"),
        creationAntibes: resolve(root, "creation-site-internet-antibes.html"),
        creationMonaco: resolve(root, "creation-site-internet-monaco.html"),
        graphisteNice: resolve(root, "graphiste-nice.html"),
        studioDesignNice: resolve(root, "studio-design-nice.html"),
        coutSiteNice: resolve(root, "combien-coute-site-internet-nice.html"),
        codeVsPlateforme: resolve(root, "site-sur-mesure-ou-wix-squarespace.html"),
        siteIaOuDev: resolve(root, "site-avec-ia-ou-developpeur.html"),
      },
    },
  },
}));
