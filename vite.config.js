import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { generateCaseStudies } from "./src/case-study/generate.js";

const root = fileURLToPath(new URL(".", import.meta.url));

// Génère les pages d'études de cas (realisations/<slug>.html) + l'entrée
// sitemap à partir des données, AVANT que Vite ne résolve les entrées.
const caseStudyInput = generateCaseStudies(root);

// Inclusion de fragments HTML partagés (aucune dépendance npm).
// Dans une page : <!--#include partials/footer.html--> est remplacé par le
// contenu du fichier. Évite de dupliquer navbar / footer / head sur chaque
// page : on écrit le bloc une seule fois, modifiable à un seul endroit.
// Fonctionne en dev et au build ; en dev, modifier un partial recharge la page.
function htmlPartials() {
  // Consomme aussi l'indentation devant la directive : le partial porte déjà
  // sa propre indentation, on évite ainsi de la doubler sur la 1re ligne.
  const includeRe = /[ \t]*<!--\s*#include\s+(\S+?)\s*-->/g;
  const render = (html) =>
    html.replace(includeRe, (_m, file) =>
      readFileSync(resolve(root, file), "utf8").trimEnd()
    );
  return {
    name: "html-partials",
    transformIndexHtml: { order: "pre", handler: render },
    handleHotUpdate(ctx) {
      if (ctx.file.includes("/partials/")) {
        ctx.server.ws.send({ type: "full-reload" });
      }
    },
  };
}

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
      // Même règle que consent.js : un choix sans date ou de plus de 6 mois
      // (182 jours) est expiré, le bandeau réapparaît.
      if (out.includes('id="cookie-consent"')) {
        const reveal =
          '<script>try{var c=localStorage.getItem("diurn-cookie-consent");' +
          'var d=Number(localStorage.getItem("diurn-cookie-consent-date"));' +
          'if((c!=="granted"&&c!=="denied")||!d||Date.now()-d>15724800000){var b=document.getElementById("cookie-consent");' +
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
  plugins: [react(), htmlPartials(), optimizeHtml()],
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
        parcours: resolve(root, "parcours.html"),
        // Pages d'études de cas générées depuis src/data/caseStudies.js
        ...caseStudyInput,
      },
    },
  },
}));
