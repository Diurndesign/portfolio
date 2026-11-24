// Génère les images de partage (Open Graph / X) par page, dans public/img/og/.
// Usage : node scripts/og-images.mjs   (nécessite Playwright + Chromium)
// Format : 1200 × 630 rendu en ×2, soit 2400 × 1260 comme og-cover.png.
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { resolve } from "path";
import { mkdirSync, readFileSync } from "fs";

// Playwright n'est pas une dépendance du site : on le charge depuis
// l'installation globale (npm i -g playwright) ou locale.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL("..", import.meta.url));
const fonts = resolve(root, "src/fonts");
const outDir = resolve(root, "public/img/og");
mkdirSync(outDir, { recursive: true });

// Polices embarquées en base64 : une page chargée via setContent n'a pas le
// droit de lire des fichiers locaux.
const font = (name) =>
  `url(data:font/woff2;base64,${readFileSync(resolve(fonts, name + ".woff2")).toString("base64")}) format("woff2")`;
const FONT_LIGHT = font("HelloParisSerifLight");
const FONT_XLIGHT = font("HelloParisSerifExtraLight");

const BLUE = "#010d94";
const CREAM = "#ebe6db";
const INK = "#17193a";

const pages = [
  {
    file: "combien-coute-site-internet-nice",
    theme: "blue",
    eyebrow: "Guide · prix 2026",
    kicker: "Prix d'un site internet à Nice",
    title: "900&nbsp;€ <span class=\"arrow\">→</span> 4&nbsp;500&nbsp;€",
    titleSize: 175,
    sub: "La grille réelle, poste par poste.",
  },
  {
    file: "graphiste-nice",
    theme: "cream",
    eyebrow: "Identité de marque",
    kicker: "Graphiste à",
    title: "Nice",
    sub: "Logo dès 700&nbsp;€ · charte graphique · print &amp; web",
  },
  {
    file: "creation-site-internet-nice",
    theme: "blue",
    eyebrow: "43,70° N · 7,26° E",
    kicker: "Création de site internet",
    title: "Nice",
    sub: "Sur mesure, dès 900&nbsp;€ · un seul interlocuteur",
  },
  {
    file: "creation-site-internet-cannes",
    theme: "blue",
    eyebrow: "43,55° N · 7,02° E",
    kicker: "Création de site internet",
    title: "Cannes",
    sub: "Hôtellerie · luxe · événementiel · Croisette",
  },
  {
    file: "creation-site-internet-antibes",
    theme: "blue",
    eyebrow: "43,58° N · 7,12° E",
    kicker: "Création de site internet",
    title: "Antibes",
    sub: "Juan-les-Pins · Port Vauban · Sophia Antipolis",
  },
  {
    file: "creation-site-internet-monaco",
    theme: "blue",
    eyebrow: "43,74° N · 7,42° E",
    kicker: "Création de site internet",
    title: "Monaco",
    sub: "Sites premium et multilingues",
  },
];

const html = (p) => {
  const bg = p.theme === "cream" ? CREAM : BLUE;
  const fg = p.theme === "cream" ? INK : "#ffffff";
  const soft = p.theme === "cream" ? "rgba(23,25,58,.68)" : "rgba(255,255,255,.72)";
  const rule = p.theme === "cream" ? "rgba(23,25,58,.35)" : "rgba(255,255,255,.45)";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{font-family:HPLight;src:${FONT_LIGHT}}
@font-face{font-family:HPXLight;src:${FONT_XLIGHT}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:${bg};color:${fg};font-family:"Helvetica Neue",Arial,sans-serif;
  position:relative;padding:64px 80px}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{font-family:HPLight;font-size:44px;line-height:1;letter-spacing:.01em}
.eyebrow{font-size:17px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:${soft}}
.main{position:absolute;left:80px;right:80px;top:180px}
.kicker{font-family:HPLight;font-variant-ligatures:none;text-transform:lowercase;font-size:48px;line-height:1.1;color:${soft}}
.title{font-family:HPXLight;font-size:${p.titleSize || 210}px;line-height:1;margin-top:6px;letter-spacing:-.01em;white-space:nowrap}
.title .arrow{font-family:"Helvetica Neue",Arial,sans-serif;font-weight:200;font-size:.6em;vertical-align:.16em;opacity:.7}
.bottom{position:absolute;left:80px;right:80px;bottom:60px;display:flex;justify-content:space-between;align-items:flex-end;
  border-top:2px solid ${rule};padding-top:22px}
.sub{font-size:27px;line-height:1.3}
.url{font-size:18px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${soft}}
</style></head><body>
<div class="top"><div class="logo">DiUrN sTudio</div><div class="eyebrow">${p.eyebrow}</div></div>
<div class="main"><div class="kicker">${p.kicker}</div><div class="title">${p.title}</div></div>
<div class="bottom"><div class="sub">${p.sub}</div><div class="url">diurnstudio.fr</div></div>
</body></html>`;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
for (const p of pages) {
  await page.setContent(html(p), { waitUntil: "load" });
  await page.evaluate(async () => { await document.fonts.load('40px HPLight'); await document.fonts.load('40px HPXLight'); await document.fonts.ready; });
  await page.screenshot({ path: resolve(outDir, `${p.file}.png`) });
  console.log("✓", `img/og/${p.file}.png`);
}
await browser.close();
