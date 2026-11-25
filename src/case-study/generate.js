// ============================================================
//  Études de cas — génération au build
// ============================================================
// Écrit une page HTML statique par étude de cas (realisations/<slug>.html),
// plus la page index (realisations/index.html), à
// partir des données (src/data/caseStudies.js). Le sitemap est produit à part
// (src/sitemap/sitemap.js), à partir des entrées de Vite.
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
import { renderCaseStudy, renderCaseStudyIndex } from "./render.js";

export function generateCaseStudies(root) {
  const dir = resolve(root, "realisations");
  mkdirSync(dir, { recursive: true });

  const wanted = new Set(caseStudies.map((e) => `${e.slug}.html`));
  wanted.add("index.html");

  // Nettoie les pages orphelines (étude supprimée des données).
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".html") && !wanted.has(file)) {
      rmSync(resolve(dir, file));
    }
  }

  const input = {};
  // Empreinte de chaque étude pour le sitemap : ses propres données + le
  // gabarit, sans les textes des autres études (voir src/sitemap/sitemap.js).
  const template = readFileSync(resolve(root, "src/case-study/render.js"), "utf8");
  const fingerprints = {};
  for (const entry of caseStudies) {
    const html = renderCaseStudy(entry, caseStudies);
    const target = resolve(dir, `${entry.slug}.html`);
    writeIfChanged(target, html);
    fingerprints[target] = JSON.stringify(entry) + template;
    input[`caseStudy_${entry.slug.replace(/[^a-z0-9]/gi, "_")}`] = target;
  }

  // Page index /realisations (realisations/index.html).
  const indexFile = resolve(dir, "index.html");
  writeIfChanged(indexFile, renderCaseStudyIndex(caseStudies));
  input.caseStudyIndex = indexFile;

  return { input, fingerprints };
}

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, "utf8") === content) return;
  writeFileSync(file, content);
}
