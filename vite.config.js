import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

// Inline la feuille de style dans chaque page : supprime la requête CSS
// bloquant le rendu (elle ne fait que ~8 Ko) et laisse les polices démarrer
// plus tôt. Aucune dépendance npm.
function inlineCss() {
  const inlined = new Set();
  return {
    name: "inline-css",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html, ctx) {
      if (!ctx || !ctx.bundle) return html;

      // Retrouve les fichiers CSS émis dans le bundle.
      const cssFiles = Object.keys(ctx.bundle).filter((f) => f.endsWith(".css"));
      if (!cssFiles.length) return html;

      let out = html;
      for (const file of cssFiles) {
        const asset = ctx.bundle[file];
        const css = typeof asset.source === "string" ? asset.source : "";
        if (!css) continue;

        // Remplace <link rel="stylesheet" href="/assets/xxx.css"> par le CSS inline.
        const base = file.split("/").pop().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const linkRe = new RegExp(
          '<link[^>]*rel="stylesheet"[^>]*href="[^"]*' + base + '"[^>]*>',
          "g"
        );
        if (linkRe.test(out)) {
          out = out.replace(linkRe, `<style>${css}</style>`);
          inlined.add(file);
        }
      }
      return out;
    },
    // Une fois toutes les pages transformées, le CSS est inline partout :
    // on retire le fichier désormais orphelin du bundle.
    generateBundle(_options, bundle) {
      for (const file of inlined) {
        delete bundle[file];
      }
    },
  };
}

export default defineConfig(() => ({
  // Le site est servi à la racine du domaine (Vercel).
  base: "/",
  plugins: [inlineCss()],
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
        auditGratuit: resolve(root, "audit-site-web-gratuit.html"),
        guides: resolve(root, "guides.html"),
      },
    },
  },
}));
