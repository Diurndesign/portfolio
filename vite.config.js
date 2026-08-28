import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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

      // --- 3. Reveal immediat du bandeau cookies ------------------------
      // Le bandeau est masque par defaut et n'etait revele qu'apres le
      // chargement complet du bundle JS (~800 ms + transition), ce qui en
      // faisait un element LCP tres tardif. Ce script inline, execute des
      // que le bandeau est parse, l'affiche immediatement pour qui n'a pas
      // encore choisi. La logique de consentement (chargement de GA sur
      // « Accepter ») reste dans consent.js : rien ne change cote RGPD.
      if (out.includes('id="cookie-consent"')) {
        const reveal =
          '<script>try{var c=localStorage.getItem("diurn-cookie-consent");' +
          'if(c!=="granted"&&c!=="denied"){var b=document.getElementById("cookie-consent");' +
          "if(b)b.classList.add(\"is-visible\");}}catch(e){}</script>";
        out = out.replace(/<\/body>/i, reveal + "</body>");
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
  plugins: [react(), optimizeHtml()],
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
        refonteSiteCharte: resolve(root, "refonte-site-et-charte-graphique.html"),
        auditGratuit: resolve(root, "audit-site-web-gratuit.html"),
        guides: resolve(root, "guides.html"),
      },
    },
  },
}));
