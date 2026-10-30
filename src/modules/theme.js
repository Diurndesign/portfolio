// ============================================================
//  Interrupteur de thème : bleu <-> orange
// ============================================================
// Bascule data-theme="orange" sur <html>. Au clic, le nouveau thème
// s'ouvre en cercle depuis le bouton par-dessus l'ancien (View
// Transitions) : les deux restent visibles, sans couleurs mélangées.
// Pendant la transition, la carte de visite est mise à plat (classe
// .theme-switching) : la capture du navigateur ne déforme plus sa 3D.
// Sans cette API, le changement est immédiat. Le choix est mémorisé dans
// le navigateur du visiteur et réappliqué dès le <head>
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

  // Interrupteur bleu / orange : une pastille de chaque couleur, un
  // anneau glisse sur celle du thème affiché. Sous la carte de visite sur
  // l'accueil ; ailleurs dans la barre latérale droite, sous les réseaux
  // (dans le menu sur mobile).
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-switch";
  btn.innerHTML =
    '<span class="theme-switch__dot theme-switch__dot--blue" aria-hidden="true"></span>' +
    '<span class="theme-switch__dot theme-switch__dot--orange" aria-hidden="true"></span>' +
    '<span class="theme-switch__thumb" aria-hidden="true"></span>';
  const slot = document.querySelector("[data-theme-switch]");
  const side = document.querySelector(".nav__side--right");
  if (slot) {
    btn.classList.add("theme-switch--row");
    slot.appendChild(btn);
  } else if (side) {
    const li = document.createElement("li");
    li.className = "nav__theme";
    li.appendChild(btn);
    side.appendChild(li);
  } else {
    btn.classList.add("theme-switch--floating");
    document.body.appendChild(btn);
  }

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
    if (reduce || !document.startViewTransition) {
      apply(next);
      return;
    }

    // Cercle qui part du centre du bouton jusqu'au coin le plus éloigné
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => apply(next));
    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${end}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 850,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  });

  sync();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
