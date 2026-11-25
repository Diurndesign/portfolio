// ============================================================
//  Sitemap — généré automatiquement au build
// ============================================================
// Plus aucune liste à tenir à la main : chaque page déclarée dans les
// entrées de Vite (vite.config.js, y compris les études de cas générées)
// arrive dans dist/sitemap.xml, avec l'URL de sa balise canonical.
// Sont exclues : les pages en noindex (404) et celles sans canonical.
//
// lastmod : la date ne bouge que si le contenu de la page change.
// src/data/sitemap-lastmod.json garde, pour chaque URL, une empreinte du
// fichier HTML et la date de sa dernière modification. Au build :
//   - empreinte identique  → on garde la date enregistrée ;
//   - empreinte différente → date du dernier commit qui touche la page
//     (si l'historique git est disponible), sinon date du jour.
// Le fichier est réécrit quand une empreinte change : le committer avec la
// modification de la page (un `npm run build` en local suffit).

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, relative } from "path";
import { createHash } from "crypto";
import { execFileSync } from "child_process";

const STORE = "src/data/sitemap-lastmod.json";

// Fichiers sources dont dépend une page générée (pour la date git).
const GENERATED_SOURCES = {
  "realisations/": ["src/data/caseStudies.js", "src/case-study/render.js"],
};

// fingerprints : { cheminAbsolu: texte } remplace, pour une page, le HTML
// servant à l'empreinte. Utile pour les études de cas : leur bloc « autres
// réalisations » reprend les textes des autres études, et une retouche de
// l'une ne doit pas changer la date de toutes.
export function sitemap({ root, fingerprints = {} }) {
  let pages = [];

  return {
    name: "sitemap",
    apply: "build",
    configResolved(config) {
      const input = config.build.rollupOptions.input || {};
      pages = Object.values(input).map((file) => resolve(root, file));
    },
    generateBundle() {
      const storePath = resolve(root, STORE);
      const store = existsSync(storePath)
        ? JSON.parse(readFileSync(storePath, "utf8"))
        : {};
      const next = {};
      const urls = [];

      for (const file of pages) {
        const html = readFileSync(file, "utf8");
        if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) continue;
        const canonical = html.match(
          /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
        );
        if (!canonical) {
          this.warn(`sitemap : pas de canonical dans ${relative(root, file)}, page ignorée`);
          continue;
        }
        const loc = canonical[1];
        if (next[loc]) {
          this.warn(`sitemap : canonical en double (${loc}) dans ${relative(root, file)}`);
          continue;
        }

        const hash = createHash("sha256")
          .update(fingerprints[file] ?? html)
          .digest("hex")
          .slice(0, 16);
        const known = store[loc];
        const lastmod =
          known && known.hash === hash ? known.lastmod : changedOn(root, file);
        next[loc] = { lastmod, hash };
        urls.push({ loc, lastmod });
      }

      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`
          )
          .join("\n") +
        "\n</urlset>\n";

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });

      const json = JSON.stringify(sortKeys(next), null, 2) + "\n";
      const before = existsSync(storePath) ? readFileSync(storePath, "utf8") : "";
      if (json !== before) {
        try {
          writeFileSync(storePath, json);
        } catch {
          // Système de fichiers en lecture seule : le sitemap reste juste.
        }
      }
    },
  };
}

// Date du dernier commit qui touche la page (ou ses sources s'il s'agit
// d'une page générée). Avec un clone partiel (shallow), le commit le plus
// ancien disponible ne dit rien de la vraie date : on prend alors la date
// du jour, qui est celle de la mise en ligne.
function changedOn(root, file) {
  const rel = relative(root, file);
  const prefix = Object.keys(GENERATED_SOURCES).find((p) => rel.startsWith(p));
  const sources = prefix ? GENERATED_SOURCES[prefix] : [rel];
  try {
    // Fichier modifié et pas encore commité : la modification date d'aujourd'hui.
    const dirty = git(root, ["status", "--porcelain", "--", ...sources]);
    if (!dirty) {
      const [sha, date] = git(root, ["log", "-1", "--format=%H %cs", "--", ...sources]).split(" ");
      if (sha && !shallowBoundaries(root).has(sha)) return date;
    }
  } catch {
    // Pas de git pendant le build.
  }
  return today();
}

let boundaries;
function shallowBoundaries(root) {
  if (!boundaries) {
    const file = resolve(root, git(root, ["rev-parse", "--git-dir"]), "shallow");
    boundaries = new Set(
      existsSync(file) ? readFileSync(file, "utf8").split("\n").filter(Boolean) : []
    );
  }
  return boundaries;
}

function git(root, args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function today() {
  // Date du jour à l'heure de Paris (AAAA-MM-JJ).
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

function sortKeys(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}
