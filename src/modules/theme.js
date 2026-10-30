// ============================================================
//  Bouton de thème : bleu <-> orange
// ============================================================
// Bascule data-theme="orange" sur <html>. Au clic, les couleurs du site
// glissent vers le nouveau thème (classe .theme-fading, le contenu reste
// visible) pendant qu'un anneau de la nouvelle couleur part du bouton.
// Le choix est mémorisé dans le navigateur du visiteur et réappliqué dès
// le <head> (partials/head-icons.html).

const KEY = "diurn-theme";
const BAR_COLOR = { blue: "#010d94", orange: "#e9573b" };
const LABEL = {
  blue: "Passer le site en orange",
  orange: "Revenir au bleu",
};

function initTheme() {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const current = () => (root.dataset.theme === "orange" ? "orange" : "blue");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  document.body.appendChild(btn);

  function sync() {
    const theme = current();
    btn.setAttribute("aria-label", LABEL[theme]);
    btn.title = LABEL[theme];
    btn.setAttribute("aria-pressed", theme === "orange" ? "true" : "false");
    if (meta) meta.setAttribute("content", BAR_COLOR[theme]);
  }

  function apply(theme) {
    if (theme === "orange") root.dataset.theme = "orange";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      // stockage indisponible (navigation privée) : le thème vaut pour la page
    }
    sync();
    document.dispatchEvent(new Event("themechange"));
  }

  btn.addEventListener("click", () => {
    const next = current() === "orange" ? "blue" : "orange";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      apply(next);
      return;
    }

    // Fondu des couleurs : la classe pose les transitions avant le changement
    root.classList.add("theme-fading");
    void root.offsetWidth;
    apply(next);
    clearTimeout(btn._fadeTimer);
    btn._fadeTimer = setTimeout(() => root.classList.remove("theme-fading"), 900);

    // Anneau qui part du bouton jusqu'au coin le plus éloigné
    if (!document.body.animate) return;
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const ring = document.createElement("div");
    ring.className = "theme-ring";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.borderColor = BAR_COLOR[next];
    document.body.appendChild(ring);
    // le diamètre grandit (pas d'échelle) : le trait reste fin
    ring.animate(
      [
        { width: `${r.width}px`, height: `${r.width}px`, opacity: 1 },
        { width: `${end * 2}px`, height: `${end * 2}px`, opacity: 0 },
      ],
      { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ).onfinish = () => ring.remove();
  });

  sync();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
