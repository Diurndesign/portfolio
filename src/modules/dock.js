// ============================================================
//  Vague du bas d'écran : interrupteur de couleur + anneau tournant
// ============================================================
// Une vague fixe, en bas au centre, réunit les deux commandes pour
// qu'elles ne se chevauchent plus :
//   - l'interrupteur bleu / orange (posé ici par modules/theme.js) ;
//   - un anneau de texte tournant : « Voir les projets » vers le bas tant
//     que le titre de l'accueil est à l'écran, puis « Haut de page » vers
//     le haut. Sur les autres pages, l'anneau n'apparaît qu'au défilement.

const RING = {
  down: { text: "Voir les projets · Voir les projets ·", label: "Voir les projets" },
  up: { text: "Haut de page · Haut de page ·", label: "Retour en haut de la page" },
};

function initDock() {
  const dock = document.createElement("nav");
  dock.className = "dock";
  dock.setAttribute("aria-label", "Raccourcis");
  dock.innerHTML = `
    <svg class="dock__wave" viewBox="0 0 320 88" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 88 C 52 88 66 6 116 4 L 204 4 C 254 6 268 88 320 88 Z" />
    </svg>
    <div class="dock__inner">
      <span class="dock__switch" data-theme-switch></span>
      <a class="dock__ring" href="#">
        <span class="sr-only"></span>
        <svg class="dock__ring-text" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <defs><path id="dock-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
          <text><textPath href="#dock-circle" textLength="236" lengthAdjust="spacing"></textPath></text>
        </svg>
        <svg class="dock__ring-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>`;
  document.body.appendChild(dock);

  const ring = dock.querySelector(".dock__ring");
  const label = ring.querySelector(".sr-only");
  const textPath = ring.querySelector("textPath");
  const projets = document.getElementById("projets");

  // Sens de l'anneau : vers les projets (accueil, en haut) ou vers le haut
  function setMode(up) {
    const mode = up || !projets ? "up" : "down";
    dock.classList.toggle("dock--up", mode === "up");
    // hors accueil, pas d'anneau tant qu'on est en haut de la page
    dock.classList.toggle("dock--no-ring", !up && !projets);
    ring.setAttribute("href", mode === "up" ? "#" : "#projets");
    label.textContent = RING[mode].label;
    textPath.textContent = RING[mode].text;
  }

  const trigger =
    document.querySelector(".hero__title") ||
    document.querySelector(".article-hero__title") ||
    document.querySelector("main h1");
  setMode(false);
  if (trigger && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => setMode(!entry.isIntersecting));
    }).observe(trigger);
  } else {
    setMode(true);
  }

  // Retour en haut : défilement doux, sans « # » dans l'adresse
  ring.addEventListener("click", (e) => {
    if (!dock.classList.contains("dock--up")) return; // ancre #projets
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
}

initDock();
