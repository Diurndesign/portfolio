// ============================================================
//  Menu et logo adaptatifs — chaque élément fixe (logo, liens,
//  icônes, burger) lit la couleur réellement affichée derrière lui
//  et passe en encre sur un fond clair, en blanc sur un fond foncé.
//  Indépendants : le logo en haut et le dernier lien en bas peuvent
//  avoir deux couleurs différentes.
// ============================================================
// La couleur de fond est reconstituée au point central de l'élément :
// fond des blocs sous ce point, dégradés verticaux (raccords entre
// sections), photos (couleur échantillonnée dans l'image) et photos de
// fond en CSS (voile sombre déclaré par --nav-shade).

const UI = ".nav, .dock, .cookie-consent";
const WHITE = [255, 255, 255];

const imageCache = new WeakMap();

function parseColor(str) {
  const m = str && str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}

// Couleur d'un dégradé vertical à la position t (0 en haut, 1 en bas)
function gradientAt(image, t) {
  const m = image.match(/^linear-gradient\((.*)\)$/);
  if (!m) return null;
  const head = m[1].split(/,(?![^(]*\))/)[0].trim();
  let reverse = false;
  if (!/^rgba?\(/.test(head)) {
    if (head === "to top" || head === "0deg") reverse = true;
    else if (head !== "to bottom" && head !== "180deg") return null;
  }
  const stops = [...m[1].matchAll(/(rgba?\([^)]+\))\s*([\d.]+)?%?/g)].map((s, i, all) => [
    parseColor(s[1]),
    s[2] !== undefined ? Number(s[2]) / 100 : i / Math.max(all.length - 1, 1),
  ]);
  if (!stops.length) return null;
  const x = reverse ? 1 - t : t;
  if (x <= stops[0][1]) return stops[0][0];
  for (let i = 1; i < stops.length; i++) {
    const [c1, p1] = stops[i];
    if (x <= p1) {
      const [c0, p0] = stops[i - 1];
      const k = p1 > p0 ? (x - p0) / (p1 - p0) : 1;
      return c0.map((v, j) => v + (c1[j] - v) * k);
    }
  }
  return stops[stops.length - 1][0];
}

// Couleur d'une photo au point (x, y), en tenant compte de object-fit
function imageAt(img, x, y) {
  if (!img.complete || !img.naturalWidth) return null;
  let data = imageCache.get(img);
  if (!data || data.src !== img.currentSrc) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 24;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 24, 24);
      data = { src: img.currentSrc, px: ctx.getImageData(0, 0, 24, 24).data };
    } catch {
      data = { src: img.currentSrc, px: null };
    }
    imageCache.set(img, data);
  }
  if (!data.px) return null;
  const r = img.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const fit = getComputedStyle(img).objectFit;
  let sx = r.width / nw;
  let sy = r.height / nh;
  if (fit === "cover") sx = sy = Math.max(sx, sy);
  else if (fit === "contain") sx = sy = Math.min(sx, sy);
  const u = ((x - r.left - (r.width - nw * sx) / 2) / sx) / nw;
  const v = ((y - r.top - (r.height - nh * sy) / 2) / sy) / nh;
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;
  const i = (Math.min(23, Math.floor(v * 24)) * 24 + Math.min(23, Math.floor(u * 24))) * 4;
  return [data.px[i], data.px[i + 1], data.px[i + 2], data.px[i + 3] / 255];
}

// Couches d'un élément au point y (de la plus haute à la plus basse)
function layersOf(el, x, y) {
  // Photo de fond assombrissante (--nav-shade = force du voile), en
  // tenant compte de son masque en dégradé vertical
  const shade = parseFloat(getComputedStyle(el).getPropertyValue("--nav-shade"));
  if (el.classList.contains("hero__bg")) {
    if (!(shade > 0)) return [];
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const mask = cs.maskImage || cs.webkitMaskImage || "";
    const m = mask.startsWith("linear-gradient") && r.height ? gradientAt(mask, (y - r.top) / r.height) : null;
    const k = shade * (m ? m[3] : 1);
    return k > 0 ? [[0, 0, 0, k]] : [];
  }
  if (el.tagName === "IMG") {
    const c = imageAt(el, x, y);
    return c ? [c] : [];
  }
  const cs = getComputedStyle(el);
  const out = [];
  // Raccords en pseudo-éléments (::after au-dessus de ::before), placés
  // en absolu en haut ou en bas de leur section
  ["::after", "::before"].forEach((pseudo) => {
    const ps = getComputedStyle(el, pseudo);
    if (ps.content === "none" || ps.position !== "absolute" || !ps.backgroundImage.startsWith("linear-gradient")) return;
    const r = el.getBoundingClientRect();
    const h = parseFloat(ps.height);
    const top = ps.top !== "auto" ? r.top + parseFloat(ps.top) : r.bottom - parseFloat(ps.bottom) - h;
    if (!h || y < top || y > top + h) return;
    const g = gradientAt(ps.backgroundImage, (y - top) / h);
    if (g) out.push(g);
  });
  if (cs.backgroundImage.startsWith("linear-gradient")) {
    const r = el.getBoundingClientRect();
    const g = r.height ? gradientAt(cs.backgroundImage, (y - r.top) / r.height) : null;
    if (g) out.push(g);
  }
  const bg = parseColor(cs.backgroundColor);
  if (bg && bg[3] > 0) out.push(bg);
  return out;
}

function over(top, base) {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + base[i] * (1 - a)).concat(1);
}

function backgroundAt(x, y, fades) {
  const layers = [];
  const hit = document.elementsFromPoint(x, y).find((el) => !el.closest(UI));
  // Raccords dégradés posés par-dessus les sections (sans pointeur)
  [...fades].reverse().forEach((f) => {
    const r = f.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) layers.push(...layersOf(f, x, y));
  });
  for (let el = hit; el && el !== document.documentElement; el = el.parentElement) {
    const l = layersOf(el, x, y);
    layers.push(...l);
    if (l.length && l[l.length - 1][3] >= 0.99) break;
  }
  if (!layers.length || layers[layers.length - 1][3] < 0.99) {
    layers.push(parseColor(getComputedStyle(document.body).backgroundColor) || WHITE.concat(1));
  }
  return layers.reduceRight((base, top) => over(top, base));
}

function luminance(rgb) {
  const [r, g, b] = rgb.slice(0, 3).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (l1 + 0.05) / (l2 + 0.05);
}

function initScrollNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let items = [];
  let fades = [];
  const collect = () => {
    items = [
      ...document.querySelectorAll(
        ".site-logo, .nav__burger, .nav__side--left .nav__link, .nav__social, .nav__theme .theme-switch"
      ),
    ];
    fades = [...document.querySelectorAll('[class*="__fade"], .hero__bg')].filter(
      (el) => !el.closest(UI) && getComputedStyle(el).pointerEvents === "none"
    );
  };

  let queued = false;
  const update = () => {
    queued = false;
    const ink = parseColor(`rgb(${getComputedStyle(document.documentElement).getPropertyValue("--c-ink")})`);
    const open = nav.classList.contains("is-open");
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (open || !r.width || !r.height) {
        el.classList.remove("is-on-light", "is-on-dark");
        return;
      }
      const bg = backgroundAt(r.left + r.width / 2, r.top + r.height / 2, fades);
      const light = ink && contrast(ink, bg) > contrast(WHITE, bg);
      el.classList.toggle("is-on-light", light);
      el.classList.toggle("is-on-dark", !light);
    });
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  collect();
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", () => {
    collect();
    schedule();
  });
  window.addEventListener("load", schedule);
  // images chargées plus tard, changement de thème, menu mobile ouvert
  document.addEventListener("load", (e) => e.target.tagName === "IMG" && schedule(), true);
  new MutationObserver(() => {
    collect();
    schedule();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  new MutationObserver(schedule).observe(nav, { attributes: true, attributeFilter: ["class"] });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollNav);
} else {
  initScrollNav();
}
