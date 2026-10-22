// ============================================================
//  Logo fixe — apparaît quand le titre du hero sort de l'écran
// ============================================================

function initSiteLogo() {
  const logo = document.querySelector(".site-logo");
  const trigger =
    document.querySelector(".hero__title") || document.querySelector(".hero");
  if (!logo || !trigger || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // visible dès que le déclencheur (titre du hero) n'est plus à l'écran
        logo.classList.toggle("is-visible", !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  observer.observe(trigger);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteLogo);
} else {
  initSiteLogo();
}
