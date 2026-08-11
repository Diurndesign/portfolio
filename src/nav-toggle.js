// ============================================================
//  Menu burger (mobile) : ouverture/fermeture du panneau nav
// ============================================================

function initNavToggle() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const burger = nav.querySelector(".nav__burger");
  if (!burger) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("no-scroll", open);
  }

  burger.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Fermer le menu quand on clique un lien (nav ou réseaux)
  nav.querySelectorAll(".nav__side a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // Fermer avec la touche Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavToggle);
} else {
  initNavToggle();
}
