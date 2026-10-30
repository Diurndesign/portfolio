// ============================================================
//  Bouton de thème : bleu <-> orange
// ============================================================
// Bascule data-theme="orange" sur <html>. Au clic, un disque de la
// nouvelle couleur s'étend depuis le bouton et couvre la page, le thème
// change dessous, puis le disque s'efface. (Pas de View Transitions : leur
// capture d'écran déforme la carte de visite en 3D.) Le choix est mémorisé
// dans le navigateur du visiteur et réappliqué dès le <head>
// (partials/head-icons.html).

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
  }

  btn.addEventListener("click", () => {
    const next = current() === "orange" ? "blue" : "orange";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.body.animate) {
      apply(next);
      return;
    }

    // Disque qui part du centre du bouton jusqu'au coin le plus éloigné
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const wipe = document.createElement("div");
    wipe.className = "theme-wipe";
    wipe.style.background = BAR_COLOR[next];
    document.body.appendChild(wipe);

    const grow = wipe.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${end}px at ${x}px ${y}px)`,
        ],
      },
      { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" }
    );
    grow.onfinish = () => {
      apply(next);
      const fade = wipe.animate({ opacity: [1, 0] }, { duration: 450, easing: "ease-out", fill: "forwards" });
      fade.onfinish = () => wipe.remove();
    };
  });

  sync();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
