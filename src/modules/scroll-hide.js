// ============================================================
//  Mobile : logo, burger et vague s'effacent pendant la lecture
// ============================================================
// Sur petit écran, ces éléments fixes passaient par-dessus le texte. Ils
// se retirent quand on fait défiler vers le bas et reviennent dès qu'on
// remonte, en haut de page et en fin de page (classe html.is-reading,
// styles dans layout/_navbar.scss et layout/_dock.scss).

function initScrollHide() {
  const root = document.documentElement;
  const mobile = window.matchMedia("(max-width: 767px)");
  let lastY = window.scrollY;
  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    const delta = y - lastY;
    const atEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
    if (!mobile.matches || y < 120 || atEnd || root.classList.contains("menu-open")) {
      root.classList.remove("is-reading");
    } else if (delta > 6) {
      root.classList.add("is-reading");
    } else if (delta < -6) {
      root.classList.remove("is-reading");
    }
    if (Math.abs(delta) > 6) lastY = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  // le focus clavier fait toujours réapparaître la navigation
  document.addEventListener("focusin", (e) => {
    if (e.target.closest(".nav, .dock")) root.classList.remove("is-reading");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollHide);
} else {
  initScrollHide();
}
