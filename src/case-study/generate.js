// ============================================================
//  Études de cas — génération au build
// ============================================================
// Écrit une page HTML statique par étude de cas (realisations/<slug>.html) à
// partir des données (src/data/caseStudies.js) et maintient le sitemap à jour.
// Appelé depuis vite.config.js : la génération a lieu avant que Vite ne
// résolve les entrées multi-pages, en dev comme au build.
//
// Les fichiers realisations/*.html sont des artefacts générés (ignorés par
// git) : la source de vérité reste le fichier de données.

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  readdirSync,
} from "fs";
import { resolve } from "path";
import { caseStudies } from "../data/caseStudies.js";
import { renderCaseStudy } from "./render.js";

export function generateCaseStudies(root) {
  const dir = resolve(root, "realisations");
  mkdirSync(dir, { recursive: true });

  const wanted = new Set(caseStudies.map((e) => `${e.slug}.html`));

  // Nettoie les pages orphelines (étude supprimée des données).
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".html") && !wanted.has(file)) {
      rmSync(resolve(dir, file));
    }
  }

  const input = {};
  for (const entry of caseStudies) {
    const html = renderCaseStudy(entry, caseStudies);
    const target = resolve(dir, `${entry.slug}.html`);
    writeIfChanged(target, html);
    input[`caseStudy_${entry.slug.replace(/[^a-z0-9]/gi, "_")}`] = target;
  }

  patchSitemap(root);

  return input;
}

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, "utf8") === content) return;
  writeFileSync(file, content);
}

// Remplace le bloc entre les marqueurs du sitemap par les URLs des études de
// cas. Idempotent (lastmod vient des données) : aucune modification parasite.
function patchSitemap(root) {
  const file = resolve(root, "public/sitemap.xml");
  if (!existsSync(file)) return;

  const xml = readFileSync(file, "utf8");
  const re = /(<!-- case-studies:start -->)[\s\S]*?(<!-- case-studies:end -->)/;
  if (!re.test(xml)) return;

  const block = caseStudies
    .map(
      (e) => `  <url>
    <loc>https://www.diurnstudio.fr/realisations/${e.slug}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n");

  const next = xml.replace(re, `$1\n${block}\n  $2`);
  if (next !== xml) writeFileSync(file, next);
}
