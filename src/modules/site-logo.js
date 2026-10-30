// ============================================================
//  Bouton « Haut de page » (et logo fixe de l'accueil) — apparaît
//  quand le titre principal de la page sort de l'écran
// ============================================================

function initSiteLogo() {
  const items = [...document.querySelectorAll(".back-top, .site-logo:not(.is-visible)")];
  const trigger =
    document.querySelector(".hero__title") ||
    document.querySelector(".article-hero__title") ||
    document.querySelector("main h1") ||
    document.querySelector(".hero");
  if (!items.length || !trigger || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // visible dès que le déclencheur (titre principal) n'est plus à l'écran
        items.forEach((el) => el.classList.toggle("is-visible", !entry.isIntersecting));
      });
    },
    { threshold: 0 }
  );

  observer.observe(trigger);

  // Retour en haut : défilement doux sans laisser « # » dans l'adresse
  document.querySelectorAll(".back-top").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      const target = document.querySelector("main h1") || document.body;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteLogo);
} else {
  initSiteLogo();
}
