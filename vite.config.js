import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

// Optimise le rendu de chaque page au build (aucune dépendance npm) :
//  1. Inline la feuille de style : supprime la requête CSS bloquant le rendu
//     (elle ne fait que ~8 Ko).
//  2. Précharge les 2 polices d'affichage utilisées au-dessus de la ligne de
//     flottaison (titre ExtraLight + gros titres Light) pour raccourcir la
//     chaîne critique et accélérer le LCP.
function optimizeHtml() {
  const inlined = new Set();
  // Polices réellement utilisées above-the-fold sur toutes les pages.
  const preloadFonts = ["HelloParisSerifExtraLight", "HelloParisSerifLight"];

  return {
    name: "optimize-html",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html, ctx) {
      if (!ctx || !ctx.bundle) return html;
      let out = html;

      // --- 1. Inline du CSS ---------------------------------------------
      const cssFiles = Object.keys(ctx.bundle).filter((f) => f.endsWith(".css"));
      for (const file of cssFiles) {
        const asset = ctx.bundle[file];
        const css = typeof asset.source === "string" ? asset.source : "";
        if (!css) continue;

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

      // --- 2. Preload des polices critiques -----------------------------
      const tags = [];
      for (const name of preloadFonts) {
        const file = Object.keys(ctx.bundle).find(
          (f) => f.includes(name) && f.endsWith(".woff2")
        );
        if (file) {
          tags.push(
            `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${file}">`
          );
        }
      }
      if (tags.length) {
        out = out.replace(/<head(\s[^>]*)?>/i, (m) => m + tags.join(""));
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
  plugins: [optimizeHtml()],
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
