// ============================================================
//  Navbar adaptative — passe en foncé quand une section claire
//  (marquée [data-nav-light]) traverse le centre du viewport.
// ============================================================

function initScrollNav() {
  const nav = document.querySelector(".nav");
  const lightSections = document.querySelectorAll("[data-nav-light]");
  if (!nav || !lightSections.length || !("IntersectionObserver" in window)) return;

  const active = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      nav.classList.toggle("nav--light", active.size > 0);
    },
    // bande fine au centre vertical : actif quand la section croise le milieu
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );

  lightSections.forEach((section) => observer.observe(section));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollNav);
} else {
  initScrollNav();
}
